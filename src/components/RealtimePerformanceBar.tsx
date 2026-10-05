import React from 'react';
import { Activity, IndianRupee, PackageCheck, AlertTriangle, ArrowDownUp, Sparkles } from 'lucide-react';
import { StoreMetrics, SortOption } from '../types';

interface RealtimePerformanceBarProps {
  metrics: StoreMetrics;
  currentSort: SortOption;
  onTriggerAutoSortLowestToHighest: () => void;
  onSimulateOrder?: () => void;
  isAutoSorted: boolean;
}

export const RealtimePerformanceBar: React.FC<RealtimePerformanceBarProps> = ({
  metrics,
  currentSort,
  onTriggerAutoSortLowestToHighest,
  onSimulateOrder,
  isAutoSorted
}) => {
  return (
    <div className="w-full px-4 md:px-8 py-3">
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Live Status Pulse */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE STORE ENGINE</span>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
              Real-time telemetry &amp; inventory synchronization
            </div>
          </div>

          {/* Center: Live KPI Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {/* Metric 1: Today Revenue */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Today Sales</div>
                <div className="text-sm sm:text-base font-bold text-white tabular-nums">
                  ₹{metrics.todayRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Metric 2: Today Orders */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <PackageCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Orders Today</div>
                <div className="text-sm sm:text-base font-bold text-white tabular-nums">
                  {metrics.todayOrders} Orders
                </div>
              </div>
            </div>

            {/* Metric 3: Active Shoppers */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Visitors</div>
                <div className="text-sm sm:text-base font-bold text-white tabular-nums">
                  {metrics.activeVisitors} live
                </div>
              </div>
            </div>

            {/* Metric 4: Low Stock Alert */}
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                metrics.lowStockItemsCount > 0
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Low Stock Alert</div>
                <div className={`text-sm sm:text-base font-bold tabular-nums ${
                  metrics.lowStockItemsCount > 0 ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {metrics.lowStockItemsCount} items
                </div>
              </div>
            </div>
          </div>

          {/* Right Action: Auto-Sort Trigger Indicator */}
          <div className="flex items-center gap-2.5 pt-2 lg:pt-0 border-t border-slate-800 lg:border-t-0">
            {/* Sort Status Pill */}
            <button
              onClick={onTriggerAutoSortLowestToHighest}
              title="Click to force-sort catalog lowest to highest price"
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentSort === 'price_asc'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sort: Lowest → Highest {currentSort === 'price_asc' && '(Active)'}</span>
            </button>
          </div>

        </div>

        {/* Auto-Sort Banner Notification */}
        {isAutoSorted && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>Automatic Price Sorting Active:</strong> Electronic products are sorted from <strong>Lowest to Highest price</strong> upon customer order fulfillment.
              </span>
            </div>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Order trigger active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
