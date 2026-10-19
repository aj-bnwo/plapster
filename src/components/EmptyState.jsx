import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function EmptyState({ userName = 'darling', onResetFilters, currentCategory, currentDuration }) {
  return (
    <div className="w-full max-w-lg mx-auto my-8 p-8 rounded-3xl bg-white/85 backdrop-blur-xl border-2 border-white text-center shadow-lg">
      <div className="relative mx-auto w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#5BCEFA]/40 to-[#F5A9B8]/40 blur-lg" />
        <div className="relative w-full h-full rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-xs">
          <span className="text-2xl font-black text-[#F5A9B8]">♠</span>
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 font-['Outfit']">
        No Matching Plap Vids for {userName}
      </h3>

      <p className="text-sm font-medium text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
        {currentCategory !== 'All' || currentDuration !== 'All' ? (
          <>
            Don't worry, <strong className="text-slate-900">{userName}</strong>... no Plap Vids currently match category <strong className="text-slate-900">"{currentCategory}"</strong> with duration <strong className="text-slate-900">"{currentDuration}"</strong>.
          </>
        ) : (
          `No videos found in this pool, ${userName}. Reset your specs to explore everything.`
        )}
      </p>

      <button
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black bg-gradient-to-r from-[#F5A9B8] to-[#5BCEFA] text-slate-950 hover:scale-105 active:scale-95 shadow-md shadow-[#F5A9B8]/30 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset Specs to All</span>
      </button>
    </div>
  );
}
