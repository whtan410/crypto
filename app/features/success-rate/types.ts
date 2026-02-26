export type TransactionTypeCode = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

export interface SuccessRateItemDto {
  id: string;
  merchantCode: string;
  transactionType: TransactionTypeCode;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
  currency: string;
  dateRange: string;
  averageAmount: number;
}

export interface SuccessRateResponseDto {
  rows: SuccessRateItemDto[];
}

export interface SuccessRateRowViewModel {
  id: string;
  merchantCode: string;
  transactionType: TransactionTypeCode;
  totalTransactions: string;
  successfulTransactions: string;
  failedTransactions: string;
  successRate: string;
  currency: string;
  dateRange: string;
  averageAmount: string;
}

export interface SuccessRateViewModel {
  rows: SuccessRateRowViewModel[];
}

export interface SuccessRateFilterQuery {
  merchantCode?: string;
  transactionType?: string;
  currency?: string;
  fromDate?: string;
  toDate?: string;
}

export interface SuccessRateRepository {
  listSuccessRate(query?: SuccessRateFilterQuery): Promise<SuccessRateResponseDto>;
}
