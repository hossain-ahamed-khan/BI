export type PageId =
  | 'overview'
  | 'sales-revenue'
  | 'sales-area'
  | 'sales-category'
  | 'sales-product'
  | 'sales-trend'
  | 'sales-discounts'
  | 'sales-tips'
  | 'sales-payments'
  | 'crm-clients'
  | 'crm-loyalty'
  | 'crm-satisfaction'
  | 'crm-service'
  | 'reservations'
  | 'mkt-web'
  | 'mkt-booking'
  | 'mkt-paid'
  | 'labour'
  | 'labour-perf'
  | 'fb'
  | 'fb-stock'
  | 'reports';

export type Period = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface NavItem {
  id: PageId;
  label: string;
  icon: string;
  children?: NavItem[];
}
