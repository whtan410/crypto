import React, { useMemo, useState } from 'react';
import { Button, DatePicker, Input, Select, Table, Tabs, Tag, message } from 'antd';
import { CalendarOutlined, ClearOutlined, CopyOutlined, ExportOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { CURRENCY_OPTIONS } from '../constants/filterOptions';
import { SUCCESS_RATE_ROUTE_BY_MENU_KEY } from '../features/success-rate/config';

type ManualMatchFilters = {
  requestId: string;
  requestType: string;
  nickname: string;
  bankName: string;
  currency: string;
  merchantCode: string;
  merchantUserId: string;
  orderNumber: string;
  targetBankName: string;
  targetAccountNumber: string;
  targetAccountHolder: string;
  matchedTransactionId: string;
  matchedBy: string;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
};

type ManualMatchRow = {
  key: string;
  requestId: string;
  requestType: string;
  status: string;
  nickname: string;
  bankName: string;
  accountNumber: string;
  targetBankName: string;
  targetAccountNumber: string;
  targetAccountHolder: string;
  currency: string;
  amount: number;
  merchantCode: string;
  merchantUserId: string;
  orderNumber: string;
};

const REQUEST_TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Withdrawal', value: 'Withdrawal' },
];

const INITIAL_FILTERS: ManualMatchFilters = {
  requestId: '',
  requestType: '',
  nickname: '',
  bankName: '',
  currency: '',
  merchantCode: '',
  merchantUserId: '',
  orderNumber: '',
  targetBankName: '',
  targetAccountNumber: '',
  targetAccountHolder: '',
  matchedTransactionId: '',
  matchedBy: '',
  fromDate: null,
  toDate: null,
};

const MOCK_ROWS: ManualMatchRow[] = [
  { key: '1', requestId: 'D568_58E9', requestType: 'Deposit', status: 'Manual Matched', nickname: 'Test Bank 01', bankName: 'BANGKOK BANK PUBLIC COMPANY LTD.', accountNumber: '01234567890', targetBankName: 'BBL', targetAccountNumber: '8610383138', targetAccountHolder: 'TEST HOLDER', currency: 'THB', amount: 499.99, merchantCode: 'test123', merchantUserId: 'TEST123', orderNumber: '2026_1716' },
  { key: '2', requestId: '1869_5F4F', requestType: 'Deposit', status: 'Manual Matched', nickname: 'merch', bankName: 'BANGKOK BANK PUBLIC COMPANY LTD.', accountNumber: '8610383138', targetBankName: 'BBL', targetAccountNumber: '8610383138', targetAccountHolder: 'USER A', currency: 'THB', amount: 400.0, merchantCode: 'merch', merchantUserId: 'USER', orderNumber: '2025_1640' },
  { key: '3', requestId: '9244_F1C9', requestType: 'Deposit', status: 'Manual Matched', nickname: 'test-bbl-prove', bankName: 'BANGKOK BANK PUBLIC COMPANY LTD.', accountNumber: '8610383138', targetBankName: 'BBL', targetAccountNumber: '8610383138', targetAccountHolder: 'USER B', currency: 'THB', amount: 99.99, merchantCode: 'merch', merchantUserId: 'USER', orderNumber: '2025_2152' },
];

export default function ManualMatchPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ManualMatchFilters>(INITIAL_FILTERS);

  const updateFilter = <K extends keyof ManualMatchFilters>(key: K, value: ManualMatchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMenuClick = (key: string) => {
    const route = SUCCESS_RATE_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  const columns: ColumnsType<ManualMatchRow> = useMemo(
    () => [
      { title: 'Request ID', dataIndex: 'requestId', width: 120, render: (v: string) => <span>{v} <CopyOutlined style={{ color: '#99a3af' }} /></span> },
      { title: 'Request Type', dataIndex: 'requestType', width: 110, render: () => <Tag color="cyan">Deposit</Tag> },
      { title: 'Status', dataIndex: 'status', width: 130, render: () => <Tag color="gold">Manual Matched</Tag> },
      { title: 'Nickname', dataIndex: 'nickname', width: 120 },
      { title: 'Bank Name', dataIndex: 'bankName', width: 170 },
      { title: 'Account Number', dataIndex: 'accountNumber', width: 140 },
      { title: 'Target Bank Name', dataIndex: 'targetBankName', width: 140 },
      { title: 'Target Account Number', dataIndex: 'targetAccountNumber', width: 160 },
      { title: 'Target Account Holder', dataIndex: 'targetAccountHolder', width: 150 },
      { title: 'Currency', dataIndex: 'currency', width: 90, render: () => <Tag>THB</Tag> },
      { title: 'Amount', dataIndex: 'amount', width: 90, align: 'right', render: (v: number) => v.toFixed(2) },
      { title: 'Merchant Code', dataIndex: 'merchantCode', width: 120 },
      { title: 'Merchant User ID', dataIndex: 'merchantUserId', width: 130 },
      { title: 'Order Number', dataIndex: 'orderNumber', width: 120, render: (v: string) => <span>{v} <CopyOutlined style={{ color: '#99a3af' }} /></span> },
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
          activeKey="manual-match"
          onChange={() => navigate('/manual-match')}
          hideAdd
          type="editable-card"
          tabBarStyle={{ marginBottom: 0, borderBottom: 'none', paddingLeft: '16px' }}
          className="manual-match-main-tab"
          items={[
            {
              key: 'manual-match',
              label: <span style={{ fontSize: 13, fontWeight: 400 }}>Manual Match</span>,
            },
          ]}
        />
      </div>

      <div style={{ backgroundColor: '#2f4058', padding: '8px 18px 12px 18px' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>Manual Match</div>
        <div style={{ color: '#c7d0dc', fontSize: 12 }}>
          <span>Report</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Manual Match</span>
        </div>
      </div>

      <div style={{ padding: '12px 16px 18px 16px' }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #d9dde3', borderRadius: 2, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
            <Input size="small" placeholder="Request ID" value={filters.requestId} onChange={(e) => updateFilter('requestId', e.target.value)} />
            <Select size="small" placeholder="Request Type" options={REQUEST_TYPE_OPTIONS} value={filters.requestType || undefined} allowClear onChange={(v) => updateFilter('requestType', v ?? '')} />
            <Input size="small" placeholder="Nickname" value={filters.nickname} onChange={(e) => updateFilter('nickname', e.target.value)} />
            <Input size="small" placeholder="Bank Name" value={filters.bankName} onChange={(e) => updateFilter('bankName', e.target.value)} />
            <Select size="small" placeholder="Currency" options={CURRENCY_OPTIONS} value={filters.currency || undefined} allowClear onChange={(v) => updateFilter('currency', v ?? '')} />
            <Input size="small" placeholder="Merchant Code" value={filters.merchantCode} onChange={(e) => updateFilter('merchantCode', e.target.value)} />
            <Input size="small" placeholder="Merchant User ID" value={filters.merchantUserId} onChange={(e) => updateFilter('merchantUserId', e.target.value)} />
            <Input size="small" placeholder="Order Number" value={filters.orderNumber} onChange={(e) => updateFilter('orderNumber', e.target.value)} />
            <Input size="small" placeholder="Target Bank Name" value={filters.targetBankName} onChange={(e) => updateFilter('targetBankName', e.target.value)} />
            <Input size="small" placeholder="Target Account Number" value={filters.targetAccountNumber} onChange={(e) => updateFilter('targetAccountNumber', e.target.value)} />
            <Input size="small" placeholder="Target Account Holder" value={filters.targetAccountHolder} onChange={(e) => updateFilter('targetAccountHolder', e.target.value)} />
            <Input size="small" placeholder="Matched Transaction ID" value={filters.matchedTransactionId} onChange={(e) => updateFilter('matchedTransactionId', e.target.value)} />
            <Input size="small" placeholder="Matched By" value={filters.matchedBy} onChange={(e) => updateFilter('matchedBy', e.target.value)} />
            <DatePicker size="small" placeholder="From Date" value={filters.fromDate} onChange={(v) => updateFilter('fromDate', v)} style={{ width: '100%' }} suffixIcon={<CalendarOutlined style={{ color: '#9aa4b2' }} />} />
            <DatePicker size="small" placeholder="To Date" value={filters.toDate} onChange={(v) => updateFilter('toDate', v)} style={{ width: '100%' }} suffixIcon={<CalendarOutlined style={{ color: '#9aa4b2' }} />} />
            <div />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button size="small" icon={<ClearOutlined />} onClick={() => setFilters(INITIAL_FILTERS)}>Clear Filters</Button>
            <Button size="small" type="primary" icon={<FilterOutlined />} onClick={() => message.success('Filters applied')}>Apply Filters</Button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <Button size="small" icon={<ExportOutlined />}>EXPORT</Button>
        </div>

        <Table<ManualMatchRow>
          rowKey="key"
          columns={columns}
          dataSource={MOCK_ROWS}
          size="small"
          scroll={{ x: 1900 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} entries`,
          }}
        />
      </div>

      <style>{`
        .manual-match-main-tab .ant-tabs-nav { margin-bottom: 0 !important; }
        .manual-match-main-tab .ant-tabs-nav::before { border-bottom: none !important; }
        .manual-match-main-tab .ant-tabs-tab {
          background-color: #ecf0f1 !important;
          border: none !important;
          color: #262626 !important;
          padding: 6px 12px !important;
          margin: 0 !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .manual-match-main-tab .ant-tabs-ink-bar { display: none !important; }
        .manual-match-main-tab .ant-tabs-content-holder { display: none !important; }
      `}</style>
    </div>
  );
}
