/**
 * Mock Tabs Page - Chrome-style Dynamic Tab System
 * Tabs open only when user selects Mock items from dropdown.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { MockTransactionForm } from '../components/mock-forms/MockTransactionForm';
import { MockBalanceUpdateForm } from '../components/mock-forms/MockBalanceUpdateForm';
import { MockWithdrawalRequestForm } from '../components/mock-forms/MockWithdrawalRequestForm';
import { MockDepositRequestForm } from '../components/mock-forms/MockDepositRequestForm';
import { MockFreezeForm } from '../components/mock-forms/MockFreezeForm';

interface MockTab {
  key: string;
  mockType: MockType;
  label: string;
  content: React.ReactNode;
}

type MockType = 'mock-transaction' | 'mock-balance' | 'mock-withdrawal' | 'mock-deposit' | 'mock-freeze';

interface TabsState {
  tabs: MockTab[];
  activeKey: string;
  tabCounter: number;
}

const MOCK_CONFIG: Record<MockType, { label: string; component: React.ReactNode; route: string }> = {
  'mock-transaction': {
    label: 'Mock Transaction',
    component: <MockTransactionForm />,
    route: '/mock-transaction',
  },
  'mock-balance': {
    label: 'Mock Balance Update',
    component: <MockBalanceUpdateForm />,
    route: '/mock-balance-update',
  },
  'mock-withdrawal': {
    label: 'Mock Withdrawal Request',
    component: <MockWithdrawalRequestForm />,
    route: '/mock-withdrawal-request',
  },
  'mock-deposit': {
    label: 'Mock Deposit Request',
    component: <MockDepositRequestForm />,
    route: '/mock-deposit-request',
  },
  'mock-freeze': {
    label: 'Mock Freeze',
    component: <MockFreezeForm />,
    route: '/mock-freeze',
  },
};

const ROUTE_TO_MOCK: Record<string, MockType> = {
  '/mock-transaction': 'mock-transaction',
  '/mock-balance-update': 'mock-balance',
  '/mock-withdrawal-request': 'mock-withdrawal',
  '/mock-deposit-request': 'mock-deposit',
  '/mock-freeze': 'mock-freeze',
};

const ROUTE_BY_MENU_KEY: Record<string, string> = {
  account: '/account',
  'report-deposit-history': '/deposit-history',
  'report-withdrawal-history': '/withdrawal-history',
  'report-bank-transaction': '/bank-transaction',
  'report-merchant-profile': '/merchant-profile',
  'report-success-rate': '/success-rate',
  'report-manual-match': '/manual-match',
  'report-activity-log': '/activity-log',
};

const isMockType = (value: string): value is MockType =>
  Object.prototype.hasOwnProperty.call(MOCK_CONFIG, value);

export default function MockTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabsState, setTabsState] = useState<TabsState>({
    tabs: [],
    activeKey: '',
    tabCounter: 0,
  });
  const { tabs, activeKey } = tabsState;

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.key === activeKey),
    [tabs, activeKey]
  );

  const addTab = (mockType: MockType, shouldNavigate: boolean) => {
    setTabsState((prevState) => {
      const existingTab = prevState.tabs.find((tab) => tab.mockType === mockType);
      if (existingTab) {
        return {
          ...prevState,
          activeKey: existingTab.key,
        };
      }

      const config = MOCK_CONFIG[mockType];
      const newTabKey = `${mockType}-${prevState.tabCounter}`;
      const newTab: MockTab = {
        key: newTabKey,
        mockType,
        label: config.label,
        content: config.component,
      };

      return {
        tabs: [...prevState.tabs, newTab],
        activeKey: newTabKey,
        tabCounter: prevState.tabCounter + 1,
      };
    });

    if (shouldNavigate) {
      const route = MOCK_CONFIG[mockType].route;
      if (location.pathname !== route) {
        navigate(route);
      }
    }
  };

  useEffect(() => {
    const mockTypeFromRoute = ROUTE_TO_MOCK[location.pathname];
    if (mockTypeFromRoute) {
      addTab(mockTypeFromRoute, false);
    }
  }, [location.pathname]);

  const handleMenuClick = (key: string) => {
    if (isMockType(key)) {
      addTab(key, true);
      return;
    }

    const route = ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }

    message.info(`Navigated to: ${key}`);
  };

  const handleUserMenuClick = (key: string) => {
    message.info(`User action: ${key}`);
  };

  const handleActiveTabChange = (nextActiveKey: string) => {
    setTabsState((prevState) => ({
      ...prevState,
      activeKey: nextActiveKey,
    }));
    const nextActiveTab = tabs.find((tab) => tab.key === nextActiveKey);
    if (nextActiveTab) {
      const route = MOCK_CONFIG[nextActiveTab.mockType].route;
      if (location.pathname !== route) {
        navigate(route);
      }
    }
  };

  const removeTab = (targetKey: string) => {
    const targetIndex = tabs.findIndex((tab) => tab.key === targetKey);
    if (targetIndex === -1) {
      return;
    }

    const newTabs = tabs.filter((tab) => tab.key !== targetKey);

    if (targetKey === activeKey) {
      if (newTabs.length === 0) {
        setTabsState((prevState) => ({
          ...prevState,
          tabs: newTabs,
          activeKey: '',
        }));
        if (location.pathname !== '/mock-tabs') {
          navigate('/mock-tabs');
        }
      } else {
        const nextTab = targetIndex > 0 ? newTabs[targetIndex - 1] : newTabs[0];
        setTabsState((prevState) => ({
          ...prevState,
          tabs: newTabs,
          activeKey: nextTab.key,
        }));
        const route = MOCK_CONFIG[nextTab.mockType].route;
        if (location.pathname !== route) {
          navigate(route);
        }
      }
      return;
    }

    setTabsState((prevState) => ({
      ...prevState,
      tabs: newTabs,
    }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ecf0f1' }}>
      <div style={{ marginBottom: '-16px' }}>
        <TopNavigationPanel
          userName="MING"
          onMenuClick={handleMenuClick}
          onUserMenuClick={handleUserMenuClick}
        />
      </div>

      <div style={{ backgroundColor: '#d9dde3', paddingTop: '4px', minHeight: '48px' }}>
        {tabs.length === 0 ? (
          <div style={{ height: '44px' }} />
        ) : (
          <Tabs
            activeKey={activeKey}
            onChange={handleActiveTabChange}
            hideAdd
            type="editable-card"
            onEdit={(targetKey, action) => {
              if (action === 'remove') {
                removeTab(targetKey as string);
              }
            }}
            tabBarStyle={{
              marginBottom: 0,
              borderBottom: 'none',
              paddingLeft: '16px',
            }}
            className="browser-style-tabs"
            items={tabs.map((tab) => ({
              key: tab.key,
              label: <span style={{ fontSize: '13px', fontWeight: 400 }}>{tab.label}</span>,
              closeIcon: (
                <CloseOutlined
                  style={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: activeKey === tab.key ? '#595959' : '#8c8c8c',
                  }}
                />
              ),
            }))}
          />
        )}
      </div>

      {activeTab && (
        <div
          style={{
            backgroundColor: '#34495e',
            padding: '12px 24px 14px 24px',
          }}
        >
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
            {activeTab.label}
          </div>
          <div style={{ color: '#fff', fontSize: '13px' }}>
            <span style={{ opacity: 0.7 }}>Mock</span>
            <span style={{ margin: '0 8px', opacity: 0.7 }}>&gt;</span>
            <span>{activeTab.label}</span>
          </div>
        </div>
      )}

      <style>{`
        .browser-style-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }

        .browser-style-tabs .ant-tabs-nav::before {
          border-bottom: none !important;
        }

        .browser-style-tabs .ant-tabs-tab {
          background-color: #c6ccd4 !important;
          border: none !important;
          color: #4f5b66 !important;
          padding: 6px 16px 6px 24px !important;
          margin: 0 1px 0 0 !important;
          border-radius: 8px 8px 0 0 !important;
          position: relative !important;
          min-width: 140px !important;
        }

        .browser-style-tabs .ant-tabs-tab-active {
          background-color: #ecf0f1 !important;
          color: #262626 !important;
          min-width: 160px !important;
        }

        .browser-style-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #262626 !important;
        }

        .browser-style-tabs .ant-tabs-tab:hover:not(.ant-tabs-tab-active) {
          color: #2f3942 !important;
          background-color: #bfc6cf !important;
        }

        .browser-style-tabs .ant-tabs-tab-remove {
          margin-left: 4px !important;
          margin-right: 0 !important;
        }

        .browser-style-tabs .ant-tabs-tab-remove:hover {
          color: #ff4d4f !important;
        }

        .browser-style-tabs .ant-tabs-ink-bar {
          display: none !important;
        }

        .browser-style-tabs .ant-tabs-content-holder {
          display: none !important;
        }
      `}</style>

      <div style={{ padding: '0', backgroundColor: '#ecf0f1', minHeight: 'calc(100vh - 200px)' }}>
        {activeTab?.content}
      </div>
    </div>
  );
}
