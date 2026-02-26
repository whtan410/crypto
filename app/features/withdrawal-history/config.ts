import type { CallbackStatusCode, WithdrawalStatusCode } from './types';

export const WITHDRAWAL_HISTORY_ROUTE_BY_MENU_KEY: Record<string, string> = {
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

export const WITHDRAWAL_STATUS_META: Record<WithdrawalStatusCode, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: '#faad14' },
  APPROVED: { label: 'Approved', color: '#52c41a' },
  PROCESSING: { label: 'Processing', color: '#1890ff' },
  COMPLETED: { label: 'Completed', color: '#3aa76d' },
  REJECTED: { label: 'Rejected', color: '#e55353' },
  FAILED: { label: 'Failed', color: '#c0392b' },
  CANCELLED: { label: 'Cancelled', color: '#7a869a' },
};

export const CALLBACK_STATUS_META: Record<CallbackStatusCode, { label: string; color: string }> = {
  TRUE: { label: 'True', color: '#49b649' },
  FALSE: { label: 'False', color: '#e55353' },
  PENDING: { label: 'Pending', color: '#faad14' },
};
