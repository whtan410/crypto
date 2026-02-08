/**
 * Filter Type Definitions
 * TypeScript interfaces and types for the filter component
 */

export interface FilterField {
  name: string;
  type: 'text' | 'select' | 'date' | 'daterange' | 'number';
  label: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  span?: number; // Grid column span (default: 6 for 4 columns layout)
  rules?: Array<any>; // Validation rules
}

export interface PageFilterPanelProps {
  fields: FilterField[];
  onFilter: (values: Record<string, any>) => void;
  onClear?: () => void;
  onExport?: () => void;
  onCreate?: () => void;
  showExport?: boolean;
  showCreate?: boolean;
  createButtonText?: string;
  exportButtonText?: string;
  loading?: boolean;
  initialValues?: Record<string, any>;
}

export type FilterValues = Record<string, any>;
