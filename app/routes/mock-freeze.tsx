/**
 * Mock Freeze Page
 * Generates mock freeze data for testing purposes
 */

import React, { useState } from 'react';
import { Card, Input, Select, Button, Row, Col, Tabs, message } from 'antd';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const { TabPane } = Tabs;

export default function MockFreeze() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountId: '',
    reason: '',
    type: undefined,
  });

  const handleMenuClick = (key: string) => {
    console.log('Menu clicked:', key);
    message.info(`Navigated to: ${key}`);
  };

  const handleUserMenuClick = (key: string) => {
    console.log('User menu clicked:', key);
    message.info(`User action: ${key}`);
  };

  const handleClear = () => {
    setFormData({
      accountId: '',
      reason: '',
      type: undefined,
    });
    message.success('Form cleared');
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    message.success('Mock freeze submitted');
  };

  const handleTabChange = (key: string) => {
    console.log('Tab changed to:', key);
    // Navigate to the corresponding route
    navigate(`/${key}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ecf0f1' }}>
      {/* Top Navigation Panel */}
      <div style={{ marginBottom: '-16px' }}>
        <TopNavigationPanel
          userName="MING"
          onMenuClick={handleMenuClick}
          onUserMenuClick={handleUserMenuClick}
        />
      </div>

      {/* Tab Navigation - Browser Style - Darker Blue */}
      <div style={{ backgroundColor: '#1a252f', paddingTop: '4px' }}>
        <Tabs
          activeKey="mock-freeze"
          onChange={handleTabChange}
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: 'none',
            paddingLeft: '16px',
          }}
          className="browser-style-tabs"
          items={[
            {
              key: 'mock-transaction',
              label: (
                <span style={{ fontSize: '13px', fontWeight: 400 }}>
                  Mock Transaction
                </span>
              ),
            },
            {
              key: 'mock-balance-update',
              label: (
                <span style={{ fontSize: '13px', fontWeight: 400 }}>
                  Mock Balance Update
                </span>
              ),
            },
            {
              key: 'mock-withdrawal-request',
              label: (
                <span style={{ fontSize: '13px', fontWeight: 400 }}>
                  Mock Withdrawal Request
                </span>
              ),
            },
            {
              key: 'mock-deposit-request',
              label: (
                <span style={{ fontSize: '13px', fontWeight: 400 }}>
                  Mock Deposit Request
                </span>
              ),
            },
            {
              key: 'mock-freeze',
              label: (
                <span style={{ fontSize: '13px', fontWeight: 400 }}>
                  Mock Freeze
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Page Title and Breadcrumb - Lighter Grey/Blue */}
      <div
        style={{
          backgroundColor: '#34495e',
          padding: '12px 24px 14px 24px',
        }}
      >
        {/* Page Title */}
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
          Mock Freeze
        </div>
        {/* Breadcrumb */}
        <div style={{ color: '#fff', fontSize: '13px' }}>
          <span style={{ opacity: 0.7 }}>Mock</span>
          <span style={{ margin: '0 8px', opacity: 0.7 }}>&gt;</span>
          <span>Freeze</span>
        </div>
      </div>

      <style>{`
        .browser-style-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }

        .browser-style-tabs .ant-tabs-nav::before {
          border-bottom: none !important;
        }

        .browser-style-tabs .ant-tabs-tab {
          background-color: rgba(0, 0, 0, 0.15) !important;
          border: none !important;
          color: rgba(255, 255, 255, 0.65) !important;
          padding: 6px 24px !important;
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
          color: rgba(255, 255, 255, 0.9) !important;
          background-color: rgba(0, 0, 0, 0.25) !important;
        }

        .browser-style-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
      `}</style>

      {/* Main Content */}
      <div style={{ padding: '0', backgroundColor: '#ecf0f1', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 24px 24px 24px' }}>
          <Card
            style={{
              backgroundColor: '#3d5168',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: 0 }}
          >
            {/* Card Header */}
            <div
              style={{
                backgroundColor: '#4a5f7a',
                padding: '20px 24px',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <LockOutlined style={{ fontSize: '20px', color: '#fff' }} />
              <div>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>
                  Mock Freeze
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '13px', marginTop: '4px' }}>
                  Generate mock freeze data for testing purposes
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div style={{ padding: '32px 24px', backgroundColor: '#fff' }}>
              <Row gutter={[16, 16]}>
                {/* Account ID */}
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '8px', color: '#595959' }}>
                    * Account ID
                  </div>
                  <Input
                    placeholder="Account ID"
                    value={formData.accountId}
                    onChange={(e) =>
                      setFormData({ ...formData, accountId: e.target.value })
                    }
                  />
                </Col>

                {/* Type */}
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '8px', color: '#595959' }}>
                    * Type
                  </div>
                  <Select
                    placeholder="Select type"
                    style={{ width: '100%' }}
                    value={formData.type}
                    onChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                    options={[
                      { value: 'freeze', label: 'Freeze' },
                      { value: 'unfreeze', label: 'Unfreeze' },
                    ]}
                  />
                </Col>

                {/* Reason */}
                <Col xs={24}>
                  <div style={{ marginBottom: '8px', color: '#595959' }}>
                    Reason
                  </div>
                  <Input.TextArea
                    placeholder="Reason"
                    rows={4}
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                  />
                </Col>
              </Row>

              {/* Action Buttons */}
              <div
                style={{
                  marginTop: '32px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <Button onClick={handleClear}>
                  Clear
                </Button>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
