import React, { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, Tabs, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, ExportOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import {
  ACTIVITY_LOG_ACTION_OPTIONS,
  ACTIVITY_LOG_ROUTE_BY_MENU_KEY,
  ACTIVITY_LOG_TARGET_TYPE_OPTIONS,
} from '../features/activity-log/config';

type ActivityLogRow = {
  id: string;
  timestamp: string;
  username: string;
  targetType: string;
  action: string;
  description: string;
  userId: string;
  targetId: string;
  ipAddress: string;
  userAgent: string;
};

type ActivityLogFilters = {
  username: string;
  action: string;
  targetType: string;
  targetId: string;
  fromDate?: string;
  toDate?: string;
};

const MOCK_ROWS: ActivityLogRow[] = [
  {
    id: 'A682_B4B9',
    timestamp: '2026-01-25 14:52',
    username: 'ming',
    targetType: 'MANUAL_MATCH_REPORT',
    action: 'REPORT_VIEWED',
    description: 'Manual match report viewed with filters.',
    userId: '237A07_91B8D9',
    targetId: '-',
    ipAddress: '45.83.126.14',
    userAgent: 'MOZI_7.36',
  },
  {
    id: 'A400_FA9D',
    timestamp: '2026-01-25 14:52',
    username: 'ming',
    targetType: 'SUCCESS_RATE_REPORT',
    action: 'REPORT_VIEWED',
    description: 'Success rate report viewed.',
    userId: '237A07_91B8D9',
    targetId: '-',
    ipAddress: '45.83.126.14',
    userAgent: 'MOZI_7.36',
  },
  {
    id: 'A521_5902',
    timestamp: '2026-01-25 14:52',
    username: 'ming',
    targetType: 'TRANSACTION_REPORT',
    action: 'REPORT_VIEWED',
    description: 'Transaction report viewed.',
    userId: '237A07_91B8D9',
    targetId: '-',
    ipAddress: '45.83.126.14',
    userAgent: 'MOZI_7.36',
  },
  {
    id: 'A284_9458',
    timestamp: '2026-01-25 14:51',
    username: 'ming',
    targetType: 'WITHDRAWAL_REQUEST_REPORT',
    action: 'REPORT_VIEWED',
    description: 'Withdrawal request report viewed.',
    userId: '237A07_91B8D9',
    targetId: '-',
    ipAddress: '45.83.126.14',
    userAgent: 'MOZI_7.36',
  },
  {
    id: 'A784_8966',
    timestamp: '2026-01-25 14:51',
    username: 'ming',
    targetType: 'DEPOSIT_REQUEST_REPORT',
    action: 'REPORT_VIEWED',
    description: 'Deposit request report viewed.',
    userId: '237A07_91B8D9',
    targetId: '-',
    ipAddress: '45.83.126.14',
    userAgent: 'MOZI_7.36',
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

const filterRows = (rows: ActivityLogRow[], query: ActivityLogFilters) =>
  rows.filter((row) => {
    const rowDate = row.timestamp.slice(0, 10);
    const usernameMatch = !query.username || normalize(row.username).includes(normalize(query.username));
    const actionMatch = !query.action || row.action === query.action;
    const targetTypeMatch = !query.targetType || row.targetType === query.targetType;
    const targetIdMatch = !query.targetId || normalize(row.targetId).includes(normalize(query.targetId));
    const fromDateMatch = !query.fromDate || rowDate >= query.fromDate;
    const toDateMatch = !query.toDate || rowDate <= query.toDate;
    return usernameMatch && actionMatch && targetTypeMatch && targetIdMatch && fromDateMatch && toDateMatch;
  });

export default function ActivityLogPage() {
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState<ActivityLogRow[]>(MOCK_ROWS);
  const [rows, setRows] = useState<ActivityLogRow[]>(MOCK_ROWS);
  const [filters, setFilters] = useState<ActivityLogFilters>({
    username: '',
    action: '',
    targetType: '',
    targetId: '',
    fromDate: undefined,
    toDate: undefined,
  });
  const [rangeDate, setRangeDate] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm<ActivityLogRow>();

  useEffect(() => {
    setRows(filterRows(allRows, filters));
  }, [allRows, filters]);

  const handleMenuClick = (key: string) => {
    const route = ACTIVITY_LOG_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      fromDate: rangeDate?.[0]?.format('YYYY-MM-DD'),
      toDate: rangeDate?.[1]?.format('YYYY-MM-DD'),
    }));
  };

  const clearFilters = () => {
    setRangeDate(null);
    setFilters({
      username: '',
      action: '',
      targetType: '',
      targetId: '',
      fromDate: undefined,
      toDate: undefined,
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    form.setFieldsValue({
      id: '',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm'),
      username: '',
      targetType: '',
      action: 'REPORT_VIEWED',
      description: '',
      userId: '',
      targetId: '-',
      ipAddress: '',
      userAgent: 'MOZI_7.36',
    });
    setModalOpen(true);
  };

  const openEditModal = (row: ActivityLogRow) => {
    setEditingId(row.id);
    form.setFieldsValue(row);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAllRows((prev) => prev.filter((row) => row.id !== id));
    message.success('Activity log deleted');
  };

  const submitCrud = async () => {
    const values = await form.validateFields();
    if (editingId) {
      setAllRows((prev) => prev.map((row) => (row.id === editingId ? { ...row, ...values, id: editingId } : row)));
      message.success('Activity log updated');
    } else {
      const newId = `A${Date.now().toString().slice(-4)}_${Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, '0')}`;
      setAllRows((prev) => [{ ...values, id: newId }, ...prev]);
      message.success('Activity log created');
    }
    setModalOpen(false);
  };

  const columns: ColumnsType<ActivityLogRow> = useMemo(
    () => [
      {
        title: 'Actions',
        key: 'actions',
        width: 92,
        fixed: 'left',
        render: (_value, row) => (
          <Space size={8}>
            <Tooltip title={`View ${row.id}`}>
              <EyeOutlined style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => message.info(`Viewing ${row.id}`)} />
            </Tooltip>
            <Tooltip title={`Edit ${row.id}`}>
              <EditOutlined style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => openEditModal(row)} />
            </Tooltip>
            <Popconfirm title="Delete this log?" okText="Delete" onConfirm={() => handleDelete(row.id)}>
              <Tooltip title={`Delete ${row.id}`}>
                <DeleteOutlined style={{ color: '#e55353', cursor: 'pointer' }} />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
      { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
      { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', width: 130 },
      { title: 'Username', dataIndex: 'username', key: 'username', width: 100 },
      { title: 'Target Type', dataIndex: 'targetType', key: 'targetType', width: 180 },
      { title: 'Action', dataIndex: 'action', key: 'action', width: 130 },
      { title: 'Description', dataIndex: 'description', key: 'description', width: 260 },
      { title: 'User ID', dataIndex: 'userId', key: 'userId', width: 140 },
      { title: 'Target ID', dataIndex: 'targetId', key: 'targetId', width: 100 },
      { title: 'IP Address', dataIndex: 'ipAddress', key: 'ipAddress', width: 120 },
      { title: 'User Agent', dataIndex: 'userAgent', key: 'userAgent', width: 110 },
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
          activeKey="activity-log"
          onChange={() => navigate('/activity-log')}
          hideAdd
          type="editable-card"
          tabBarStyle={{ marginBottom: 0, borderBottom: 'none', paddingLeft: '16px' }}
          className="activity-log-main-tab"
          items={[
            {
              key: 'activity-log',
              label: <span style={{ fontSize: 13, fontWeight: 400 }}>Activity Log</span>,
            },
          ]}
        />
      </div>

      <div style={{ backgroundColor: '#2f4058', padding: '8px 18px 12px 18px' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>Activity Log</div>
        <div style={{ color: '#c7d0dc', fontSize: 12 }}>
          <span>Report</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Activity Log</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, marginBottom: 8 }}>
            <Input
              size="small"
              placeholder="Username"
              value={filters.username}
              onChange={(event) => setFilters((prev) => ({ ...prev, username: event.target.value }))}
            />
            <Select
              size="small"
              placeholder="Action"
              options={ACTIVITY_LOG_ACTION_OPTIONS}
              value={filters.action || undefined}
              onChange={(value) => setFilters((prev) => ({ ...prev, action: value || '' }))}
              allowClear
            />
            <Select
              size="small"
              placeholder="Target Type"
              options={ACTIVITY_LOG_TARGET_TYPE_OPTIONS}
              value={filters.targetType || undefined}
              onChange={(value) => setFilters((prev) => ({ ...prev, targetType: value || '' }))}
              allowClear
            />
            <Input
              size="small"
              placeholder="Target ID"
              value={filters.targetId}
              onChange={(event) => setFilters((prev) => ({ ...prev, targetId: event.target.value }))}
            />
            <DatePicker.RangePicker
              size="small"
              value={rangeDate as [Dayjs, Dayjs] | null}
              onChange={(value) => setRangeDate(value as [Dayjs | null, Dayjs | null] | null)}
              style={{ width: '100%' }}
              placeholder={['Date Range', 'Date Range']}
              format="YYYY-MM-DD"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button size="small" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button size="small" type="primary" icon={<SearchOutlined />} onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, gap: 8 }}>
          <Button size="small" type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            CREATE
          </Button>
          <Button size="small" icon={<ExportOutlined />} onClick={() => message.success('Export triggered')}>
            EXPORT
          </Button>
        </div>

        <Table<ActivityLogRow>
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={rows}
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} entries`,
          }}
        />
      </div>

      <Modal
        title={editingId ? 'Edit Activity Log' : 'Create Activity Log'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => void submitCrud()}
        okText={editingId ? 'Update' : 'Create'}
        width={900}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <Form.Item name="timestamp" label="Timestamp" rules={[{ required: true, message: 'Timestamp is required' }]}>
              <Input placeholder="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="targetType" label="Target Type" rules={[{ required: true, message: 'Target type is required' }]}>
              <Select options={ACTIVITY_LOG_TARGET_TYPE_OPTIONS.filter((item) => item.value)} />
            </Form.Item>
            <Form.Item name="action" label="Action" rules={[{ required: true, message: 'Action is required' }]}>
              <Select options={ACTIVITY_LOG_ACTION_OPTIONS.filter((item) => item.value)} />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Description is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userId" label="User ID" rules={[{ required: true, message: 'User ID is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="targetId" label="Target ID">
              <Input />
            </Form.Item>
            <Form.Item name="ipAddress" label="IP Address" rules={[{ required: true, message: 'IP address is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userAgent" label="User Agent">
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <style>{`
        .activity-log-main-tab .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .activity-log-main-tab .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        .activity-log-main-tab .ant-tabs-tab {
          background-color: #ecf0f1 !important;
          border: none !important;
          color: #262626 !important;
          padding: 6px 12px !important;
          margin: 0 !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .activity-log-main-tab .ant-tabs-ink-bar {
          display: none !important;
        }
        .activity-log-main-tab .ant-tabs-content-holder {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
