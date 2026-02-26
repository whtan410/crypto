import type { CallbackStatusCode, DepositStatusCode } from './types';

export const DEPOSIT_HISTORY_ROUTE_BY_MENU_KEY: Record<string, string> = {
  account: '/account',
  'user-role-config': '/role',
  mock: '/mock-tabs',
  'mock-transaction': '/mock-transaction',
  'mock-balance': '/mock-balance-update',
  'mock-withdrawal': '/mock-withdrawal-request',
  'mock-deposit': '/mock-deposit-request',
  'mock-freeze': '/mock-freeze',
  'report-deposit-history': '/deposit-history',
  'report-withdrawal-history': '/withdrawal-history',
  'report-bank-transaction': '/bank-transaction',
  'report-merchant-profile': '/merchant-profile',
  'report-success-rate': '/success-rate',
  'report-manual-match': '/manual-match',
  'report-activity-log': '/activity-log',
};

export interface ReportPageTab {
  key: string;
  label: string;
  route?: string;
}

export const REPORT_PAGE_TABS: ReportPageTab[] = [
  { key: 'deposit-history', label: 'Deposit History', route: '/deposit-history' },
  { key: 'withdrawal-history', label: 'Withdrawal History' },
  { key: 'bank-transaction', label: 'Bank Transaction' },
  { key: 'merchant-profile', label: 'Merchant User Profile' },
  { key: 'success-rate', label: 'Success Rate' },
  { key: 'manual-match', label: 'Manual Match' },
  { key: 'activity-log', label: 'Activity Log' },
];

export const DEPOSIT_STATUS_META: Record<DepositStatusCode, { label: string; color: string }> = {
  MATCHED: { label: 'Matched', color: '#5f9ea0' },
  MANUAL_MATCHED: { label: 'Manual Matched', color: '#e9a23b' },
  UNPAID: { label: 'Unpaid', color: '#e55353' },
  EXPIRED: { label: 'Expired', color: '#7a869a' },
  INITIATED: { label: 'Initiated', color: '#4f6ef7' },
  COMPLETED: { label: 'Completed', color: '#3aa76d' },
  FAILED: { label: 'Failed', color: '#c0392b' },
};

export const CALLBACK_STATUS_META: Record<CallbackStatusCode, { label: string; color: string }> = {
  TRUE: { label: 'True', color: '#49b649' },
  FALSE: { label: 'False', color: '#e55353' },
  PENDING: { label: 'Pending', color: '#faad14' },
};
