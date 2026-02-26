import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  Tabs,
  Typography,
  message,
} from 'antd';
import {
  CheckCircleFilled,
  CloseOutlined,
  CopyOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { ACCOUNT_FILTER_FIELDS, ACCOUNT_GRID_COLUMNS, ACCOUNT_ROUTE_BY_MENU_KEY, STATUS_META } from '../features/account/config';
import { mapAccountPageDtoToViewModel, MockAccountRepository } from '../features/account/repository';
import type { AccountFilterQuery, AccountPageViewModel } from '../features/account/types';

const { Text } = Typography;

const accountRepository = new MockAccountRepository();

const EMPTY_VIEW_MODEL: AccountPageViewModel = {
  summaryCards: [],
  rows: [],
};

const metricLine = (label: string, value: string, highlight = false) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
    <Text style={{ fontSize: 11, color: '#667085' }}>{label}</Text>
    <Text style={{ fontSize: 11, color: highlight ? '#2f855a' : '#1f2937', fontWeight: highlight ? 600 : 500 }}>
      {value}
    </Text>
  </div>
);

const gridTemplateColumns = ACCOUNT_GRID_COLUMNS.map((column) => column.width).join(' ');

export default function AccountPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AccountFilterQuery>({});
  const [data, setData] = useState<AccountPageViewModel>(EMPTY_VIEW_MODEL);

  const loadData = useCallback(async (query?: AccountFilterQuery) => {
    setLoading(true);
    try {
      const responseDto = await accountRepository.listAccountPageData(query);
      setData(mapAccountPageDtoToViewModel(responseDto));
    } catch (error) {
      console.error('Failed to load account data', error);
      message.error('Failed to load account data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleMenuClick = (key: string) => {
    const route = ACCOUNT_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  const handleFilterValueChange = (name: string, value: string | number | boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    void loadData(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    void loadData({});
  };

  const handleAccountTabEdit = (_targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      navigate('/');
    }
  };

  const filterControls = useMemo(
    () =>
      ACCOUNT_FILTER_FIELDS.map((field) => (
        <Col xs={24} md={12} lg={6} key={field.name}>
          {field.type === 'select' ? (
            <Select
              size="small"
              style={{ width: '100%' }}
              placeholder={field.placeholder ?? field.label}
              options={field.options}
              value={(filters[field.name] as string | undefined) ?? undefined}
              allowClear
              onChange={(value) => handleFilterValueChange(field.name, value)}
            />
          ) : (
            <Input
              size="small"
              placeholder={field.placeholder ?? field.label}
              value={(filters[field.name] as string | undefined) ?? ''}
              onChange={(event) => handleFilterValueChange(field.name, event.target.value)}
            />
          )}
        </Col>
      )),
    [filters]
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ecf0f1' }}>
      <div style={{ marginBottom: '-16px' }}>
        <TopNavigationPanel userName="MING" onMenuClick={handleMenuClick} />
      </div>

      <div style={{ backgroundColor: '#d9dde3', paddingTop: '4px', minHeight: '44px' }}>
        <Tabs
          activeKey="account"
          onChange={() => navigate('/account')}
          hideAdd
          type="editable-card"
          onEdit={handleAccountTabEdit}
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: 'none',
            paddingLeft: '16px',
          }}
          className="account-browser-style-tabs"
          items={[
            {
              key: 'account',
              label: <span style={{ fontSize: '13px', fontWeight: 400 }}>Account</span>,
              closeIcon: (
                <CloseOutlined
                  style={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: '#595959',
                  }}
                />
              ),
            },
          ]}
        />
      </div>

      <div
        style={{
          backgroundColor: '#34495e',
          padding: '12px 24px 14px 24px',
        }}
      >
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
          Account
        </div>
      </div>

      <div style={{ padding: '16px 16px 20px 16px' }}>
        <Card style={{ borderRadius: 6, marginBottom: 12 }}>
          <Row gutter={[8, 8]}>
            {filterControls}
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <Button size="small" onClick={handleClearFilters}>Clear Filters</Button>
            <Button size="small" type="primary" onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </Card>

        <Spin spinning={loading}>
          <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
            {data.summaryCards.map((card) => (
              <Col xs={24} md={12} lg={6} key={card.key}>
                <Card size="small" style={{ height: '100%' }}>
                  <div style={{ color: '#667085', fontSize: 12, marginBottom: 6 }}>
                    <CheckCircleFilled style={{ color: '#4096ff', marginRight: 6 }} />
                    {card.title}
                  </div>
                  <div style={{ fontSize: 36, lineHeight: 1, letterSpacing: '-0.5px', color: '#111827', marginBottom: 8 }}>
                    {card.value}
                  </div>
                  <Text type="secondary" style={{ fontSize: 11 }}>{card.subtitle}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
            <Button size="small" icon={<DownloadOutlined />}>EXPORT</Button>
            <Button size="small" type="primary" icon={<PlusOutlined />}>CREATE</Button>
          </div>

          <Card styles={{ body: { padding: 0 } }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns,
                background: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                padding: '10px 12px',
                fontSize: 12,
                color: '#475467',
                fontWeight: 600,
              }}
            >
              {ACCOUNT_GRID_COLUMNS.map((column) => (
                <div key={column.key}>{column.label}</div>
              ))}
            </div>

            {data.rows.map((row, index) => (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns,
                  gap: 8,
                  padding: '12px',
                  borderBottom: index === data.rows.length - 1 ? 'none' : '1px solid #f0f0f0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: 6 }}>{row.id}</div>
                  <div style={{ fontSize: 11, color: '#475467', marginBottom: 2 }}>{row.bank}</div>
                  <div style={{ fontSize: 11, color: '#475467', marginBottom: 2 }}>Account Number: {row.accountNumber}</div>
                  <div style={{ fontSize: 11, color: '#475467' }}>Account Holder: {row.holder}</div>
                </div>

                <div>
                  <Space direction="vertical" size={4}>
                    {row.statuses.map((status) => (
                      <Tag key={status.code} color={STATUS_META[status.code].color}>
                        {status.label}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div>
                  {metricLine('Balance Limit:', row.balanceLimit)}
                  {metricLine('Current Balance:', row.currentBalance)}
                  {metricLine('Total In:', row.totalIn)}
                  {metricLine('Total Out:', row.totalOut)}
                </div>

                <div>
                  {metricLine('Daily In Transfer Limit:', row.inTransfer.dailyTransferLimit)}
                  {metricLine('Daily In Used:', row.inTransfer.dailyUsed)}
                  {metricLine('Pending In:', row.inTransfer.pending)}
                  {metricLine('Average In Limit:', row.inTransfer.averageLimit, true)}
                  {metricLine('Daily In Count Limit:', row.inTransfer.dailyCountLimit)}
                  {metricLine('Daily In Count Used:', row.inTransfer.dailyCountUsed)}
                </div>

                <div>
                  {metricLine('Daily Out Transfer Limit:', row.outTransfer.dailyTransferLimit)}
                  {metricLine('Daily Out Used:', row.outTransfer.dailyUsed)}
                  {metricLine('Pending Out:', row.outTransfer.pending)}
                  {metricLine('Average Out Limit:', row.outTransfer.averageLimit, true)}
                  {metricLine('Daily Out Count Limit:', row.outTransfer.dailyCountLimit)}
                  {metricLine('Daily Out Count Used:', row.outTransfer.dailyCountUsed)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontSize: 11 }}>In</Text>
                    <Switch size="small" checked={row.inEnabled} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11 }}>Out</Text>
                    <Switch size="small" checked={row.outEnabled} />
                  </div>
                </div>

                <div>
                  <Space size={8}>
                    <EyeOutlined style={{ color: '#4096ff' }} />
                    <EditOutlined style={{ color: '#13c2c2' }} />
                    <CopyOutlined style={{ color: '#722ed1' }} />
                    <SearchOutlined style={{ color: '#52c41a' }} />
                    <FileTextOutlined style={{ color: '#faad14' }} />
                  </Space>
                </div>
              </div>
            ))}
          </Card>
        </Spin>
      </div>

      <style>{`
        .account-browser-style-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }

        .account-browser-style-tabs .ant-tabs-nav::before {
          border-bottom: none !important;
        }

        .account-browser-style-tabs .ant-tabs-tab {
          background-color: #c6ccd4 !important;
          border: none !important;
          color: #4f5b66 !important;
          padding: 6px 10px 6px 14px !important;
          margin: 0 1px 0 0 !important;
          border-radius: 8px 8px 0 0 !important;
          position: relative !important;
          min-width: 94px !important;
        }

        .account-browser-style-tabs .ant-tabs-tab-active {
          background-color: #ecf0f1 !important;
          color: #262626 !important;
          min-width: 94px !important;
        }

        .account-browser-style-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #262626 !important;
        }

        .account-browser-style-tabs .ant-tabs-tab-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          gap: 8px !important;
        }

        .account-browser-style-tabs .ant-tabs-tab:hover:not(.ant-tabs-tab-active) {
          color: #2f3942 !important;
          background-color: #bfc6cf !important;
        }

        .account-browser-style-tabs .ant-tabs-tab-remove {
          margin-left: 4px !important;
          margin-right: 0 !important;
        }

        .account-browser-style-tabs .ant-tabs-tab-remove:hover {
          color: #ff4d4f !important;
        }

        .account-browser-style-tabs .ant-tabs-ink-bar {
          display: none !important;
        }

        .account-browser-style-tabs .ant-tabs-content-holder {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
