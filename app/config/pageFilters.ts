/**
 * Page Filter Configurations
 * Pre-configured filter field definitions for each page in the application
 */

import type { FilterField } from '../types/filter';
import {
  DEPOSIT_STATUS_OPTIONS,
  WITHDRAWAL_STATUS_OPTIONS,
  ACCOUNT_STATUS_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
  BANK_OPTIONS,
  TRANSFER_DIRECTION_OPTIONS,
  CLOSED_STATUS_OPTIONS,
  DIRECTION_OPTIONS,
  PROBLEM_TRANSACTION_STATUS_OPTIONS,
  CALLBACK_TYPE_OPTIONS,
  CALLBACK_STATUS_OPTIONS,
  CURRENCY_OPTIONS,
} from '../constants/filterOptions';

// Deposit History Page Filters
export const DEPOSIT_HISTORY_FILTERS: FilterField[] = [
  { name: 'nickname', type: 'text', label: 'Nickname', span: 6 },
  { name: 'bankName', type: 'text', label: 'Bank Name', span: 6 },
  { name: 'status', type: 'select', label: 'Status', options: DEPOSIT_STATUS_OPTIONS, span: 6 },
  { name: 'currency', type: 'select', label: 'Currency', options: CURRENCY_OPTIONS, span: 6 },
  { name: 'orderNumber', type: 'text', label: 'Order Number', span: 6 },
  { name: 'matchedTransactionId', type: 'text', label: 'Matched Transaction ID', span: 6 },
  { name: 'accountType', type: 'select', label: 'Account Type', options: ACCOUNT_TYPE_OPTIONS, span: 6 },
  { name: 'merchantCode', type: 'text', label: 'Merchant Code', span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];

// Withdrawal History Page Filters
export const WITHDRAWAL_HISTORY_FILTERS: FilterField[] = [
  { name: 'nickname', type: 'text', label: 'Nickname', span: 6 },
  { name: 'bankName', type: 'text', label: 'Bank Name', span: 6 },
  { name: 'status', type: 'select', label: 'Status', options: WITHDRAWAL_STATUS_OPTIONS, span: 6 },
  { name: 'currency', type: 'select', label: 'Currency', options: CURRENCY_OPTIONS, span: 6 },
  { name: 'orderNumber', type: 'text', label: 'Order Number', span: 6 },
  { name: 'targetBankName', type: 'text', label: 'Target Bank Name', span: 6 },
  { name: 'targetAccountNumber', type: 'text', label: 'Target Account Number', span: 6 },
  { name: 'targetAccountHolder', type: 'text', label: 'Target Account Holder', span: 6 },
  { name: 'matchedTransactionId', type: 'text', label: 'Matched Transaction ID', span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];

// Account Dashboard Page Filters
export const ACCOUNT_DASHBOARD_FILTERS: FilterField[] = [
  { name: 'nickname', type: 'text', label: 'Nickname', span: 6 },
  { name: 'bank', type: 'select', label: 'Bank', options: BANK_OPTIONS, span: 6 },
  { name: 'accountHolder', type: 'text', label: 'Account Holder', span: 6 },
  { name: 'accountNumber', type: 'text', label: 'Account Number', span: 6 },
  { name: 'status', type: 'select', label: 'Status', options: ACCOUNT_STATUS_OPTIONS, span: 6 },
  { name: 'accountType', type: 'select', label: 'Account Type', options: ACCOUNT_TYPE_OPTIONS, span: 6 },
  { name: 'in', type: 'select', label: 'In', options: TRANSFER_DIRECTION_OPTIONS, span: 6 },
  { name: 'out', type: 'select', label: 'Out', options: TRANSFER_DIRECTION_OPTIONS, span: 6 },
];

// Success Rate Page Filters
export const SUCCESS_RATE_FILTERS: FilterField[] = [
  { name: 'startDate', type: 'date', label: 'Start Date', span: 8 },
  { name: 'endDate', type: 'date', label: 'End Date', span: 8 },
  { name: 'merchantCode', type: 'text', label: 'Merchant Code', span: 8 },
];

// Activity Log Page Filters
export const ACTIVITY_LOG_FILTERS: FilterField[] = [
  { name: 'username', type: 'text', label: 'Username', span: 6 },
  { name: 'action', type: 'text', label: 'Action', span: 6 },
  { name: 'targetType', type: 'text', label: 'Target Type', span: 6 },
  { name: 'targetId', type: 'text', label: 'Target ID', span: 6 },
  { name: 'dateRange', type: 'daterange', label: 'Date Range', span: 12 },
];

// Out Exception (Withdrawal Exception) Page Filters
export const OUT_EXCEPTION_FILTERS: FilterField[] = [
  { name: 'bankName', type: 'text', label: 'Bank Name', span: 6 },
  { name: 'orderNumber', type: 'text', label: 'Order Number', span: 6 },
  { name: 'targetAccountNumber', type: 'text', label: 'Target Account Number', span: 6 },
  { name: 'targetAccountHolder', type: 'text', label: 'Target Account Holder', span: 6 },
  { name: 'targetBankName', type: 'text', label: 'Target Bank Name', span: 6 },
  { name: 'closed', type: 'select', label: 'Closed', options: CLOSED_STATUS_OPTIONS, span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];

// In Exception (Deposit Exception) Page Filters
export const IN_EXCEPTION_FILTERS: FilterField[] = [
  { name: 'bankName', type: 'text', label: 'Bank Name', span: 6 },
  { name: 'accountNumber', type: 'text', label: 'Account Number', span: 6 },
  { name: 'counterpartyAccount', type: 'text', label: 'Counterparty Account', span: 6 },
  { name: 'counterpartyName', type: 'text', label: 'Counterparty Name', span: 6 },
  { name: 'reference', type: 'text', label: 'Reference', span: 6 },
  { name: 'closed', type: 'select', label: 'Closed', options: CLOSED_STATUS_OPTIONS, span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];

// Problem Transactions Page Filters
export const PROBLEM_TRANSACTIONS_FILTERS: FilterField[] = [
  { name: 'id', type: 'text', label: 'ID', span: 6 },
  { name: 'bankName', type: 'text', label: 'Bank Name', span: 6 },
  { name: 'counterpartyAccount', type: 'text', label: 'Counterparty Account', span: 6 },
  { name: 'counterpartyBank', type: 'text', label: 'Counterparty Bank', span: 6 },
  { name: 'status', type: 'select', label: 'Status', options: PROBLEM_TRANSACTION_STATUS_OPTIONS, span: 6 },
  { name: 'direction', type: 'select', label: 'Direction', options: DIRECTION_OPTIONS, span: 6 },
  { name: 'reference', type: 'text', label: 'Reference', span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];

// Failed Callbacks Page Filters
export const FAILED_CALLBACKS_FILTERS: FilterField[] = [
  { name: 'callbackType', type: 'select', label: 'Callback Type', options: CALLBACK_TYPE_OPTIONS, span: 6 },
  { name: 'status', type: 'select', label: 'Status', options: CALLBACK_STATUS_OPTIONS, span: 6 },
  { name: 'merchantCode', type: 'text', label: 'Merchant Code', span: 6 },
  { name: 'orderNumber', type: 'text', label: 'Order Number', span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];

// Bank Transaction Page Filters
export const BANK_TRANSACTION_FILTERS: FilterField[] = [
  { name: 'bankName', type: 'text', label: 'Bank Name', span: 6 },
  { name: 'accountNumber', type: 'text', label: 'Account Number', span: 6 },
  { name: 'direction', type: 'select', label: 'Direction', options: DIRECTION_OPTIONS, span: 6 },
  { name: 'counterpartyAccount', type: 'text', label: 'Counterparty Account', span: 6 },
  { name: 'reference', type: 'text', label: 'Reference', span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];

// Manual Match Page Filters
export const MANUAL_MATCH_FILTERS: FilterField[] = [
  { name: 'bankName', type: 'text', label: 'Bank Name', span: 6 },
  { name: 'orderNumber', type: 'text', label: 'Order Number', span: 6 },
  { name: 'matchedBy', type: 'text', label: 'Matched By', span: 6 },
  { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
  { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
];
