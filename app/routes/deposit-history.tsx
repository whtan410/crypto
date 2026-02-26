import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Input, Select, Space, Table, Tabs, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CalendarOutlined, EditOutlined, ExportOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { ACCOUNT_TYPE_OPTIONS, CURRENCY_OPTIONS, DEPOSIT_STATUS_OPTIONS } from '../constants/filterOptions';
import {
  CALLBACK_STATUS_META,
  DEPOSIT_HISTORY_ROUTE_BY_MENU_KEY,
  DEPOSIT_STATUS_META,
} from '../features/deposit-history/config';
import { mapDepositHistoryDtoToViewModel, MockDepositHistoryRepository } from '../features/deposit-history/repository';
import type { DepositHistoryFilterQuery, DepositHistoryRowViewModel } from '../features/deposit-history/types';

const repository = new MockDepositHistoryRepository();

const toIsoDate = (value?: Dayjs | null): string | undefined => {
  if (!value) {
    return undefined;
  }
  return value.format('YYYY-MM-DD');
};

export default function DepositHistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<DepositHistoryRowViewModel[]>([]);
  const [filters, setFilters] = useState<DepositHistoryFilterQuery>({
    nickname: '',
    bankName: '',
    status: '',
    currency: '',
    orderNumber: '',
    matchedTransactionId: '',
    accountType: '',
    merchantCode: '',
    fromDate: undefined,
    toDate: undefined,
  });
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const loadData = useCallback(async (query?: DepositHistoryFilterQuery) => {
    setLoading(true);
    try {
      const dto = await repository.listDepositHistory(query);
      const vm = mapDepositHistoryDtoToViewModel(dto);
      setRows(vm.rows);
    } catch (error) {
      console.error('Failed to load deposit history', error);
      message.error('Failed to load deposit history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleMenuClick = (key: string) => {
    const route = DEPOSIT_HISTORY_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  const handleApplyFilters = () => {
    const query: DepositHistoryFilterQuery = {
      ...filters,
      fromDate: toIsoDate(fromDate),
      toDate: toIsoDate(toDate),
    };
    void loadData(query);
  };

  const handleClearFilters = () => {
    const resetFilters: DepositHistoryFilterQuery = {
      nickname: '',
      bankName: '',
      status: '',
      currency: '',
      orderNumber: '',
      matchedTransactionId: '',
      accountType: '',
      merchantCode: '',
      fromDate: undefined,
      toDate: undefined,
    };
    setFilters(resetFilters);
    setFromDate(null);
    setToDate(null);
    void loadData({});
  };

  const handleExport = () => {
    message.success('Export triggered');
  };

  const columns: ColumnsType<DepositHistoryRowViewModel> = useMemo(
    () => [
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        render: (_value, row) => (
          <Space size={8}>
            <Tooltip title={`View ${row.id}`}>
              <EyeOutlined style={{ color: '#3b82f6', cursor: 'pointer' }} />
            </Tooltip>
            <Tooltip title={`Edit ${row.id}`}>
              <EditOutlined style={{ color: '#f59e0b', cursor: 'pointer' }} />
            </Tooltip>
          </Space>
        ),
      },
      { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
      { title: 'Nickname', dataIndex: 'nickname', key: 'nickname', width: 140 },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (status: DepositHistoryRowViewModel['status']) => {
          const meta = DEPOSIT_STATUS_META[status];
          return (
            <span
              style={{
                backgroundColor: meta.color,
                color: '#fff',
                borderRadius: 10,
                fontSize: 11,
                padding: '1px 10px',
                display: 'inline-block',
                lineHeight: '18px',
              }}
            >
              {meta.label}
            </span>
          );
        },
      },
      {
        title: 'Callback Status',
        dataIndex: 'callbackStatus',
        key: 'callbackStatus',
        width: 140,
        render: (status: DepositHistoryRowViewModel['callbackStatus']) => {
          const meta = CALLBACK_STATUS_META[status];
          return (
            <span
              style={{
                backgroundColor: meta.color,
                color: '#fff',
                borderRadius: 10,
                fontSize: 11,
                padding: '1px 10px',
                display: 'inline-block',
                lineHeight: '18px',
              }}
            >
              {meta.label}
            </span>
          );
        },
      },
      { title: 'Order Number', dataIndex: 'orderNumber', key: 'orderNumber', width: 140 },
      { title: 'Order Amount', dataIndex: 'orderAmount', key: 'orderAmount', width: 130, align: 'right' },
      { title: 'Assigned Amount', dataIndex: 'assignedAmount', key: 'assignedAmount', width: 140, align: 'right' },
      { title: 'Request Time', dataIndex: 'requestTime', key: 'requestTime', width: 160 },
    ],
    []
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0f3' }}>
      <div style={{ marginBottom: '-16px' }}>
        <TopNavigationPanel userName="MING" onMenuClick={handleMenuClick} />
      </div>

      <div style={{ backgroundColor: '#d9dde3', minHeight: '44px', paddingTop: '4px' }}>
        <Tabs
          activeKey="deposit-history"
          onChange={() => navigate('/deposit-history')}
          hideAdd
          type="editable-card"
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: 'none',
            paddingLeft: '16px',
          }}
          className="deposit-history-main-tab"
          items={[
            {
              key: 'deposit-history',
              label: <span style={{ fontSize: 13, fontWeight: 400 }}>Deposit History</span>,
            },
          ]}
        />
      </div>

      <div style={{ backgroundColor: '#2f4058', padding: '8px 18px 12px 18px' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>Deposit History</div>
        <div style={{ color: '#c7d0dc', fontSize: 12 }}>
          <span>Report</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Deposit History</span>
        </div>
      </div>

      <div style={{ padding: '12px 16px 18px 16px' }}>
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #d9dde3',
            borderRadius: 2,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Input
              size="small"
              placeholder="Nickname"
              value={filters.nickname}
              onChange={(event) => setFilters((prev) => ({ ...prev, nickname: event.target.value }))}
            />
            <Select
              size="small"
              placeholder="Status"
              options={DEPOSIT_STATUS_OPTIONS}
              value={filters.status || undefined}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              allowClear
            />
            <DatePicker
              size="small"
              placeholder="From Date"
              value={fromDate}
              onChange={setFromDate}
              style={{ width: '100%' }}
              suffixIcon={<CalendarOutlined style={{ color: '#9aa4b2' }} />}
            />
            <DatePicker
              size="small"
              placeholder="To Date"
              value={toDate}
              onChange={setToDate}
              style={{ width: '100%' }}
              suffixIcon={<CalendarOutlined style={{ color: '#9aa4b2' }} />}
            />
            <Input
              size="small"
              placeholder="Bank Name"
              value={filters.bankName}
              onChange={(event) => setFilters((prev) => ({ ...prev, bankName: event.target.value }))}
            />
            <Select
              size="small"
              placeholder="Currency"
              options={CURRENCY_OPTIONS}
              value={filters.currency || undefined}
              onChange={(value) => setFilters((prev) => ({ ...prev, currency: value }))}
              allowClear
            />
            <Select
              size="small"
              placeholder="Account Type"
              options={ACCOUNT_TYPE_OPTIONS}
              value={filters.accountType || undefined}
              onChange={(value) => setFilters((prev) => ({ ...prev, accountType: value }))}
              allowClear
            />
            <Input
              size="small"
              placeholder="Merchant Code"
              value={filters.merchantCode}
              onChange={(event) => setFilters((prev) => ({ ...prev, merchantCode: event.target.value }))}
            />
            <Input
              size="small"
              placeholder="Order Number"
              value={filters.orderNumber}
              onChange={(event) => setFilters((prev) => ({ ...prev, orderNumber: event.target.value }))}
            />
            <Input
              size="small"
              placeholder="Matched Transaction ID"
              value={filters.matchedTransactionId}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, matchedTransactionId: event.target.value }))
              }
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button size="small" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button size="small" type="primary" icon={<SearchOutlined />} onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>
            EXPORT
          </Button>
        </div>

        <Table<DepositHistoryRowViewModel>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          size="small"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} entries`,
          }}
        />
      </div>

      <style>{`
        .deposit-history-main-tab .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .deposit-history-main-tab .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        .deposit-history-main-tab .ant-tabs-tab {
          background-color: #ecf0f1 !important;
          border: none !important;
          color: #262626 !important;
          padding: 6px 12px !important;
          margin: 0 !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .deposit-history-main-tab .ant-tabs-ink-bar {
          display: none !important;
        }
        .deposit-history-main-tab .ant-tabs-content-holder {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
