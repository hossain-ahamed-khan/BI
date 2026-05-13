export interface MetricValue {
  value: number;
  growth_ly?: number;
  growth_lw?: number;
  ytd?: number;
  target?: number;
  trend?: ProductTrendPoint[] | number[];
}

export interface RateMetric {
  count: number;
  rate: number;
}

export interface Summary {
  gross_revenue: MetricValue;
  net_revenue: MetricValue;
  total_covers: MetricValue;
  cancellation_rate: RateMetric;
  no_show_rate: RateMetric;
  labor_cost_perc: MetricValue;
  fb_cost_rate: MetricValue;
  customer_satisfaction: number;
  returning_guests: {
    value: string;
    growth_ly: number;
  };
}

export interface RevenueEvolution {
  date: string;
  Total: number;
  Day: number;
  Night: number;
}

export interface AreaPerformance {
  area: string;
  revenue: number;
  order_count: number;
  avg_order_value: number;
  growth_ly: number;
  perc_of_total: number;
}

export interface PaymentTrend {
  date: string;
  value: number;
}

export interface PaymentMetric {
  value: number;
  percentage_of_total?: number;
  growth_ly?: number;
  trend: PaymentTrend[];
}

export interface PaymentMethods {
  total_received: PaymentMetric;
  card_payments: PaymentMetric;
  cash_payments: PaymentMetric;
  other_payments: PaymentMetric;
}

export interface DataSource {
  name: string;
  status: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_superuser: boolean;
  is_staff: boolean;
}

export interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface OverviewData {
  summary: Summary;
  revenue_evolution: RevenueEvolution[];
  performance_by_area: AreaPerformance[];
  payment_methods: PaymentMethods;
  data_sources: DataSource[];
  start_date: string;
  end_date: string;
}

export interface AreaTrend {
  period: string;
  gross_revenue: number;
  net_revenue: number;
  discounts: number;
  covers: number;
  avg_ticket: number;
}

export interface AreaDataRow {
  area: string;
  gross_revenue: number;
  gross_revenue_ly_growth: number;
  net_revenue: number;
  net_revenue_ly_growth: number;
  discounts: number;
  discounts_ly_growth: number;
  covers: number;
  covers_ly_growth: number;
  avg_ticket: number;
  avg_ticket_ly_growth: number;
  returning_guests_perc: number;
  perc_of_total: number;
  trends: AreaTrend[];
}

export interface SalesByAreaData {
  summary: {
    total_net_revenue: number;
    total_orders: number;
    areas_tracked: number;
  };
  chart: {
    areas: string[];
    data: any[];
  };
  table: AreaDataRow[];
  start_date: string;
  end_date: string;
}

export interface CategoryProduct {
  name: string;
  qty: number;
  gross_revenue: number;
  net_revenue: number;
  perc_of_total: number;
}

export interface CategoryTableItem {
  category: string;
  products_sold: number;
  gross_revenue: number;
  net_revenue: number;
  perc_of_total: number;
  top_products: CategoryProduct[];
}

export interface SalesByCategoryData {
  chart: {
    categories: string[];
    data: any[];
  };
  table: {
    data: CategoryTableItem[];
    total_count: number;
    limit: number;
    offset: number;
  };
  summary: {
    total_net_revenue: number;
    category_count: number;
  };
  start_date: string;
  end_date: string;
}

export interface ProductTrendPoint {
  date: string;
  value: number;
}

export interface ProductSummaryMetric {
  value: number | string;
  growth_lw?: number;
  growth_lm?: number;
  growth_ly?: number;
  percentage?: number;
  percentage_of_total?: number;
  name?: string;
  trend: ProductTrendPoint[] | number[];
}

export interface ProductTableItem {
  name: string;
  category: string;
  qty: number;
  gross_revenue: number;
  net_revenue: number;
}

export interface SalesByProductData {
  summary: {
    total_skus: ProductSummaryMetric;
    units_sold: ProductSummaryMetric;
    top_category: ProductSummaryMetric;
    avg_price_unit: ProductSummaryMetric;
  };
  table: {
    data: ProductTableItem[];
    total_count: number;
    limit: number;
    offset: number;
  };
  start_date: string;
  end_date: string;
}

export interface TrendSummaryMetric extends ProductSummaryMetric {
  food_perc?: number;
  drink_perc?: number;
}

export interface TopListItem {
  name: string;
  product: string;
  qty: number;
}

export interface ParetoItem {
  name: string;
  product: string;
  category: string;
  qty: number;
  gross_revenue: number;
  perc_of_total: number;
  cumulative_perc: number;
}

export interface SalesByTrendData {
  summary: {
    food_sales: TrendSummaryMetric;
    drink_sales: TrendSummaryMetric;
    food_drink_split: TrendSummaryMetric;
    avg_dish_price: TrendSummaryMetric;
  };
  top_10: {
    dishes: TopListItem[];
    cocktails: TopListItem[];
    wines: TopListItem[];
  };
  pareto_table: {
    data: ParetoItem[];
    total_count: number;
    limit: number;
    offset: number;
  };
  start_date: string;
  end_date: string;
}

export interface DetailTableItem {
  name: string;
  type: string;
  times_applied: number;
  amount: number;
}

export interface DiscountsRefundsData {
  summary: {
    total_discounts: ProductSummaryMetric;
    total_refunds: ProductSummaryMetric;
    total_impact: ProductSummaryMetric;
  };
  detail_table: DetailTableItem[];
  start_date: string;
  end_date: string;
}

export interface AreaTipItem {
  area: string;
  total_tips: number;
  avg_per_order: number;
  tip_rate: number;
}

export interface BreakdownItem {
  label: string;
  value: number;
  percentage: number;
}

export interface TipsData {
  summary: {
    total_tips: ProductSummaryMetric;
    avg_tip_cover: ProductSummaryMetric;
    tip_rate: ProductSummaryMetric;
    cash_tips: ProductSummaryMetric;
  };
  tips_by_area: AreaTipItem[];
  breakdown: {
    by_payment: BreakdownItem[];
    by_shift: BreakdownItem[];
  };
  start_date: string;
  end_date: string;
}

export interface CardBrandDetail {
  brand: string;
  amount: number;
  percentage: number;
}

export interface CRMClient {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  company: string;
  visits: number;
  total_spend: number;
  spend_per_visit: number;
  loyalty_tier: string;
  tags: string[];
}

export interface CRMData {
  summary: {
    total_clients: ProductSummaryMetric;
    returning_guests: TrendSummaryMetric;
    avg_lifetime_spend: ProductSummaryMetric;
    new_this_month: ProductSummaryMetric & { growth?: number };
    res_with_spend: {
      percentage: number;
      count: number;
      total: number;
      trend: ProductTrendPoint[];
    };
  };
  table: {
    data: CRMClient[];
    total_count: number;
    limit: number;
    offset: number;
  };
  start_date: string;
  end_date: string;
}

export interface LoyaltyTierMovement {
  guest: string;
  from: string;
  to: string;
  date: string;
  driver: string;
}

export interface AtRiskLoyalClient {
  guest: string;
  tier: string;
  last_visit: string;
  days_inactive: number;
  avg_frequency: string;
  total_spend: number;
}

export interface LoyaltyEvolutionPoint {
  month: string;
  Loyal: number;
  VIP: number;
  Super: number;
  "At Risk": number;
}

export interface LoyaltyData {
  summary: {
    total_loyal_plus: ProductSummaryMetric;
    new_promotions: ProductSummaryMetric;
    at_risk: ProductSummaryMetric;
    conversions_lm: ProductSummaryMetric;
  };
  funnel: { label: string; value: number }[];
  tier_movements: LoyaltyTierMovement[];
  at_risk_table: AtRiskLoyalClient[];
  evolution: LoyaltyEvolutionPoint[];
  start_date: string;
  end_date: string;
}

export interface ReviewItem {
  guest: string;
  rating: number;
  content: string;
  date: string;
  area: string;
  source: string;
  status: string;
  matched_id: string;
}

export interface SatisfactionData {
  summary: {
    avg_rating: number;
    star_distribution: Record<string, number>;
    total_reviews: number;
    negative_reviews: {
      count: number;
      percentage: number;
    };
    response_rate: number;
  };
  concepts: {
    food: number;
    service: number;
    ambience: number;
    drinks: number;
  };
  top_issues: { name: string; count: number }[];
  reviews: ReviewItem[];
  countries: { country: string; total: number; negative: number; rate: number }[];
  negative_food_match: any[];
  start_date: string;
  end_date: string;
}

export interface PaidMediaChannel {
  channel: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: string;
  cpc: number;
  conv: number;
  cpa: number;
  roas: number;
}

export interface PaidMediaData {
  summary: {
    total_ad_spend: ProductSummaryMetric;
    total_conversions: ProductSummaryMetric;
    blended_cpa: { value: number };
    revenue_generated: { value: number; roas: number };
    blended_ctr: { value: string };
  };
  channel_performance: PaidMediaChannel[];
  start_date: string;
  end_date: string;
}

export interface WebsiteAnalyticsData {

  summary: {
    site_visits: ProductSummaryMetric & { users_info: string };
    unique_users: ProductSummaryMetric & { new_users_info: string };
    avg_time_on_site: ProductSummaryMetric;
    bounce_rate: ProductSummaryMetric;
    pages_per_session: ProductSummaryMetric;
  };
  charts: {
    visits_users: { date: string; sessions: number; users: number }[];
    time_bounce: { date: string; avg_time: number; bounce_rate: number }[];
  };
  breakdowns: {
    by_country: { label: string; visits: number; perc: number; avg_time: string }[];
    by_city: { label: string; visits: number; perc: number; avg_time: string }[];
    by_language: { label: string; visits: number; perc: number; avg_time: string }[];
  };
  start_date: string;
  end_date: string;
}

export interface CustomerServiceChannel {
  channel: string;
  total_successful_interactions: number;
  csat_score: number;
  top_topic: string;
  avg_response_time: string | null;
  missed_interactions: number | null;
  resolution_rate: number | null;
}

export interface CustomerServiceData {
  summary: {
    overall_csat: number;
    total_interactions: number;
    total_open_tickets: number | null;
    avg_response_time: string | null;
  };
  channels: CustomerServiceChannel[];
  start_date: string;
  end_date: string;
}

export interface BookingWidgetTrend {
  date: string;
  searches: number;
  availability_rate: number;
  bookings: number;
}

export interface BookingWidgetData {
  summary: {
    total_reservations: number;
    widget_searches: number;
    availability_rate: number;
    avg_advance_days: number;
    avg_party_size: number;
  };
  trends: BookingWidgetTrend[];
  party_size_demand: { size: string; searches: number; avail_rate: number }[];
  lead_time_demand: { days: string; searches: number; avail_rate: number }[];
  breakdowns: {
    by_country: { label: string; value: number; perc: number }[];
    by_source: { label: string; value: number; perc: number }[];
  };
  start_date: string;
  end_date: string;
}

export interface LaborIndicator {
  date: string;
  revenue: number;
  staff: number;
  hours_worked: number;
  labor_cost: number;
  lc_perc: number;
  productivity: number;
}

export interface DeptBreakdown {
  department: string;
  staff: number;
  hours: number;
  cost: number;
  ms_perc: number;
}

export interface LaborEvolutionPoint {
  month: string;
  revenue: number;
  labor_cost: number;
  lc_perc: number;
}

export interface LaborCostData {
  summary: {
    labor_cost: MetricValue;
    labor_cost_perc: MetricValue;
    hours_worked: MetricValue;
    total_headcount: MetricValue & { status: string };
  };
  indicators: LaborIndicator[];
  dept_breakdown: DeptBreakdown[];
  evolution: LaborEvolutionPoint[];
  start_date: string;
  end_date: string;
}

export interface AbsencesSummary {
  absenteeism_rate: MetricValue & { label: string };
  cost_bajas: MetricValue & { label: string };
  active_sick_leaves: MetricValue;
  accum_overtime: MetricValue;
  punctuality_rate: MetricValue;
}

export interface AbsenceTracking {
  employee: string;
  department: string;
  type: string;
  start_date: string;
  days: number;
  hs: number;
  cost: number;
  status: string;
}

export interface IndividualPerformance {
  employee: string;
  dept: string;
  hs_contrato: number;
  hs_trabajadas: number;
  hs_extra: number;
  productivity: number;
  punctuality: string;
  cost: number;
}

export interface AbsencesData {
  summary: AbsencesSummary;
  paid_absence_tracking: AbsenceTracking[];
  individual_performance: IndividualPerformance[];
  shift_ranking: { label: string; value: number }[];
  evolution_chart: { label: string; values: Record<string, number> }[];
  start_date: string;
  end_date: string;
}

export interface FBTopItem {
  name: string;
  qty: number;
  rev: number;
  vs_ly?: number;
}

export interface FBParetoItem {
  name: string;
  category: string;
  qty: number;
  gross_revenue: number;
  net_revenue: number;
  perc_of_total: number;
  cumulative_perc: number;
}

export interface FBPerformanceData {
  summary: {
    food_cost_perc: MetricValue;
    drink_cost_perc: MetricValue;
    stock_value: ProductSummaryMetric;
    purchases_month: ProductSummaryMetric;
  };
  top_10: {
    dishes: FBTopItem[];
    cocktails: FBTopItem[];
    wines: FBTopItem[];
  };
  pareto_table: {
    data: FBParetoItem[];
    total_count: number;
    limit: number;
    offset: number;
  };
  start_date: string;
  end_date: string;
}

export interface PartySizeRow {
  pax: string | number;
  reservations: number;
  perc: number;
  covers: number;
  avg_spend: number;
  vs_ly: number;
}

export interface ReservationsData {
  summary: {
    total_reservations: ProductSummaryMetric;
    no_shows: RateMetric & { trend: ProductTrendPoint[] };
    cancellations: RateMetric & { trend: ProductTrendPoint[] };
    avg_party_size: ProductSummaryMetric;
  };
  bookings_by_source: { label: string; value: number; perc: number }[];
  bookings_by_day_of_week: { day: string; value: number }[];
  peak_hours_chart: { hour: number; count: number }[];
  top_countries: { country: string; count: number; perc: number }[];
  party_size_table: {
    rows: PartySizeRow[];
    total: {
      reservations: number;
      covers: number;
      avg_spend: number;
    };
  };
  start_date: string;
  end_date: string;
}

export interface PaymentMethodsData {
  summary: {
    total_received: ProductSummaryMetric;
    card_payments: ProductSummaryMetric;
    cash_payments: ProductSummaryMetric;
    other_payments: ProductSummaryMetric;
  };
  breakdown_chart: BreakdownItem[];
  card_type_detail: {
    total: number;
    brands: CardBrandDetail[];
  };
  start_date: string;
  end_date: string;
}
