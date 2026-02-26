import type { FilterField } from '../../types/filter';

export type AccountStatusCode =
  | 'ACTIVE'
  | 'DEPOSIT_OFFLINE'
  | 'WITHDRAWAL_OFFLINE'
  | 'MAINTENANCE'
  | 'FROZEN';

export interface TransferMetricDto {
  dailyTransferLimit: number;
  dailyUsed: number;
  pending: number;
  averageLimit: number;
  dailyCountLimit: number;
  dailyCountUsed: number;
}

export interface AccountItemDto {
  id: string;
  bank: string;
  accountNumber: string;
  holder: string;
  statuses: AccountStatusCode[];
  balanceLimit: number;
  currentBalance: number;
  totalIn: number;
  totalOut: number;
  inTransfer: TransferMetricDto;
  outTransfer: TransferMetricDto;
  inEnabled: boolean;
  outEnabled: boolean;
}

export interface SummaryCardDto {
  key: string;
  title: string;
  value: number;
  subtitle: string;
  isCurrency?: boolean;
}

export interface AccountPageResponseDto {
  summaryCards: SummaryCardDto[];
  accounts: AccountItemDto[];
}

export interface TransferMetricViewModel {
  dailyTransferLimit: string;
  dailyUsed: string;
  pending: string;
  averageLimit: string;
  dailyCountLimit: string;
  dailyCountUsed: string;
}

export interface AccountRowViewModel {
  id: string;
  bank: string;
  accountNumber: string;
  holder: string;
  statuses: Array<{ code: AccountStatusCode; label: string }>;
  balanceLimit: string;
  currentBalance: string;
  totalIn: string;
  totalOut: string;
  inTransfer: TransferMetricViewModel;
  outTransfer: TransferMetricViewModel;
  inEnabled: boolean;
  outEnabled: boolean;
}

export interface SummaryCardViewModel {
  key: string;
  title: string;
  value: string;
  subtitle: string;
}

export interface AccountPageViewModel {
  summaryCards: SummaryCardViewModel[];
  rows: AccountRowViewModel[];
}

export type AccountFilterQuery = Record<string, string | number | boolean | undefined>;

export interface AccountDataRepository {
  listAccountPageData(query?: AccountFilterQuery): Promise<AccountPageResponseDto>;
}

export interface AccountFilterField extends FilterField {
  name:
    | 'nickname'
    | 'bank'
    | 'accountHolder'
    | 'accountNumber'
    | 'status'
    | 'accountType'
    | 'in'
    | 'out';
}
