# PageFilterPanel Component

A flexible, reusable filter panel component for the Casino Banking System application. This component provides consistent filtering capabilities across all pages with support for multiple field types and actions.

## Features

- **Dynamic Field Rendering**: Supports text, select, date, daterange, and number field types
- **Responsive Layout**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Form Validation**: Built-in validation support with Ant Design Form
- **Action Buttons**: Clear Filters, Apply Filters, Export, and Create
- **Loading States**: Visual feedback during data operations
- **Customizable**: Flexible configuration per page

## Installation

The component uses Ant Design components. Ensure you have `antd` installed:

```bash
npm install antd
```

## Usage

### Basic Example

```typescript
import { PageFilterPanel } from '@/components/PageFilterPanel';
import { DEPOSIT_HISTORY_FILTERS } from '@/config/pageFilters';

function MyPage() {
  const handleFilter = (values: Record<string, any>) => {
    console.log('Filter values:', values);
    // Call your API with filter values
  };

  return (
    <PageFilterPanel
      fields={DEPOSIT_HISTORY_FILTERS}
      onFilter={handleFilter}
    />
  );
}
```

### With Export Button

```typescript
<PageFilterPanel
  fields={DEPOSIT_HISTORY_FILTERS}
  onFilter={handleFilter}
  onExport={handleExport}
  showExport
/>
```

### With Create Button

```typescript
<PageFilterPanel
  fields={ACCOUNT_DASHBOARD_FILTERS}
  onFilter={handleFilter}
  onCreate={handleCreate}
  showCreate
  createButtonText="Create Account"
/>
```

### Complete Example

```typescript
import { useState } from 'react';
import { PageFilterPanel } from '@/components/PageFilterPanel';
import type { FilterValues } from '@/types/filter';

function DepositHistoryPage() {
  const [loading, setLoading] = useState(false);

  const filterFields = [
    { name: 'nickname', type: 'text', label: 'Nickname', span: 6 },
    { name: 'status', type: 'select', label: 'Status', options: STATUS_OPTIONS, span: 6 },
    { name: 'fromDate', type: 'date', label: 'From Date', span: 6 },
    { name: 'toDate', type: 'date', label: 'To Date', span: 6 },
  ];

  const handleFilter = (values: FilterValues) => {
    setLoading(true);
    // API call
    fetchData(values).finally(() => setLoading(false));
  };

  const handleExport = () => {
    // Export logic
  };

  return (
    <div>
      <PageFilterPanel
        fields={filterFields}
        onFilter={handleFilter}
        onExport={handleExport}
        showExport
        loading={loading}
        initialValues={{ status: 'ACTIVE' }}
      />
      {/* Your table or content */}
    </div>
  );
}
```

## Component Props

### PageFilterPanelProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fields` | `FilterField[]` | Yes | - | Array of field configurations |
| `onFilter` | `(values: Record<string, any>) => void` | Yes | - | Callback when Apply Filters is clicked |
| `onClear` | `() => void` | No | - | Custom clear handler (defaults to resetting form and calling onFilter with empty values) |
| `onExport` | `() => void` | No | - | Callback when Export button is clicked |
| `onCreate` | `() => void` | No | - | Callback when Create button is clicked |
| `showExport` | `boolean` | No | `false` | Show Export button |
| `showCreate` | `boolean` | No | `false` | Show Create button |
| `createButtonText` | `string` | No | `'Create'` | Text for Create button |
| `exportButtonText` | `string` | No | `'Export'` | Text for Export button |
| `loading` | `boolean` | No | `false` | Show loading state on Apply Filters button |
| `initialValues` | `Record<string, any>` | No | `{}` | Initial form values |

### FilterField Interface

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | `string` | Yes | - | Field name (form field key) |
| `type` | `'text' \| 'select' \| 'date' \| 'daterange' \| 'number'` | Yes | - | Field type |
| `label` | `string` | Yes | - | Field label |
| `placeholder` | `string` | No | Auto-generated | Placeholder text |
| `options` | `Array<{label: string, value: string \| number}>` | No | - | Options for select fields |
| `span` | `number` | No | `6` | Grid column span (24 grid system) |
| `rules` | `Array<any>` | No | - | Ant Design form validation rules |

## Field Types

### Text Input

```typescript
{
  name: 'nickname',
  type: 'text',
  label: 'Nickname',
  placeholder: 'Enter nickname' // optional
}
```

### Select Dropdown

```typescript
{
  name: 'status',
  type: 'select',
  label: 'Status',
  options: [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ]
}
```

### Date Picker

```typescript
{
  name: 'fromDate',
  type: 'date',
  label: 'From Date'
}
```

### Date Range Picker

```typescript
{
  name: 'dateRange',
  type: 'daterange',
  label: 'Date Range'
}
```

### Number Input

```typescript
{
  name: 'amount',
  type: 'number',
  label: 'Amount'
}
```

## Pre-configured Filters

The application includes pre-configured filter sets in `/app/config/pageFilters.ts`:

- `DEPOSIT_HISTORY_FILTERS` - 10 fields
- `WITHDRAWAL_HISTORY_FILTERS` - 11 fields
- `ACCOUNT_DASHBOARD_FILTERS` - 8 fields
- `SUCCESS_RATE_FILTERS` - 3 fields
- `ACTIVITY_LOG_FILTERS` - 5 fields
- `OUT_EXCEPTION_FILTERS` - 8 fields
- `IN_EXCEPTION_FILTERS` - 8 fields
- `PROBLEM_TRANSACTIONS_FILTERS` - 9 fields
- `FAILED_CALLBACKS_FILTERS` - 6 fields
- `BANK_TRANSACTION_FILTERS` - 7 fields
- `MANUAL_MATCH_FILTERS` - 5 fields

### Using Pre-configured Filters

```typescript
import { DEPOSIT_HISTORY_FILTERS } from '@/config/pageFilters';

<PageFilterPanel
  fields={DEPOSIT_HISTORY_FILTERS}
  onFilter={handleFilter}
/>
```

## Filter Options Constants

All dropdown options are centralized in `/app/constants/filterOptions.ts`:

- `DEPOSIT_STATUS_OPTIONS`
- `WITHDRAWAL_STATUS_OPTIONS`
- `ACCOUNT_STATUS_OPTIONS`
- `ACCOUNT_TYPE_OPTIONS`
- `BANK_OPTIONS`
- `TRANSFER_DIRECTION_OPTIONS`
- `CLOSED_STATUS_OPTIONS`
- `DIRECTION_OPTIONS`
- `PROBLEM_TRANSACTION_STATUS_OPTIONS`
- `CALLBACK_TYPE_OPTIONS`
- `CALLBACK_STATUS_OPTIONS`
- `CURRENCY_OPTIONS`

### Using Filter Options

```typescript
import { DEPOSIT_STATUS_OPTIONS } from '@/constants/filterOptions';

const fields = [
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    options: DEPOSIT_STATUS_OPTIONS
  }
];
```

## Responsive Layout

The component uses a 24-column grid system:

- **Desktop (≥1200px)**: Default span of 6 (4 columns)
- **Tablet (768px-1199px)**: Span of 12 (2 columns)
- **Mobile (<768px)**: Span of 24 (1 column)

### Custom Column Spans

```typescript
const fields = [
  { name: 'field1', type: 'text', label: 'Full Width', span: 24 },
  { name: 'field2', type: 'text', label: 'Half Width', span: 12 },
  { name: 'field3', type: 'text', label: 'Third Width', span: 8 },
  { name: 'field4', type: 'text', label: 'Quarter Width', span: 6 },
];
```

## Form Validation

Add validation rules using Ant Design's form rules:

```typescript
const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    rules: [
      { required: true, message: 'Please input email' },
      { type: 'email', message: 'Invalid email format' }
    ]
  },
  {
    name: 'amount',
    type: 'number',
    label: 'Amount',
    rules: [
      { required: true, message: 'Please input amount' },
      { type: 'number', min: 0, message: 'Amount must be positive' }
    ]
  }
];
```

## Styling

The component includes default styling with:
- White background
- 24px padding
- 8px border radius
- Subtle shadow
- 16px bottom margin

### Custom Styling

Wrap the component in a container with custom styles:

```typescript
<div className="custom-filter-panel">
  <PageFilterPanel {...props} />
</div>
```

```css
.custom-filter-panel {
  background: #f5f5f5;
  padding: 16px;
}
```

## Advanced Usage

### Custom Clear Handler

```typescript
const handleClear = () => {
  // Custom logic before clearing
  console.log('Clearing filters');

  // Reset additional state
  setCustomState(null);
};

<PageFilterPanel
  fields={fields}
  onFilter={handleFilter}
  onClear={handleClear}
/>
```

### Initial Values

```typescript
<PageFilterPanel
  fields={fields}
  onFilter={handleFilter}
  initialValues={{
    status: 'ACTIVE',
    fromDate: '2024-01-01',
    accountType: 'CORPORATE'
  }}
/>
```

### Loading State

```typescript
const [loading, setLoading] = useState(false);

const handleFilter = async (values) => {
  setLoading(true);
  try {
    await fetchData(values);
  } finally {
    setLoading(false);
  }
};

<PageFilterPanel
  fields={fields}
  onFilter={handleFilter}
  loading={loading}
/>
```

## File Structure

```
app/
├── components/
│   ├── PageFilterPanel.tsx         # Main component
│   └── PageFilterPanel.README.md   # This file
├── types/
│   └── filter.ts                   # TypeScript types
├── constants/
│   └── filterOptions.ts            # Dropdown options
└── config/
    └── pageFilters.ts              # Pre-configured filters
```

## Browser Support

The component works in all modern browsers supported by Ant Design:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Form labels are properly associated with inputs
- Keyboard navigation is fully supported
- ARIA attributes are handled by Ant Design components

## Performance

- Only changed filter values are included in the callback
- Form validation is optimized by Ant Design
- No unnecessary re-renders

## Troubleshooting

### Filters not applying

Ensure your `onFilter` callback is correctly handling the values:

```typescript
const handleFilter = (values: FilterValues) => {
  console.log('Received:', values); // Debug
  // Your API call
};
```

### Date format issues

Dates are returned as Day.js objects. Convert to desired format:

```typescript
const handleFilter = (values: FilterValues) => {
  const formatted = {
    ...values,
    fromDate: values.fromDate?.format('YYYY-MM-DD'),
    toDate: values.toDate?.format('YYYY-MM-DD'),
  };
  // Use formatted values
};
```

### Options not showing in Select

Ensure options array is correctly formatted:

```typescript
// Correct
options: [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' }
]

// Incorrect
options: ['Active', 'Inactive'] // Won't work
```

## Migration Guide

If you have existing filter forms, migrate them to use PageFilterPanel:

### Before
```typescript
<Form>
  <Form.Item name="nickname" label="Nickname">
    <Input />
  </Form.Item>
  <Form.Item name="status" label="Status">
    <Select options={statusOptions} />
  </Form.Item>
  <Button onClick={handleClear}>Clear</Button>
  <Button onClick={handleSubmit}>Apply</Button>
</Form>
```

### After
```typescript
const fields = [
  { name: 'nickname', type: 'text', label: 'Nickname' },
  { name: 'status', type: 'select', label: 'Status', options: statusOptions }
];

<PageFilterPanel
  fields={fields}
  onFilter={handleFilter}
/>
```

## Contributing

When adding new filter configurations:

1. Add dropdown options to `/app/constants/filterOptions.ts`
2. Create filter field array in `/app/config/pageFilters.ts`
3. Export the configuration
4. Use in your page component

## License

Part of the Casino Banking System application.
