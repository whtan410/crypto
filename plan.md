Req

Deposit (Money In)

Customer/App
→ Create Deposit (amount, method)
→ Gateway creates txn = INITIATED
→ Gateway redirect / payment link to PSP
→ Customer pays on PSP
→ PSP webhook/callback to Gateway (SUCCESS/FAILED/PENDING)
→ Gateway verify + idempotency
→ If SUCCESS: txn = COMPLETED → credit user balance → notify
→ If FAILED: txn = FAILED → notify
→ If PENDING: txn = PENDING → wait/poll → update later

Withdrawal (Money Out)

Customer/App
→ Create Withdrawal (amount, destination)
→ Gateway validate + balance check
→ Gateway reserve funds (hold) → txn = REQUESTED
→ (optional) risk/AML check
→ Gateway send payout request to PSP/Bank → txn = PROCESSING
→ PSP webhook/callback to Gateway (SUCCESS/FAILED)
→ Gateway verify + idempotency
→ If SUCCESS: txn = COMPLETED → deduct reserved funds → notify
→ If FAILED: txn = FAILED → release reserved funds → notify

1) Deposit request (normal path)

Client/App
→ Create Deposit Request
→ Gateway creates DepositRequest
  status = INITIATED
  expires_at = T + X minutes
→ Client is shown payment info

(time passes, no payment)

→ System marks request
→ DepositRequest → EXPIRED
→ Request is no longer valid for auto-payment

2) Late amount received (exception detected)

PSP / Bank
→ Money In received
→ Gateway receives webhook / bank statement line
→ Gateway tries Auto-Match
→ ❌ No ACTIVE request found
→ Create ExceptionPayment
  status = UNMATCHED
→ Funds stored in Suspense / Holding account
→ System notification:
  “⚠️ Extra / Unmatched amount detected”

3) Staff manual matching

Staff
→ Open Exception Queue
→ Select an UNMATCHED ExceptionPayment
→ Search expired DepositRequest (user / amount / time)
→ Staff clicks Match

System
→ Validate:
  • DepositRequest not completed
  • ExceptionPayment not already matched
→ Link ExceptionPayment → DepositRequest
→ Update statuses:
  DepositRequest → COMPLETED (MANUAL)
  ExceptionPayment → MATCHED
→ Ledger movement:
  Suspense
  → User Balance
→ Notify user / merchant:
  “Deposit confirmed (manual match)”

4) Unmatched stays unmatched (no refund)

If staff does nothing
→ ExceptionPayment remains UNMATCHED
→ Funds stay in Suspense
→ Visible in audit / ops dashboard
→ Can be matched later at any time

1) Deposit Request Flow (Bank Transfer – Money In)

Player/App
→ Create Deposit Request (playerId, amount RM100)
→ System validates (limits/KYC/risk)
→ System creates DepositRequest = INITIATED + expires_at
→ System generates matching key (choose one):

Virtual Account (VA) OR

Unique Amount (RM100.01) OR

(optional) Reference code
→ System shows player payment instruction (bank account/VA + exact amount)
→ Player transfers money
→ System receives deposit detection input (depends on your setup):

bank feed / statement import / ops entry
→ System tries Auto Match
→ If matched → COMPLETED → credit player balance
→ If not matched → create ExceptionPayment = UNMATCHED (funds parked in suspense)

Expiry rule (casino style)
DepositRequest expires for UI
→ but if money arrives later
→ still can match (within “late window”)
→ else goes to Exception

2) Auto-Match Logic (Deposit)

Incoming bank credit (amount, time, maybe payer info)
→ Match in this priority order:

Virtual Account number matches a request/player
→ Match → Complete → Credit

Unique amount matches exactly (RM100.01)
→ Match → Complete → Credit

Payer fingerprint (if you have payer account/name from statement)
→ Identify player → match that player’s latest open request → Complete → Credit

If none works OR multiple candidates
→ ExceptionPayment = UNMATCHED (park funds)
→ notify ops / merchant dashboard

3) Exception Flow (Unmatched Deposits)
A) Unmatched deposit created

Incoming bank credit
→ Auto-match failed / ambiguous
→ Create ExceptionPayment = UNMATCHED
→ Funds go to Suspense (not usable)
→ Notify: “Unmatched payment detected”

B) Exception resolution modes (merchant chooses)
Mode 1: AUTO-RESOLVE (system keeps trying)

ExceptionPayment UNMATCHED
→ scheduled job runs every X minutes
→ re-try matching (VA / unique amount / payer fingerprint)
→ if exactly 1 match found
→ ExceptionPayment = MATCHED
→ DepositRequest = COMPLETED_AUTO
→ Suspense → Player Balance

Mode 2: MANUAL-RESOLVE (ops/staff)

Ops dashboard
→ open UNMATCHED list
→ select exception payment
→ system shows candidates (same amount, time window, player recent requests)
→ staff selects correct DepositRequest
→ confirm match
→ ExceptionPayment = MATCHED
→ DepositRequest = COMPLETED_MANUAL
→ Suspense → Player Balance

C) If player paid wrong cent (RM100 instead of RM100.01)

Incoming RM100.00
→ likely cannot match by amount
→ goes to UNMATCHED
→ can still be auto-resolved only if you have VA or payer fingerprint
→ otherwise manual match is required

4) Withdrawal Request Flow (Money Out)

Player/App
→ Create Withdrawal Request (playerId, amount, destination bank)
→ System validates (KYC, limits, risk, destination format)
→ System checks available balance
→ System reserves funds (Available → Reserved)
→ Create WithdrawalRequest = REQUESTED
→ (optional) risk/AML check
→ If approved → PROCESSING
→ Ops initiates bank transfer / payout (since you said bank won’t help)
→ System records payout details (time, amount, destination, internal ref)
→ COMPLETED when confirmed by ops/bank proof
→ Reserved → Deducted (finalize)

If failed / not sent
→ CANCELLED/FAILED
→ Reserved → Available (release)

5) Withdrawal Exception Flow
A) Withdrawal “stuck”

WithdrawalRequest = PROCESSING too long
→ move to WITHDRAWAL_EXCEPTION queue
→ ops checks bank app / transfer status
→ update final state:

if sent & confirmed → COMPLETED

if not sent / rejected → FAILED + release reserve

B) Wrong amount / partial (rare but happens)

If ops sent wrong amount
→ flag exception
→ hold account
→ manual correction (policy decision)

6) The minimum statuses you need

DepositRequest
INITIATED → (EXPIRED_UI) → COMPLETED / FAILED

ExceptionPayment
UNMATCHED → MATCHED

WithdrawalRequest
REQUESTED → PROCESSING → COMPLETED
or
REQUESTED → FAILED/CANCELLED

Overall system idea

Operator / Casino uses your gateway to:
• create deposit requests for players
• receive bank transfers into operator-controlled accounts
• auto-match incoming credits to the right player/request
• create withdrawal requests and execute payouts
• handle exceptions safely (unmatched / ambiguous / late / wrong amount)

⸻

A) Deposit request flow (player deposit)

Casino Backend
→ Gateway: Create Deposit Request (operatorId, playerId, amount, currency)

Gateway
→ validate (limits, KYC tier, operator rules)
→ create DepositRequest = INITIATED + expires_at
→ generate matching key (choose what your licensed setup supports):
• Virtual Account / Unique Account (best)
• Unique Amount (cents tagging) (fallback)
• Reference code (optional, if you enforce it)

Gateway
→ return payment instructions (bank acct / VA + exact amount + expiry)

Player
→ bank transfer to provided account

Gateway
→ receives bank credit events (via bank integration / statement feed / core banking)
→ create BankCredit record
→ run matching engine
→ if matched → DepositRequest = COMPLETED → credit player wallet (ledger)
→ notify casino (webhook): deposit.completed

⸻

B) Deposit matching engine (auto-match rules)

Incoming BankCredit (amount, time, destination acct, payer info, txn id)

Gateway
→ try match by priority:
1. Destination VA / unique account
→ match directly to player/request
2. Bank transaction ID already linked
→ idempotency (ignore duplicates)
3. Unique amount (RM100.01 style)
→ match payable_amount == received_amount within window
4. Payer fingerprint (if bank provides payer account/name)
→ identify player → match latest open request

If exactly 1 match
→ Match → Complete → Ledger credit → Notify

If 0 match OR >1 candidates
→ create ExceptionPayment = UNMATCHED
→ funds stay in Suspense
→ notify casino/ops: deposit.unmatched

⸻

C) Deposit exception flow (late / wrong amount / ambiguous)

1) Late payment

DepositRequest expired in UI
→ bank credit arrives later
→ if still within “late match window” (e.g. 24–72h)
→ match allowed
→ complete as COMPLETED_LATE

2) Wrong amount (player sent RM100 not RM100.01)

BankCredit RM100.00 arrives
→ unique amount match fails
→ if VA match exists → still auto-match
→ else if payer fingerprint exists → auto-match
→ else → UNMATCHED

3) Ambiguous (many players paid same RM100)

BankCredit RM100.00
→ multiple candidate requests
→ UNMATCHED

Resolution modes (operator chooses)

AUTO mode
UNMATCHED
→ scheduler retries matching (when more info arrives / window narrows)
→ if becomes unique → auto-match

MANUAL mode
UNMATCHED
→ ops dashboard shows candidates (player recent requests, time window, amount)
→ staff selects request
→ MATCHED → Suspense → Player credit
→ audit log who/when/why

⸻

D) Withdrawal request flow (player payout)

Casino Backend
→ Gateway: Create Withdrawal Request (operatorId, playerId, amount, destination bank acct)

Gateway
→ validate (KYC, limits, fraud/AML, destination format)
→ check player balance
→ reserve funds (Available → Reserved)
→ WithdrawalRequest = REQUESTED

Gateway
→ (optional) risk approval / velocity checks
→ WithdrawalRequest = APPROVED

Gateway / Payout engine
→ execute bank payout (via bank rails)
→ WithdrawalRequest = PROCESSING

Bank
→ payout confirmation (status feed / statement debit / callback)

Gateway
→ if success → COMPLETED → finalize ledger (Reserved → Deducted)
→ notify casino: withdrawal.completed

If failed
→ FAILED → release reserve (Reserved → Available)
→ notify casino: withdrawal.failed

⸻

E) Payout exception flow (missing confirmation / wrong destination / stuck)

WithdrawalRequest PROCESSING too long
→ move to PAYOUT_EXCEPTION

Ops / system checks
→ bank status lookup / reconciliation
→ resolve:
• if sent & confirmed → COMPLETED
• if rejected / not sent → FAILED + release reserve
• if returned later → treat as reversal event → re-credit player

⸻

F) What operators care about (must-have controls)

1) Ledger correctness

Deposit matched
→ Suspense → Player Balance
Withdrawal approved
→ Player Balance → Reserved

Withdrawal completed
→ Reserved → Bank settlement

2) Idempotency

Same bank credit / same payout confirmation
→ processed once only

3) Reconciliation

Daily reconciliation job
→ bank credits vs matched deposits
→ bank debits vs completed payouts
→ anything missing → exception queue

4) Audit trail

Every match/unmatch/manual action
→ operatorId, staffId, timestamp, reason

⸻

G) Minimal entities you should implement
• DepositRequest
• BankCredit (raw incoming transfer record)
• ExceptionPayment (unmatched credits)
• WithdrawalRequest
• BankDebit / PayoutTransfer
• LedgerEntry + Balance



