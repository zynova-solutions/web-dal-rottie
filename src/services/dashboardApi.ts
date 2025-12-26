import { adminGet } from './adminApi';

// Backend response types
interface BackendDashboardStats {
  totalSalesToday: number;
  activeOrders: number;
  pendingDeliveries: number;
  popularDish: { de: string; en: string } | string;
  salesTrend: Array<{ date: string; revenue: number }>;
  paymentMix: { Cash: number; Card: number; Online: number };
}

// Frontend types
export interface DashboardStats {
  totalSalesToday: number;
  salesDelta: number;
  activeOrders: number;
  activeOrdersDelta: number;
  pendingDeliveries: number;
  pendingDeliveriesDelta: number;
  popularDish: string;
  popularDishDelta: number;
}

export interface SalesChartData {
  labels: string[];
  data: number[];
}

export interface PaymentMixData {
  cash: number;
  card: number;
  online: number;
}

export interface TopDish {
  name: string;
  count: number;
}

export interface LiveOrder {
  id: string;
  status: string;
  dish: string;
  time: string;
}

/**
 * Fetch dashboard KPI stats from backend
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await adminGet<BackendDashboardStats>('/api/dashboard/admin');
    const data = response.data;
    
    // Extract multilingual popularDish
    const popularDish = typeof data.popularDish === 'object' 
      ? (data.popularDish.en || data.popularDish.de || 'N/A')
      : data.popularDish || 'N/A';
    
    return {
      totalSalesToday: Math.round(data.totalSalesToday || 0),
      salesDelta: 0, // Backend doesn't provide delta yet
      activeOrders: data.activeOrders || 0,
      activeOrdersDelta: 0,
      pendingDeliveries: data.pendingDeliveries || 0,
      pendingDeliveriesDelta: 0,
      popularDish,
      popularDishDelta: 0,
    };
  } catch {
    return {
      totalSalesToday: 0,
      salesDelta: 0,
      activeOrders: 0,
      activeOrdersDelta: 0,
      pendingDeliveries: 0,
      pendingDeliveriesDelta: 0,
      popularDish: 'N/A',
      popularDishDelta: 0,
    };
  }
}

/**
 * Fetch sales chart data for the last 7 days from backend
 */
export async function fetchSalesChartData(): Promise<SalesChartData> {
  try {
    const response = await adminGet<BackendDashboardStats>('/api/dashboard/admin');
    const salesTrend = response.data.salesTrend || [];
    
    const labels: string[] = [];
    const data: number[] = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    salesTrend.forEach(item => {
      const date = new Date(item.date);
      labels.push(daysOfWeek[date.getDay()]);
      data.push(Math.round(item.revenue));
    });
    
    return { labels, data };
  } catch {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [0, 0, 0, 0, 0, 0, 0],
    };
  }
}

/**
 * Fetch payment method mix from backend
 */
export async function fetchPaymentMixData(): Promise<PaymentMixData> {
  try {
    const response = await adminGet<BackendDashboardStats>('/api/dashboard/admin');
    const mix = response.data.paymentMix || { Cash: 0, Card: 0, Online: 0 };
    
    // Convert to lowercase property names
    return {
      cash: mix.Cash || 0,
      card: mix.Card || 0,
      online: mix.Online || 0,
    };
  } catch {
    return { cash: 0, card: 0, online: 0 };
  }
}

/**
 * Fetch live/recent orders from backend dashboard
 * Note: This endpoint is not available in the current API response
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchLiveOrders(_limit: number = 20): Promise<LiveOrder[]> {
  // The current API doesn't provide live orders data
  // Return empty array for now
  return [];
}
