"use client";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { 
  fetchDashboardStats, 
  fetchSalesChartData, 
  fetchPaymentMixData
} from '@/services/dashboardApi';

// Register Chart.js elements for react-chartjs-2 v4+
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface KPI {
  label: string;
  value: number | string;
  delta: number;
  tooltip: string;
  onClick: () => void;
}

export default function AdminDashboard() {
	const [loading, setLoading] = useState(true);
	const [kpis, setKpis] = useState<KPI[]>([]);
  const [salesData, setSalesData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number }[] } | null>(null);
  const [paymentData, setPaymentData] = useState<{ labels: string[]; datasets: { data: number[]; backgroundColor: string[] }[] } | null>(null);

	useEffect(() => {
		loadDashboardData();
	}, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [stats, salesChart, paymentMix] = await Promise.all([
        fetchDashboardStats(),
        fetchSalesChartData(),
        fetchPaymentMixData()
      ]);

      // Build KPI cards
      const kpiData: KPI[] = [
        { 
          label: "Total Sales Today", 
          value: `€${stats.totalSalesToday}`, 
          delta: stats.salesDelta, 
          tooltip: "Total sales today", 
          onClick: () => alert('Go to Sales List') 
        },
        { 
          label: "Active Orders", 
          value: stats.activeOrders, 
          delta: stats.activeOrdersDelta, 
          tooltip: "Active orders", 
          onClick: () => alert('Go to Active Orders') 
        },
        { 
          label: "Pending Deliveries", 
          value: stats.pendingDeliveries, 
          delta: stats.pendingDeliveriesDelta, 
          tooltip: "Pending deliveries", 
          onClick: () => alert('Go to Pending Deliveries') 
        },
        { 
          label: "Popular Dish", 
          value: stats.popularDish, 
          delta: 0, 
          tooltip: "Most ordered dish today", 
          onClick: () => alert('Go to Dishes') 
        },
      ];

      setKpis(kpiData);

      // Build chart data
      setSalesData({
        labels: salesChart.labels,
        datasets: [
          {
            label: "Sales (€)",
            data: salesChart.data,
            borderColor: "#7a1313",
            backgroundColor: "rgba(122,19,19,0.1)",
            tension: 0.4,
          },
        ],
      });

      setPaymentData({
        labels: ["Cash", "Card", "Online"],
        datasets: [
          {
            data: [paymentMix.cash, paymentMix.card, paymentMix.online],
            backgroundColor: ["#7a1313", "#fbbf24", "#10b981"],
          },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setLoading(false);
    }
  }

  const salesOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const paymentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const } },
  };

	return (
		<div className="p-4 md:p-8">
			<h1 className="text-2xl font-bold mb-6">Dashboard</h1>
			{/* KPI Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{kpis.map((kpi) => (
					<div
						key={kpi.label}
						className="bg-white rounded shadow p-5 flex flex-col items-start cursor-pointer hover:shadow-lg transition relative"
						title={kpi.tooltip}
						onClick={kpi.onClick}
					>
						<span className="text-gray-500 text-xs mb-1">{kpi.label}</span>
						{loading ? (
							<div className="h-7 w-20 bg-gray-200 animate-pulse rounded mb-1" />
						) : (
							<span className="text-2xl font-bold">{kpi.value}</span>
						)}
						{/* Delta badge */}
						{!loading && kpi.delta !== 0 && (
							<span
								className={`text-xs rounded px-2 py-0.5 mt-1 ${
                  kpi.delta >= 0 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-red-600 bg-red-50'
                }`}
								title="Delta vs yesterday"
							>
								{kpi.delta >= 0 ? "+" : ""}
								{kpi.delta}%
							</span>
						)}
					</div>
				))}
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				<div className="bg-white rounded shadow p-4 col-span-2 min-h-[300px] flex flex-col">
					<div className="flex justify-between items-center mb-2">
						<span className="font-semibold">Sales (Last 7 Days)</span>
					</div>
					<div className="flex-1 flex items-center justify-center text-gray-400 w-full min-h-[250px]">
						{loading || !salesData ? (
							<div className="h-32 w-full bg-gray-100 animate-pulse rounded" />
						) : (
							<Line data={salesData} options={salesOptions} height={200} width={600} />
						)}
					</div>
				</div>
				<div className="flex flex-col gap-6">
					<div className="bg-white rounded shadow p-4 min-h-[140px] flex-1">
						<span className="font-semibold">Payment Mix</span>
						<div className="flex-1 flex items-center justify-center text-gray-400 mt-2 min-h-[120px]" style={{height: 180, maxHeight: 180}}>
							{loading || !paymentData ? (
								<div className="h-20 w-20 bg-gray-100 animate-pulse rounded-full" />
							) : (
								<Pie data={paymentData} options={paymentOptions} height={160} width={160} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
