import React, { useState } from 'react';
import { CustomerOrder, OrderStatus } from '../types';
import { ShoppingBag, Truck, CheckCircle2, Clock, Eye, Printer, X, DollarSign, Filter, Search, Zap } from 'lucide-react';

interface CustomerOrdersManagerProps {
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onSimulateOrder: () => void;
}

export const CustomerOrdersManager: React.FC<CustomerOrdersManagerProps> = ({
  orders,
  onUpdateOrderStatus,
  onSimulateOrder
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CustomerOrder | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'ALL' || ord.orderStatus === filterStatus;
    const matchesSearch =
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500 animate-spin" />
            Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
            <Truck className="w-3 h-3 text-sky-600" />
            Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-cyan-600" />
            <span>Customer Orders &amp; Fulfillment</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track customer purchases, fulfillment status, payment confirmation, and dispatch.
          </p>
        </div>

        <button
          onClick={onSimulateOrder}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Simulate New Customer Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, Customer name or email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'Processing', 'Shipped', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Order ID &amp; Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items Purchased</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No customer orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemsCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">
                          {order.id}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                      </td>

                      {/* Items Purchased */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold line-clamp-1 max-w-xs">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {itemsCount} item{itemsCount > 1 ? 's' : ''} total
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 font-black text-slate-900 tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {order.paymentStatus} · {order.paymentMethod.split(' ')[0]}
                        </span>
                      </td>

                      {/* Order Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.orderStatus)}
                          <select
                            value={order.orderStatus}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-transparent text-[11px] text-slate-500 hover:text-slate-800 border-b border-dashed border-slate-300 focus:outline-none cursor-pointer"
                          >
                            <option value="Processing">Mark Processing</option>
                            <option value="Shipped">Mark Shipped</option>
                            <option value="Delivered">Mark Delivered</option>
                            <option value="Cancelled">Cancel Order</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Header */}
            <div className="border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/mmb_logo.png" alt="MMB Logo" className="w-14 h-14 object-contain drop-shadow" />
                  <div>
                    <div className="text-xl font-black text-slate-900 tracking-tight">
                      Mumbai Mobile Bazaar
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Official Sales Invoice</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-700">
                    {selectedInvoiceOrder.id}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Customer</div>
                <div className="font-bold text-slate-800">{selectedInvoiceOrder.customerName}</div>
                <div className="text-slate-600">{selectedInvoiceOrder.customerEmail}</div>
                <div className="text-slate-600">{selectedInvoiceOrder.customerPhone || 'N/A'}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Shipping To</div>
                <div className="text-slate-700 leading-relaxed">{selectedInvoiceOrder.shippingAddress}</div>
                <div className="mt-1 font-mono text-[11px] text-cyan-700">
                  Tracking: {selectedInvoiceOrder.trackingNumber || 'Pending'}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 mb-5">
              <div className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 flex justify-between">
                <span>Electronic Item</span>
                <span>Amount</span>
              </div>
              {selectedInvoiceOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x </span>
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">(₹{item.price.toLocaleString('en-IN')} ea)</span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{selectedInvoiceOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              {selectedInvoiceOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Special Discount (ONTAS5)</span>
                  <span className="tabular-nums">-₹{selectedInvoiceOrder.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Paid</span>
                <span className="tabular-nums">₹{selectedInvoiceOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Invoice Footer Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Payment verified via {selectedInvoiceOrder.paymentMethod}
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
