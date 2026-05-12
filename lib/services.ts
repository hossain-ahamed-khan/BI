import apiClient from './api-client';
import { 
  OverviewData, 
  LoginResponse, 
  SalesByAreaData, 
  SalesByCategoryData,
  SalesByProductData,
  SalesByTrendData,
  DiscountsRefundsData,
  TipsData,
  PaymentMethodsData,
  CRMData,
  LoyaltyData,
  SatisfactionData,
  CustomerServiceData,
  BookingWidgetData,
  LaborCostData,
  AbsencesData,
  FBPerformanceData,
  ReservationsData
} from './types/api';

export const metricsService = {
  login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/api/users/login/', credentials);
    return data;
  },

  getReservationsData: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<ReservationsData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<ReservationsData>('/api/metrics/reservations-dashboard/', { params });
    return data;
  },

  getFBPerformanceData: async (
    period: string = 'month',
    startDate?: string,
    endDate?: string,
    limit: number = 25,
    offset: number = 0
  ): Promise<FBPerformanceData> => {
    const params: Record<string, string | number> = { period, limit, offset };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<FBPerformanceData>('/api/metrics/fb-performance/', { params });
    return data;
  },

  getAbsencesData: async (
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<AbsencesData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<AbsencesData>('/api/metrics/absences-analysis/', { params });
    return data;
  },

  getLaborCostData: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<LaborCostData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<LaborCostData>('/api/metrics/labor-cost-dashboard-v2/', { params });
    return data;
  },

  getBookingWidgetData: async (

    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<PaidMediaData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<PaidMediaData>('/api/metrics/paid-media/', { params });
    return data;
  },

  getBookingWidgetData: async (

    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<BookingWidgetData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<BookingWidgetData>('/api/metrics/booking-widget/', { params });
    return data;
  },

  getCRMData: async (

    period: string = 'month',
    startDate?: string,
    endDate?: string,
    limit: number = 10,
    offset: number = 0,
    search?: string,
    loyaltyTier?: string
  ): Promise<CRMData> => {
    const params: Record<string, string | number> = { period, limit, offset };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (search) params.search = search;
    if (loyaltyTier && loyaltyTier !== 'All') params.loyalty_tier = loyaltyTier;

    const { data } = await apiClient.get<CRMData>('/api/metrics/client-crm/', { params });
    return data;
  },

  getLoyaltyData: async (
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<LoyaltyData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<LoyaltyData>('/api/metrics/loyalty/', { params });
    return data;
  },

  getSatisfactionData: async (
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<SatisfactionData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<SatisfactionData>('/api/metrics/guest-satisfaction-analysis/', { params });
    return data;
  },

  getCustomerServiceData: async (
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<CustomerServiceData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<CustomerServiceData>('/api/metrics/customer-service/', { params });
    return data;
  },
  getOverview: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<OverviewData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<OverviewData>('/api/metrics/overview/', { params });
    return data;
  },

  getSalesByArea: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<SalesByAreaData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<SalesByAreaData>('/api/metrics/sales-by-area/', { params });
    return data;
  },

  getSalesByCategory: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<SalesByCategoryData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<SalesByCategoryData>('/api/metrics/sales-by-category/', { params });
    return data;
  },

  getSalesByProduct: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string,
    limit: number = 25,
    offset: number = 0
  ): Promise<SalesByProductData> => {
    const params: Record<string, string | number> = { period, limit, offset };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<SalesByProductData>('/api/metrics/sales-by-product/', { params });
    return data;
  },

  getSalesByTrend: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string,
    limit: number = 25,
    offset: number = 0
  ): Promise<SalesByTrendData> => {
    const params: Record<string, string | number> = { period, limit, offset };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<SalesByTrendData>('/api/metrics/sales-by-trend/', { params });
    return data;
  },

  getDiscountsRefunds: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<DiscountsRefundsData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<DiscountsRefundsData>('/api/metrics/discounts-refunds/', { params });
    return data;
  },

  getTips: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<TipsData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<TipsData>('/api/metrics/tips/', { params });
    return data;
  },

  getPaymentMethods: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<PaymentMethodsData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<PaymentMethodsData>('/api/metrics/payment-methods/', { params });
    return data;
  },

  getWebsiteAnalytics: async (
    period: string = 'week',
    startDate?: string,
    endDate?: string
  ): Promise<WebsiteAnalyticsData> => {
    const params: Record<string, string> = { period };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await apiClient.get<WebsiteAnalyticsData>('/api/metrics/website-analytics/', { params });
    return data;
  },

  // We can add other specific metric endpoints here as needed


  getLaborCost: async () => {
    const { data } = await apiClient.get('/api/metrics/labor-cost-dashboard/');
    return data;
  },
};
