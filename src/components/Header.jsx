import React from 'react';
import { History, Flame, Clock, CheckCircle2, Sparkles, ShieldCheck, User } from 'lucide-react';
import { formatMinutesTotal } from '../utils/videoScanner';
import plapsterLogo from '../assets/plapster_logo.png';

export default function Header({
  userName,
  onEditUserName,
  totalVideos,
  watchedCount,
  totalSecondsPlapped,
  daysStreak,
  onClearHistory,
}) {
  const unwatchedCount = Math.max(0, totalVideos - watchedCount);

  return (
    <header className="relative w-full pt-6 pb-6 px-4 sm:px-8 lg:px-12 max-w-[1500px] mx-auto">
      {/* Top Navigation Row: Brand + User Greeting + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pb-6 border-b border-slate-200/80">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Prominent, Large & Fully Uncropped Designer Logo */}
          <div className="relative group cursor-pointer flex-shrink-0">
            <img
              src={plapsterLogo}
              alt="Plapster Logo"
              className="h-40 sm:h-48 lg:h-56 w-auto object-contain drop-shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 font-['Outfit']">
                Plapster
              </h1>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-600 mt-1 flex items-center gap-1.5">
              <span>Plap it away!</span>
              <span className="text-[#F5A9B8] font-black">♠</span>
              <span className="text-slate-400 font-normal hidden sm:inline">Surrender to the BNWO</span>
            </p>
          </div>
        </div>

        {/* User Profile Tag & History Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* User Name Pill */}
          {userName && (
            <button
              onClick={onEditUserName}
              title="Click to change your nickname"
              className="px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 hover:text-slate-950 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#5BCEFA]" />
              <span>
                Hey, <strong className="text-slate-950">{userName}</strong>
              </span>
              <span className="text-[#F5A9B8] font-black">♠</span>
            </button>
          )}

          {/* Reset History */}
          {watchedCount > 0 && (
            <button
              onClick={onClearHistory}
              title="Reset Plap History"
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200/80 transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <History className="w-4 h-4 text-[#F5A9B8]" />
              <span className="text-xs font-bold hidden sm:inline">Reset History</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar Cards (Wide Expansive Row) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5">
        {/* Stat 1: Minutes Plapped */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#5BCEFA]/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-[#5BCEFA]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Minutes Plapped</p>
            <p className="text-lg sm:text-xl font-black text-slate-950 truncate">
              {formatMinutesTotal(totalSecondsPlapped)}
            </p>
          </div>
        </div>

        {/* Stat 2: Vids Watched */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5A9B8]/25 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#F5A9B8]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Vids Watched</p>
            <p className="text-lg sm:text-xl font-black text-slate-950 truncate">
              {watchedCount} <span className="text-xs font-bold text-slate-400">/ {totalVideos}</span>
            </p>
          </div>
        </div>

        {/* Stat 3: Days Streak */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Days Streak</p>
            <p className="text-lg sm:text-xl font-black text-slate-950 truncate">
              {daysStreak > 0 ? `${daysStreak} Day${daysStreak > 1 ? 's' : ''}` : 'Start Today!'}
            </p>
          </div>
        </div>

        {/* Stat 4: Fresh Queue */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#5BCEFA]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#5BCEFA]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Fresh Queue</p>
            <p className="text-lg sm:text-xl font-black text-slate-950 truncate">
              {unwatchedCount} <span className="text-xs font-bold text-slate-400">unplapped</span>
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Assurance Banner */}
      <div className="mt-3.5 px-4 py-2 rounded-xl bg-white/60 border border-slate-200/60 backdrop-blur-md flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-slate-700">
            100% Client-Side Privacy:
          </span>
          <span className="hidden sm:inline">
            All files, watch history, and streaks stay exclusively on your browser. Zero tracking, zero external uploads.
          </span>
          <span className="sm:hidden">
            Local browser storage only. Zero tracking.
          </span>
        </div>
        <span className="text-[#5BCEFA] font-black text-xs">♠</span>
      </div>
    </header>
  );
}
