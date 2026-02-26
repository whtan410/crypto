import React from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space } from 'antd';

export function MockTransactionForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Mock Transaction:', values);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Transaction ID"
            name="transactionId"
            rules={[{ required: true, message: 'Please input transaction ID' }]}
          >
            <Input placeholder="Enter transaction ID" />
          </Form.Item>

          <Form.Item
            label="User ID"
            name="userId"
            rules={[{ required: true, message: 'Please input user ID' }]}
          >
            <Input placeholder="Enter user ID" />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please input amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter amount"
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: 'Please select currency' }]}
          >
            <Select placeholder="Select currency">
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="EUR">EUR</Select.Option>
              <Select.Option value="GBP">GBP</Select.Option>
              <Select.Option value="BTC">BTC</Select.Option>
              <Select.Option value="ETH">ETH</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Transaction Type"
            name="type"
            rules={[{ required: true, message: 'Please select transaction type' }]}
          >
            <Select placeholder="Select transaction type">
              <Select.Option value="deposit">Deposit</Select.Option>
              <Select.Option value="withdrawal">Withdrawal</Select.Option>
              <Select.Option value="transfer">Transfer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={() => form.resetFields()}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
