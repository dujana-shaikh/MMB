import React from 'react';
import {
  Home,
  Headphones,
  Smartphone,
  Tablet,
  ChevronRight,
  Layers,
  X
} from 'lucide-react';
import { ElectronicCategory, Product } from '../types';

interface CategorySidebarProps {
  selectedCategory: ElectronicCategory;
  onSelectCategory: (cat: ElectronicCategory) => void;
  products: Product[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface CategoryNavEntry {
  id: ElectronicCategory;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const CATEGORY_ENTRIES: CategoryNavEntry[] = [
  {
    id: 'ALL',
    label: 'All Products',
    icon: <Home className="w-4 h-4" />,
    description: 'Browse all products'
  },
  {
    id: 'HEADPHONES',
    label: 'Headphone',
    icon: <Headphones className="w-4 h-4" />,
    description: 'Noise cancelling & studio audio'
  },
  {
    id: 'CELL PHONES',
    label: 'Cell Phones',
    icon: <Smartphone className="w-4 h-4" />,
    description: '5G smartphones & flagships'
  },
  {
    id: 'TABLETS',
    label: 'Tablet',
    icon: <Tablet className="w-4 h-4" />,
    description: 'iPads, Android & 2K tablets'
  }
];

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  products,
  isOpenMobile,
  onCloseMobile
}) => {
  // Compute counts per category
  const countsMap = React.useMemo(() => {
    const map: Record<string, number> = { ALL: products.length };
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 w-64 lg:w-72 shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase">
              Electronic Categories
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Departments &amp; Catalog
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Categories Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {CATEGORY_ENTRIES.map((entry) => {
          const isActive = selectedCategory === entry.id;
          const count = countsMap[entry.id] || 0;

          return (
            <button
              key={entry.id}
              onClick={() => {
                onSelectCategory(entry.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all duration-200 cursor-pointer group relative ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-sm font-extrabold translate-x-1'
                  : 'text-slate-700 hover:text-cyan-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-600'
                  }`}
                >
                  {entry.icon}
                </div>
                <div className="truncate">
                  <div className="tracking-wide uppercase text-[12px] leading-tight">
                    {entry.label}
                  </div>
                  <div
                    className={`text-[10px] font-normal truncate ${
                      isActive ? 'text-cyan-100' : 'text-slate-400'
                    }`}
                  >
                    {entry.description}
                  </div>
                </div>
              </div>

              {/* Count Badge / Indicator */}
              <div className="flex items-center gap-1.5 pl-2 shrink-0">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-cyan-100/60 group-hover:text-cyan-700'
                  }`}
                >
                  {count}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive
                      ? 'text-white translate-x-0.5'
                      : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 self-start z-10 border-r border-slate-200/80 bg-white min-h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />
          {/* Slide-out Panel */}
          <div className="relative z-10 max-w-xs w-full shadow-2xl flex flex-col h-full bg-white animate-fadeIn">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
