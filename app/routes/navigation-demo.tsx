/**
 * Navigation Demo Page
 * Demo page showing the TopNavigationPanel component
 */

import React, { useState } from 'react';
import { Typography, Card, message } from 'antd';
import { TopNavigationPanel } from '../components/TopNavigationPanel';

const { Title, Paragraph, Text } = Typography;

export default function NavigationDemo() {
  const [lastClicked, setLastClicked] = useState('');

  const handleMenuClick = (key: string) => {
    console.log('Menu clicked:', key);
    setLastClicked(key);
    message.info(`Navigated to: ${key}`);
  };

  const handleUserMenuClick = (key: string) => {
    console.log('User menu clicked:', key);
    setLastClicked(`user-menu: ${key}`);
    message.info(`User action: ${key}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <TopNavigationPanel
        userName="John Doe"
        onMenuClick={handleMenuClick}
        onUserMenuClick={handleUserMenuClick}
      />

      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>Top Navigation Panel Demo</Title>
          <Paragraph>
            This is the main navigation panel with all sections and features.
          </Paragraph>

          <div style={{ marginTop: '24px' }}>
            <Title level={4}>Features:</Title>
            <ul>
              <li><strong>Logo:</strong> Casino Banking logo on the left</li>
              <li><strong>Account:</strong> Single click navigation</li>
              <li><strong>User:</strong> Dropdown with User List, User Role Configuration</li>
              <li><strong>Report:</strong> Dropdown with 7 report pages</li>
              <li><strong>Exception:</strong> Dropdown with 4 exception pages</li>
              <li><strong>Settings:</strong> Dropdown with Maintenance Period, General Settings</li>
              <li><strong>Mock:</strong> Dropdown with 5 mock testing pages</li>
              <li><strong>Admin:</strong> Single click navigation</li>
              <li><strong>Web Icon:</strong> Global/web features (right side)</li>
              <li><strong>User Dropdown:</strong> Profile, Change Password, Logout (right side)</li>
            </ul>
          </div>

          {lastClicked && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f6f6f6', borderRadius: '4px' }}>
              <Text strong>Last Clicked: </Text>
              <Text code>{lastClicked}</Text>
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <Title level={4}>Section Structure:</Title>

            <Card size="small" style={{ marginTop: '16px' }}>
              <Text strong>Account</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>Account Dashboard/List</li>
                <li>Role Management</li>
              </ul>
            </Card>

            <Card size="small" style={{ marginTop: '8px' }}>
              <Text strong>User (Dropdown)</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>User List</li>
                <li>User Role Configuration</li>
              </ul>
            </Card>

            <Card size="small" style={{ marginTop: '8px' }}>
              <Text strong>Report (Dropdown)</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>Deposit History</li>
                <li>Withdrawal History</li>
                <li>Bank Transaction</li>
                <li>Merchant User Profile</li>
                <li>Success Rate</li>
                <li>Manual Match</li>
                <li>Activity Log</li>
              </ul>
            </Card>

            <Card size="small" style={{ marginTop: '8px' }}>
              <Text strong>Exception (Dropdown)</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>In Exception</li>
                <li>Out Exception</li>
                <li>Problem Transactions</li>
                <li>Failed Callbacks</li>
              </ul>
            </Card>

            <Card size="small" style={{ marginTop: '8px' }}>
              <Text strong>Settings (Dropdown)</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>Maintenance Period</li>
                <li>General Settings</li>
              </ul>
            </Card>

            <Card size="small" style={{ marginTop: '8px' }}>
              <Text strong>Mock (Dropdown)</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>Mock Transaction</li>
                <li>Mock Balance Update</li>
                <li>Mock Withdrawal Request</li>
                <li>Mock Deposit Request</li>
                <li>Mock Freeze</li>
              </ul>
            </Card>

            <Card size="small" style={{ marginTop: '8px' }}>
              <Text strong>Admin</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>PGS Admin Dashboard</li>
              </ul>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}
