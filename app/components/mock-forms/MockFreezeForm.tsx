import React from 'react';
import { Form, Input, Select, Button, Card, Space, Switch } from 'antd';

export function MockFreezeForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Mock Freeze:', values);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ freezeStatus: true }}
        >
          <Form.Item
            label="User ID"
            name="userId"
            rules={[{ required: true, message: 'Please input user ID' }]}
          >
            <Input placeholder="Enter user ID" />
          </Form.Item>

          <Form.Item
            label="Freeze Type"
            name="freezeType"
            rules={[{ required: true, message: 'Please select freeze type' }]}
          >
            <Select placeholder="Select freeze type">
              <Select.Option value="account">Account Freeze</Select.Option>
              <Select.Option value="withdrawals">Withdrawal Freeze</Select.Option>
              <Select.Option value="deposits">Deposit Freeze</Select.Option>
              <Select.Option value="trading">Trading Freeze</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Freeze Status"
            name="freezeStatus"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Freeze"
              unCheckedChildren="Unfreeze"
            />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please input reason' }]}
          >
            <Select placeholder="Select reason">
              <Select.Option value="security">Security Concern</Select.Option>
              <Select.Option value="compliance">Compliance Review</Select.Option>
              <Select.Option value="suspicious">Suspicious Activity</Select.Option>
              <Select.Option value="request">User Request</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Additional Notes"
            name="notes"
          >
            <Input.TextArea
              placeholder="Enter additional notes"
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Apply Freeze
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
