import { useQuery } from '@tanstack/react-query';
import { metricsService } from '@/lib/services';

export const useOverviewMetrics = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'overview', range, startDate, endDate],
    queryFn: () => metricsService.getOverview(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};

export const useSalesByArea = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'sales-by-area', range, startDate, endDate],
    queryFn: () => metricsService.getSalesByArea(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useSalesByCategory = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'sales-by-category', range, startDate, endDate],
    queryFn: () => metricsService.getSalesByCategory(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useSalesByProduct = (
  range: string = 'week',
  startDate?: string,
  endDate?: string,
  limit: number = 25,
  offset: number = 0
) => {
  return useQuery({
    queryKey: ['metrics', 'sales-by-product', range, startDate, endDate, limit, offset],
    queryFn: () => metricsService.getSalesByProduct(range, startDate, endDate, limit, offset),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useSalesByTrend = (
  range: string = 'week',
  startDate?: string,
  endDate?: string,
  limit: number = 25,
  offset: number = 0
) => {
  return useQuery({
    queryKey: ['metrics', 'sales-by-trend', range, startDate, endDate, limit, offset],
    queryFn: () => metricsService.getSalesByTrend(range, startDate, endDate, limit, offset),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useDiscountsRefunds = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'discounts-refunds', range, startDate, endDate],
    queryFn: () => metricsService.getDiscountsRefunds(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useTips = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'tips', range, startDate, endDate],
    queryFn: () => metricsService.getTips(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const usePaymentMethods = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'payment-methods', range, startDate, endDate],
    queryFn: () => metricsService.getPaymentMethods(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useWebsiteAnalytics = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'website-analytics', range, startDate, endDate],
    queryFn: () => metricsService.getWebsiteAnalytics(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useCRMData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string,
  limit: number = 10,
  offset: number = 0,
  search?: string,
  loyaltyTier?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'crm-clients', range, startDate, endDate, limit, offset, search, loyaltyTier],
    queryFn: () => metricsService.getCRMData(range, startDate, endDate, limit, offset, search, loyaltyTier),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useLoyaltyData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'crm-loyalty', range, startDate, endDate],
    queryFn: () => metricsService.getLoyaltyData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useSatisfactionData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'crm-satisfaction', range, startDate, endDate],
    queryFn: () => metricsService.getSatisfactionData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useCustomerServiceData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'crm-customer-service', range, startDate, endDate],
    queryFn: () => metricsService.getCustomerServiceData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useBookingWidgetData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'marketing-booking-widget', range, startDate, endDate],
    queryFn: () => metricsService.getBookingWidgetData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useLaborCostData = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'staff-labor-cost', range, startDate, endDate],
    queryFn: () => metricsService.getLaborCostData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useAbsencesData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'staff-absences', range, startDate, endDate],
    queryFn: () => metricsService.getAbsencesData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useFBPerformanceData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string,
  limit: number = 25,
  offset: number = 0
) => {
  return useQuery({
    queryKey: ['metrics', 'fb-performance', range, startDate, endDate, limit, offset],
    queryFn: () => metricsService.getFBPerformanceData(range, startDate, endDate, limit, offset),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useReservationsData = (
  range: string = 'week',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'reservations-dashboard', range, startDate, endDate],
    queryFn: () => metricsService.getReservationsData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};

export const usePaidMediaData = (
  range: string = 'month',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['metrics', 'marketing-paid-media', range, startDate, endDate],
    queryFn: () => metricsService.getPaidMediaData(range, startDate, endDate),
    refetchInterval: 5 * 60 * 1000,
  });
};
