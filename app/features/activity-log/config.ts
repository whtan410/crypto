export const ACTIVITY_LOG_ROUTE_BY_MENU_KEY: Record<string, string> = {
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

export const ACTIVITY_LOG_ACTION_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'REPORT_VIEWED', value: 'REPORT_VIEWED' },
  { label: 'REPORT_EXPORTED', value: 'REPORT_EXPORTED' },
  { label: 'RECORD_CREATED', value: 'RECORD_CREATED' },
  { label: 'RECORD_UPDATED', value: 'RECORD_UPDATED' },
  { label: 'RECORD_DELETED', value: 'RECORD_DELETED' },
];

export const ACTIVITY_LOG_TARGET_TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'MANUAL_MATCH_REPORT', value: 'MANUAL_MATCH_REPORT' },
  { label: 'SUCCESS_RATE_REPORT', value: 'SUCCESS_RATE_REPORT' },
  { label: 'TRANSACTION_REPORT', value: 'TRANSACTION_REPORT' },
  { label: 'WITHDRAWAL_REQUEST_REPORT', value: 'WITHDRAWAL_REQUEST_REPORT' },
  { label: 'DEPOSIT_REQUEST_REPORT', value: 'DEPOSIT_REQUEST_REPORT' },
];
