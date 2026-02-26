import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, Tabs, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { ACCOUNT_TYPE_OPTIONS, CURRENCY_OPTIONS, WITHDRAWAL_STATUS_OPTIONS } from '../constants/filterOptions';
import {
  CALLBACK_STATUS_META,
  WITHDRAWAL_HISTORY_ROUTE_BY_MENU_KEY,
  WITHDRAWAL_STATUS_META,
} from '../features/withdrawal-history/config';
import { mapWithdrawalHistoryDtoToViewModel, MockWithdrawalHistoryRepository } from '../features/withdrawal-history/repository';
import type { WithdrawalHistoryFilterQuery, WithdrawalHistoryRowViewModel } from '../features/withdrawal-history/types';

const repository = new MockWithdrawalHistoryRepository();

const toIsoDate = (value?: Dayjs | null): string | undefined => {
  if (!value) {
    return undefined;
  }
  return value.format('YYYY-MM-DD');
};

const normalize = (value: string) => value.trim().toLowerCase();

const filterRows = (
  sourceRows: WithdrawalHistoryRowViewModel[],
  query: WithdrawalHistoryFilterQuery
): WithdrawalHistoryRowViewModel[] =>
  sourceRows.filter((row) => {
    const rowDate = row.transactionTime.slice(0, 10);
    const accountIdMatch = !query.accountId || normalize(row.accountId).includes(normalize(query.accountId));
    const nicknameMatch = !query.nickname || normalize(row.nickname).includes(normalize(query.nickname));
    const bankNameMatch = !query.bankName || normalize(row.bankName).includes(normalize(query.bankName));
    const targetBankNameMatch =
      !query.targetBankName || normalize(row.targetBankName).includes(normalize(query.targetBankName));
    const targetAccountNumberMatch =
      !query.targetAccountNumber || normalize(row.targetAccountNumber).includes(normalize(query.targetAccountNumber));
    const targetAccountHolderMatch =
      !query.targetAccountHolder || normalize(row.targetAccountHolder).includes(normalize(query.targetAccountHolder));
    const matchedTransactionIdMatch =
      !query.matchedTransactionId || normalize(row.matchedTransactionId).includes(normalize(query.matchedTransactionId));
    const statusMatch = !query.status || row.status === query.status;
    const currencyMatch = !query.currency || row.currency === query.currency;
    const orderNumberMatch = !query.orderNumber || normalize(row.orderNumber).includes(normalize(query.orderNumber));
    const accountTypeMatch = !query.accountType || row.accountType === query.accountType;
    const merchantCodeMatch =
      !query.merchantCode || normalize(row.merchantCode).includes(normalize(query.merchantCode));
    const fromDateMatch = !query.fromDate || rowDate >= query.fromDate;
    const toDateMatch = !query.toDate || rowDate <= query.toDate;

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
      fromDateMatch &&
      toDateMatch
    );
  });

export default function WithdrawalHistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allRows, setAllRows] = useState<WithdrawalHistoryRowViewModel[]>([]);
  const [rows, setRows] = useState<WithdrawalHistoryRowViewModel[]>([]);
  const [filters, setFilters] = useState<WithdrawalHistoryFilterQuery>({
    nickname: '',
    bankName: '',
    targetBankName: '',
    targetAccountNumber: '',
    targetAccountHolder: '',
    matchedTransactionId: '',
    status: '',
    currency: '',
    orderNumber: '',
    accountType: '',
    merchantCode: '',
    fromDate: undefined,
    toDate: undefined,
  });
  const [appliedQuery, setAppliedQuery] = useState<WithdrawalHistoryFilterQuery>({});
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm<WithdrawalHistoryRowViewModel>();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const dto = await repository.listWithdrawalHistory();
      const vm = mapWithdrawalHistoryDtoToViewModel(dto);
      setAllRows(vm.rows);
      setAppliedQuery({});
      setRows(vm.rows);
    } catch (error) {
      console.error('Failed to load withdrawal history', error);
      message.error('Failed to load withdrawal history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setRows(filterRows(allRows, appliedQuery));
  }, [allRows, appliedQuery]);

  const handleMenuClick = (key: string) => {
    const route = WITHDRAWAL_HISTORY_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  const handleApplyFilters = () => {
    const query: WithdrawalHistoryFilterQuery = {
      ...filters,
      fromDate: toIsoDate(fromDate),
      toDate: toIsoDate(toDate),
    };
    setAppliedQuery(query);
  };

  const handleClearFilters = () => {
    const resetFilters: WithdrawalHistoryFilterQuery = {
      nickname: '',
      bankName: '',
      targetBankName: '',
      targetAccountNumber: '',
      targetAccountHolder: '',
      matchedTransactionId: '',
      status: '',
      currency: '',
      orderNumber: '',
      accountType: '',
      merchantCode: '',
      fromDate: undefined,
      toDate: undefined,
    };
    setFilters(resetFilters);
    setFromDate(null);
    setToDate(null);
    setAppliedQuery({});
  };

  const handleExport = () => {
    message.success('Export triggered');
  };

  const openCreateModal = () => {
    setEditingId(null);
    form.setFieldsValue({
      accountId: '',
      nickname: '',
      status: 'PENDING',
      callbackStatus: 'PENDING',
      orderNumber: '',
      amount: '',
      transactionTime: '',
      bankName: '',
      targetBankName: '',
      targetAccountNumber: '',
      targetAccountHolder: '',
      matchedTransactionId: '',
      currency: 'THB',
      accountType: 'PERSONAL',
      merchantCode: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (row: WithdrawalHistoryRowViewModel) => {
    setEditingId(row.id);
    form.setFieldsValue(row);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAllRows((prev) => prev.filter((row) => row.id !== id));
    message.success('Withdrawal row deleted');
  };

  const handleSubmitCrud = async () => {
    const values = await form.validateFields();
    if (editingId) {
      setAllRows((prev) => prev.map((row) => (row.id === editingId ? { ...row, ...values } : row)));
      message.success('Withdrawal row updated');
    } else {
      const newId = `WD${Date.now().toString().slice(-8)}`;
      setAllRows((prev) => [{ ...values, id: newId }, ...prev]);
      message.success('Withdrawal row created');
    }
    setModalOpen(false);
  };

  const columns: ColumnsType<WithdrawalHistoryRowViewModel> = useMemo(
    () => [
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        render: (_value, row) => (
          <Space size={8}>
            <Tooltip title={`View ${row.id}`}>
              <EyeOutlined
                style={{ color: '#3b82f6', cursor: 'pointer' }}
                onClick={() => message.info(`Viewing ${row.id}`)}
              />
            </Tooltip>
            <Tooltip title={`Edit ${row.id}`}>
              <EditOutlined style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => openEditModal(row)} />
            </Tooltip>
            <Popconfirm title="Delete this record?" okText="Delete" onConfirm={() => handleDelete(row.id)}>
              <Tooltip title={`Delete ${row.id}`}>
                <DeleteOutlined style={{ color: '#e55353', cursor: 'pointer' }} />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
      { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
      { title: 'Nickname', dataIndex: 'nickname', key: 'nickname', width: 160 },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (status: WithdrawalHistoryRowViewModel['status']) => {
          const meta = WITHDRAWAL_STATUS_META[status];
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
        render: (status: WithdrawalHistoryRowViewModel['callbackStatus']) => {
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
      { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 130, align: 'right' },
      { title: 'Transaction Time', dataIndex: 'transactionTime', key: 'transactionTime', width: 160 },
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
          activeKey="withdrawal-history"
          onChange={() => navigate('/withdrawal-history')}
          hideAdd
          type="editable-card"
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: 'none',
            paddingLeft: '16px',
          }}
          className="withdrawal-history-main-tab"
          items={[
            {
              key: 'withdrawal-history',
              label: <span style={{ fontSize: 13, fontWeight: 400 }}>Withdrawal History</span>,
            },
          ]}
        />
      </div>

      <div style={{ backgroundColor: '#2f4058', padding: '8px 18px 12px 18px' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>Withdrawal History</div>
        <div style={{ color: '#c7d0dc', fontSize: 12 }}>
          <span>Report</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Withdrawal History</span>
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
              options={WITHDRAWAL_STATUS_OPTIONS}
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
              placeholder="Target Bank Name"
              value={filters.targetBankName}
              onChange={(event) => setFilters((prev) => ({ ...prev, targetBankName: event.target.value }))}
            />
            <Input
              size="small"
              placeholder="Target Account Number"
              value={filters.targetAccountNumber}
              onChange={(event) => setFilters((prev) => ({ ...prev, targetAccountNumber: event.target.value }))}
            />
            <Input
              size="small"
              placeholder="Target Account Holder"
              value={filters.targetAccountHolder}
              onChange={(event) => setFilters((prev) => ({ ...prev, targetAccountHolder: event.target.value }))}
            />
            <Input
              size="small"
              placeholder="Matched Transaction ID"
              value={filters.matchedTransactionId}
              onChange={(event) => setFilters((prev) => ({ ...prev, matchedTransactionId: event.target.value }))}
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, gap: 8 }}>
          <Button size="small" type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            CREATE
          </Button>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>
            EXPORT
          </Button>
        </div>

        <Table<WithdrawalHistoryRowViewModel>
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

      <Modal
        title={editingId ? 'Edit Withdrawal' : 'Create Withdrawal'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => void handleSubmitCrud()}
        okText={editingId ? 'Update' : 'Create'}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <Form.Item name="nickname" label="Nickname" rules={[{ required: true, message: 'Nickname is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
              <Select options={WITHDRAWAL_STATUS_OPTIONS.filter((item) => item.value)} />
            </Form.Item>
            <Form.Item
              name="callbackStatus"
              label="Callback Status"
              rules={[{ required: true, message: 'Callback status is required' }]}
            >
              <Select
                options={[
                  { label: 'True', value: 'TRUE' },
                  { label: 'False', value: 'FALSE' },
                  { label: 'Pending', value: 'PENDING' },
                ]}
              />
            </Form.Item>
            <Form.Item name="orderNumber" label="Order Number" rules={[{ required: true, message: 'Order number is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="transactionTime"
              label="Transaction Time"
              rules={[{ required: true, message: 'Transaction time is required' }]}
            >
              <Input placeholder="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Form.Item name="bankName" label="Bank Name" rules={[{ required: true, message: 'Bank name is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="targetBankName" label="Target Bank Name">
              <Input />
            </Form.Item>
            <Form.Item name="targetAccountNumber" label="Target Account Number">
              <Input />
            </Form.Item>
            <Form.Item name="targetAccountHolder" label="Target Account Holder">
              <Input />
            </Form.Item>
            <Form.Item name="matchedTransactionId" label="Matched Transaction ID">
              <Input />
            </Form.Item>
            <Form.Item name="currency" label="Currency">
              <Select options={CURRENCY_OPTIONS.filter((item) => item.value)} />
            </Form.Item>
            <Form.Item name="accountType" label="Account Type">
              <Select options={ACCOUNT_TYPE_OPTIONS.filter((item) => item.value)} />
            </Form.Item>
            <Form.Item name="merchantCode" label="Merchant Code">
              <Input />
            </Form.Item>
            <Form.Item name="accountId" label="Account ID">
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <style>{`
        .withdrawal-history-main-tab .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .withdrawal-history-main-tab .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        .withdrawal-history-main-tab .ant-tabs-tab {
          background-color: #ecf0f1 !important;
          border: none !important;
          color: #262626 !important;
          padding: 6px 12px !important;
          margin: 0 !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .withdrawal-history-main-tab .ant-tabs-ink-bar {
          display: none !important;
        }
        .withdrawal-history-main-tab .ant-tabs-content-holder {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
