/**
 * PageFilterPanel Component
 * Reusable filter panel component for all pages in the application
 *
 * Features:
 * - Dynamic field rendering based on configuration
 * - Responsive grid layout (4 cols desktop, 2 cols tablet, 1 col mobile)
 * - Form validation and submission
 * - Clear, Apply, Export, and Create actions
 * - Loading states
 */

import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ClearOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { PageFilterPanelProps, FilterField } from '../types/filter';

const { RangePicker } = DatePicker;

export const PageFilterPanel: React.FC<PageFilterPanelProps> = ({
  fields,
  onFilter,
  onClear,
  onExport,
  onCreate,
  showExport = false,
  showCreate = false,
  createButtonText = 'Create',
  exportButtonText = 'Export',
  loading = false,
  initialValues = {},
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, any>) => {
    // Filter out empty values
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    onFilter(filteredValues);
  };

  const handleClear = () => {
    form.resetFields();
    if (onClear) {
      onClear();
    } else {
      // If no custom clear handler, trigger filter with empty values
      onFilter({});
    }
  };

  const renderField = (field: FilterField) => {
    const { type, placeholder, options } = field;

    switch (type) {
      case 'text':
        return (
          <Input
            placeholder={placeholder || `Enter ${field.label}`}
            allowClear
          />
        );

      case 'select':
        return (
          <Select
            placeholder={placeholder || `Select ${field.label}`}
            options={options}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        );

      case 'date':
        return (
          <DatePicker
            placeholder={placeholder || `Select ${field.label}`}
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        );

      case 'daterange':
        return (
          <RangePicker
            placeholder={['Start Date', 'End Date']}
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder || `Enter ${field.label}`}
            allowClear
          />
        );

      default:
        return <Input placeholder={placeholder || `Enter ${field.label}`} />;
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        padding: '24px',
        marginBottom: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
        layout="vertical"
      >
        <Row gutter={[16, 0]}>
          {fields.map((field) => (
            <Col
              key={field.name}
              xs={24}
              sm={12}
              md={field.span || 6}
              lg={field.span || 6}
            >
              <Form.Item
                name={field.name}
                label={field.label}
                rules={field.rules}
              >
                {renderField(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Row justify="end" style={{ marginTop: '8px' }}>
          <Space>
            <Button
              onClick={handleClear}
              icon={<ClearOutlined />}
            >
              Clear Filters
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
            >
              Apply Filters
            </Button>

            {showExport && (
              <Button
                onClick={onExport}
                icon={<ExportOutlined />}
                disabled={loading}
              >
                {exportButtonText}
              </Button>
            )}

            {showCreate && (
              <Button
                type="primary"
                onClick={onCreate}
                icon={<PlusOutlined />}
                disabled={loading}
              >
                {createButtonText}
              </Button>
            )}
          </Space>
        </Row>
      </Form>
    </div>
  );
};

export default PageFilterPanel;
