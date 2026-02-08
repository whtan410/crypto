import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Card, Space, Typography } from "antd";

const { Title, Paragraph } = Typography;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Casino Banking System" },
    { name: "description", content: "Casino Banking Management System" },
  ];
}

export default function Home() {
  return (
    <div style={{ padding: '24px' }}>
      <Title>Casino Banking System</Title>
      <Paragraph>
        Welcome to the Casino Banking Management System. This application provides
        comprehensive tools for managing accounts, transactions, and reports.
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '24px' }}>
        <Card title="Demo Pages" bordered>
          <Space direction="vertical">
            <Link to="/navigation-demo">
              <a style={{ fontSize: '16px' }}>Top Navigation Panel Demo</a>
            </Link>
            <Link to="/deposit-history">
              <a style={{ fontSize: '16px' }}>Deposit History - Filter Demo</a>
            </Link>
            <Link to="/accounts">
              <a style={{ fontSize: '16px' }}>Account Management - Filter with Create Button Demo</a>
            </Link>
            <Link to="/mock-transaction">
              <a style={{ fontSize: '16px' }}>Mock Transaction - Full Page Demo</a>
            </Link>
            <Link to="/mock-balance-update">
              <a style={{ fontSize: '16px' }}>Mock Balance Update - Full Page Demo</a>
            </Link>
            <Link to="/mock-withdrawal-request">
              <a style={{ fontSize: '16px' }}>Mock Withdrawal Request - Full Page Demo</a>
            </Link>
            <Link to="/mock-deposit-request">
              <a style={{ fontSize: '16px' }}>Mock Deposit Request - Full Page Demo</a>
            </Link>
            <Link to="/mock-freeze">
              <a style={{ fontSize: '16px' }}>Mock Freeze - Full Page Demo</a>
            </Link>
          </Space>
        </Card>

        <Card title="PageFilterPanel Component" bordered>
          <Paragraph>
            The <code>PageFilterPanel</code> is a reusable filter component that supports:
          </Paragraph>
          <ul>
            <li>Dynamic field rendering (text, select, date, daterange, number)</li>
            <li>Responsive grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)</li>
            <li>Clear Filters and Apply Filters actions</li>
            <li>Optional Export and Create buttons</li>
            <li>Loading states</li>
          </ul>
        </Card>

        <Card title="Available Filter Configurations" bordered>
          <Paragraph>Pre-configured filters are available for:</Paragraph>
          <ul>
            <li>Deposit History (10 fields)</li>
            <li>Withdrawal History (11 fields)</li>
            <li>Account Dashboard (8 fields)</li>
            <li>Success Rate (3 fields)</li>
            <li>Activity Log (5 fields)</li>
            <li>Out Exception (8 fields)</li>
            <li>In Exception (8 fields)</li>
            <li>Problem Transactions (9 fields)</li>
            <li>Failed Callbacks (6 fields)</li>
            <li>Bank Transaction (7 fields)</li>
            <li>Manual Match (5 fields)</li>
          </ul>
        </Card>
      </Space>
    </div>
  );
}
