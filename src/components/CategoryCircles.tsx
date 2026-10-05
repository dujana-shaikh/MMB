import React from 'react';
import { Headphones, Smartphone, Tablet, ArrowRight } from 'lucide-react';
import { ElectronicCategory } from '../types';

interface CategoryCirclesProps {
  selectedCategory: ElectronicCategory;
  onSelectCategory: (cat: ElectronicCategory) => void;
}

interface CircleItem {
  id: ElectronicCategory;
  title: string;
  sublabel: string;
  icon: React.ReactNode;
  bgGradient: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const items: CircleItem[] = [
    {
      id: 'HEADPHONES',
      title: 'Headphone',
      sublabel: 'Get Product',
      icon: <Headphones className="w-8 h-8 text-cyan-600" />,
      bgGradient: 'from-slate-100 to-slate-200'
    },
    {
      id: 'CELL PHONES',
      title: 'Cell Phones',
      sublabel: 'Get Product',
      icon: <Smartphone className="w-8 h-8 text-cyan-600" />,
      bgGradient: 'from-slate-100 to-slate-200'
    },
    {
      id: 'TABLETS',
      title: 'Tablet',
      sublabel: 'Get Product',
      icon: <Tablet className="w-8 h-8 text-cyan-600" />,
      bgGradient: 'from-slate-100 to-slate-200'
    }
  ];

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center max-w-3xl mx-auto">
        {items.map((item) => {
          const isSelected = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(isSelected ? 'ALL' : item.id)}
              className="flex flex-col items-center group cursor-pointer text-center w-full max-w-[150px]"
            >
              {/* Circular Avatar / Badge Container from screenshot */}
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center p-3 mb-3 transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-cyan-500 bg-cyan-50 shadow-md scale-105'
                    : 'bg-gradient-to-b from-slate-50 to-slate-100/90 hover:from-white hover:to-cyan-50 border border-slate-200/90 shadow-xs hover:shadow-md hover:scale-105'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-100 group-hover:border-cyan-200 transition-colors">
                  {item.icon}
                </div>
              </div>

              {/* Title & Sublabel matching screenshot */}
              <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                isSelected ? 'text-cyan-600' : 'text-slate-800 group-hover:text-cyan-600'
              }`}>
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 group-hover:text-cyan-600/80 font-medium transition-colors flex items-center gap-1 mt-0.5">
                <span>{item.sublabel}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
