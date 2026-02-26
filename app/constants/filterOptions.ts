/**
 * Filter Options Constants
 * Centralized dropdown options for all filter fields across the application
 */

export const DEPOSIT_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Matched', value: 'MATCHED' },
  { label: 'Manual Matched', value: 'MANUAL_MATCHED' },
  { label: 'Unpaid', value: 'UNPAID' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Initiated', value: 'INITIATED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Failed', value: 'FAILED' },
];

export const WITHDRAWAL_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const ACCOUNT_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Deposit Offline', value: 'DEPOSIT_OFFLINE' },
  { label: 'Withdrawal Offline', value: 'WITHDRAWAL_OFFLINE' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Frozen', value: 'FROZEN' },
];

export const ACCOUNT_TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Corporate', value: 'CORPORATE' },
  { label: 'Personal', value: 'PERSONAL' },
];

export const BANK_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'BANGKOK BANK PUBLIC COMPANY LTD', value: 'BBL' },
  { label: 'KASIKORNBANK PCL', value: 'KBANK' },
  { label: 'TMB BANK PUBLIC COMPANY LTD/TTB', value: 'TMB' },
  { label: 'BAAC - BANK FOR AGRICULTURE AND AGRICULTURAL CO', value: 'BAAC' },
  { label: 'KRUNG THAI BANK PUBLIC COMPANY LTD', value: 'KTB' },
  { label: 'SIAM COMMERCIAL BANK PUBLIC COMPANY LTD', value: 'SCB' },
  { label: 'BANK OF AYUDHYA PUBLIC COMPANY LTD', value: 'BAY' },
];

export const TRANSFER_DIRECTION_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Enabled', value: 'ENABLED' },
  { label: 'Disabled', value: 'DISABLED' },
];

export const CLOSED_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Closed', value: 'CLOSED' },
];

export const DIRECTION_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'In', value: 'IN' },
  { label: 'Out', value: 'OUT' },
];

export const PROBLEM_TRANSACTION_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Unmatched', value: 'UNMATCHED' },
  { label: 'Matched', value: 'MATCHED' },
  { label: 'Investigating', value: 'INVESTIGATING' },
  { label: 'Resolved', value: 'RESOLVED' },
];

export const CALLBACK_TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Deposit', value: 'DEPOSIT' },
  { label: 'Withdrawal', value: 'WITHDRAWAL' },
  { label: 'Balance Update', value: 'BALANCE_UPDATE' },
];

export const CALLBACK_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'True', value: 'TRUE' },
  { label: 'False', value: 'FALSE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Retry', value: 'RETRY' },
];

export const CURRENCY_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'THB', value: 'THB' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
];

export const TRANSACTION_TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Deposit', value: 'DEPOSIT' },
  { label: 'Withdrawal', value: 'WITHDRAWAL' },
  { label: 'Transfer', value: 'TRANSFER' },
];
