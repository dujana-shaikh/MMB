import React from 'react';
import { CheckCircle2, ArrowDownUp, Package, ArrowRight, X } from 'lucide-react';
import { CustomerOrder } from '../types';

interface OrderConfirmationModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
  onGoToStorefront: () => void;
  onGoToOrders: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onGoToStorefront,
  onGoToOrders
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-fadeIn text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          Electronic Order Placed!
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Order ID: <span className="font-mono font-bold text-slate-800">{order.id}</span>
        </p>

        {/* Auto-Sort Highlight Banner */}
        <div className="my-5 p-3.5 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-300 rounded-2xl text-left">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-cyan-500 text-white rounded-lg shrink-0 mt-0.5">
              <ArrowDownUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-cyan-950 uppercase tracking-wide">
                Automatic Price Sort Applied
              </div>
              <p className="text-xs text-cyan-800 mt-0.5 leading-relaxed">
                As required, when an electronic item is ordered, the entire catalog is <strong>automatically sorted from Lowest to Highest price</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 text-left border border-slate-100 mb-6">
          <div className="flex justify-between text-slate-500">
            <span>Customer:</span>
            <span className="font-bold text-slate-800">{order.customerName}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Items Ordered:</span>
            <span className="font-semibold text-slate-800">{order.items.length} items</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Total Charged:</span>
            <span className="font-black text-slate-900 tabular-nums">₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Inventory Status:</span>
            <span className="font-semibold text-emerald-600">Stock Decremented in Real-Time</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onGoToStorefront();
            }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Catalog (Lowest to Highest)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToOrders();
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Manage in Customer Orders Panel
          </button>
        </div>
      </div>
    </div>
  );
};
