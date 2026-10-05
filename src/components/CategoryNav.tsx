import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { ElectronicCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: ElectronicCategory;
  onSelectCategory: (cat: ElectronicCategory) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const CATEGORIES: { id: ElectronicCategory; label: string }[] = [
  { id: 'ALL', label: 'HOME' },
  { id: 'HEADPHONES', label: 'HEADPHONES' },
  { id: 'CELL PHONES', label: 'CELL PHONES' },
  { id: 'TABLETS', label: 'TABLETS' },
  { id: 'PHOTOGRAPHY', label: 'PHOTOGRAPHY' }
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  cartCount,
  onOpenCart
}) => {
  return (
    <nav className="w-full bg-white border-b border-slate-200/80 px-4 md:px-8 overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-between min-w-max gap-6 py-3">
        <div className="flex items-center gap-5 md:gap-7">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-[12px] md:text-[13px] font-bold tracking-wider transition-colors uppercase whitespace-nowrap cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-cyan-500 font-extrabold'
                    : 'text-slate-800 hover:text-cyan-500'
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Small Cart Icon from screenshot */}
        <button
          onClick={onOpenCart}
          className="flex items-center text-slate-800 hover:text-cyan-500 transition-colors pl-4 border-l border-slate-200 cursor-pointer"
          title="View Cart"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="ml-1 text-[11px] font-bold text-cyan-600">
              ({cartCount})
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
