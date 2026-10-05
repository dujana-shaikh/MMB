import { Search, ShoppingBag, UserCheck, Menu, Database } from 'lucide-react';

interface HeaderTopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeView: 'storefront' | 'admin_dashboard' | 'inventory' | 'orders' | 'analytics';
  setActiveView: (view: 'storefront' | 'admin_dashboard' | 'inventory' | 'orders' | 'analytics') => void;
  cartCount: number;
  onOpenCart: () => void;
  onSimulateOrder?: () => void;
  recentOrderNotification: string | null;
  onToggleSidebar?: () => void;
  dbStatus?: {
    connected: boolean;
    dbName?: string;
    host?: string;
  };
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  searchQuery,
  onSearchChange,
  activeView,
  setActiveView,
  cartCount,
  onOpenCart,
  onSimulateOrder,
  recentOrderNotification,
  onToggleSidebar,
  dbStatus
}) => {
  return (
    <div className="w-full">
      {/* Main Header Row */}
      <header className="px-4 md:px-8 py-3.5 bg-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 shadow-xs">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-700 hover:text-cyan-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Open Categories"
              aria-label="Open Categories"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => setActiveView('storefront')}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group select-none py-1"
          >
            <img
              src="/mmb_logo.png"
              alt="Mumbai Mobile Bazaar Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 min-w-[64px] min-h-[64px] object-contain drop-shadow-md group-hover:scale-105 transition-all"
            />
            <div className="flex flex-col justify-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                Mumbai Mobile Bazaar
              </span>
            </div>
          </div>
        </div>

        {/* Center Search Input & Down Navigation */}
        <div className="flex-1 max-w-xl mx-2 md:mx-6 min-w-[260px] flex flex-col items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeView !== 'storefront') setActiveView('storefront');
            }}
            className="relative flex items-center w-full"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-28 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 px-5 py-1.5 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Navigation Links directly down of the search bar */}
          <nav className="flex items-center justify-center gap-5 sm:gap-7 mt-2 pt-0.5 text-xs w-full overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveView('storefront')}
              className={`transition-all pb-0.5 cursor-pointer whitespace-nowrap text-xs font-bold ${
                activeView === 'storefront'
                  ? 'text-cyan-600 border-b-2 border-cyan-500'
                  : 'text-slate-600 hover:text-cyan-600'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActiveView('analytics')}
              className={`transition-all pb-0.5 cursor-pointer whitespace-nowrap text-xs font-bold ${
                activeView === 'analytics'
                  ? 'text-cyan-600 border-b-2 border-cyan-500'
                  : 'text-slate-600 hover:text-cyan-600'
              }`}
            >
              Store Analytics
            </button>
            <button
              type="button"
              onClick={() => setActiveView('inventory')}
              className={`transition-all pb-0.5 cursor-pointer whitespace-nowrap text-xs font-bold ${
                activeView === 'inventory'
                  ? 'text-cyan-600 border-b-2 border-cyan-500'
                  : 'text-slate-600 hover:text-cyan-600'
              }`}
            >
              Inventory
            </button>
            <button
              type="button"
              onClick={() => setActiveView('orders')}
              className={`transition-all pb-0.5 cursor-pointer whitespace-nowrap text-xs font-bold ${
                activeView === 'orders'
                  ? 'text-cyan-600 border-b-2 border-cyan-500'
                  : 'text-slate-600 hover:text-cyan-600'
              }`}
            >
              Customer Orders
            </button>
          </nav>
        </div>

        {/* Right Section: Database Status, Account & Cart */}
        <div className="flex items-center gap-2.5">
          {/* MongoDB Atlas Status Pill */}
          <div 
            title={dbStatus?.connected ? `Connected to MongoDB Atlas (${dbStatus.dbName || 'mmb_bazaar'})` : 'Connecting to MongoDB backend...'}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              dbStatus?.connected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <Database className="w-3.5 h-3.5 opacity-80" />
            <span className="hidden md:inline">Atlas:</span>
            <span>{dbStatus?.connected ? 'Live' : 'Connecting'}</span>
          </div>

          {/* Account Profile Badge */}
          <div className="flex items-center gap-2 pl-1 text-slate-700 text-xs font-medium">
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
              <UserCheck className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <div className="font-semibold text-slate-800">My Account</div>
              <div className="text-[10px] text-slate-400">Customer</div>
            </div>
          </div>

          {/* Cart Icon & Count */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-cyan-600 bg-slate-50 hover:bg-cyan-50 rounded-full border border-slate-200 transition-colors cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </div>
  );
};
