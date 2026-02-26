export const ROLE_ROUTE_BY_MENU_KEY: Record<string, string> = {
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

export const ROLE_TABLE_COLUMNS = [
  { key: 'roleName', title: 'Role Name' },
  { key: 'userCount', title: 'Users Count' },
  { key: 'permissions', title: 'Permissions' },
  { key: 'actions', title: 'Actions' },
] as const;
