import React from 'react';
import { RotateCcw, X } from 'lucide-react';

export default function PostPlaybackToast({
  userName = 'darling',
  video,
  onReplay,
  onPickAnother,
  onDismiss,
}) {
  if (!video) return null;

  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-lg w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative rounded-full bg-white/95 backdrop-blur-xl border-2 border-white p-2 sm:p-2.5 shadow-2xl flex items-center justify-between gap-3">
        {/* Glow */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#5BCEFA]/60 via-white/50 to-[#F5A9B8]/60 blur-md -z-10" />

        {/* Info */}
        <div className="flex items-center gap-2 pl-3 min-w-0">
          <span className="text-[#5BCEFA] font-black text-lg flex-shrink-0">♠</span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">
              Session Finished for {userName}
            </p>
            <p className="text-xs font-black text-slate-900 truncate max-w-[140px] sm:max-w-[190px]">
              {video.title}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onReplay}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#F5A9B8]" />
            <span>Replay</span>
          </button>

          <button
            onClick={onPickAnother}
            className="px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#F5A9B8] to-[#5BCEFA] text-slate-950 hover:scale-105 active:scale-95 shadow-md shadow-[#F5A9B8]/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>♠</span>
            <span>Next Plap</span>
          </button>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
