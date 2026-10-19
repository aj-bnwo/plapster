import React, { useEffect, useState, useRef } from 'react';
import { Play, X, RefreshCw, Clock, Eye, Sparkles } from 'lucide-react';
import { formatDuration, getWatchBadgeInfo } from '../utils/videoScanner';
import plapsterLogo from '../assets/plapster_logo.png';

export default function CountdownModal({
  userName = 'darling',
  video,
  history,
  onPlayImmediately,
  onCancel,
  onReroll,
  countdownSeconds = 4,
}) {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  const watchInfo = getWatchBadgeInfo(video.src || video.id, history);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, timeLeft / countdownSeconds);
  const strokeDashoffset = circumference - progressRatio * circumference;

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTimeLeft(countdownSeconds);

    const interval = 50;
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, countdownSeconds - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        onPlayImmediately();
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [video, countdownSeconds, onPlayImmediately]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter' || e.key === ' ') {
        onPlayImmediately();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, onPlayImmediately]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-white p-6 sm:p-8 shadow-2xl overflow-hidden scale-in-95 animate-in duration-200">
        {/* Ambient Trans Pride Orbs */}
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-[#5BCEFA]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-[#F5A9B8]/30 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Cancel countdown"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#5BCEFA]/25 text-slate-900 border border-[#5BCEFA]/40 mb-2">
            <img src={plapsterLogo} alt="Logo" className="w-3.5 h-3.5 object-contain" />
            <span>Roulette Picked for {userName}</span>
          </span>
          <h2 className="text-2xl font-black text-slate-950 tracking-tight font-['Outfit']">
            Plap Incoming, {userName}...
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Hold tight, {userName} — activating stream now
          </p>
        </div>

        {/* Circular Countdown Progress Ring */}
        <div className="relative w-28 h-28 mx-auto my-3 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-200"
              strokeWidth="6"
              fill="transparent"
            />
            <defs>
              <linearGradient id="transPrideCountdownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5BCEFA" />
                <stop offset="50%" stopColor="#F5A9B8" />
                <stop offset="100%" stopColor="#5BCEFA" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#transPrideCountdownGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 60ms linear' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-950 font-mono tracking-tighter">
              {Math.ceil(timeLeft)}
            </span>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#F5A9B8]">
              sec
            </span>
          </div>
        </div>

        {/* Video Preview Snapshot */}
        <div className="my-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
          <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-200">
            <video
              src={video.src}
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-base font-black">♠</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-[#5BCEFA] uppercase tracking-wider">
                {video.category}
              </span>
              <span className="text-slate-300">•</span>
              {watchInfo.isNew ? (
                <span className="text-[10px] font-black text-[#F5A9B8] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Fresh
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                  <Eye className="w-2.5 h-2.5 text-[#F5A9B8]" />
                  {watchInfo.label}
                </span>
              )}
            </div>
            <h4 className="text-sm font-black text-slate-900 truncate">
              {video.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-bold">
              <Clock className="w-3 h-3 text-[#5BCEFA]" />
              <span>{formatDuration(video.duration)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {/* Play Immediately */}
          <button
            onClick={onPlayImmediately}
            className="w-full sm:flex-1 py-3 px-5 rounded-full font-black text-sm bg-gradient-to-r from-[#F5A9B8] to-[#5BCEFA] text-slate-950 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#F5A9B8]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Plap Now, {userName}</span>
          </button>

          {/* Reroll */}
          <button
            onClick={onReroll}
            className="w-full sm:w-auto py-3 px-4 rounded-full font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5BCEFA]" />
            <span>Reroll</span>
          </button>

          {/* Cancel */}
          <button
            onClick={onCancel}
            className="w-full sm:w-auto py-3 px-4 rounded-full font-bold text-xs sm:text-sm text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
