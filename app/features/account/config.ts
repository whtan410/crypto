import { ACCOUNT_STATUS_OPTIONS, ACCOUNT_TYPE_OPTIONS, BANK_OPTIONS, TRANSFER_DIRECTION_OPTIONS } from '../../constants/filterOptions';
import type { AccountFilterField, AccountStatusCode } from './types';

export const ACCOUNT_ROUTE_BY_MENU_KEY: Record<string, string> = {
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

export const ACCOUNT_FILTER_FIELDS: AccountFilterField[] = [
  { name: 'nickname', type: 'text', label: 'Nickname', placeholder: 'Nickname' },
  { name: 'bank', type: 'select', label: 'Bank', options: BANK_OPTIONS, placeholder: 'Bank' },
  { name: 'accountHolder', type: 'text', label: 'Account Holder', placeholder: 'Account Holder' },
  { name: 'accountNumber', type: 'text', label: 'Account Number', placeholder: 'Account Number' },
  { name: 'status', type: 'select', label: 'Status', options: ACCOUNT_STATUS_OPTIONS, placeholder: 'Status' },
  { name: 'accountType', type: 'select', label: 'Account Type', options: ACCOUNT_TYPE_OPTIONS, placeholder: 'Account Type' },
  { name: 'in', type: 'select', label: 'In', options: TRANSFER_DIRECTION_OPTIONS, placeholder: 'In' },
  { name: 'out', type: 'select', label: 'Out', options: TRANSFER_DIRECTION_OPTIONS, placeholder: 'Out' },
];

export const ACCOUNT_GRID_COLUMNS = [
  { key: 'accountInfo', label: 'Account Info', width: '2fr' },
  { key: 'status', label: 'Status', width: '1.2fr' },
  { key: 'balanceDetails', label: 'Balance Details', width: '2fr' },
  { key: 'inTransfer', label: 'In Transfer', width: '2fr' },
  { key: 'outTransfer', label: 'Out Transfer', width: '2fr' },
  { key: 'enableSettings', label: 'Enable Settings', width: '1.2fr' },
  { key: 'actions', label: 'Actions', width: '1.2fr' },
] as const;

export const STATUS_META: Record<AccountStatusCode, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'green' },
  DEPOSIT_OFFLINE: { label: 'Deposit Offline', color: 'orange' },
  WITHDRAWAL_OFFLINE: { label: 'Withdrawal Offline', color: 'orange' },
  MAINTENANCE: { label: 'Maintenance', color: 'blue' },
  FROZEN: { label: 'Frozen', color: 'red' },
};
