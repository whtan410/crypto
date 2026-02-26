import type {
  SuccessRateFilterQuery,
  SuccessRateItemDto,
  SuccessRateRepository,
  SuccessRateResponseDto,
  SuccessRateViewModel,
} from './types';

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

const AMOUNT_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PERCENTAGE_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'percent',
});

const MOCK_SUCCESS_RATE: SuccessRateItemDto[] = [
  {
    id: 'SR01...A1B2',
    merchantCode: 'MRC001',
    transactionType: 'DEPOSIT',
    totalTransactions: 1250,
    successfulTransactions: 1187,
    failedTransactions: 63,
    successRate: 0.9496,
    currency: 'THB',
    dateRange: '2026-02-01 - 2026-02-22',
    averageAmount: 850.5,
  },
  {
    id: 'SR02...C3D4',
    merchantCode: 'MRC002',
    transactionType: 'DEPOSIT',
    totalTransactions: 980,
    successfulTransactions: 921,
    failedTransactions: 59,
    successRate: 0.9398,
    currency: 'THB',
    dateRange: '2026-02-01 - 2026-02-22',
    averageAmount: 675.25,
  },
  {
    id: 'SR03...E5F6',
    merchantCode: 'MRC001',
    transactionType: 'WITHDRAWAL',
    totalTransactions: 845,
    successfulTransactions: 803,
    failedTransactions: 42,
    successRate: 0.9503,
    currency: 'THB',
    dateRange: '2026-02-01 - 2026-02-22',
    averageAmount: 1250.75,
  },
  {
    id: 'SR04...G7H8',
    merchantCode: 'MRC003',
    transactionType: 'DEPOSIT',
    totalTransactions: 560,
    successfulTransactions: 512,
    failedTransactions: 48,
    successRate: 0.9143,
    currency: 'THB',
    dateRange: '2026-02-01 - 2026-02-22',
    averageAmount: 425.5,
  },
  {
    id: 'SR05...I9J0',
    merchantCode: 'MRC002',
    transactionType: 'WITHDRAWAL',
    totalTransactions: 720,
    successfulTransactions: 689,
    failedTransactions: 31,
    successRate: 0.9569,
    currency: 'THB',
    dateRange: '2026-02-01 - 2026-02-22',
    averageAmount: 980.25,
  },
  {
    id: 'SR06...K1L2',
    merchantCode: 'MRC004',
    transactionType: 'TRANSFER',
    totalTransactions: 350,
    successfulTransactions: 332,
    failedTransactions: 18,
    successRate: 0.9486,
    currency: 'THB',
    dateRange: '2026-02-01 - 2026-02-22',
    averageAmount: 1500.0,
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

const inDateRange = (dateRange: string, fromDate?: string, toDate?: string) => {
  if (!fromDate && !toDate) {
    return true;
  }
  // Simple check - in a real app, you'd parse the date range properly
  return true;
};

const filterRows = (rows: SuccessRateItemDto[], query?: SuccessRateFilterQuery): SuccessRateItemDto[] => {
  if (!query) {
    return rows;
  }

  return rows.filter((row) => {
    const merchantCodeMatch =
      !query.merchantCode || normalize(row.merchantCode).includes(normalize(query.merchantCode));
    const transactionTypeMatch = !query.transactionType || row.transactionType === query.transactionType;
    const currencyMatch = !query.currency || row.currency === query.currency;
    const dateMatch = inDateRange(row.dateRange, query.fromDate, query.toDate);

    return merchantCodeMatch && transactionTypeMatch && currencyMatch && dateMatch;
  });
};

export const mapSuccessRateDtoToViewModel = (dto: SuccessRateResponseDto): SuccessRateViewModel => ({
  rows: dto.rows.map((row) => ({
    id: row.id,
    merchantCode: row.merchantCode,
    transactionType: row.transactionType,
    totalTransactions: NUMBER_FORMATTER.format(row.totalTransactions),
    successfulTransactions: NUMBER_FORMATTER.format(row.successfulTransactions),
    failedTransactions: NUMBER_FORMATTER.format(row.failedTransactions),
    successRate: PERCENTAGE_FORMATTER.format(row.successRate),
    currency: row.currency,
    dateRange: row.dateRange,
    averageAmount: AMOUNT_FORMATTER.format(row.averageAmount),
  })),
});

export class MockSuccessRateRepository implements SuccessRateRepository {
  async listSuccessRate(query?: SuccessRateFilterQuery): Promise<SuccessRateResponseDto> {
    return {
      rows: filterRows(MOCK_SUCCESS_RATE, query),
    };
  }
}
