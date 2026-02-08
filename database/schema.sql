-- ============================================================================
-- Casino Banking System - PostgreSQL Database Schema
-- ============================================================================
-- Version: 1.0
-- Database: PostgreSQL 14+
-- Features: UUID, JSONB, Triggers, Partitioning
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE deposit_request_status AS ENUM (
    'INITIATED',
    'EXPIRED_UI',
    'COMPLETED',
    'COMPLETED_LATE',
    'COMPLETED_AUTO',
    'COMPLETED_MANUAL',
    'FAILED'
);

CREATE TYPE exception_payment_status AS ENUM (
    'UNMATCHED',
    'MATCHED',
    'REFUNDED',
    'REJECTED',
    'MANUAL_REQUIRED'
);

CREATE TYPE withdrawal_request_status AS ENUM (
    'REQUESTED',
    'PENDING_REVIEW',
    'APPROVED',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'REJECTED',
    'CANCELLED',
    'EXCEPTION'
);

CREATE TYPE kyc_status AS ENUM (
    'UNVERIFIED',
    'PENDING',
    'VERIFIED',
    'REJECTED',
    'EXPIRED'
);

CREATE TYPE kyc_tier AS ENUM (
    'TIER_0',
    'TIER_1',
    'TIER_2',
    'TIER_3'
);

CREATE TYPE matching_key_type AS ENUM (
    'VIRTUAL_ACCOUNT',
    'UNIQUE_AMOUNT',
    'REFERENCE_CODE'
);

CREATE TYPE confidence_level AS ENUM (
    'HIGH',
    'MEDIUM',
    'LOW',
    'NONE'
);

CREATE TYPE ledger_account_type AS ENUM (
    'PLAYER_AVAILABLE',
    'PLAYER_RESERVED',
    'SUSPENSE',
    'OPERATOR_REVENUE',
    'PAYOUT_PENDING',
    'REFUND_PENDING',
    'BANK_FEES',
    'ROUNDING_ADJUSTMENT'
);

CREATE TYPE reconciliation_status AS ENUM (
    'PASS',
    'WARNING',
    'CRITICAL'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Operators (Casino/Gaming Operators)
CREATE TABLE operators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),

    -- Bank account configuration (JSONB for flexibility)
    bank_accounts JSONB NOT NULL DEFAULT '[]',
    -- Example: [{"bank_code": "MAYBANK", "account_number": "1234567890", "account_name": "Casino Operator", "currency": "MYR", "is_primary": true}]

    -- Limits configuration
    limits JSONB NOT NULL DEFAULT '{}',
    -- Example: {"min_deposit": 10.00, "max_deposit": 100000.00, "min_withdrawal": 20.00, "max_withdrawal": 50000.00}

    -- Settings
    auto_resolve_exceptions BOOLEAN DEFAULT true,
    require_kyc_for_withdrawal BOOLEAN DEFAULT true,

    -- Status
    active BOOLEAN DEFAULT true,
    suspended BOOLEAN DEFAULT false,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_operators_active ON operators(active) WHERE deleted_at IS NULL;
CREATE INDEX idx_operators_license ON operators(license_number) WHERE deleted_at IS NULL;

-- ============================================================================

-- Players
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),

    -- External reference (operator's player ID)
    player_external_id VARCHAR(100) NOT NULL,

    -- Personal info (encrypted)
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    date_of_birth DATE,

    -- KYC
    kyc_status kyc_status DEFAULT 'UNVERIFIED',
    kyc_tier kyc_tier DEFAULT 'TIER_0',
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    kyc_expires_at TIMESTAMP WITH TIME ZONE,
    kyc_documents JSONB DEFAULT '[]',

    -- Bank accounts (encrypted sensitive data)
    bank_accounts JSONB DEFAULT '[]',
    -- Example: [{"bank_code": "MAYBANK", "account_number": "encrypted", "account_name": "John Doe", "verified": true, "added_at": "2026-01-01T00:00:00Z"}]

    -- Payer fingerprints for auto-matching
    payer_fingerprints JSONB DEFAULT '[]',
    -- Example: [{"payer_account": "hash", "payer_name": "JOHN DOE", "last_used": "2026-01-01T00:00:00Z", "match_count": 5}]

    -- Status flags
    active BOOLEAN DEFAULT true,
    suspended BOOLEAN DEFAULT false,
    blocked_withdrawal BOOLEAN DEFAULT false,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT uq_player_operator_external UNIQUE (operator_id, player_external_id)
);

CREATE INDEX idx_players_operator ON players(operator_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_external_id ON players(operator_id, player_external_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_kyc_status ON players(kyc_status, kyc_tier);
CREATE INDEX idx_players_active ON players(active) WHERE deleted_at IS NULL AND active = true;

-- GIN index for JSONB searching
CREATE INDEX idx_players_payer_fingerprints ON players USING GIN (payer_fingerprints);

-- ============================================================================

-- Player Balances (separate table for better concurrency)
CREATE TABLE player_balances (
    player_id UUID PRIMARY KEY REFERENCES players(id),
    operator_id UUID NOT NULL REFERENCES operators(id),

    -- Balances (in cents to avoid floating point issues)
    available_cents BIGINT NOT NULL DEFAULT 0 CHECK (available_cents >= 0),
    reserved_cents BIGINT NOT NULL DEFAULT 0 CHECK (reserved_cents >= 0),
    total_cents BIGINT GENERATED ALWAYS AS (available_cents + reserved_cents) STORED,

    -- Currency
    currency VARCHAR(3) DEFAULT 'MYR',

    -- Optimistic locking for concurrent updates
    version INTEGER NOT NULL DEFAULT 1,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_player_balances_operator ON player_balances(operator_id);
CREATE INDEX idx_player_balances_reserved ON player_balances(reserved_cents) WHERE reserved_cents > 0;

-- ============================================================================

-- Deposit Requests
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    player_id UUID NOT NULL REFERENCES players(id),

    -- Amount (in cents)
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    currency VARCHAR(3) DEFAULT 'MYR',

    -- Status
    status deposit_request_status DEFAULT 'INITIATED',

    -- Matching strategy
    matching_key_type matching_key_type NOT NULL,
    matching_key_value VARCHAR(255) NOT NULL,

    -- For unique amount matching
    payable_amount_cents BIGINT,

    -- For virtual account
    virtual_account VARCHAR(50),

    -- For reference code
    reference_code VARCHAR(50),

    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    late_match_window_ends_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Completion details
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by VARCHAR(50), -- 'AUTO' or staff ID
    matched_bank_credit_id UUID,

    -- Failure details
    failure_reason TEXT,

    -- Metadata
    player_ip VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_virtual_account UNIQUE (virtual_account),
    CONSTRAINT uq_reference_code UNIQUE (reference_code)
);

-- Indexes for performance
CREATE INDEX idx_deposit_requests_player ON deposit_requests(player_id, created_at DESC);
CREATE INDEX idx_deposit_requests_operator ON deposit_requests(operator_id, created_at DESC);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status, created_at DESC);
CREATE INDEX idx_deposit_requests_expiry ON deposit_requests(expires_at) WHERE status = 'INITIATED';
CREATE INDEX idx_deposit_requests_matching_key ON deposit_requests(matching_key_type, matching_key_value) WHERE status IN ('INITIATED', 'EXPIRED_UI');
CREATE INDEX idx_deposit_requests_amount ON deposit_requests(payable_amount_cents, created_at) WHERE status IN ('INITIATED', 'EXPIRED_UI');
CREATE INDEX idx_deposit_requests_virtual_account ON deposit_requests(virtual_account) WHERE virtual_account IS NOT NULL;

-- Partial index for active requests (hot data)
CREATE INDEX idx_deposit_requests_active ON deposit_requests(created_at DESC)
    WHERE status IN ('INITIATED', 'EXPIRED_UI')
    AND created_at > CURRENT_TIMESTAMP - INTERVAL '7 days';

-- ============================================================================

-- Bank Credits (Raw incoming bank transfers)
CREATE TABLE bank_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),

    -- Bank transaction details
    bank_transaction_id VARCHAR(255) NOT NULL,

    -- Amount (in cents)
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'MYR',

    -- Destination (our bank account)
    destination_account VARCHAR(50) NOT NULL,
    destination_bank_code VARCHAR(20),

    -- Payer information (from bank statement)
    payer_account VARCHAR(50),
    payer_name VARCHAR(255),
    payer_bank_code VARCHAR(20),
    payer_reference VARCHAR(255),

    -- Raw data from bank
    raw_data JSONB,

    -- Received timestamp (from bank statement)
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Processing status
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    matched_deposit_id UUID REFERENCES deposit_requests(id),

    -- If created exception
    created_exception_id UUID,

    -- Metadata
    import_batch_id UUID,
    source VARCHAR(50), -- 'WEBHOOK', 'STATEMENT_IMPORT', 'MANUAL_ENTRY'

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_bank_transaction_id UNIQUE (operator_id, bank_transaction_id)
);

CREATE INDEX idx_bank_credits_operator ON bank_credits(operator_id, received_at DESC);
CREATE INDEX idx_bank_credits_transaction_id ON bank_credits(bank_transaction_id);
CREATE INDEX idx_bank_credits_unprocessed ON bank_credits(operator_id, created_at DESC) WHERE processed = false;
CREATE INDEX idx_bank_credits_amount ON bank_credits(amount_cents, received_at) WHERE processed = false;
CREATE INDEX idx_bank_credits_destination ON bank_credits(destination_account, received_at DESC);
CREATE INDEX idx_bank_credits_payer ON bank_credits(payer_account, payer_name) WHERE payer_account IS NOT NULL;

-- ============================================================================

-- Exception Payments (Unmatched deposits)
CREATE TABLE exception_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    bank_credit_id UUID NOT NULL REFERENCES bank_credits(id),

    -- Amount (in cents)
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'MYR',

    -- Status
    status exception_payment_status DEFAULT 'UNMATCHED',
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- HIGH, MEDIUM, LOW

    -- Matching attempts
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    next_retry_at TIMESTAMP WITH TIME ZONE,

    -- Suggested matches (AI/rule-based suggestions)
    suggested_matches JSONB DEFAULT '[]',
    -- Example: [{"deposit_request_id": "uuid", "confidence": 0.85, "reason": "Amount match + time proximity"}]

    -- Resolution
    matched_deposit_id UUID REFERENCES deposit_requests(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID, -- staff user ID
    resolution_method VARCHAR(50), -- 'AUTO_RETRY', 'MANUAL_MATCH', 'REFUND', 'REJECT'
    resolution_notes TEXT,

    -- Refund tracking
    refund_withdrawal_id UUID,

    -- SLA tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sla_breach_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_exception_bank_credit UNIQUE (bank_credit_id)
);

CREATE INDEX idx_exception_payments_operator ON exception_payments(operator_id, created_at DESC);
CREATE INDEX idx_exception_payments_status ON exception_payments(status, priority, created_at DESC);
CREATE INDEX idx_exception_payments_unmatched ON exception_payments(operator_id, created_at DESC) WHERE status = 'UNMATCHED';
CREATE INDEX idx_exception_payments_retry ON exception_payments(next_retry_at) WHERE status = 'UNMATCHED' AND next_retry_at IS NOT NULL;
CREATE INDEX idx_exception_payments_sla ON exception_payments(sla_breach_at) WHERE status = 'UNMATCHED' AND sla_breach_at < CURRENT_TIMESTAMP;

-- GIN index for suggested matches
CREATE INDEX idx_exception_payments_suggestions ON exception_payments USING GIN (suggested_matches);

-- ============================================================================

-- Withdrawal Requests
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    player_id UUID NOT NULL REFERENCES players(id),

    -- Amount (in cents)
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    currency VARCHAR(3) DEFAULT 'MYR',

    -- Destination bank details (encrypted)
    destination_bank_code VARCHAR(20) NOT NULL,
    destination_account_number VARCHAR(255) NOT NULL, -- encrypted
    destination_account_name VARCHAR(255) NOT NULL,

    -- Status
    status withdrawal_request_status DEFAULT 'REQUESTED',

    -- Fund reservation
    reserved_amount_cents BIGINT NOT NULL,
    reserved_at TIMESTAMP WITH TIME ZONE,
    released_at TIMESTAMP WITH TIME ZONE,

    -- Risk/AML
    risk_score DECIMAL(5, 2), -- 0.00 to 100.00
    risk_flags JSONB DEFAULT '[]',
    -- Example: ["LARGE_AMOUNT", "RAPID_WITHDRAWAL", "NEW_ACCOUNT"]

    risk_reviewed_by UUID,
    risk_reviewed_at TIMESTAMP WITH TIME ZONE,
    risk_decision VARCHAR(50), -- 'APPROVED', 'REJECTED'
    risk_notes TEXT,

    -- Approval
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,

    -- Payout details
    payout_initiated_at TIMESTAMP WITH TIME ZONE,
    payout_initiated_by UUID,
    payout_batch_id UUID,

    -- Completion
    completed_at TIMESTAMP WITH TIME ZONE,
    bank_transaction_id VARCHAR(255),
    bank_confirmation JSONB,
    actual_payout_amount_cents BIGINT,
    payout_fee_cents BIGINT DEFAULT 0,

    -- Failure
    failure_reason TEXT,
    failed_at TIMESTAMP WITH TIME ZONE,

    -- Exception tracking
    exception_created_at TIMESTAMP WITH TIME ZONE,
    exception_resolved_at TIMESTAMP WITH TIME ZONE,

    -- Player request details
    player_ip VARCHAR(45),
    user_agent TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_withdrawal_requests_player ON withdrawal_requests(player_id, created_at DESC);
CREATE INDEX idx_withdrawal_requests_operator ON withdrawal_requests(operator_id, created_at DESC);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status, created_at DESC);
CREATE INDEX idx_withdrawal_requests_pending ON withdrawal_requests(operator_id, created_at DESC)
    WHERE status IN ('REQUESTED', 'PENDING_REVIEW', 'APPROVED');
CREATE INDEX idx_withdrawal_requests_processing ON withdrawal_requests(payout_initiated_at)
    WHERE status = 'PROCESSING';
CREATE INDEX idx_withdrawal_requests_risk_review ON withdrawal_requests(operator_id, created_at DESC)
    WHERE status = 'PENDING_REVIEW';
CREATE INDEX idx_withdrawal_requests_exception ON withdrawal_requests(exception_created_at)
    WHERE status = 'EXCEPTION';

-- ============================================================================

-- Payout Transactions (Bank payout tracking)
CREATE TABLE payout_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    withdrawal_request_id UUID NOT NULL REFERENCES withdrawal_requests(id),

    -- Amount (in cents)
    amount_cents BIGINT NOT NULL,
    fee_cents BIGINT DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'MYR',

    -- Bank details
    bank_transaction_id VARCHAR(255),
    bank_reference VARCHAR(255),
    destination_account VARCHAR(255),

    -- Status
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SENT, CONFIRMED, FAILED

    -- Timing
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,

    -- Failure details
    failure_code VARCHAR(50),
    failure_message TEXT,

    -- Confirmation data
    bank_confirmation JSONB,

    -- Batch processing
    batch_id UUID,
    batch_position INTEGER,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payout_transactions_withdrawal ON payout_transactions(withdrawal_request_id);
CREATE INDEX idx_payout_transactions_operator ON payout_transactions(operator_id, created_at DESC);
CREATE INDEX idx_payout_transactions_status ON payout_transactions(status, initiated_at);
CREATE INDEX idx_payout_transactions_bank_txn ON payout_transactions(bank_transaction_id) WHERE bank_transaction_id IS NOT NULL;
CREATE INDEX idx_payout_transactions_batch ON payout_transactions(batch_id) WHERE batch_id IS NOT NULL;

-- ============================================================================

-- Ledger Entries (Double-entry accounting)
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),

    -- Entry type
    entry_type VARCHAR(50) NOT NULL, -- 'DEPOSIT', 'WITHDRAWAL', 'REFUND', 'ADJUSTMENT', 'FEE'

    -- Reference to source transaction
    reference_type VARCHAR(50), -- 'DEPOSIT_REQUEST', 'WITHDRAWAL_REQUEST', 'EXCEPTION_PAYMENT'
    reference_id UUID NOT NULL,

    -- Double-entry
    account_debit ledger_account_type NOT NULL,
    account_credit ledger_account_type NOT NULL,

    -- Amount (in cents)
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    currency VARCHAR(3) DEFAULT 'MYR',

    -- Player context (if applicable)
    player_id UUID REFERENCES players(id),

    -- Description
    description TEXT,

    -- Reconciliation
    reconciled BOOLEAN DEFAULT false,
    reconciliation_batch_id UUID,
    reconciled_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps (immutable)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100) -- 'SYSTEM' or user ID
);

-- Partition by month for performance
CREATE INDEX idx_ledger_entries_operator ON ledger_entries(operator_id, created_at DESC);
CREATE INDEX idx_ledger_entries_reference ON ledger_entries(reference_type, reference_id);
CREATE INDEX idx_ledger_entries_player ON ledger_entries(player_id, created_at DESC) WHERE player_id IS NOT NULL;
CREATE INDEX idx_ledger_entries_type ON ledger_entries(entry_type, created_at DESC);
CREATE INDEX idx_ledger_entries_accounts ON ledger_entries(account_debit, account_credit, created_at DESC);
CREATE INDEX idx_ledger_entries_unreconciled ON ledger_entries(operator_id, created_at DESC) WHERE reconciled = false;

-- ============================================================================

-- Daily Reconciliation Records
CREATE TABLE reconciliations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),

    -- Date range
    reconciliation_date DATE NOT NULL,
    start_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    end_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Status
    status reconciliation_status DEFAULT 'PASS',

    -- Balances
    opening_balance_cents BIGINT NOT NULL,
    total_credits_cents BIGINT NOT NULL,
    total_debits_cents BIGINT NOT NULL,
    expected_balance_cents BIGINT NOT NULL,
    actual_balance_cents BIGINT NOT NULL,
    variance_cents BIGINT NOT NULL,

    -- Counts
    bank_credits_count INTEGER NOT NULL,
    matched_deposits_count INTEGER NOT NULL,
    unmatched_credits_count INTEGER NOT NULL,

    bank_debits_count INTEGER NOT NULL,
    completed_withdrawals_count INTEGER NOT NULL,
    unmatched_debits_count INTEGER NOT NULL,

    -- Reserved & Suspense
    expected_reserved_cents BIGINT NOT NULL,
    actual_reserved_cents BIGINT NOT NULL,
    reserved_variance_cents BIGINT NOT NULL,

    expected_suspense_cents BIGINT NOT NULL,
    actual_suspense_cents BIGINT NOT NULL,
    suspense_variance_cents BIGINT NOT NULL,

    -- Bank statement
    bank_statement_file VARCHAR(255),
    bank_statement_hash VARCHAR(64),

    -- Processing
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,

    -- Issues found
    issues JSONB DEFAULT '[]',
    -- Example: [{"type": "UNMATCHED_CREDIT", "severity": "HIGH", "details": {...}}]

    -- Report
    report_url VARCHAR(500),

    -- Performed by
    performed_by VARCHAR(100) DEFAULT 'SYSTEM',
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_operator_date UNIQUE (operator_id, reconciliation_date)
);

CREATE INDEX idx_reconciliations_operator ON reconciliations(operator_id, reconciliation_date DESC);
CREATE INDEX idx_reconciliations_status ON reconciliations(status, reconciliation_date DESC);
CREATE INDEX idx_reconciliations_date ON reconciliations(reconciliation_date DESC);

-- ============================================================================

-- Audit Logs (Immutable audit trail)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID REFERENCES operators(id),

    -- Event details
    event_type VARCHAR(100) NOT NULL, -- 'DEPOSIT_COMPLETED', 'WITHDRAWAL_APPROVED', 'EXCEPTION_MATCHED', etc.
    event_category VARCHAR(50) NOT NULL, -- 'DEPOSIT', 'WITHDRAWAL', 'EXCEPTION', 'SYSTEM'

    -- Actor
    actor_type VARCHAR(50), -- 'PLAYER', 'STAFF', 'SYSTEM'
    actor_id VARCHAR(100),
    actor_name VARCHAR(255),

    -- Target
    target_type VARCHAR(50), -- 'DEPOSIT_REQUEST', 'WITHDRAWAL_REQUEST', 'PLAYER'
    target_id UUID,

    -- Change details
    previous_state JSONB,
    new_state JSONB,
    changes JSONB,

    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),

    -- Request details
    request_id VARCHAR(100), -- for request tracing

    -- Description
    description TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamp (immutable)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Partition by month for large volumes
CREATE INDEX idx_audit_logs_operator ON audit_logs(operator_id, created_at DESC);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type, created_at DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_type, actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id, created_at DESC);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_request ON audit_logs(request_id) WHERE request_id IS NOT NULL;

-- GIN indexes for JSONB columns
CREATE INDEX idx_audit_logs_changes ON audit_logs USING GIN (changes);
CREATE INDEX idx_audit_logs_metadata ON audit_logs USING GIN (metadata);

-- ============================================================================

-- Staff Users (Ops team)
CREATE TABLE staff_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID REFERENCES operators(id),

    -- Authentication
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),

    -- Profile
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'ADMIN', 'FINANCE', 'OPS', 'RISK', 'READONLY'

    -- Permissions
    permissions JSONB DEFAULT '[]',
    -- Example: ["exception.view", "exception.match", "withdrawal.approve", "reconciliation.run"]

    -- MFA
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),

    -- Status
    active BOOLEAN DEFAULT true,
    suspended BOOLEAN DEFAULT false,

    -- Session tracking
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(45),

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_staff_users_email ON staff_users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_staff_users_operator ON staff_users(operator_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_staff_users_active ON staff_users(active) WHERE active = true AND deleted_at IS NULL;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_operators_updated_at BEFORE UPDATE ON operators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_balances_updated_at BEFORE UPDATE ON player_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deposit_requests_updated_at BEFORE UPDATE ON deposit_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exception_payments_updated_at BEFORE UPDATE ON exception_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================

-- Increment version on player_balance update (optimistic locking)
CREATE OR REPLACE FUNCTION increment_balance_version()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_player_balance_version BEFORE UPDATE ON player_balances
    FOR EACH ROW EXECUTE FUNCTION increment_balance_version();

-- ============================================================================

-- Audit log trigger for sensitive operations
CREATE OR REPLACE FUNCTION log_withdrawal_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO audit_logs (
            operator_id,
            event_type,
            event_category,
            target_type,
            target_id,
            previous_state,
            new_state,
            description
        ) VALUES (
            NEW.operator_id,
            'WITHDRAWAL_STATUS_CHANGED',
            'WITHDRAWAL',
            'WITHDRAWAL_REQUEST',
            NEW.id,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            format('Withdrawal status changed from %s to %s', OLD.status, NEW.status)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_withdrawal_status AFTER UPDATE ON withdrawal_requests
    FOR EACH ROW EXECUTE FUNCTION log_withdrawal_status_change();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Active deposits view (frequently accessed)
CREATE OR REPLACE VIEW v_active_deposit_requests AS
SELECT
    dr.id,
    dr.operator_id,
    dr.player_id,
    p.player_external_id,
    p.full_name as player_name,
    dr.amount_cents / 100.0 as amount,
    dr.currency,
    dr.status,
    dr.matching_key_type,
    dr.matching_key_value,
    dr.payable_amount_cents / 100.0 as payable_amount,
    dr.expires_at,
    dr.late_match_window_ends_at,
    dr.created_at,
    EXTRACT(EPOCH FROM (dr.expires_at - CURRENT_TIMESTAMP)) / 60 as minutes_until_expiry
FROM deposit_requests dr
JOIN players p ON dr.player_id = p.id
WHERE dr.status IN ('INITIATED', 'EXPIRED_UI')
    AND dr.created_at > CURRENT_TIMESTAMP - INTERVAL '7 days';

-- ============================================================================

-- Exception queue view
CREATE OR REPLACE VIEW v_exception_queue AS
SELECT
    ep.id,
    ep.operator_id,
    ep.status,
    ep.priority,
    ep.amount_cents / 100.0 as amount,
    ep.currency,
    bc.bank_transaction_id,
    bc.payer_account,
    bc.payer_name,
    bc.received_at,
    ep.retry_count,
    ep.suggested_matches,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ep.created_at)) / 3600 as hours_unmatched,
    ep.created_at
FROM exception_payments ep
JOIN bank_credits bc ON ep.bank_credit_id = bc.id
WHERE ep.status IN ('UNMATCHED', 'MANUAL_REQUIRED')
ORDER BY
    CASE ep.priority
        WHEN 'HIGH' THEN 1
        WHEN 'MEDIUM' THEN 2
        WHEN 'LOW' THEN 3
    END,
    ep.created_at ASC;

-- ============================================================================

-- Player balance summary
CREATE OR REPLACE VIEW v_player_balance_summary AS
SELECT
    pb.player_id,
    pb.operator_id,
    p.player_external_id,
    p.full_name as player_name,
    pb.available_cents / 100.0 as available_balance,
    pb.reserved_cents / 100.0 as reserved_balance,
    pb.total_cents / 100.0 as total_balance,
    pb.currency,
    pb.updated_at,
    (SELECT COUNT(*) FROM withdrawal_requests wr
     WHERE wr.player_id = pb.player_id
     AND wr.status IN ('REQUESTED', 'PROCESSING', 'PENDING_REVIEW')) as pending_withdrawals_count
FROM player_balances pb
JOIN players p ON pb.player_id = p.id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE operators IS 'Casino/gaming operators using the payment gateway';
COMMENT ON TABLE players IS 'Players belonging to operators';
COMMENT ON TABLE player_balances IS 'Player wallet balances (separate for concurrency)';
COMMENT ON TABLE deposit_requests IS 'Deposit requests created by players';
COMMENT ON TABLE bank_credits IS 'Raw bank transfer credits received';
COMMENT ON TABLE exception_payments IS 'Unmatched deposits requiring manual resolution';
COMMENT ON TABLE withdrawal_requests IS 'Withdrawal requests from players';
COMMENT ON TABLE payout_transactions IS 'Bank payout transaction tracking';
COMMENT ON TABLE ledger_entries IS 'Double-entry ledger for all financial movements';
COMMENT ON TABLE reconciliations IS 'Daily reconciliation records';
COMMENT ON TABLE audit_logs IS 'Immutable audit trail for compliance';
COMMENT ON TABLE staff_users IS 'Operations staff users';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
