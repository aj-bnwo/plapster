import React from 'react';
import { Sparkles, Layers, Clock, Zap, Timer, ChevronDown, ChevronUp, Shuffle, Flame } from 'lucide-react';

export default function PlapRouletteDeck({
  userName = 'darling',
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDuration,
  onSelectDuration,
  categoryCounts,
  durationCounts,
  matchingVideosCount,
  unwatchedMatchingCount,
  onLaunchRandom,
  disabledLaunch,
  showLibrary,
  onToggleShowLibrary,
}) {
  const durationOptions = [
    { id: 'All', label: 'Any Duration', subtitle: 'Any length', icon: Clock },
    { id: '< 1 min', label: '< 1 min', subtitle: 'Quick Plap', icon: Zap },
    { id: '1–5 mins', label: '1–5 mins', subtitle: 'Regular Plap', icon: Timer },
    { id: '5–10 mins', label: '5–10 mins', subtitle: 'Deep Plap', icon: Clock },
    { id: '10+ mins', label: '10+ mins', subtitle: 'Marathon Plap', icon: Layers },
  ];

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-4 space-y-8">
      {/* Expansive Frosted Control Deck */}
      <div className="relative rounded-3xl frosted-glass border-2 border-white/95 p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
        {/* Subtle Ambient Orbs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#5BCEFA]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#F5A9B8]/25 blur-3xl pointer-events-none" />

        {/* 2-Column Responsive Layout on Desktop */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Spec Pickers (Categories & Durations) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-7">
            {/* 1. Category Selection */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="text-[#5BCEFA] font-black text-base">♠</span>
                  <span>1. Choose Category</span>
                </label>
                <span className="text-xs font-bold text-slate-500">
                  Selected: <span className="text-[#F5A9B8] font-black">{selectedCategory}</span>
                </span>
              </div>

              {/* Category Pills Grid */}
              <div className="flex flex-wrap gap-2.5">
                {/* All Categories Option */}
                <button
                  onClick={() => onSelectCategory('All')}
                  className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs ${selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-[#5BCEFA] to-[#F5A9B8] text-slate-950 shadow-md shadow-[#5BCEFA]/30 scale-[1.03] ring-2 ring-white'
                    : 'bg-white/85 hover:bg-white text-slate-700 border border-slate-200/80 hover:border-[#5BCEFA]'
                    }`}
                >
                  <span className="font-black">♠ All Categories</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-black ${selectedCategory === 'All'
                      ? 'bg-white/40 text-slate-950'
                      : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    {categoryCounts['All'] || 0}
                  </span>
                </button>

                {/* Categories */}
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;
                  const count = categoryCounts[category] || 0;

                  return (
                    <button
                      key={category}
                      onClick={() => onSelectCategory(category)}
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs ${isSelected
                        ? 'bg-gradient-to-r from-[#F5A9B8] to-[#5BCEFA] text-slate-950 shadow-md shadow-[#F5A9B8]/30 scale-[1.03] ring-2 ring-white'
                        : 'bg-white/85 hover:bg-white text-slate-700 border border-slate-200/80 hover:border-[#F5A9B8]'
                        }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-black ${isSelected
                          ? 'bg-white/40 text-slate-950'
                          : 'bg-slate-100 text-slate-500'
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Duration Selection */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="text-[#F5A9B8] font-black text-base">♠</span>
                  <span>2. How long do you want it, {userName}?</span>
                </label>
                <span className="text-xs font-bold text-slate-500">
                  Selected: <span className="text-[#5BCEFA] font-black">{selectedDuration}</span>
                </span>
              </div>

              {/* Responsive Duration Bucket Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                {durationOptions.map((opt) => {
                  const isSelected = selectedDuration === opt.id;
                  const count = durationCounts[opt.id] ?? 0;
                  const Icon = opt.icon;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectDuration(opt.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer border shadow-xs ${isSelected
                        ? 'bg-gradient-to-br from-white to-[#5BCEFA]/20 border-2 border-[#5BCEFA] shadow-md shadow-[#5BCEFA]/25 scale-[1.03]'
                        : 'bg-white/85 hover:bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#5BCEFA]' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {count}
                        </span>
                      </div>
                      <div>
                        <p className={`text-xs sm:text-sm font-black ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                          {opt.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Seductive Roulette Action Deck */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-white p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              {/* Seductive / Sassy Tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#F5A9B8]/25 text-slate-900 border border-[#F5A9B8]/40">
                  <Flame className="w-3.5 h-3.5 text-[#F5A9B8]" />
                  <span>Plap Roulette for {userName}</span>
                </span>
                <span className="text-sm font-black text-slate-900">♠ ♠ ♠</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-['Outfit']">
                Surrender to the BNWO, {userName}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 leading-relaxed">
                Resistance is completely futile, <strong className="text-slate-900 font-bold">{userName}</strong>. You know you can't stop at just one plap... let the roulette decide your fate. ♠
              </p>

              {/* Current Match Pill */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5 text-xs font-bold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Matching Pool:</span>
                  <span className="font-black text-slate-900">{matchingVideosCount} Plap Vids</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Unplapped / Fresh:</span>
                  <span className="font-black text-[#F5A9B8]">{unwatchedMatchingCount} waiting for {userName}</span>
                </div>
              </div>
            </div>

            {/* The Big Random Button */}
            <div className="pt-2">
              <button
                onClick={onLaunchRandom}
                disabled={disabledLaunch}
                className={`w-full py-4 sm:py-5 px-6 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 cursor-pointer ${disabledLaunch
                  ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400 border border-slate-300'
                  : 'hover:scale-[1.03] active:scale-[0.98] group'
                  }`}
              >
                {!disabledLaunch ? (
                  <div className="relative w-full flex items-center justify-center">
                    {/* Glowing Trans Pride Radial Ring */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#5BCEFA] via-[#F5A9B8] to-[#5BCEFA] opacity-80 blur-md group-hover:opacity-100 animate-pulse transition duration-300" />

                    <div className="relative w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center gap-2.5 border border-white/20">
                      <span className="text-xl text-[#5BCEFA] font-black">♠</span>
                      <span className="tracking-wider uppercase font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#5BCEFA] group-hover:to-[#F5A9B8] transition-colors">
                        PLAP ME, ROULETTE
                      </span>
                      <Shuffle className="w-5 h-5 text-[#F5A9B8] ml-1 group-hover:rotate-180 transition-transform duration-500" />
                    </div>
                  </div>
                ) : (
                  <span>No Matching Plap Vids for {userName}</span>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                Ready to lose control, {userName}? Safe 4s countdown with instant play
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Peek Matching Videos Toggle Pill */}
      <div className="text-center pt-2">
        <button
          onClick={onToggleShowLibrary}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 hover:border-slate-300 text-xs sm:text-sm font-black text-slate-800 hover:text-slate-950 shadow-sm transition-all cursor-pointer"
        >
          <span>♠ Peek Matching Plap Vids for {userName} ({matchingVideosCount})</span>
          {showLibrary ? (
            <ChevronUp className="w-4 h-4 text-[#F5A9B8]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5BCEFA]" />
          )}
        </button>
      </div>
    </div>
  );
}
