import React from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space } from 'antd';

export function MockBalanceUpdateForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Mock Balance Update:', values);
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
            label="User ID"
            name="userId"
            rules={[{ required: true, message: 'Please input user ID' }]}
          >
            <Input placeholder="Enter user ID" />
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
            label="New Balance"
            name="newBalance"
            rules={[{ required: true, message: 'Please input new balance' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter new balance"
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            label="Update Type"
            name="updateType"
            rules={[{ required: true, message: 'Please select update type' }]}
          >
            <Select placeholder="Select update type">
              <Select.Option value="set">Set Balance</Select.Option>
              <Select.Option value="increase">Increase Balance</Select.Option>
              <Select.Option value="decrease">Decrease Balance</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
          >
            <Input.TextArea
              placeholder="Enter reason for balance update"
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Balance
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
