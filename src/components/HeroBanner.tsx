import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface HeroBannerProps {
  onShopNow: (product: Product) => void;
  featuredProduct: Product;
  onExploreMore: () => void;
  onToggleSidebar?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  featuredProduct,
  onExploreMore,
  onToggleSidebar
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'MUMBAI MOBILE BAZZER',
      subtitle: 'Smart Choices for a Smarter Life in Mumbai',
      badge: 'Exclusive Deals & Top Brands',
      urlTag: 'mumbaimobilebazzer.com',
      price: '₹58,990',
      originalPrice: '₹67,990',
      description: 'FLAGSHIP 5G PHONES & ELECTRONICS',
      image: '/src/assets/images/hero_cyan_camera_1791176277434.jpg',
      product: featuredProduct
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="w-full px-4 md:px-8 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 shadow-md">
        {/* Main Banner Grid */}
        <div className="flex flex-col lg:flex-row items-stretch min-h-[380px] lg:min-h-[440px]">
          
          {/* Left Navigation Arrow */}
          <button
            onClick={() => setCurrentSlide(0)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Left Text & Pricing Content matching screenshot */}
          <div className="flex-1 p-8 sm:p-12 lg:pl-16 flex flex-col justify-center text-white z-10">
            {/* Top Tag Row */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/95 font-medium text-sm sm:text-base">
                {current.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs tracking-wide">
                {current.urlTag}
              </span>
            </div>

            {/* Sub-headline */}
            <p className="text-white/90 text-sm sm:text-base font-medium mb-1">
              {current.subtitle}
            </p>

            {/* Main Big Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-xs mb-6 uppercase">
              {current.title}
            </h1>

            {/* Price Row */}
            <div className="space-y-1 mb-6">
              <div className="text-sm font-semibold text-white/80 line-through">
                {current.originalPrice}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {current.price}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-white/80 tracking-widest uppercase">
                {current.description}
              </div>
            </div>

            {/* SHOP NOW Button */}
            <div>
              <button
                onClick={() => onShopNow(current.product)}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full shadow-lg hover:shadow-cyan-700/30 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>SHOP NOW</span>
                <span className="text-cyan-200">→</span>
              </button>
            </div>
          </div>

          {/* Center/Right Photography Showcase */}
          <div className="flex-1 relative flex items-center justify-center p-4 lg:p-0 overflow-hidden">
            {/* Embedded Mini Search Bar from screenshot */}
            <div className="absolute top-6 right-6 lg:right-16 z-20 hidden sm:flex items-center bg-white/30 backdrop-blur-md rounded-full px-3 py-1 text-xs text-white border border-white/40">
              <span className="text-white/90 mr-2">Search</span>
              <span className="opacity-80">🔍</span>
            </div>

            {/* Hero Camera Photo */}
            <div className="relative w-full max-w-md lg:max-w-xl h-64 sm:h-80 lg:h-96 flex items-center justify-center group">
              <img
                src={current.image}
                alt="Ontas Pro 4K Mirrorless Camera"
                referrerPolicy="no-referrer"
                className="object-contain max-h-full max-w-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 rounded-xl"
              />
            </div>
          </div>

          {/* Right Blue Action Bar from screenshot */}
          <div className="hidden lg:flex w-20 bg-sky-600 flex-col items-center justify-between py-8 px-2 text-white border-l border-sky-500/50">
            {/* Top Hamburger Icon */}
            <button
              onClick={onToggleSidebar || onExploreMore}
              className="p-2 rounded-lg hover:bg-sky-500/50 transition-colors cursor-pointer"
              title="Toggle Electronic Categories Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Middle More Catalog Arrow */}
            <button
              onClick={onExploreMore}
              className="flex flex-col items-center gap-2 group cursor-pointer"
              title="Browse More Electronic Catalog"
            >
              <div className="w-10 h-10 rounded-full bg-slate-900/60 group-hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-md">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-white/90 text-center leading-tight">
                More Catalog
              </span>
            </button>

            {/* Social Icons matching screenshot */}
            <div className="flex flex-col items-center gap-3 text-white/80">
              <span className="text-xs hover:text-white cursor-pointer transition-colors">f</span>
              <span className="text-xs hover:text-white cursor-pointer transition-colors">◎</span>
              <span className="text-xs hover:text-white cursor-pointer transition-colors">𝕏</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
