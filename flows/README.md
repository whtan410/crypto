# Casino Banking System - Flow Documentation

## Overview
This directory contains comprehensive flow diagrams and exception handling documentation for a casino-style banking system supporting deposits and withdrawals.

## Documents

### 1. [Deposit Request Flow](./01-deposit-request-flow.md)
**Purpose:** Normal deposit request lifecycle from player initiation to completion

**Key Features:**
- Input validation and KYC checks
- Multiple matching key generation (VA, unique amount, reference code)
- Late match window handling
- Payment instruction generation

**Exception Types:**
- Input validation errors
- Limit & KYC failures
- Request expiry
- Database/system errors

**State Transitions:** `INITIATED → EXPIRED_UI → COMPLETED`

---

### 2. [Auto-Match Engine](./02-auto-match-engine.md)
**Purpose:** Automatic matching of bank credits to deposit requests

**Matching Strategies (Priority Order):**
1. **Virtual Account Match** (HIGH confidence) - Direct account mapping
2. **Unique Amount Match** (MEDIUM confidence) - Cent-tagging exact match
3. **Payer Fingerprint Match** (LOW confidence) - Bank account recognition

**Exception Types:**
- Duplicate bank credits (idempotency)
- Ambiguous matches (multiple candidates)
- Amount mismatches
- Late payments
- Unrecognized payers
- Overpayment/underpayment

**Auto-Retry:** 15-minute intervals, max 24 attempts (6 hours)

---

### 3. [Deposit Exception Resolution](./03-deposit-exception-resolution.md)
**Purpose:** Handle unmatched deposits through auto-retry and manual resolution

**Resolution Modes:**
- **AUTO Mode:** Scheduled retry with auto-matching
- **MANUAL Mode:** Staff-driven resolution with full audit trail

**Resolution Actions:**
- Match to deposit request
- Initiate refund
- Park for later review
- Reject as invalid

**Exception Types:**
- Late payments
- Wrong amount (cent mismatch)
- Ambiguous matches
- Overpayment/underpayment
- Unrecognized payers
- Duplicate attempts

**SLA Targets:**
- Ambiguous match: 1-4 hours
- Late payment: 2-8 hours
- Wrong amount: 6-24 hours

---

### 4. [Withdrawal Request Flow](./04-withdrawal-request-flow.md)
**Purpose:** Player withdrawal lifecycle with fund reservation and risk checks

**Validation Stages:**
1. Input validation (amount, format, destination)
2. KYC verification (tier-based limits)
3. Limit checks (daily/monthly/velocity)
4. Balance checks (available funds)
5. Destination validation (bank account format)

**Risk/AML Triggers:**
- Large amounts (> RM 10,000)
- Rapid withdrawals (multiple in 1 hour)
- New accounts (< 7 days)
- Pattern changes (10x larger than average)
- Geo-location mismatches

**State Transitions:** `REQUESTED → PENDING_REVIEW → APPROVED → PROCESSING → COMPLETED/FAILED`

**Exception Types:**
- Payout timeout (no confirmation)
- Bank rejection
- Partial payout (wrong amount sent)
- Duplicate payout
- Player disputes

---

### 5. [System Architecture Overview](./05-system-architecture-overview.md)
**Purpose:** Complete system architecture with all components and integrations

**Core Components:**
- API Gateway (authentication, rate limiting)
- Deposit/Withdrawal Services
- Auto-Match Engine
- Exception Service
- Risk/AML Service
- Payout Engine
- Ledger System (double-entry)
- Notification Service

**Data Models:**
- Operator, Player, Player Balance
- Deposit Request, Bank Credit, Exception Payment
- Withdrawal Request, Payout Transaction
- Ledger Entry

**Infrastructure:**
- Multi-AZ deployment
- Read replicas for scaling
- Redis caching
- Message queue (async processing)
- Daily backups with 30-day retention

**Security:**
- JWT authentication
- TLS 1.3 encryption
- PII masking in logs
- Rate limiting & fraud detection

---

### 6. [Daily Reconciliation Flow](./06-reconciliation-flow.md)
**Purpose:** Daily ledger and bank statement reconciliation

**Reconciliation Components:**
1. **Credits Reconciliation:** Bank credits vs completed deposits
2. **Debits Reconciliation:** Bank debits vs completed withdrawals
3. **Ledger Balance Check:** Expected vs actual balances
4. **Reserved Funds Check:** Pending withdrawals vs reserved amounts
5. **Suspense Account Check:** Unmatched exceptions vs suspense balance

**Variance Tolerance:**
- Acceptable: ≤ RM 1.00 (rounding)
- Warning: RM 1.00 - RM 100.00
- Critical: > RM 100.00 (lock withdrawals)

**Exception Types:**
- Statement import failure
- Duplicate processing
- Date mismatches
- Partial statements
- Process timeout

**SLA:** Complete by 9:00 AM daily (3-hour max duration)

---

## Quick Reference Guide

### Critical Paths

**Happy Path - Deposit:**
```
Player Request → Validation → Create Request → Generate Key →
Player Pays → Bank Credit → Auto-Match → Credit Balance → Notify
```

**Happy Path - Withdrawal:**
```
Player Request → Validation → Reserve Funds → Risk Check →
Approve → Process Payout → Bank Confirms → Deduct Funds → Notify
```

**Exception Path - Unmatched Deposit:**
```
Bank Credit → Auto-Match Failed → Create Exception →
Auto-Retry (15 min) OR Manual Match → Resolve → Credit Balance
```

---

### Exception Priority Matrix

| Exception Type | Priority | Auto-Resolve? | SLA |
|----------------|----------|---------------|-----|
| Ambiguous match | HIGH | No | 1-4 hours |
| Late payment | HIGH | Yes (retry) | 2-8 hours |
| Payout timeout | HIGH | No | 4 hours |
| Wrong amount | MEDIUM | Partial | 6-24 hours |
| Unrecognized payer | MEDIUM | No | 12-48 hours |
| Overpayment | LOW | No | 24-72 hours |

---

### State Diagrams Summary

**Deposit Request States:**
```
INITIATED ──────> EXPIRED_UI ──────> COMPLETED
    └──────────────────────────────────> COMPLETED (skip expiry if fast match)
                                     └──> COMPLETED_LATE (late window)
                                     └──> COMPLETED_AUTO (auto-retry)
                                     └──> COMPLETED_MANUAL (staff match)
```

**Exception Payment States:**
```
UNMATCHED ──────> MATCHED (auto or manual)
    ├──────────> REFUNDED (player refund)
    └──────────> REJECTED (invalid source)
```

**Withdrawal Request States:**
```
REQUESTED ──────> PENDING_REVIEW ──────> APPROVED ──────> PROCESSING ──────> COMPLETED
    ├──────────> REJECTED (risk denial)                      ├──────────> FAILED (bank rejection)
    └──────────> CANCELLED (player cancel)                   └──────────> EXCEPTION (timeout)
                                                                   ├──────> COMPLETED (manual confirm)
                                                                   └──────> FAILED (manual confirm)
```

---

## Integration Points

### External Systems

**Bank Integrations:**
- **Input:** Bank statement feed (SFTP/CSV), webhooks (if available)
- **Output:** Payout instructions (CSV/API), manual portal entries

**Casino Backend:**
- **Webhooks:** deposit.completed, withdrawal.completed, deposit.unmatched
- **API Calls:** Create deposit/withdrawal requests, query status

**Notification Services:**
- **SMS:** OTP, confirmations, alerts
- **Email:** Receipts, exception notifications
- **Push:** Mobile app notifications

**Third-party Services:**
- **KYC Providers:** Identity verification
- **AML Services:** Transaction screening
- **Fraud Detection:** ML-based risk scoring

---

## Configuration Parameters

### Timing Windows
```json
{
  "deposit_expiry_minutes": 30,
  "late_match_window_hours": 72,
  "withdrawal_timeout_hours": 6,
  "auto_retry_interval_minutes": 15,
  "max_retry_attempts": 24
}
```

### Limits
```json
{
  "min_deposit": 10.00,
  "min_withdrawal": 20.00,
  "max_withdrawal_per_transaction": 50000.00,
  "daily_withdrawal_limit_tier1": 500.00,
  "daily_withdrawal_limit_tier2": 5000.00,
  "daily_withdrawal_limit_tier3": 50000.00
}
```

### Risk Thresholds
```json
{
  "high_risk_amount": 10000.00,
  "velocity_check_hour": 1,
  "max_withdrawals_per_day": 3,
  "new_account_days": 7,
  "pattern_multiplier": 10
}
```

### Reconciliation
```json
{
  "variance_tolerance_minor": 1.00,
  "variance_tolerance_warning": 100.00,
  "start_time": "06:00",
  "sla_completion_time": "09:00",
  "max_duration_hours": 3
}
```

---

## Monitoring Dashboard Metrics

### Real-Time Metrics
- Deposit success rate (%)
- Auto-match rate (%)
- Average exception resolution time (minutes)
- Withdrawal completion rate (%)
- API latency p95 (ms)
- Active exceptions count

### Daily Metrics
- Total deposits (count & amount)
- Total withdrawals (count & amount)
- Manual intervention rate (%)
- Reconciliation variance (RM)
- Reserved funds total (RM)
- Suspense account balance (RM)

### Alerts
- Exception queue > 50 items
- Withdrawal SLA breach
- Reconciliation variance > RM 100
- API error rate > 5%
- Database connection pool > 80%

---

## Compliance & Audit

### Data Retention
- **Transactions:** 7 years (regulatory requirement)
- **Audit logs:** 7 years (immutable)
- **Daily backups:** 30 days
- **PII:** Per GDPR/local regulations

### Audit Trail Requirements
Every financial operation logs:
- User/Staff ID
- Timestamp (UTC)
- Action taken
- Before/after state
- IP address
- Session ID
- Approval chain (if applicable)

### Regulatory Reports
- **AML Reports:** Suspicious transactions > threshold
- **Daily Reconciliation:** Balance verification
- **Exception Summary:** Unmatched payments report
- **Payout Audit:** All completed withdrawals

---

## Disaster Recovery

### Recovery Time Objectives (RTO)
- **Critical Systems:** 15 minutes
- **Database Restore:** 1 hour
- **Full System Recovery:** 4 hours

### Recovery Point Objectives (RPO)
- **Ledger Data:** 0 minutes (continuous WAL)
- **Transaction Data:** 5 minutes (replica lag)
- **Audit Logs:** 0 minutes (append-only)

### Backup Strategy
- **Continuous:** PostgreSQL WAL archiving
- **Daily:** Full database backup
- **Weekly:** System snapshot
- **Off-site:** Replicated to separate region

---

## Getting Started

### For Developers
1. Read [System Architecture](./05-system-architecture-overview.md) first
2. Understand [Deposit Flow](./01-deposit-request-flow.md) and [Withdrawal Flow](./04-withdrawal-request-flow.md)
3. Study [Auto-Match Engine](./02-auto-match-engine.md) for core logic
4. Review exception handling patterns

### For Operations Team
1. Focus on [Exception Resolution](./03-deposit-exception-resolution.md)
2. Understand [Reconciliation](./06-reconciliation-flow.md) daily tasks
3. Memorize SLA targets and escalation procedures
4. Practice using exception dashboard

### For Finance Team
1. Review [Reconciliation Flow](./06-reconciliation-flow.md)
2. Understand ledger movements in each flow
3. Know variance tolerance thresholds
4. Setup daily report subscriptions

---

## Support & Escalation

### Incident Severity Levels

**P0 - Critical (Immediate Response)**
- Database down
- Reconciliation variance > RM 10,000
- Unauthorized withdrawal detected
- Payment system completely offline

**P1 - High (15 min response)**
- Auto-match engine failure
- API error rate > 10%
- Withdrawal timeout > 100 requests
- Exception queue > 200 items

**P2 - Medium (1 hour response)**
- Single component degraded
- Manual match required > 50 items
- Payout delay > SLA
- Cache failure (degraded performance)

**P3 - Low (4 hour response)**
- Minor UI bugs
- Reporting delays
- Non-critical alert tuning

### Escalation Path
1. **On-Call Engineer** (24/7)
2. **Team Lead** (P0/P1)
3. **Engineering Manager** (P0)
4. **CTO + Finance Director** (Critical incidents)

---

## Version History
- **v1.0** (2026-02-01): Initial flow documentation created
- Based on requirements in `plan.md`
- Covers deposit, withdrawal, exceptions, reconciliation
- Includes comprehensive exception handling for all scenarios

---

## Related Documents
- `../plan.md` - Original requirements and logic
- System architecture diagrams (in this directory)
- API documentation (to be created)
- Database schema (to be created)
- Runbook procedures (to be created)
