import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Smartphone
} from 'lucide-react';
import { Product, ProductVariantItem } from '../types';

interface CustomerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  selectedVariant?: ProductVariantItem | null;
  selectedSubVariant?: string | null;
  initialMode?: 'call' | 'message';
}

export const CustomerContactModal: React.FC<CustomerContactModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedVariant,
  selectedSubVariant,
  initialMode = 'call'
}) => {
  const [activeTab, setActiveTab] = useState<'call' | 'message'>(initialMode);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Sync mode whenever modal opens with initialMode
  React.useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen || !product) return null;

  const contact = product.customerContact || {
    name: 'Customer Inquiry',
    phone: '+91 98201 98765',
    email: 'buyer@mumbaimobile.in',
    city: 'Mumbai, Maharashtra',
    lastInquiry: 'Direct inquiry on Mumbai Mobile Bazzer'
  };

  const currentPrice = selectedVariant?.price ?? product.price;
  const variantName = selectedVariant?.name ?? (product.variants?.[0]?.name || 'Standard');
  const subVariantName = selectedSubVariant ?? (product.subVariants?.[0] || 'Default');

  const defaultMessage = `Hello ${contact.name}, this is Mumbai Mobile Bazzer regarding your inquiry for ${product.name} (${variantName} - ${subVariantName}) at ₹${currentPrice.toLocaleString('en-IN')}. We have stock available ready for fast Mumbai delivery. Would you like to confirm your order?`;

  const [customMessage, setCustomMessage] = useState(defaultMessage);

  // Reset custom message when product changes
  React.useEffect(() => {
    setCustomMessage(
      `Hello ${contact.name}, this is Mumbai Mobile Bazzer regarding your inquiry for ${product.name} (${variantName} - ${subVariantName}) at ₹${currentPrice.toLocaleString('en-IN')}. We have stock available ready for fast Mumbai delivery. Would you like to confirm your order?`
    );
  }, [product, selectedVariant, selectedSubVariant, contact.name]);

  const cleanPhone = contact.phone.replace(/[^0-9]/g, '');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(contact.phone);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
  const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(customMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Strip */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
              activeTab === 'call' ? 'bg-emerald-500' : 'bg-cyan-500'
            }`}>
              {activeTab === 'call' ? (
                <Phone className="w-5 h-5 text-white" />
              ) : (
                <MessageSquare className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                {activeTab === 'call' ? 'Customer Call Dial' : 'Customer Message Portal'}
              </h3>
              <p className="text-xs text-slate-300">
                Mumbai Mobile Bazzer · Verified Customer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('call')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'call'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call Customer ({contact.phone})</span>
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'message'
                ? 'bg-white text-cyan-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
            <span>Send Message</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Product & Variant Context Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3.5">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-2xs"
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 uppercase">
                {product.brand} · {product.category}
              </span>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate mt-1">
                {product.name}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Variant: <strong className="text-cyan-700">{variantName}</strong>
                </span>
                <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Color: <strong className="text-slate-900">{subVariantName}</strong>
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tabular-nums">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Profile Box */}
          <div className="bg-white border-2 border-emerald-100 rounded-2xl p-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Customer Contact
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {contact.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.city || 'Mumbai, MH'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Buyer</span>
              </div>
            </div>

            {/* Prominent Phone Number Display */}
            <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent rounded-xl border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Customer Phone Number
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 tracking-wide font-mono tabular-nums">
                    {contact.phone}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyPhone}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                {copiedNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {contact.lastInquiry && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Note: {contact.lastInquiry}</span>
              </div>
            )}
          </div>

          {/* Tab Specific Actions */}
          {activeTab === 'call' ? (
            <div className="space-y-3">
              <a
                href={`tel:${cleanPhone}`}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
              >
                <Phone className="w-5 h-5" />
                <span>Call Now ({contact.phone})</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopyPhone}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNumber ? 'Number Copied!' : 'Copy Number'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('message')}
                  className="py-2.5 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Switch to Message</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Message Content (Editable)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-medium"
                />
              </div>

              {/* Message Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp ({contact.phone})</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a
                  href={smsUrl}
                  className="py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Direct SMS</span>
                </a>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleCopyMessage}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Message Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Message Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('call')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call {contact.name} instead</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
