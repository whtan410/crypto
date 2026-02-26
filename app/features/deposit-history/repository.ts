import type {
  DepositHistoryFilterQuery,
  DepositHistoryItemDto,
  DepositHistoryRepository,
  DepositHistoryResponseDto,
  DepositHistoryViewModel,
} from './types';

const AMOUNT_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const MOCK_DEPOSIT_HISTORY: DepositHistoryItemDto[] = [
  {
    id: 'FE8A...77F8',
    nickname: 'Test Bank 01',
    status: 'MATCHED',
    callbackStatus: 'TRUE',
    orderNumber: '2026...1730',
    orderAmount: 500,
    assignedAmount: 499.99,
    requestTime: '2026-01-21 16:30',
    bankName: 'BANGKOK BANK PUBLIC COMPANY LTD',
    currency: 'THB',
    accountType: 'CORPORATE',
    merchantCode: 'MRC001',
    matchedTransactionId: 'TXN-10001',
  },
  {
    id: 'AB63...B2D7',
    nickname: 'Test Bank 01',
    status: 'MATCHED',
    callbackStatus: 'TRUE',
    orderNumber: '2101...1728',
    orderAmount: 500,
    assignedAmount: 499.99,
    requestTime: '2026-01-21 16:28',
    bankName: 'KASIKORNBANK PCL',
    currency: 'THB',
    accountType: 'PERSONAL',
    merchantCode: 'MRC001',
    matchedTransactionId: 'TXN-10002',
  },
  {
    id: 'D56E...5BE9',
    nickname: 'Test Bank 01',
    status: 'MANUAL_MATCHED',
    callbackStatus: 'TRUE',
    orderNumber: '2028...1718',
    orderAmount: 500,
    assignedAmount: 499.99,
    requestTime: '2026-01-21 16:16',
    bankName: 'BANGKOK BANK PUBLIC COMPANY LTD',
    currency: 'THB',
    accountType: 'CORPORATE',
    merchantCode: 'MRC002',
    matchedTransactionId: 'TXN-10003',
  },
  {
    id: 'A57C...4F1A',
    nickname: 'Test Bank 01',
    status: 'UNPAID',
    callbackStatus: 'FALSE',
    orderNumber: '2026...1708',
    orderAmount: 500,
    assignedAmount: 499.99,
    requestTime: '2026-01-21 16:00',
    bankName: 'KRUNG THAI BANK PUBLIC COMPANY LTD',
    currency: 'THB',
    accountType: 'PERSONAL',
    merchantCode: 'MRC003',
    matchedTransactionId: 'TXN-10004',
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

const inDateRange = (requestTime: string, fromDate?: string, toDate?: string) => {
  if (!fromDate && !toDate) {
    return true;
  }
  const requestDate = requestTime.slice(0, 10);
  if (fromDate && requestDate < fromDate) {
    return false;
  }
  if (toDate && requestDate > toDate) {
    return false;
  }
  return true;
};

const filterRows = (rows: DepositHistoryItemDto[], query?: DepositHistoryFilterQuery): DepositHistoryItemDto[] => {
  if (!query) {
    return rows;
  }

  return rows.filter((row) => {
    const nicknameMatch =
      !query.nickname || normalize(row.nickname).includes(normalize(query.nickname));
    const bankNameMatch =
      !query.bankName || normalize(row.bankName).includes(normalize(query.bankName));
    const statusMatch = !query.status || row.status === query.status;
    const currencyMatch = !query.currency || row.currency === query.currency;
    const orderNumberMatch =
      !query.orderNumber || normalize(row.orderNumber).includes(normalize(query.orderNumber));
    const matchedTransactionIdMatch =
      !query.matchedTransactionId ||
      normalize(row.matchedTransactionId).includes(normalize(query.matchedTransactionId));
    const accountTypeMatch = !query.accountType || row.accountType === query.accountType;
    const merchantCodeMatch =
      !query.merchantCode || normalize(row.merchantCode).includes(normalize(query.merchantCode));
    const dateMatch = inDateRange(row.requestTime, query.fromDate, query.toDate);

    return (
      nicknameMatch &&
      bankNameMatch &&
      statusMatch &&
      currencyMatch &&
      orderNumberMatch &&
      matchedTransactionIdMatch &&
      accountTypeMatch &&
      merchantCodeMatch &&
      dateMatch
    );
  });
};

export const mapDepositHistoryDtoToViewModel = (dto: DepositHistoryResponseDto): DepositHistoryViewModel => ({
  rows: dto.rows.map((row) => ({
    id: row.id,
    nickname: row.nickname,
    status: row.status,
    callbackStatus: row.callbackStatus,
    orderNumber: row.orderNumber,
    orderAmount: AMOUNT_FORMATTER.format(row.orderAmount),
    assignedAmount: AMOUNT_FORMATTER.format(row.assignedAmount),
    requestTime: row.requestTime,
    bankName: row.bankName,
    currency: row.currency,
    accountType: row.accountType,
    merchantCode: row.merchantCode,
    matchedTransactionId: row.matchedTransactionId,
  })),
});

export class MockDepositHistoryRepository implements DepositHistoryRepository {
  async listDepositHistory(query?: DepositHistoryFilterQuery): Promise<DepositHistoryResponseDto> {
    return {
      rows: filterRows(MOCK_DEPOSIT_HISTORY, query),
    };
  }
}
