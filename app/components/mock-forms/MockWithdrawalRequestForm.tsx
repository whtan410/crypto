import React from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space, DatePicker } from 'antd';

export function MockWithdrawalRequestForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Mock Withdrawal Request:', values);
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
            label="Request ID"
            name="requestId"
            rules={[{ required: true, message: 'Please input request ID' }]}
          >
            <Input placeholder="Enter request ID" />
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
              placeholder="Enter withdrawal amount"
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
            label="Withdrawal Address"
            name="address"
            rules={[{ required: true, message: 'Please input withdrawal address' }]}
          >
            <Input placeholder="Enter withdrawal address" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input.TextArea
              placeholder="Enter any notes"
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Request
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
