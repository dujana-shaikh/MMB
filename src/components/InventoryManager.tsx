import React, { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, ArrowUpDown, RefreshCw, CheckCircle2, IndianRupee, Boxes, Edit2, ShieldAlert } from 'lucide-react';
import { Product, ElectronicCategory } from '../types';

interface InventoryManagerProps {
  products: Product[];
  onUpdateProductStock: (id: string, newStock: number) => void;
  onUpdateProductPrice: (id: string, newPrice: number) => void;
  onOpenAddProductModal: () => void;
  onRestockProduct: (id: string, amount: number) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  onUpdateProductStock,
  onUpdateProductPrice,
  onOpenAddProductModal,
  onRestockProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;
    const matchesLowStock = !showLowStockOnly || p.stock <= p.reorderLevel;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Calculate inventory metrics
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.reorderLevel).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setEditStockValue(p.stock);
    setEditPriceValue(p.price);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateProductStock(id, Math.max(0, editStockValue));
    onUpdateProductPrice(id, Math.max(0.01, editPriceValue));
    setEditingProductId(null);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-cyan-600" />
            <span>Electronic Inventory &amp; Stock Tracking</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor real-time warehouse counts, automated reorder thresholds, and valuation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddProductModal}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Electronic</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total SKUs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Total SKUs</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              {products.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Electronics catalog</div>
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Warehouse Units</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              {totalUnits}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Available for fulfillment</div>
          </div>
        </div>

        {/* Total Inventory Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Total Asset Value</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              ₹{totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">At retail pricing</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by electronic name, SKU, brand..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="PHOTOGRAPHY">Photography</option>
            <option value="HEADPHONES">Headphones</option>
            <option value="CELL PHONES">Cell Phones</option>
            <option value="TABLETS">Tablets</option>
            <option value="VIDEO GAMES">Video Games</option>
            <option value="WEARABLE TECH">Wearable Tech</option>
            <option value="OFFICE SUPPLIES">Office Supplies</option>
          </select>
        </div>

        {/* Low Stock Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              showLowStockOnly
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Low Stock Filter {showLowStockOnly ? '(Active)' : ''}</span>
          </button>
        </div>
      </div>

      {/* Inventory Tracking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Product &amp; SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Threshold</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Restock &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((product) => {
                const isEditing = editingProductId === product.id;
                const isLow = product.stock <= product.reorderLevel && product.stock > 0;
                const isOut = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Product Name & SKU */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="object-contain max-h-full max-w-full"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">₹</span>
                          <input
                            type="number"
                            step="1"
                            value={editPriceValue}
                            onChange={(e) => setEditPriceValue(parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 bg-white border border-cyan-400 rounded text-xs font-bold"
                          />
                        </div>
                      ) : (
                        `₹${product.price.toLocaleString('en-IN')}`
                      )}
                    </td>

                    {/* Stock Level with Visual Bar */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStockValue}
                          onChange={(e) => setEditStockValue(parseInt(e.target.value, 10) || 0)}
                          className="w-20 px-2 py-1 bg-white border border-cyan-400 rounded text-xs font-bold"
                        />
                      ) : (
                        <div>
                          <div className="font-extrabold text-slate-900 tabular-nums">
                            {product.stock} units
                          </div>
                          {/* Mini Progress Indicator */}
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isOut
                                  ? 'bg-rose-500 w-0'
                                  : isLow
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Reorder Threshold */}
                    <td className="py-3 px-4 text-slate-500 tabular-nums">
                      {product.reorderLevel} units
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Optimal
                        </span>
                      )}
                    </td>

                    {/* Actions: Quick Restock & Edit */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(product.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProductId(null)}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onRestockProduct(product.id, 10)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded cursor-pointer transition-colors"
                            title="Add 10 units to warehouse"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => onRestockProduct(product.id, 50)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded cursor-pointer transition-colors"
                            title="Add 50 units to warehouse"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleStartEdit(product)}
                            className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors cursor-pointer"
                            title="Edit Stock or Price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
