/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Product,
  CustomerOrder,
  ElectronicCategory,
  SortOption,
  StoreMetrics,
  OrderItem,
  OrderStatus
} from './types';
import { api, DbStatus } from './services/api';
import { HeaderTopBar } from './components/HeaderTopBar';
import { CategorySidebar } from './components/CategorySidebar';
import { ProductCatalog } from './components/ProductCatalog';
import { InventoryManager } from './components/InventoryManager';
import { CustomerOrdersManager } from './components/CustomerOrdersManager';
import { SalesAnalytics } from './components/SalesAnalytics';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { QuickOrderModal } from './components/QuickOrderModal';
import { AddNewProductModal } from './components/AddNewProductModal';
import { CounterOfferModal } from './components/CounterOfferModal';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Store } from 'lucide-react';

export default function App() {
  // 1. Data States (starts empty - no demo data)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Clear legacy demo data storage
      localStorage.removeItem('mmb_products_catalog_v6');
      localStorage.removeItem('mmb_customer_orders_inr');
      localStorage.removeItem('mmb_cart_items_inr');

      const saved = localStorage.getItem('mmb_live_products_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('mmb_live_orders_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [cartItems, setCartItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('mmb_live_cart_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // 2. Navigation & View States
  const [activeView, setActiveView] = useState<
    'storefront' | 'admin_dashboard' | 'inventory' | 'orders' | 'analytics'
  >('storefront');

  const [selectedCategory, setSelectedCategory] = useState<ElectronicCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Sorting State - CRITICAL REQUIREMENT: Lowest to Highest price automatically triggers on customer electronic order
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');
  const [autoSortedNotice, setAutoSortedNotice] = useState(false);
  const [recentOrderNotification, setRecentOrderNotification] = useState<string | null>(null);

  // 4. Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [counterOfferProduct, setCounterOfferProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // 5. Database State & Initial MongoDB Fetch
  const [dbStatus, setDbStatus] = useState<DbStatus>({ connected: false });

  useEffect(() => {
    let isMounted = true;

    const syncWithMongo = async () => {
      try {
        const status = await api.checkHealth();
        if (isMounted) setDbStatus(status);

        if (status.connected) {
          const [remoteProducts, remoteOrders] = await Promise.all([
            api.getProducts(),
            api.getOrders()
          ]);
          if (isMounted && Array.isArray(remoteProducts)) {
            setProducts(remoteProducts);
          }
          if (isMounted && Array.isArray(remoteOrders)) {
            setOrders(remoteOrders);
          }
        }
      } catch (err) {
        console.warn('MongoDB sync error:', err);
      }
    };

    syncWithMongo();

    // Check health every 15s
    const timer = setInterval(async () => {
      const status = await api.checkHealth();
      if (isMounted) setDbStatus(status);
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Save live store data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mmb_live_products_v1', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('mmb_live_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('mmb_live_cart_v1', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Compute Store Metrics in real time based strictly on real transactions
  const metrics: StoreMetrics = useMemo(() => {
    const totalRev = orders.reduce((acc, ord) => acc + ord.totalAmount, 0);
    const today = new Date().toISOString().slice(0, 10);
    const todayOrdersList = orders.filter((o) => o.createdAt.startsWith(today));
    const todayRev = todayOrdersList.reduce((acc, ord) => acc + ord.totalAmount, 0);
    const avgOrderVal = orders.length > 0 ? totalRev / orders.length : 0;
    const lowStock = products.filter((p) => p.stock <= p.reorderLevel).length;

    return {
      totalRevenue: totalRev,
      todayRevenue: todayRev,
      totalOrders: orders.length,
      todayOrders: todayOrdersList.length,
      averageOrderValue: avgOrderVal,
      lowStockItemsCount: lowStock,
      activeVisitors: 0,
      conversionRate: 0
    };
  }, [orders, products]);

  // Handle Order Placement (decrements stock, updates orders, and AUTO-SORTS products lowest to highest price)
  const executeOrder = (newOrder: CustomerOrder) => {
    // 1. Decrement inventory stock
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const itemInOrder = newOrder.items.find((i) => i.productId === p.id);
        if (itemInOrder) {
          return {
            ...p,
            stock: Math.max(0, p.stock - itemInOrder.quantity)
          };
        }
        return p;
      })
    );

    // 2. Add customer order
    setOrders((prev) => [newOrder, ...prev]);

    // 3. MANDATORY REQUIREMENT:
    // "when the customer oder the Electroni then the lowest to highest price of the Electronic products should be sorted automatically."
    setSortBy('price_asc');
    setAutoSortedNotice(true);

    const firstItemName = newOrder.items[0]?.name || 'Electronic product';
    setRecentOrderNotification(
      `Order #${newOrder.id} placed for ${newOrder.customerName} (${firstItemName})! Catalog automatically sorted: Lowest to Highest price.`
    );

    // Clear notification after 10s
    setTimeout(() => {
      setRecentOrderNotification(null);
    }, 10000);

    // Show confirmation modal
    setConfirmedOrder(newOrder);

    // Persist to MongoDB Atlas
    api.createOrder(newOrder).catch((err) => console.warn('Order sync to MongoDB error:', err));
  };

  // Quick Order from Modal or Hero
  const handleConfirmQuickOrder = (
    product: Product,
    quantity: number,
    customerName: string,
    customerEmail: string
  ) => {
    const totalAmount = product.price * quantity;
    const newOrder: CustomerOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerEmail,
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          category: product.category,
          image: product.image
        }
      ],
      totalAmount,
      discountAmount: 0,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      createdAt: new Date().toISOString(),
      shippingAddress: '420 Skyline Drive, San Jose, CA',
      paymentMethod: 'Credit Card (Visa)',
      trackingNumber: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    setQuickOrderProduct(null);
    executeOrder(newOrder);
  };

  // Checkout from Cart
  const handleCheckoutCart = (
    customerName: string,
    customerEmail: string,
    shippingAddress: string,
    discountCode: string
  ) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const hasDiscount = discountCode.trim().toUpperCase() === 'ONTAS5';
    const discount = hasDiscount ? subtotal * 0.05 : 0;
    const total = Math.max(0, subtotal - discount);

    const newOrder: CustomerOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerEmail,
      items: [...cartItems],
      totalAmount: total,
      discountAmount: discount,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      createdAt: new Date().toISOString(),
      shippingAddress,
      paymentMethod: 'Apple Pay / Credit Card',
      trackingNumber: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    setCartItems([]);
    setIsCartOpen(false);
    executeOrder(newOrder);
  };

  // Simulate Customer Order Button
  const handleSimulateCustomerOrder = () => {
    const available = products.filter((p) => p.stock > 0);
    if (available.length === 0) return;

    // Pick 1-2 random items
    const randomProduct = available[Math.floor(Math.random() * available.length)];
    const mockNames = [
      'Maya Lin',
      'Ethan Scott',
      'Jessica Taylor',
      'Robert Sterling',
      'Chloe Bennett',
      'Gabriel Santos'
    ];
    const chosenName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const chosenEmail = `${chosenName.toLowerCase().replace(' ', '.')}@techmail.com`;

    const newOrder: CustomerOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: chosenName,
      customerEmail: chosenEmail,
      items: [
        {
          productId: randomProduct.id,
          name: randomProduct.name,
          price: randomProduct.price,
          quantity: 1,
          category: randomProduct.category,
          image: randomProduct.image
        }
      ],
      totalAmount: randomProduct.price,
      discountAmount: 0,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      createdAt: new Date().toISOString(),
      shippingAddress: 'Colaba Causeway, South Mumbai, MH 400001',
      paymentMethod: 'UPI (Paytm)',
      trackingNumber: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    executeOrder(newOrder);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
          image: product.image
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Inventory modifications
  const handleUpdateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
    api.updateProduct(id, { stock: newStock });
  };

  const handleUpdateProductPrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
    api.updateProduct(id, { price: newPrice });
  };

  const handleRestockProduct = (id: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedStock = p.stock + amount;
          api.updateProduct(id, { stock: updatedStock });
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    api.createProduct(newProduct);
  };

  // Order status modification
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
    );
    api.updateOrderStatus(orderId, newStatus);
  };

  // Filtered & Sorted Products List
  const displayedProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Apply Sorting (notice 'price_asc' sorts from lowest to highest price)
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price; // Lowest to highest
        case 'price_desc':
          return b.price - a.price; // Highest to lowest
        case 'rating_desc':
          return b.rating - a.rating;
        case 'stock_desc':
          return b.stock - a.stock;
        case 'featured':
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        default:
          return a.price - b.price;
      }
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const featuredCamera = useMemo(() => {
    return (
      products.find((p) => p.sku === 'ONT-CAM-4K8') ||
      products[0]
    );
  }, [products]);

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Fullscreen App Container */}
      <div className="w-full min-h-screen flex flex-col">
        
        {/* 1. Header Top Bar (Announcement strip, Brand, Search, Cart) */}
        <HeaderTopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeView={activeView}
          setActiveView={setActiveView}
          cartCount={cartTotalCount}
          onOpenCart={() => setIsCartOpen(true)}
          onSimulateOrder={handleSimulateCustomerOrder}
          recentOrderNotification={recentOrderNotification}
          onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
          dbStatus={dbStatus}
        />

        {/* Main Fullscreen Body: Sidebar + Main Content */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch min-h-0 w-full">
          {/* Categories Sidebar */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              if (activeView !== 'storefront') setActiveView('storefront');
              setIsSidebarOpenMobile(false);
            }}
            products={products}
            isOpenMobile={isSidebarOpenMobile}
            onCloseMobile={() => setIsSidebarOpenMobile(false)}
          />

          {/* Fullscreen Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col bg-white">
            {/* Management Toolbar (only visible in inventory, orders, or analytics view) */}
            {activeView !== 'storefront' && (
              <div className="bg-slate-50 border-b border-slate-200/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 hidden sm:inline">
                    Store Manager:
                  </span>
                  <button
                    onClick={() => setActiveView('storefront')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-white text-cyan-600 shadow-xs border border-slate-200 hover:bg-slate-50"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Back to Storefront</span>
                  </button>
                  <button
                    onClick={() => setActiveView('inventory')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'inventory'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Inventory ({products.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveView('orders')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'orders'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Customer Orders ({orders.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveView('analytics')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'analytics'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Sales Analytics</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. Primary View Content */}
            <main className="flex-1 bg-white w-full">
              {/* STOREFRONT VIEW: Fullscreen, clean e-commerce experience */}
              {activeView === 'storefront' && (
                <div className="animate-fadeIn w-full">
                  {/* Full Electronic Products Catalog */}
                  <ProductCatalog
                    products={displayedProducts}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    onOrderProduct={(product) => setCounterOfferProduct(product)}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              )}

          {/* ADMIN DASHBOARD OVERVIEW */}
          {activeView === 'admin_dashboard' && (
            <div className="animate-fadeIn space-y-6">
              {/* Quick Jump Grid */}
              <div className="px-4 md:px-8 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Inventory Quick Card */}
                  <div
                    onClick={() => setActiveView('inventory')}
                    className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-cyan-600 group-hover:translate-x-1 transition-transform">
                        Manage →
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Warehouse Inventory</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {products.length} SKUs · {products.reduce((a, b) => a + b.stock, 0)} items in stock
                    </p>
                  </div>

                  {/* Orders Quick Card */}
                  <div
                    onClick={() => setActiveView('orders')}
                    className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                        Fulfill →
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Customer Orders</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {orders.length} total orders · {orders.filter((o) => o.orderStatus === 'Processing').length} awaiting fulfillment
                    </p>
                  </div>

                  {/* Analytics Quick Card */}
                  <div
                    onClick={() => setActiveView('analytics')}
                    className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                        Analyze →
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Sales Performance</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      ₹{metrics.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} gross sales · 3.4% conversion
                    </p>
                  </div>
                </div>
              </div>

              {/* Embedded Sales Analytics */}
              <SalesAnalytics
                metrics={metrics}
                orders={orders}
                products={products}
              />
            </div>
          )}

          {/* INVENTORY TRACKING VIEW */}
          {activeView === 'inventory' && (
            <div className="animate-fadeIn">
              <InventoryManager
                products={products}
                onUpdateProductStock={handleUpdateProductStock}
                onUpdateProductPrice={handleUpdateProductPrice}
                onOpenAddProductModal={() => setIsAddProductOpen(true)}
                onRestockProduct={handleRestockProduct}
              />
            </div>
          )}

          {/* CUSTOMER ORDERS VIEW */}
          {activeView === 'orders' && (
            <div className="animate-fadeIn">
              <CustomerOrdersManager
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onSimulateOrder={handleSimulateCustomerOrder}
              />
            </div>
          )}

          {/* SALES ANALYTICS VIEW */}
          {activeView === 'analytics' && (
            <div className="animate-fadeIn">
              <SalesAnalytics
                metrics={metrics}
                orders={orders}
                products={products}
              />
            </div>
          )}
        </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-slate-900 text-white border-t border-slate-800 px-4 md:px-8 py-8 mt-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">MMB- Mumbai Mobile Bazzer</span>
              <span>Mobile &amp; Electronics Hub</span>
              <span>·</span>
              <span>Store Management</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveView('storefront')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Storefront
              </button>
              <button
                onClick={() => setActiveView('inventory')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Inventory Tracker
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Customer Orders
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Sales Analytics
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutCart}
      />

      {/* Quick Single-Item Order Checkout Modal */}
      <QuickOrderModal
        product={quickOrderProduct}
        onClose={() => setQuickOrderProduct(null)}
        onConfirmOrder={handleConfirmQuickOrder}
      />

      {/* Order Confirmation & Auto-Sort Notification Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onGoToStorefront={() => setActiveView('storefront')}
        onGoToOrders={() => setActiveView('orders')}
      />

      {/* Add New Electronic Product Modal */}
      <AddNewProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Counter Offer & Release to App Modal */}
      <CounterOfferModal
        product={counterOfferProduct}
        isOpen={!!counterOfferProduct}
        onClose={() => setCounterOfferProduct(null)}
        onSubmitCounterOffer={(productId, counterPrice, message) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? { ...p, price: counterPrice } : p))
          );
          setRecentOrderNotification(
            `Counter offer of ₹${counterPrice.toLocaleString('en-IN')} released to App!`
          );
          setTimeout(() => setRecentOrderNotification(null), 5000);
        }}
      />
    </div>
  );
}
