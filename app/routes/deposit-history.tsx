/**
 * Deposit History Page
 * Demo page to test the PageFilterPanel component
 */

import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageFilterPanel } from '../components/PageFilterPanel';
import { DEPOSIT_HISTORY_FILTERS } from '../config/pageFilters';
import type { FilterValues } from '../types/filter';

interface DepositRecord {
  key: string;
  id: string;
  nickname: string;
  bankName: string;
  status: string;
  currency: string;
  amount: number;
  orderNumber: string;
  merchantCode: string;
  createdAt: string;
}

export default function DepositHistoryPage() {
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  // Sample data
  const dataSource: DepositRecord[] = [
    {
      key: '1',
      id: 'DEP001',
      nickname: 'Account A',
      bankName: 'BANGKOK BANK',
      status: 'MATCHED',
      currency: 'THB',
      amount: 1500.00,
      orderNumber: 'ORD123456',
      merchantCode: 'MERCH001',
      createdAt: '2024-01-15 10:30:00',
    },
    {
      key: '2',
      id: 'DEP002',
      nickname: 'Account B',
      bankName: 'KASIKORNBANK',
      status: 'PENDING',
      currency: 'THB',
      amount: 2500.00,
      orderNumber: 'ORD123457',
      merchantCode: 'MERCH002',
      createdAt: '2024-01-15 11:45:00',
    },
    {
      key: '3',
      id: 'DEP003',
      nickname: 'Account C',
      bankName: 'TMB BANK',
      status: 'COMPLETED',
      currency: 'THB',
      amount: 5000.00,
      orderNumber: 'ORD123458',
      merchantCode: 'MERCH001',
      createdAt: '2024-01-15 14:20:00',
    },
  ];

  const columns: ColumnsType<DepositRecord> = [
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
      title: 'Bank Name',
      dataIndex: 'bankName',
      key: 'bankName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Merchant Code',
      dataIndex: 'merchantCode',
      key: 'merchantCode',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
    // Implement export logic
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Deposit History</h1>

      <PageFilterPanel
        fields={DEPOSIT_HISTORY_FILTERS}
        onFilter={handleFilter}
        onExport={handleExport}
        showExport
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
    </div>
  );
}
