export type WithdrawalStatusCode =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'FAILED'
  | 'CANCELLED';

export type CallbackStatusCode = 'TRUE' | 'FALSE' | 'PENDING';

export interface WithdrawalHistoryItemDto {
  id: string;
  accountId: string;
  nickname: string;
  status: WithdrawalStatusCode;
  callbackStatus: CallbackStatusCode;
  orderNumber: string;
  amount: number;
  transactionTime: string;
  bankName: string;
  targetBankName: string;
  targetAccountNumber: string;
  targetAccountHolder: string;
  matchedTransactionId: string;
  currency: string;
  accountType: string;
  merchantCode: string;
}

export interface WithdrawalHistoryResponseDto {
  rows: WithdrawalHistoryItemDto[];
}

export interface WithdrawalHistoryRowViewModel {
  id: string;
  accountId: string;
  nickname: string;
  status: WithdrawalStatusCode;
  callbackStatus: CallbackStatusCode;
  orderNumber: string;
  amount: string;
  transactionTime: string;
  bankName: string;
  targetBankName: string;
  targetAccountNumber: string;
  targetAccountHolder: string;
  matchedTransactionId: string;
  currency: string;
  accountType: string;
  merchantCode: string;
}

export interface WithdrawalHistoryViewModel {
  rows: WithdrawalHistoryRowViewModel[];
}

export interface WithdrawalHistoryFilterQuery {
  accountId?: string;
  nickname?: string;
  bankName?: string;
  targetBankName?: string;
  targetAccountNumber?: string;
  targetAccountHolder?: string;
  matchedTransactionId?: string;
  status?: string;
  currency?: string;
  orderNumber?: string;
  accountType?: string;
  merchantCode?: string;
  fromDate?: string;
  toDate?: string;
}

export interface WithdrawalHistoryRepository {
  listWithdrawalHistory(query?: WithdrawalHistoryFilterQuery): Promise<WithdrawalHistoryResponseDto>;
}
