/**
 * TopNavigationPanel Component
 * Main navigation panel with logo, section menus, and user dropdown
 */

import React from 'react';
import { Menu, Dropdown, Avatar, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  BankOutlined,
  UserOutlined,
  FileTextOutlined,
  WarningOutlined,
  SettingOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  GlobalOutlined,
  DownOutlined,
  LogoutOutlined,
  ProfileOutlined,
  LockOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

interface TopNavigationPanelProps {
  userName?: string;
  onMenuClick?: (key: string) => void;
  onUserMenuClick?: (key: string) => void;
}

export const TopNavigationPanel: React.FC<TopNavigationPanelProps> = ({
  userName = 'Admin User',
  onMenuClick,
  onUserMenuClick,
}) => {
  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <ProfileOutlined />,
    },
    {
      key: 'change-password',
      label: 'Change Password',
      icon: <LockOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = (e) => {
    if (onUserMenuClick) {
      onUserMenuClick(e.key);
    }
  };

  // Report section dropdown
  const reportMenuItems: MenuProps['items'] = [
    { key: 'report-deposit-history', label: 'Deposit History' },
    { key: 'report-withdrawal-history', label: 'Withdrawal History' },
    { key: 'report-bank-transaction', label: 'Bank Transaction' },
    { key: 'report-merchant-profile', label: 'Merchant User Profile' },
    { key: 'report-success-rate', label: 'Success Rate' },
    { key: 'report-manual-match', label: 'Manual Match' },
    { key: 'report-activity-log', label: 'Activity Log' },
  ];

  // User section dropdown
  const userMenuItems2: MenuProps['items'] = [
    { key: 'user-list', label: 'User List' },
    { key: 'user-role-config', label: 'User Role Configuration' },
  ];

  // Exception section dropdown
  const exceptionMenuItems: MenuProps['items'] = [
    { key: 'exception-in', label: 'In Exception' },
    { key: 'exception-out', label: 'Out Exception' },
    { key: 'exception-problem', label: 'Problem Transactions' },
    { key: 'exception-callbacks', label: 'Failed Callbacks' },
  ];

  // Settings section dropdown
  const settingsMenuItems: MenuProps['items'] = [
    { key: 'settings-maintenance', label: 'Maintenance Period' },
    { key: 'settings-general', label: 'General Settings' },
  ];

  // Mock section dropdown
  const mockMenuItems: MenuProps['items'] = [
    { key: 'mock-transaction', label: 'Mock Transaction' },
    { key: 'mock-balance', label: 'Mock Balance Update' },
    { key: 'mock-withdrawal', label: 'Mock Withdrawal Request' },
    { key: 'mock-deposit', label: 'Mock Deposit Request' },
    { key: 'mock-freeze', label: 'Mock Freeze' },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (onMenuClick) {
      onMenuClick(e.key);
    }
  };

  // Main navigation items
  const mainMenuItems: MenuItem[] = [
    {
      key: 'account',
      label: 'Account',
      icon: <BankOutlined />,
      onClick: handleMenuClick,
    },
    {
      key: 'user',
      label: (
        <span>
          User <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
        </span>
      ),
      icon: <UserOutlined />,
      children: userMenuItems2,
    },
    {
      key: 'report',
      label: (
        <span>
          Report <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
        </span>
      ),
      icon: <FileTextOutlined />,
      children: reportMenuItems,
    },
    {
      key: 'exception',
      label: (
        <span>
          Exception <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
        </span>
      ),
      icon: <WarningOutlined />,
      children: exceptionMenuItems,
    },
    {
      key: 'settings',
      label: (
        <span>
          Settings <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
        </span>
      ),
      icon: <SettingOutlined />,
      children: settingsMenuItems,
    },
    {
      key: 'mock',
      label: (
        <span>
          Mock <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
        </span>
      ),
      icon: <ExperimentOutlined />,
      children: mockMenuItems,
    },
    {
      key: 'admin',
      label: 'Admin',
      icon: <SafetyOutlined />,
      onClick: handleMenuClick,
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Left: Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: '24px',
        }}
      >
        {/* Two overlapping circles logo */}
        <div style={{ position: 'relative', width: '32px', height: '24px' }}>
          {/* Dark blue circle */}
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#1e3a8a',
              border: '2px solid #1e3a8a',
            }}
          />
          {/* Light blue circle */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              border: '2px solid #3b82f6',
            }}
          />
        </div>
      </div>

      {/* Middle: Main Navigation */}
      <div style={{ flex: 1 }}>
        <Menu
          onClick={handleMenuClick}
          mode="horizontal"
          items={mainMenuItems}
          style={{
            borderBottom: 'none',
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {/* Right: Web Icon and User Dropdown */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginLeft: '24px',
        }}
      >
        {/* Web Icon */}
        <GlobalOutlined
          style={{
            fontSize: '20px',
            color: '#595959',
            cursor: 'pointer',
          }}
          onClick={() => onMenuClick?.('web')}
        />

        {/* User Dropdown */}
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          trigger={['click']}
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              style={{ backgroundColor: '#1890ff' }}
              icon={<UserOutlined />}
            />
            <span style={{ color: '#262626' }}>{userName}</span>
            <DownOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopNavigationPanel;
