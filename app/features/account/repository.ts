import { STATUS_META } from './config';
import type {
  AccountDataRepository,
  AccountFilterQuery,
  AccountItemDto,
  AccountPageResponseDto,
  AccountPageViewModel,
  SummaryCardDto,
  TransferMetricDto,
} from './types';

const THB_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const toThb = (value: number) => `THB ${THB_FORMATTER.format(value)}`;

const toTransferMetricViewModel = (metric: TransferMetricDto) => ({
  dailyTransferLimit: toThb(metric.dailyTransferLimit),
  dailyUsed: toThb(metric.dailyUsed),
  pending: toThb(metric.pending),
  averageLimit: toThb(metric.averageLimit),
  dailyCountLimit: String(metric.dailyCountLimit),
  dailyCountUsed: String(metric.dailyCountUsed),
});

const toSummaryValue = (card: SummaryCardDto) =>
  card.isCurrency ? THB_FORMATTER.format(card.value) : String(card.value);

export const mapAccountPageDtoToViewModel = (dto: AccountPageResponseDto): AccountPageViewModel => ({
  summaryCards: dto.summaryCards.map((card) => ({
    key: card.key,
    title: card.title,
    value: toSummaryValue(card),
    subtitle: card.subtitle,
  })),
  rows: dto.accounts.map((account) => ({
    id: account.id,
    bank: account.bank,
    accountNumber: account.accountNumber,
    holder: account.holder,
    statuses: account.statuses.map((code) => ({
      code,
      label: STATUS_META[code].label,
    })),
    balanceLimit: toThb(account.balanceLimit),
    currentBalance: toThb(account.currentBalance),
    totalIn: toThb(account.totalIn),
    totalOut: toThb(account.totalOut),
    inTransfer: toTransferMetricViewModel(account.inTransfer),
    outTransfer: toTransferMetricViewModel(account.outTransfer),
    inEnabled: account.inEnabled,
    outEnabled: account.outEnabled,
  })),
});

const MOCK_SUMMARY_CARDS: SummaryCardDto[] = [
  { key: 'dailyInQuota', title: 'Daily In Quota (Active)', value: 121280000, subtitle: 'Remaining: 121,280,000.00', isCurrency: true },
  { key: 'totalBalance', title: 'Total Balance (Active)', value: 2259351.78, subtitle: 'Frozen: 384,452.28', isCurrency: true },
  { key: 'corporateCount', title: 'Corporate Accounts', value: 6, subtitle: 'Active: 4 | Inactive: 1 | Draft: 0 | Suspended: 0 | Closed: 0 | Freeze: 1' },
  { key: 'personalCount', title: 'Personal Accounts', value: 5, subtitle: 'Active: 3 | Inactive: 1 | Draft: 1 | Suspended: 0 | Closed: 0 | Freeze: 0' },
];

const MOCK_ACCOUNTS: AccountItemDto[] = [
  {
    id: 'Stress Test Bank 1',
    bank: 'KASIKORNBANK PCL (KBANK)',
    accountNumber: '12345767890',
    holder: 'Stress Test Holder 1234',
    statuses: ['DEPOSIT_OFFLINE', 'WITHDRAWAL_OFFLINE', 'ACTIVE'],
    balanceLimit: 1000000000,
    currentBalance: 50.01,
    totalIn: 150.01,
    totalOut: 0,
    inTransfer: {
      dailyTransferLimit: 130000000,
      dailyUsed: 0,
      pending: 0,
      averageLimit: 130000000,
      dailyCountLimit: 0,
      dailyCountUsed: 2,
    },
    outTransfer: {
      dailyTransferLimit: 10000000,
      dailyUsed: 0,
      pending: 0,
      averageLimit: 130000000,
      dailyCountLimit: 0,
      dailyCountUsed: 0,
    },
    inEnabled: true,
    outEnabled: false,
  },
  {
    id: 'Test Bank 01',
    bank: 'BANGKOK BANK PCL',
    accountNumber: '0998833999',
    holder: 'System Test Holder',
    statuses: ['DEPOSIT_OFFLINE', 'ACTIVE'],
    balanceLimit: 100000000,
    currentBalance: 340120,
    totalIn: 500000,
    totalOut: 220600,
    inTransfer: {
      dailyTransferLimit: 10000000,
      dailyUsed: 100000,
      pending: 0,
      averageLimit: 10000000,
      dailyCountLimit: 0,
      dailyCountUsed: 2,
    },
    outTransfer: {
      dailyTransferLimit: 10000000,
      dailyUsed: 30000,
      pending: 0,
      averageLimit: 10000000,
      dailyCountLimit: 0,
      dailyCountUsed: 0,
    },
    inEnabled: true,
    outEnabled: false,
  },
];

export class MockAccountRepository implements AccountDataRepository {
  async listAccountPageData(_query?: AccountFilterQuery): Promise<AccountPageResponseDto> {
    return {
      summaryCards: MOCK_SUMMARY_CARDS,
      accounts: MOCK_ACCOUNTS,
    };
  }
}
