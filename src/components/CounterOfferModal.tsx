import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Tag,
  TrendingDown,
  Sparkles,
  Smartphone,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';

interface CounterOfferModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitCounterOffer: (productId: string, counterPrice: number, message: string) => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitCounterOffer
}) => {
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [moq, setMoq] = useState<number | ''>(0);
  const [adminNote, setAdminNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setCounterPrice(product.price);
      setMoq(0);
      setAdminNote(`Exclusive MMB App counter offer on ${product.name}. Limited stock available!`);
      setIsSubmitted(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentPrice = product.price;
  const difference = currentPrice - counterPrice;
  const discountPercent = currentPrice > 0 ? Math.round((difference / currentPrice) * 100) : 0;

  const handleApplyDiscountPreset = (percent: number) => {
    const discounted = Math.round(currentPrice * (1 - percent / 100));
    setCounterPrice(discounted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitCounterOffer(product.id, counterPrice, adminNote);
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Close Counter Offer Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Animated Success State */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Counter Offer Released to App!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Counter offer of <strong>₹{counterPrice.toLocaleString('en-IN')}</strong> for <strong>{product.name}</strong> has been successfully dispatched to the MMB Customer App.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold border border-emerald-200">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Live on Customer App · Counter Offer Active</span>
            </div>
          </div>
        ) : (
          /* Counter Offer Form */
          <>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Counter Offer &amp; Release to App
                </h3>
                <p className="text-xs text-slate-500">
                  Set custom app pricing &amp; release counter offer to buyers
                </p>
              </div>
            </div>

            {/* Product Snapshot Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 mb-5 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="object-contain max-h-full max-w-full"
                  />
                ) : (
                  <Tag className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-cyan-700 uppercase bg-cyan-100/70 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Stock: {product.stock} units
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 truncate mt-1">
                  {product.name}
                </h4>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span>Current Store Price:</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Counter Offer Price Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Proposed Counter Offer Price (₹)
                  </label>
                  {difference > 0 && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Save ₹{difference.toLocaleString('en-IN')} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-base font-black text-slate-400">₹</span>
                  <input
                    type="number"
                    value={counterPrice}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCounterPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                    required
                    min={1}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 tabular-nums"
                  />
                </div>

                {/* Quick Discount Presets */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Presets:</span>
                  {[5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyDiscountPreset(pct)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      {pct}% Off
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCounterPrice(product.price)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Minimum Quantity (MOQ) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Minimum Quantity (MOQ)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {moq === 0 || moq === '' ? 'No minimum purchase limit' : `At least ${moq} units required`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={moq}
                      placeholder="0"
                      min={0}
                      max={product.stock}
                      onFocus={(e) => {
                        if (moq === 0) setMoq('');
                        e.target.select();
                      }}
                      onClick={() => {
                        if (moq === 0) setMoq('');
                      }}
                      onBlur={() => {
                        if (moq === '' || isNaN(Number(moq))) setMoq(0);
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setMoq('');
                        } else {
                          const parsed = parseInt(val, 10);
                          setMoq(isNaN(parsed) ? '' : Math.max(0, parsed));
                        }
                      }}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 tabular-nums placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setMoq((m) => Math.max(0, (typeof m === 'number' ? m : 0) - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer"
                      title="Decrease MOQ"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setMoq((m) => (typeof m === 'number' ? m : 0) + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer"
                      title="Increase MOQ"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets for MOQ */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setMoq(0)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                      moq === 0
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    0 (No Minimum)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoq(5)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                      moq === 5
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    5 Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoq(10)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                      moq === 10
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    10 Units
                  </button>
                </div>
              </div>

              {/* Admin Note / Counter Offer Pitch */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  App Message / Counter Offer Terms
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                  placeholder="Special pricing note for customer mobile app..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Counter Offer &amp; Release to App</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
