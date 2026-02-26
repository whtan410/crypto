import React from 'react';
import { Tabs, message } from 'antd';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { SUCCESS_RATE_ROUTE_BY_MENU_KEY } from '../features/success-rate/config';

export default function BankTransactionPage() {
  const navigate = useNavigate();

  const handleMenuClick = (key: string) => {
    const route = SUCCESS_RATE_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0f3' }}>
      <div style={{ marginBottom: '-16px' }}>
        <TopNavigationPanel userName="MING" onMenuClick={handleMenuClick} />
      </div>

      <div style={{ backgroundColor: '#d9dde3', minHeight: '44px', paddingTop: '4px' }}>
        <Tabs
          activeKey="bank-transaction"
          hideAdd
          type="editable-card"
          tabBarStyle={{ marginBottom: 0, borderBottom: 'none', paddingLeft: '16px' }}
          className="simple-report-tab"
          items={[{ key: 'bank-transaction', label: <span style={{ fontSize: 13, fontWeight: 400 }}>Bank Transaction</span> }]}
        />
      </div>

      <div style={{ backgroundColor: '#2f4058', padding: '8px 18px 12px 18px' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>Bank Transaction</div>
        <div style={{ color: '#c7d0dc', fontSize: 12 }}>
          <span>Report</span><span style={{ margin: '0 8px' }}>&gt;</span><span>Bank Transaction</span>
        </div>
      </div>

      <div style={{ padding: '12px 16px', color: '#5b6676' }}>Bank Transaction page placeholder.</div>
      <style>{`.simple-report-tab .ant-tabs-ink-bar,.simple-report-tab .ant-tabs-content-holder{display:none!important}.simple-report-tab .ant-tabs-nav::before{border-bottom:none!important}`}</style>
    </div>
  );
}
