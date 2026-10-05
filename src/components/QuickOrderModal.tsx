import React, { useState } from 'react';
import { X, Zap, ShieldCheck, ShoppingBag, ArrowDownUp } from 'lucide-react';
import { Product } from '../types';

interface QuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirmOrder: (
    product: Product,
    quantity: number,
    customerName: string,
    customerEmail: string
  ) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  product,
  onClose,
  onConfirmOrder
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('Jordan Lee');
  const [customerEmail, setCustomerEmail] = useState('jordan.lee@example.com');

  const total = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmOrder(product, quantity, customerName, customerEmail);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Customer Electronic Order
            </h3>
            <p className="text-xs text-slate-500">
              Immediate order placement &amp; catalog auto-sort
            </p>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
          <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="object-contain max-h-full max-w-full"
              />
            ) : (
              <ShoppingBag className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-cyan-700 uppercase bg-cyan-100/60 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <h4 className="font-bold text-xs text-slate-900 truncate mt-1">
              {product.name}
            </h4>
            <div className="text-sm font-extrabold text-slate-900 tabular-nums mt-0.5">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quantity Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
              Quantity (Stock Available: {product.stock})
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 font-bold rounded-l-xl cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-sm font-extrabold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 font-bold rounded-r-xl cursor-pointer"
                >
                  +
                </button>
              </div>
              <div className="text-xs text-slate-500">
                Total: <span className="font-extrabold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
              Customer Full Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
              Customer Email Address
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          {/* Policy Notice: Auto-Sorting lowest to highest */}
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center gap-2 text-cyan-900 text-[11px] leading-tight">
            <ArrowDownUp className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>
              <strong>Rule Trigger:</strong> Placing this order will automatically rearrange electronic products from <strong>Lowest to Highest price</strong>.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Confirm Order &amp; Auto-Sort Products</span>
          </button>
        </form>
      </div>
    </div>
  );
};
