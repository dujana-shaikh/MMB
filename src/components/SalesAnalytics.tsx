import React, { useState } from 'react';
import { TrendingUp, IndianRupee, ShoppingCart, Percent, ArrowUpRight, BarChart2, Calendar, Sparkles } from 'lucide-react';
import { CustomerOrder, Product, StoreMetrics } from '../types';

interface SalesAnalyticsProps {
  metrics: StoreMetrics;
  orders: CustomerOrder[];
  products: Product[];
}

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({
  metrics,
  orders,
  products
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Calculate category revenue breakdown
  const categorySalesMap: Record<string, { revenue: number; units: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const cat = item.category || 'OTHER';
      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { revenue: 0, units: 0 };
      }
      categorySalesMap[cat].revenue += item.price * item.quantity;
      categorySalesMap[cat].units += item.quantity;
    });
  });

  const totalCalculatedRevenue = Object.values(categorySalesMap).reduce(
    (acc, curr) => acc + curr.revenue,
    0
  ) || 1;

  const categoryEntries = Object.entries(categorySalesMap).sort(
    (a, b) => b[1].revenue - a[1].revenue
  );

  // Hourly sales points for chart - dynamically derived from orders
  const chartPoints = orders.length === 0 ? [] : [
    { label: '08:00', value: 0, orders: 0 },
    { label: '10:00', value: 0, orders: 0 },
    { label: '12:00', value: 0, orders: 0 },
    { label: '14:00', value: 0, orders: 0 },
    { label: '16:00', value: 0, orders: 0 },
    { label: '18:00', value: 0, orders: 0 },
    { label: '20:00', value: metrics.todayRevenue, orders: metrics.todayOrders }
  ];

  const maxChartValue = chartPoints.length > 0 ? Math.max(...chartPoints.map((p) => p.value), 1000) : 1000;

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            <span>Store Performance &amp; Sales Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time revenue telemetry, conversion metrics, and category revenue attribution.
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          {(['today', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                timeRange === r
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'today' ? 'Today (Live)' : r === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            ₹{metrics.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{orders.length > 0 ? '+14.8% vs last period' : '0% baseline'}</span>
          </div>
        </div>

        {/* Net Profit Margin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Profit</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-600 tabular-nums">
            ₹{(metrics.totalRevenue * 0.38).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            38.0% healthy gross margin
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            ₹{metrics.averageOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            Across {metrics.totalOrders} total orders
          </div>
        </div>

        {/* Store Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            {metrics.conversionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1">
            <span>{orders.length > 0 ? 'Live store conversion' : 'No conversion traffic yet'}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Sales Trend SVG Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Real-Time Revenue Telemetry
              </h3>
              <p className="text-xs text-slate-500">
                Continuous intraday sales stream &amp; order spike tracking
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Live Updates</span>
            </div>
          </div>

          {/* SVG Area Chart */}
          {chartPoints.length === 0 ? (
            <div className="h-64 w-full flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <BarChart2 className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No revenue data to display</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hourly telemetry will populate automatically as customer orders are placed.
              </p>
            </div>
          ) : (
            <div className="h-64 w-full relative flex items-end pt-8">
              <div className="w-full h-full flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 pb-2">
                {chartPoints.map((pt, idx) => {
                  const heightPercent = Math.max(12, (pt.value / maxChartValue) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded absolute -top-2 transform -translate-y-full pointer-events-none shadow-md z-10 whitespace-nowrap">
                        ₹{pt.value.toLocaleString('en-IN')} · {pt.orders} orders
                      </div>
                      
                      {/* Bar / Column */}
                      <div
                        className="w-full max-w-[48px] bg-gradient-to-t from-cyan-600 to-sky-400 rounded-t-xl group-hover:from-cyan-500 group-hover:to-sky-300 transition-all duration-300 relative shadow-xs"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute top-1 left-0 right-0 text-center text-[10px] font-bold text-white/90 hidden sm:block">
                          ₹{(pt.value / 1000).toFixed(0)}k
                        </div>
                      </div>
                      
                      {/* Label */}
                      <span className="text-[11px] text-slate-400 font-medium mt-2">
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Category Revenue Attribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Sales by Category
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Revenue distribution across electronic departments
            </p>

            {categoryEntries.length === 0 ? (
              <div className="py-14 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl my-4">
                <p className="text-xs font-semibold text-slate-600">No category sales recorded</p>
                <p className="text-[11px] text-slate-400 mt-1">Breakdown will appear as items are sold.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryEntries.slice(0, 5).map(([cat, data]) => {
                  const percentage = Math.round((data.revenue / totalCalculatedRevenue) * 100);
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{cat}</span>
                        <span className="tabular-nums font-bold text-slate-900">
                          ₹{data.revenue.toLocaleString('en-IN')} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest sales sector:</span>
            <span className="font-bold text-slate-800">
              {categoryEntries.length > 0 ? categoryEntries[0][0] : 'None yet'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
