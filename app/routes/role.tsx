import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Table, Tabs, Tag, Tooltip, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { TopNavigationPanel } from '../components/TopNavigationPanel';
import { ROLE_ROUTE_BY_MENU_KEY } from '../features/role/config';
import { mapRolePageDtoToViewModel, MockRoleRepository } from '../features/role/repository';
import type { RoleFilterQuery, RoleRowViewModel } from '../features/role/types';

const { Text } = Typography;

const roleRepository = new MockRoleRepository();

export default function RolePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RoleFilterQuery>({
    roleName: '',
    permission: '',
  });
  const [rows, setRows] = useState<RoleRowViewModel[]>([]);

  const loadData = useCallback(async (query?: RoleFilterQuery) => {
    setLoading(true);
    try {
      const responseDto = await roleRepository.listRolePageData(query);
      const viewModel = mapRolePageDtoToViewModel(responseDto);
      setRows(viewModel.rows);
    } catch (error) {
      console.error('Failed to load role data', error);
      message.error('Failed to load role data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleMenuClick = (key: string) => {
    const route = ROLE_ROUTE_BY_MENU_KEY[key];
    if (route) {
      navigate(route);
      return;
    }
    message.info(`Navigated to: ${key}`);
  };

  const handleUserMenuClick = (key: string) => {
    message.info(`User action: ${key}`);
  };

  const handleTabEdit = (_targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      navigate('/');
    }
  };

  const handleSearch = () => {
    void loadData(filters);
  };

  const handleExport = () => {
    message.success('Export triggered');
  };

  const handleCreate = () => {
    message.info('Open create role flow');
  };

  const columns: ColumnsType<RoleRowViewModel> = useMemo(
    () => [
      {
        title: 'Role Name',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 220,
      },
      {
        title: 'Users Count',
        dataIndex: 'userCount',
        key: 'userCount',
        width: 120,
      },
      {
        title: 'Permissions',
        dataIndex: 'permissions',
        key: 'permissions',
        render: (permissions: string[]) => (
          <Space size={[4, 4]} wrap>
            {permissions.length === 0 ? (
              <Text type="secondary">No permission</Text>
            ) : (
              permissions.map((permission) => (
                <Tag
                  key={permission}
                  style={{
                    marginInlineEnd: 0,
                    borderRadius: 10,
                    border: '1px solid #d6e4ff',
                    color: '#2f54eb',
                    background: '#f0f5ff',
                    fontSize: 11,
                    paddingInline: 8,
                  }}
                >
                  {permission}
                </Tag>
              ))
            )}
          </Space>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 110,
        render: (_value, row) => (
          <Space size={10}>
            <Tooltip title={`Edit ${row.roleName}`}>
              <EditOutlined
                style={{ color: '#1677ff', cursor: 'pointer' }}
                onClick={() => message.info(`Edit ${row.roleName}`)}
              />
            </Tooltip>
            <Tooltip title={`Delete ${row.roleName}`}>
              <DeleteOutlined
                style={{ color: '#ff4d4f', cursor: 'pointer' }}
                onClick={() => message.warning(`Delete ${row.roleName}`)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ecf0f1' }}>
      <div style={{ marginBottom: '-16px' }}>
        <TopNavigationPanel userName="MING" onMenuClick={handleMenuClick} onUserMenuClick={handleUserMenuClick} />
      </div>

      <div style={{ backgroundColor: '#d9dde3', paddingTop: '4px', minHeight: '44px' }}>
        <Tabs
          activeKey="role"
          onChange={() => navigate('/role')}
          hideAdd
          type="editable-card"
          onEdit={handleTabEdit}
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: 'none',
            paddingLeft: '16px',
          }}
          className="role-browser-style-tabs"
          items={[
            {
              key: 'role',
              label: <span style={{ fontSize: '13px', fontWeight: 400 }}>Role</span>,
              closeIcon: (
                <CloseOutlined
                  style={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: '#595959',
                  }}
                />
              ),
            },
          ]}
        />
      </div>

      <div
        style={{
          backgroundColor: '#2f4058',
          padding: '10px 24px 12px 24px',
        }}
      >
        <div style={{ color: '#fff', fontSize: '24px', fontWeight: 500, marginBottom: '4px' }}>Role</div>
        <div style={{ color: '#d7dde7', fontSize: '13px' }}>
          <span>User</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Role</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            padding: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Space size={8}>
              <Input
                placeholder="Role Name"
                prefix={<SearchOutlined />}
                value={filters.roleName}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    roleName: event.target.value,
                  }))
                }
                style={{ width: 220 }}
                allowClear
              />
              <Input
                placeholder="Permission"
                prefix={<SearchOutlined />}
                value={filters.permission}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    permission: event.target.value,
                  }))
                }
                style={{ width: 220 }}
                allowClear
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                SEARCH
              </Button>
            </Space>

            <Space size={8}>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                EXPORT
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                CREATE
              </Button>
            </Space>
          </div>

          <Table<RoleRowViewModel>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={rows}
            bordered={false}
            size="middle"
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['20', '50', '100'],
              defaultPageSize: 20,
              showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} entries`,
            }}
          />
        </div>
      </div>

      <style>{`
        .role-browser-style-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }

        .role-browser-style-tabs .ant-tabs-nav::before {
          border-bottom: none !important;
        }

        .role-browser-style-tabs .ant-tabs-tab {
          background-color: #c6ccd4 !important;
          border: none !important;
          color: #4f5b66 !important;
          padding: 6px 10px 6px 14px !important;
          margin: 0 1px 0 0 !important;
          border-radius: 8px 8px 0 0 !important;
          position: relative !important;
          min-width: 94px !important;
        }

        .role-browser-style-tabs .ant-tabs-tab-active {
          background-color: #ecf0f1 !important;
          color: #262626 !important;
          min-width: 94px !important;
        }

        .role-browser-style-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #262626 !important;
        }

        .role-browser-style-tabs .ant-tabs-tab-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          gap: 8px !important;
        }

        .role-browser-style-tabs .ant-tabs-tab:hover:not(.ant-tabs-tab-active) {
          color: #2f3942 !important;
          background-color: #bfc6cf !important;
        }

        .role-browser-style-tabs .ant-tabs-tab-remove {
          margin-left: 4px !important;
          margin-right: 0 !important;
        }

        .role-browser-style-tabs .ant-tabs-tab-remove:hover {
          color: #ff4d4f !important;
        }

        .role-browser-style-tabs .ant-tabs-ink-bar {
          display: none !important;
        }

        .role-browser-style-tabs .ant-tabs-content-holder {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
