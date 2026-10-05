import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Zap } from 'lucide-react';
import { OrderItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (customerName: string, customerEmail: string, shippingAddress: string, discountCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [customerEmail, setCustomerEmail] = useState('alex.m@example.com');
  const [shippingAddress, setShippingAddress] = useState('500 Tech Blvd, Suite 400, Seattle, WA');
  const [discountCode, setDiscountCode] = useState('ONTAS5');
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isDiscountValid = discountCode.trim().toUpperCase() === 'ONTAS5';
  const discountAmount = isDiscountValid ? subtotal * 0.05 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    onCheckout(customerName, customerEmail, shippingAddress, discountCode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-600" />
              <h2 className="text-lg font-black text-slate-900">
                Customer Shopping Cart
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
                {cartItems.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold text-slate-600">Your cart is currently empty</p>
                <p className="text-xs text-slate-400 mt-1">Browse the electronic catalog to add items</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80"
                >
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="object-contain max-h-full max-w-full"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')} each
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, -1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-l cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-r cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-xs text-slate-900 tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Promo Code Input */}
            {cartItems.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Coupon Code (e.g. ONTAS5)"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                    />
                  </div>
                  {isDiscountValid && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      5% Applied
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Footer Form */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              {/* Customer Inputs */}
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Customer Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (ONTAS5 - 5%)</span>
                    <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Auto-Sort Note */}
              <div className="text-[11px] text-cyan-800 bg-cyan-50 p-2.5 rounded-xl border border-cyan-200 flex items-center gap-1.5 leading-snug">
                <Zap className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>
                  <strong>Store Policy Trigger:</strong> Completing this electronic order automatically sorts the store catalog from lowest to highest price.
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleSubmitCheckout}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 active:scale-98 text-white text-xs font-extrabold tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Complete Customer Order &amp; Auto-Sort</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
