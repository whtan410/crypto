/**
 * Account Dashboard Page
 * Demo page showing PageFilterPanel with Create button
 */

import React, { useState } from 'react';
import { Table, Tag, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageFilterPanel } from '../components/PageFilterPanel';
import { ACCOUNT_DASHBOARD_FILTERS } from '../config/pageFilters';
import type { FilterValues } from '../types/filter';

interface AccountRecord {
  key: string;
  id: string;
  nickname: string;
  bank: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;
  status: string;
  balance: number;
  in: boolean;
  out: boolean;
}

export default function AccountsPage() {
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // Sample data
  const dataSource: AccountRecord[] = [
    {
      key: '1',
      id: 'ACC001',
      nickname: 'Main Account',
      bank: 'BANGKOK BANK',
      accountHolder: 'Company ABC Ltd.',
      accountNumber: '1234567890',
      accountType: 'CORPORATE',
      status: 'ACTIVE',
      balance: 150000.00,
      in: true,
      out: true,
    },
    {
      key: '2',
      id: 'ACC002',
      nickname: 'Secondary Account',
      bank: 'KASIKORNBANK',
      accountHolder: 'John Doe',
      accountNumber: '0987654321',
      accountType: 'PERSONAL',
      status: 'ACTIVE',
      balance: 75000.00,
      in: true,
      out: false,
    },
    {
      key: '3',
      id: 'ACC003',
      nickname: 'Backup Account',
      bank: 'TMB BANK',
      accountHolder: 'Company XYZ Ltd.',
      accountNumber: '5555555555',
      accountType: 'CORPORATE',
      status: 'MAINTENANCE',
      balance: 250000.00,
      in: false,
      out: false,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'green',
      DEPOSIT_OFFLINE: 'orange',
      WITHDRAWAL_OFFLINE: 'orange',
      MAINTENANCE: 'blue',
      FROZEN: 'red',
    };
    return colors[status] || 'default';
  };

  const columns: ColumnsType<AccountRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'Bank',
      dataIndex: 'bank',
      key: 'bank',
    },
    {
      title: 'Account Holder',
      dataIndex: 'accountHolder',
      key: 'accountHolder',
    },
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (type: string) => (
        <Tag color={type === 'CORPORATE' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    },
    {
      title: 'In',
      dataIndex: 'in',
      key: 'in',
      width: 80,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>{enabled ? 'ENABLED' : 'DISABLED'}</Tag>
      ),
    },
    {
      title: 'Out',
      dataIndex: 'out',
      key: 'out',
      width: 80,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>{enabled ? 'ENABLED' : 'DISABLED'}</Tag>
      ),
    },
  ];

  const handleFilter = (values: FilterValues) => {
    console.log('Filter values:', values);
    setFilterValues(values);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    console.log('Exporting data with filters:', filterValues);
    message.success('Export started');
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  const handleModalClose = () => {
    setCreateModalVisible(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Account Management</h1>

      <PageFilterPanel
        fields={ACCOUNT_DASHBOARD_FILTERS}
        onFilter={handleFilter}
        onExport={handleExport}
        onCreate={handleCreate}
        showExport
        showCreate
        createButtonText="Create Account"
        loading={loading}
      />

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          total: dataSource.length,
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        bordered
        style={{
          background: '#fff',
          borderRadius: '8px',
        }}
      />

      <Modal
        title="Create New Account"
        open={createModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <p>Account creation form would go here...</p>
      </Modal>
    </div>
  );
}
