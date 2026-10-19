import React, { useRef } from 'react';
import { Layers, Clock, Zap, Timer, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDuration,
  onSelectDuration,
  categoryCounts,
  durationCounts,
  onResetFilters,
  isFiltered,
}) {
  const scrollContainerRef = useRef(null);

  const durationBuckets = [
    { id: 'All', label: 'All Durations', icon: Clock },
    { id: '< 1 min', label: '< 1 min', icon: Zap },
    { id: '1–5 mins', label: '1–5 mins', icon: Timer },
    { id: '5–10 mins', label: '5–10 mins', icon: Clock },
    { id: '10+ mins', label: '10+ mins', icon: Layers },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-4">
      {/* 1. Category Pills: Horizontally Scrollable Bar */}
      <div className="relative group">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#5BCEFA]" />
            Categories
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs text-[#F5A9B8] hover:text-white flex items-center gap-1 transition-colors font-medium cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll categories left"
          className="hidden md:flex absolute left-0 top-10 -translate-y-1/2 z-10 w-8 h-8 rounded-full frosted-glass items-center justify-center text-slate-300 hover:text-white hover:border-white/40 shadow-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll categories right"
          className="hidden md:flex absolute right-0 top-10 -translate-y-1/2 z-10 w-8 h-8 rounded-full frosted-glass items-center justify-center text-slate-300 hover:text-white hover:border-white/40 shadow-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Categories Horizontal Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar py-1 scroll-smooth"
        >
          {/* All Categories Option */}
          <button
            onClick={() => onSelectCategory('All')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-[#F5A9B8] to-[#5BCEFA] text-slate-950 font-bold shadow-md shadow-[#F5A9B8]/20 scale-[1.03]'
                : 'frosted-glass-pill text-slate-300 hover:text-white'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === 'All'
                  ? 'bg-black/20 text-slate-900 font-semibold'
                  : 'bg-white/10 text-slate-400'
              }`}
            >
              {categoryCounts['All'] || 0}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'frosted-glass-pink text-white font-bold ring-2 ring-[#F5A9B8]/80 scale-[1.03] shadow-lg shadow-[#F5A9B8]/20'
                    : 'frosted-glass-pill text-slate-300 hover:text-white'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#F5A9B8]/30 text-white font-semibold'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Duration Buckets */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#F5A9B8]" />
            Duration
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {durationBuckets.map((bucket) => {
            const isSelected = selectedDuration === bucket.id;
            const Icon = bucket.icon;
            const count = durationCounts[bucket.id] ?? 0;

            return (
              <button
                key={bucket.id}
                onClick={() => onSelectDuration(isSelected && bucket.id !== 'All' ? 'All' : bucket.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'frosted-glass-blue text-white font-semibold ring-1 ring-[#5BCEFA]/80 shadow-md shadow-[#5BCEFA]/20 scale-[1.02]'
                    : 'frosted-glass-pill text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3 h-3 ${isSelected ? 'text-[#5BCEFA]' : 'text-slate-400'}`} />
                <span>{bucket.label}</span>
                {bucket.id !== 'All' && (
                  <span className="opacity-60 text-[10px]">({count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
