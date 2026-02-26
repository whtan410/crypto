import type {
  WithdrawalHistoryFilterQuery,
  WithdrawalHistoryItemDto,
  WithdrawalHistoryRepository,
  WithdrawalHistoryResponseDto,
  WithdrawalHistoryViewModel,
} from './types';

const AMOUNT_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const MOCK_WITHDRAWAL_HISTORY: WithdrawalHistoryItemDto[] = [
  {
    id: 'WD01...A3F2',
    accountId: 'ACC-001',
    nickname: 'Main Withdrawal Account',
    status: 'COMPLETED',
    callbackStatus: 'TRUE',
    orderNumber: 'WO2026...1545',
    amount: 1000,
    transactionTime: '2026-02-22 15:45',
    bankName: 'BANGKOK BANK PUBLIC COMPANY LTD',
    targetBankName: 'BANGKOK BANK PUBLIC COMPANY LTD',
    targetAccountNumber: '4242...2345',
    targetAccountHolder: 'MING COMPANY LTD',
    matchedTransactionId: 'MT2026...0045',
    currency: 'THB',
    accountType: 'CORPORATE',
    merchantCode: 'MRC001',
  },
  {
    id: 'WD02...B7E4',
    accountId: 'ACC-002',
    nickname: 'Secondary Account',
    status: 'PROCESSING',
    callbackStatus: 'PENDING',
    orderNumber: 'WO2026...1530',
    amount: 500,
    transactionTime: '2026-02-22 15:30',
    bankName: 'KASIKORNBANK PCL',
    targetBankName: 'KASIKORNBANK PCL',
    targetAccountNumber: '4242...5678',
    targetAccountHolder: 'MING SHOP',
    matchedTransactionId: 'MT2026...0046',
    currency: 'THB',
    accountType: 'PERSONAL',
    merchantCode: 'MRC002',
  },
  {
    id: 'WD03...C9D1',
    accountId: 'ACC-003',
    nickname: 'VIP Account',
    status: 'APPROVED',
    callbackStatus: 'PENDING',
    orderNumber: 'WO2026...1515',
    amount: 2500,
    transactionTime: '2026-02-22 15:15',
    bankName: 'KRUNG THAI BANK PUBLIC COMPANY LTD',
    targetBankName: 'KRUNG THAI BANK PUBLIC COMPANY LTD',
    targetAccountNumber: '4242...8899',
    targetAccountHolder: 'VIP TRADING',
    matchedTransactionId: 'MT2026...0047',
    currency: 'THB',
    accountType: 'CORPORATE',
    merchantCode: 'MRC001',
  },
  {
    id: 'WD04...D2A8',
    accountId: 'ACC-004',
    nickname: 'Test Withdrawal',
    status: 'REJECTED',
    callbackStatus: 'FALSE',
    orderNumber: 'WO2026...1500',
    amount: 750,
    transactionTime: '2026-02-22 15:00',
    bankName: 'SIAM COMMERCIAL BANK PCL',
    targetBankName: 'SIAM COMMERCIAL BANK PCL',
    targetAccountNumber: '4242...7711',
    targetAccountHolder: 'TEST USER',
    matchedTransactionId: 'MT2026...0048',
    currency: 'THB',
    accountType: 'PERSONAL',
    merchantCode: 'MRC003',
  },
  {
    id: 'WD05...E5C3',
    accountId: 'ACC-005',
    nickname: 'Main Withdrawal Account',
    status: 'PENDING',
    callbackStatus: 'PENDING',
    orderNumber: 'WO2026...1445',
    amount: 1500,
    transactionTime: '2026-02-22 14:45',
    bankName: 'BANGKOK BANK PUBLIC COMPANY LTD',
    targetBankName: 'BANGKOK BANK PUBLIC COMPANY LTD',
    targetAccountNumber: '4242...9999',
    targetAccountHolder: 'MAIN WALLET',
    matchedTransactionId: 'MT2026...0049',
    currency: 'THB',
    accountType: 'CORPORATE',
    merchantCode: 'MRC001',
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

const inDateRange = (transactionTime: string, fromDate?: string, toDate?: string) => {
  if (!fromDate && !toDate) {
    return true;
  }
  const transactionDate = transactionTime.slice(0, 10);
  if (fromDate && transactionDate < fromDate) {
    return false;
  }
  if (toDate && transactionDate > toDate) {
    return false;
  }
  return true;
};

const filterRows = (rows: WithdrawalHistoryItemDto[], query?: WithdrawalHistoryFilterQuery): WithdrawalHistoryItemDto[] => {
  if (!query) {
    return rows;
  }

  return rows.filter((row) => {
    const accountIdMatch =
      !query.accountId || normalize(row.accountId).includes(normalize(query.accountId));
    const nicknameMatch =
      !query.nickname || normalize(row.nickname).includes(normalize(query.nickname));
    const bankNameMatch =
      !query.bankName || normalize(row.bankName).includes(normalize(query.bankName));
    const targetBankNameMatch =
      !query.targetBankName || normalize(row.targetBankName).includes(normalize(query.targetBankName));
    const targetAccountNumberMatch =
      !query.targetAccountNumber ||
      normalize(row.targetAccountNumber).includes(normalize(query.targetAccountNumber));
    const targetAccountHolderMatch =
      !query.targetAccountHolder ||
      normalize(row.targetAccountHolder).includes(normalize(query.targetAccountHolder));
    const matchedTransactionIdMatch =
      !query.matchedTransactionId ||
      normalize(row.matchedTransactionId).includes(normalize(query.matchedTransactionId));
    const statusMatch = !query.status || row.status === query.status;
    const currencyMatch = !query.currency || row.currency === query.currency;
    const orderNumberMatch =
      !query.orderNumber || normalize(row.orderNumber).includes(normalize(query.orderNumber));
    const accountTypeMatch = !query.accountType || row.accountType === query.accountType;
    const merchantCodeMatch =
      !query.merchantCode || normalize(row.merchantCode).includes(normalize(query.merchantCode));
    const dateMatch = inDateRange(row.transactionTime, query.fromDate, query.toDate);

    return (
      accountIdMatch &&
      nicknameMatch &&
      bankNameMatch &&
      targetBankNameMatch &&
      targetAccountNumberMatch &&
      targetAccountHolderMatch &&
      matchedTransactionIdMatch &&
      statusMatch &&
      currencyMatch &&
      orderNumberMatch &&
      accountTypeMatch &&
      merchantCodeMatch &&
      dateMatch
    );
  });
};

export const mapWithdrawalHistoryDtoToViewModel = (dto: WithdrawalHistoryResponseDto): WithdrawalHistoryViewModel => ({
  rows: dto.rows.map((row) => ({
    id: row.id,
    accountId: row.accountId,
    nickname: row.nickname,
    status: row.status,
    callbackStatus: row.callbackStatus,
    orderNumber: row.orderNumber,
    amount: AMOUNT_FORMATTER.format(row.amount),
    transactionTime: row.transactionTime,
    bankName: row.bankName,
    targetBankName: row.targetBankName,
    targetAccountNumber: row.targetAccountNumber,
    targetAccountHolder: row.targetAccountHolder,
    matchedTransactionId: row.matchedTransactionId,
    currency: row.currency,
    accountType: row.accountType,
    merchantCode: row.merchantCode,
  })),
});

export class MockWithdrawalHistoryRepository implements WithdrawalHistoryRepository {
  async listWithdrawalHistory(query?: WithdrawalHistoryFilterQuery): Promise<WithdrawalHistoryResponseDto> {
    return {
      rows: filterRows(MOCK_WITHDRAWAL_HISTORY, query),
    };
  }
}
