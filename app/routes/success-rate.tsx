import React, { useMemo, useState } from 'react';
import { Button, DatePicker, Input, Tabs, message } from 'antd';
import { CalendarOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { SUCCESS_RATE_ROUTE_BY_MENU_KEY } from '../features/success-rate/config';

export default function SuccessRatePage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [merchantCode, setMerchantCode] = useState('');

  const handleMenuClick = (key: string) => {
    const route = SUCCESS_RATE_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMerchantCode('');
  };

  const formattedRange = useMemo(() => {
    const from = startDate ? startDate.format('YYYY-MM-DD') : '2026-01-25';
    const to = endDate ? endDate.format('YYYY-MM-DD') : '2026-01-31';
    return `${from} - ${to}`;
  }, [startDate, endDate]);

  const renderChartGrid = () => (
    <div className="sr-chart-grid">
      <div className="sr-chart-legend">
        <span><i style={{ background: '#f3d44e' }} /> Success Rate</span>
        <span><i style={{ background: '#43b8ac' }} /> Successful</span>
        <span><i style={{ background: '#dcdcdc' }} /> Failed</span>
      </div>
      <div className="sr-chart-canvas">
        <div className="sr-axis-label top">1.0</div>
        <div className="sr-axis-label upper">0.9</div>
        <div className="sr-axis-label mid">0.8</div>
        <div className="sr-axis-label bottom">0.6</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0f3' }}>
      <div style={{ marginBottom: '-16px' }}>
        <TopNavigationPanel userName="MING" onMenuClick={handleMenuClick} />
      </div>

      <div style={{ backgroundColor: '#d9dde3', minHeight: '44px', paddingTop: '4px' }}>
        <Tabs
          activeKey="success-rate"
          onChange={() => navigate('/success-rate')}
          hideAdd
          type="editable-card"
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: 'none',
            paddingLeft: '16px',
          }}
          className="success-rate-main-tab"
          items={[
            {
              key: 'success-rate',
              label: <span style={{ fontSize: 13, fontWeight: 400 }}>Success Rate</span>,
            },
          ]}
        />
      </div>

      <div style={{ backgroundColor: '#2f4058', padding: '8px 18px 12px 18px' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>Success Rate</div>
        <div style={{ color: '#c7d0dc', fontSize: 12 }}>
          <span>Report</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Success Rate</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 8, alignItems: 'center' }}>
            <DatePicker
              size="small"
              placeholder="Start Date"
              value={startDate}
              onChange={setStartDate}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              suffixIcon={<CalendarOutlined style={{ color: '#9aa4b2' }} />}
            />
            <DatePicker
              size="small"
              placeholder="End Date"
              value={endDate}
              onChange={setEndDate}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              suffixIcon={<CalendarOutlined style={{ color: '#9aa4b2' }} />}
            />
            <Input
              size="small"
              placeholder="Merchant Code"
              value={merchantCode}
              onChange={(event) => setMerchantCode(event.target.value)}
            />
            <Button size="small" icon={<ClearOutlined />} onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button size="small" type="primary" icon={<FilterOutlined />} onClick={() => message.success('Filters applied')}>
              Apply Filters
            </Button>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #d9dde3',
            backgroundColor: '#eff3f8',
            padding: '6px 10px',
            marginBottom: 10,
            color: '#4d5868',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <CalendarOutlined style={{ marginRight: 8 }} />
          {formattedRange}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div className="sr-stat-card">
            <div className="sr-stat-header sr-stat-header-deposit">Deposits</div>
            <div className="sr-stat-content">
              <div className="sr-stat-big">0</div>
              <div className="sr-stat-label">Successful</div>
              <div className="sr-stat-small">0</div>
              <div className="sr-stat-label">Total Attempts</div>
            </div>
          </div>
          <div className="sr-stat-card">
            <div className="sr-stat-header sr-stat-header-withdrawal">Withdrawals</div>
            <div className="sr-stat-content">
              <div className="sr-stat-big">0</div>
              <div className="sr-stat-label">Successful</div>
              <div className="sr-stat-small">0</div>
              <div className="sr-stat-label">Total Attempts</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="sr-chart-card">
            <div className="sr-chart-header sr-stat-header-deposit">Daily Deposit</div>
            {renderChartGrid()}
          </div>
          <div className="sr-chart-card">
            <div className="sr-chart-header sr-stat-header-withdrawal">Daily Withdrawal</div>
            {renderChartGrid()}
          </div>
        </div>
      </div>

      <style>{`
        .success-rate-main-tab .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .success-rate-main-tab .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        .success-rate-main-tab .ant-tabs-tab {
          background-color: #ecf0f1 !important;
          border: none !important;
          color: #262626 !important;
          padding: 6px 12px !important;
          margin: 0 !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .success-rate-main-tab .ant-tabs-ink-bar {
          display: none !important;
        }
        .success-rate-main-tab .ant-tabs-content-holder {
          display: none !important;
        }
        .sr-stat-card {
          border: 1px solid #d9dde3;
          background: #fff;
          border-radius: 2px;
          overflow: hidden;
          min-height: 104px;
        }
        .sr-stat-header {
          color: #3f4d5f;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 10px;
        }
        .sr-stat-header-deposit {
          background: #ace4e2;
        }
        .sr-stat-header-withdrawal {
          background: #f2b1b1;
        }
        .sr-stat-content {
          padding: 10px;
        }
        .sr-stat-big {
          color: #d63a3a;
          font-size: 34px;
          font-weight: 600;
          line-height: 1;
        }
        .sr-stat-small {
          color: #2f3a4a;
          margin-top: 6px;
          font-size: 20px;
          font-weight: 500;
          line-height: 1;
        }
        .sr-stat-label {
          color: #808b9b;
          font-size: 11px;
          margin-top: 2px;
        }
        .sr-chart-card {
          border: 1px solid #d9dde3;
          background: #fff;
          border-radius: 2px;
          overflow: hidden;
          min-height: 230px;
        }
        .sr-chart-header {
          color: #3f4d5f;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 10px;
        }
        .sr-chart-grid {
          padding: 12px 10px 8px;
        }
        .sr-chart-legend {
          display: flex;
          justify-content: center;
          gap: 14px;
          color: #7e8998;
          font-size: 11px;
          margin-bottom: 8px;
        }
        .sr-chart-legend span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .sr-chart-legend i {
          width: 22px;
          height: 8px;
          border-radius: 2px;
          display: inline-block;
        }
        .sr-chart-canvas {
          position: relative;
          border-left: 1px solid #ececec;
          border-bottom: 1px solid #ececec;
          margin-left: 28px;
          height: 160px;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 31px,
              #f1f1f1 32px
            ),
            repeating-linear-gradient(
              to right,
              transparent 0,
              transparent 68px,
              #f1f1f1 69px
            );
        }
        .sr-axis-label {
          position: absolute;
          left: -26px;
          font-size: 10px;
          color: #9ca6b3;
        }
        .sr-axis-label.top { top: -6px; }
        .sr-axis-label.upper { top: 26px; }
        .sr-axis-label.mid { top: 58px; }
        .sr-axis-label.bottom { bottom: -6px; }
      `}</style>
    </div>
  );
}
