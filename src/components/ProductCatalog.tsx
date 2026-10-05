import React, { useState, useMemo } from 'react';
import {
  Send,
  AlertCircle,
  Package,
  ShoppingBag,
  Phone,
  MessageSquare,
  Tag,
  Smartphone,
  Check
} from 'lucide-react';
import { Product, ElectronicCategory, SortOption, ProductVariantItem } from '../types';
import { CustomerContactModal } from './CustomerContactModal';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: ElectronicCategory;
  onSelectCategory: (cat: ElectronicCategory) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  onOrderProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  autoSortedNotice?: boolean;
}

interface ProductCardProps {
  product: Product;
  onOrderProduct: (product: Product) => void;
  onCallCustomer: (
    product: Product,
    variant: ProductVariantItem | null,
    subVariant: string | null
  ) => void;
  onMessageCustomer: (
    product: Product,
    variant: ProductVariantItem | null,
    subVariant: string | null
  ) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOrderProduct,
  onCallCustomer,
  onMessageCustomer
}) => {
  // Always default to the first variant (which is the lowest price)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem | null>(
    () => (product.variants && product.variants.length > 0 ? product.variants[0] : null)
  );

  // Always default to the first sub-variant
  const [selectedSubVariant, setSelectedSubVariant] = useState<string | null>(
    () => (product.subVariants && product.subVariants.length > 0 ? product.subVariants[0] : null)
  );

  const isLowStock = product.stock > 0 && product.stock <= product.reorderLevel;
  const isOutOfStock = product.stock === 0;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;

  const customerPhone = product.customerContact?.phone || '+91 98201 98765';
  const customerName = product.customerContact?.name || 'Customer';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-cyan-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image / Visual Slot */}
      <div className="relative h-52 sm:h-56 bg-gradient-to-b from-slate-50 to-slate-100/70 flex items-center justify-center p-3 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-2xs"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200/80 flex flex-col items-center justify-center text-slate-400 group-hover:border-cyan-200 group-hover:text-cyan-600 transition-colors shadow-xs">
            <Package className="w-8 h-8 mb-1 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {product.category}
            </span>
          </div>
        )}

        {/* Category Pill & Lowest Price First Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded shadow-xs border border-slate-200/60">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded shadow-xs">
              {product.brand}
            </span>
          )}
        </div>

        {/* Stock Status Indicator */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {isOutOfStock ? (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              Low: {product.stock} left
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs">
              Stock: {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-cyan-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selector (Storage / Spec) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-600" />
                  Variant:
                </span>
                <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                  {selectedVariant ? selectedVariant.name : 'Choose'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title={`₹${v.price.toLocaleString('en-IN')}`}
                    >
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-Variants Selector (Color / Finish) */}
          {product.subVariants && product.subVariants.length > 0 && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-cyan-600" />
                  Sub-Variant (Color):
                </span>
                <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[120px]">
                  {selectedSubVariant || 'Choose'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.subVariants.map((sv) => {
                  const isSelected = selectedSubVariant === sv;
                  return (
                    <button
                      key={sv}
                      onClick={() => setSelectedSubVariant(sv)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-cyan-400" />}
                      <span className="truncate max-w-[110px]">{sv}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Lead / Contact Quick Summary */}
          <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">
              Lead: <strong className="text-slate-800">{customerName}</strong>
            </span>
            <span className="font-mono font-bold text-emerald-800 text-[11px]">
              {customerPhone}
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {currentOriginalPrice && (
                <span className="text-xs font-medium text-slate-400 line-through mr-2">
                  ₹{currentOriginalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xl font-black text-slate-900 tracking-tight tabular-nums">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="text-[11px] font-medium text-slate-400">
              {product.stock > 0 ? `${product.stock} in stock` : 'Restock needed'}
            </div>
          </div>

          {/* Action Buttons Row: Call Icon, Message Icon & Release to App */}
          <div className="flex items-center gap-2">
            {/* Call Icon Button */}
            <button
              onClick={() => onCallCustomer(product, selectedVariant, selectedSubVariant)}
              className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
              title={`Call Customer: ${customerPhone}`}
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Call</span>
            </button>

            {/* Message Icon Button */}
            <button
              onClick={() => onMessageCustomer(product, selectedVariant, selectedSubVariant)}
              className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
              title={`Message Customer: ${customerPhone}`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Message</span>
            </button>

            {/* Release to App Button */}
            <button
              onClick={() => onOrderProduct(product)}
              disabled={isOutOfStock}
              title="Release to App / Counter Offer"
              className="flex-1 py-2.5 px-3 bg-cyan-600 hover:bg-cyan-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed truncate"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Release to App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onOrderProduct
}) => {
  // Brand selection state
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  // Customer Contact Dialog state (handles Call and Message)
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    variant: ProductVariantItem | null;
    subVariant: string | null;
    mode: 'call' | 'message';
  }>({
    isOpen: false,
    product: null,
    variant: null,
    subVariant: null,
    mode: 'call'
  });

  // Extract unique brands for the current filtered products / category
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand.trim() !== '') {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet);
  }, [products]);

  // Reset selected brand if it is not present in available brands when category switches
  React.useEffect(() => {
    if (selectedBrand !== 'ALL' && !availableBrands.includes(selectedBrand)) {
      setSelectedBrand('ALL');
    }
  }, [selectedCategory, availableBrands, selectedBrand]);

  // Filter products by selected brand
  const filteredProducts = useMemo(() => {
    if (selectedBrand === 'ALL') return products;
    return products.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
  }, [products, selectedBrand]);

  const handleOpenCall = (
    product: Product,
    variant: ProductVariantItem | null,
    subVariant: string | null
  ) => {
    setContactModal({
      isOpen: true,
      product,
      variant,
      subVariant,
      mode: 'call'
    });
  };

  const handleOpenMessage = (
    product: Product,
    variant: ProductVariantItem | null,
    subVariant: string | null
  ) => {
    setContactModal({
      isOpen: true,
      product,
      variant,
      subVariant,
      mode: 'message'
    });
  };

  return (
    <section className="w-full px-4 md:px-8 py-8">
      {/* Catalog Header & Sorting Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {selectedCategory === 'ALL'
                ? 'Featured Products & Catalog'
                : `${selectedCategory} Collection`}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredProducts.length} Products Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore authentic smartphones, headphones, tablets, and electronics at Mumbai Mobile Bazzer.
          </p>
        </div>
      </div>

      {/* Brands Row: Rendered horizontally in a row when brands are available */}
      {availableBrands.length > 0 && (
        <div className="py-4 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-600" />
            <span>Brands:</span>
          </span>

          {/* All Brands Chip */}
          <button
            onClick={() => setSelectedBrand('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedBrand === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>All {selectedCategory === 'CELL PHONES' ? 'Cell Phones' : 'Brands'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedBrand === 'ALL'
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Individual Brand Chips */}
          {availableBrands.map((brand) => {
            const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
            const count = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase()).length;
            return (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-xs scale-102'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{brand}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-cyan-700 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {products.length === 0 ? 'Store Inventory is Empty' : 'No Products Found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {products.length === 0
              ? 'All demo data has been cleared. Products added to the catalog will appear here.'
              : 'Try adjusting your brand filter or selecting a different category.'}
          </p>
          {products.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setSelectedBrand('ALL')}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Clear Brand Filter
              </button>
              <button
                onClick={() => onSelectCategory('ALL')}
                className="px-4 py-2 bg-cyan-600 text-white text-xs font-semibold rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
              >
                Reset All Categories
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrderProduct={onOrderProduct}
              onCallCustomer={handleOpenCall}
              onMessageCustomer={handleOpenMessage}
            />
          ))}
        </div>
      )}

      {/* Customer Contact Call/Message Modal */}
      <CustomerContactModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal((prev) => ({ ...prev, isOpen: false }))}
        product={contactModal.product}
        selectedVariant={contactModal.variant}
        selectedSubVariant={contactModal.subVariant}
        initialMode={contactModal.mode}
      />
    </section>
  );
};
