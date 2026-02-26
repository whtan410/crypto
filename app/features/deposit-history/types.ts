export type DepositStatusCode =
  | 'MATCHED'
  | 'MANUAL_MATCHED'
  | 'UNPAID'
  | 'EXPIRED'
  | 'INITIATED'
  | 'COMPLETED'
  | 'FAILED';

export type CallbackStatusCode = 'TRUE' | 'FALSE' | 'PENDING';

export interface DepositHistoryItemDto {
  id: string;
  nickname: string;
  status: DepositStatusCode;
  callbackStatus: CallbackStatusCode;
  orderNumber: string;
  orderAmount: number;
  assignedAmount: number;
  requestTime: string;
  bankName: string;
  currency: string;
  accountType: string;
  merchantCode: string;
  matchedTransactionId: string;
}

export interface DepositHistoryResponseDto {
  rows: DepositHistoryItemDto[];
}

export interface DepositHistoryRowViewModel {
  id: string;
  nickname: string;
  status: DepositStatusCode;
  callbackStatus: CallbackStatusCode;
  orderNumber: string;
  orderAmount: string;
  assignedAmount: string;
  requestTime: string;
  bankName: string;
  currency: string;
  accountType: string;
  merchantCode: string;
  matchedTransactionId: string;
}

export interface DepositHistoryViewModel {
  rows: DepositHistoryRowViewModel[];
}

export interface DepositHistoryFilterQuery {
  nickname?: string;
  bankName?: string;
  status?: string;
  currency?: string;
  orderNumber?: string;
  matchedTransactionId?: string;
  accountType?: string;
  merchantCode?: string;
  fromDate?: string;
  toDate?: string;
}

export interface DepositHistoryRepository {
  listDepositHistory(query?: DepositHistoryFilterQuery): Promise<DepositHistoryResponseDto>;
}
