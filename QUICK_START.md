# Quick Start Guide - PageFilterPanel Component

## Get Started in 3 Steps

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: View Demo Pages
Open your browser and navigate to:
- **Home**: `http://localhost:5173/`
- **Deposit History Demo**: `http://localhost:5173/deposit-history`
- **Account Management Demo**: `http://localhost:5173/accounts`

### Step 3: Use in Your Pages

#### Option A: Use Pre-configured Filters
```typescript
import { PageFilterPanel } from '@/components/PageFilterPanel';
import { DEPOSIT_HISTORY_FILTERS } from '@/config/pageFilters';

function MyPage() {
  const handleFilter = (values) => {
    console.log('Filters:', values);
    // Your API call here
  };

  return (
    <PageFilterPanel
      fields={DEPOSIT_HISTORY_FILTERS}
      onFilter={handleFilter}
    />
  );
}
```

#### Option B: Create Custom Filters
```typescript
import { PageFilterPanel } from '@/components/PageFilterPanel';
import { DEPOSIT_STATUS_OPTIONS } from '@/constants/filterOptions';

function MyPage() {
  const customFilters = [
    { name: 'search', type: 'text', label: 'Search', span: 12 },
    { name: 'status', type: 'select', label: 'Status', options: DEPOSIT_STATUS_OPTIONS, span: 12 },
    { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
    { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
  ];

  const handleFilter = (values) => {
    console.log('Filters:', values);
  };

  return (
    <PageFilterPanel
      fields={customFilters}
      onFilter={handleFilter}
      showExport
      onExport={() => console.log('Export clicked')}
    />
  );
}
```

## Available Pre-configured Filters

Import from `@/config/pageFilters`:

| Filter Configuration | Fields | Use Case |
|---------------------|--------|----------|
| `DEPOSIT_HISTORY_FILTERS` | 10 | Deposit transaction filtering |
| `WITHDRAWAL_HISTORY_FILTERS` | 11 | Withdrawal transaction filtering |
| `ACCOUNT_DASHBOARD_FILTERS` | 8 | Account management |
| `OUT_EXCEPTION_FILTERS` | 8 | Withdrawal exceptions |
| `IN_EXCEPTION_FILTERS` | 8 | Deposit exceptions |
| `PROBLEM_TRANSACTIONS_FILTERS` | 9 | Problem transaction tracking |
| `FAILED_CALLBACKS_FILTERS` | 6 | Failed webhook callbacks |
| `BANK_TRANSACTION_FILTERS` | 7 | Bank transaction records |
| `MANUAL_MATCH_FILTERS` | 5 | Manual matching |
| `ACTIVITY_LOG_FILTERS` | 5 | Activity audit logs |
| `SUCCESS_RATE_FILTERS` | 3 | Success rate reports |

## Available Dropdown Options

Import from `@/constants/filterOptions`:

- `DEPOSIT_STATUS_OPTIONS` - Deposit statuses (7 options)
- `WITHDRAWAL_STATUS_OPTIONS` - Withdrawal statuses (8 options)
- `ACCOUNT_STATUS_OPTIONS` - Account statuses (5 options)
- `ACCOUNT_TYPE_OPTIONS` - Account types (2 options)
- `BANK_OPTIONS` - Thai banks (7 options)
- `CURRENCY_OPTIONS` - Currencies (3 options)
- And 6 more option sets...

## Field Types

| Type | Example | Description |
|------|---------|-------------|
| `text` | `{ name: 'search', type: 'text', label: 'Search' }` | Text input |
| `select` | `{ name: 'status', type: 'select', label: 'Status', options: [...] }` | Dropdown |
| `date` | `{ name: 'fromDate', type: 'date', label: 'From' }` | Single date |
| `daterange` | `{ name: 'range', type: 'daterange', label: 'Range' }` | Date range |
| `number` | `{ name: 'amount', type: 'number', label: 'Amount' }` | Number input |

## Common Props

```typescript
<PageFilterPanel
  fields={filterFields}              // Required: Array of filter fields
  onFilter={handleFilter}            // Required: Callback when applying filters
  onClear={handleClear}              // Optional: Custom clear handler
  onExport={handleExport}            // Optional: Export callback
  onCreate={handleCreate}            // Optional: Create callback
  showExport={true}                  // Optional: Show export button
  showCreate={true}                  // Optional: Show create button
  createButtonText="Add New"         // Optional: Create button text
  exportButtonText="Export CSV"      // Optional: Export button text
  loading={false}                    // Optional: Loading state
  initialValues={{}}                 // Optional: Initial filter values
/>
```

## File Structure Reference

```
app/
├── components/
│   ├── PageFilterPanel.tsx              ← Main component
│   └── PageFilterPanel.README.md        ← Detailed docs
├── types/
│   └── filter.ts                        ← TypeScript types
├── constants/
│   └── filterOptions.ts                 ← Dropdown options (12 sets)
├── config/
│   └── pageFilters.ts                   ← Pre-configs (11 pages)
└── routes/
    ├── deposit-history.tsx              ← Demo: Filter + Export
    ├── accounts.tsx                     ← Demo: Filter + Create
    └── home.tsx                         ← Landing page
```

## Complete Example

```typescript
import { useState } from 'react';
import { Table } from 'antd';
import { PageFilterPanel } from '@/components/PageFilterPanel';
import { DEPOSIT_HISTORY_FILTERS } from '@/config/pageFilters';

export default function DepositHistory() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleFilter = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      const data = await response.json();
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export logic
    window.open('/api/deposits/export');
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Deposit History</h1>

      <PageFilterPanel
        fields={DEPOSIT_HISTORY_FILTERS}
        onFilter={handleFilter}
        onExport={handleExport}
        showExport
        loading={loading}
      />

      <Table
        dataSource={data}
        loading={loading}
        // ... table config
      />
    </div>
  );
}
```

## Tips

1. **Empty values are automatically filtered out** - No need to manually clean the filter object
2. **Dates return as Day.js objects** - Convert to string: `values.fromDate?.format('YYYY-MM-DD')`
3. **Select fields include search** - Users can type to filter dropdown options
4. **Responsive by default** - 4 cols → 2 cols → 1 col automatically
5. **Customize column spans** - Use `span` property (24 = full width, 12 = half, 6 = quarter)

## Need Help?

- **Detailed Documentation**: See `/app/components/PageFilterPanel.README.md`
- **Implementation Details**: See `/IMPLEMENTATION_SUMMARY.md`
- **Demo Code**: Check `/app/routes/deposit-history.tsx` and `/app/routes/accounts.tsx`

## Common Issues

### Issue: Dates not formatting correctly
**Solution**: Convert Day.js to string
```typescript
const handleFilter = (values) => {
  const formatted = {
    ...values,
    fromDate: values.fromDate?.format('YYYY-MM-DD')
  };
  // Use formatted
};
```

### Issue: Dropdown not showing options
**Solution**: Ensure correct format
```typescript
// ✓ Correct
options: [{ label: 'Active', value: 'ACTIVE' }]

// ✗ Wrong
options: ['Active', 'INACTIVE']
```

### Issue: Filter not clearing
**Solution**: Component auto-clears. If you need custom logic:
```typescript
<PageFilterPanel
  onClear={() => {
    // Your custom logic
    setCustomState(null);
  }}
/>
```

## Next Steps

1. Browse demo pages to see the component in action
2. Choose a pre-configured filter or create custom fields
3. Integrate into your page
4. Connect to your API
5. Done!

---

Happy filtering! 🎯
