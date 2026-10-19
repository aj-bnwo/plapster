import React, { useState } from 'react';
import { ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import plapsterLogo from '../assets/plapster_logo.png';

export default function OnboardingModal({ onComplete }) {
  const [name, setName] = useState('');
  const [is18Plus, setIs18Plus] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!is18Plus) {
      setError('You must confirm you are at least 18 years old to proceed.');
      return;
    }

    const finalName = name.trim() || 'Darling';
    onComplete({
      name: finalName,
      is18Plus: true,
      agreedAt: Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-3xl border-2 border-white p-7 sm:p-9 shadow-2xl overflow-hidden scale-in-95 animate-in duration-200">
        {/* Subtle Ambient Orbs */}
        <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-[#5BCEFA]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full bg-[#F5A9B8]/30 blur-3xl pointer-events-none" />

        {/* Top Emblem with Official Plapster Logo */}
        <div className="text-center mb-6">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5BCEFA] to-[#F5A9B8] opacity-80 blur-md" />
            <div className="relative w-full h-full rounded-2xl bg-white border-2 border-white flex items-center justify-center shadow-md p-2 overflow-hidden">
              <img
                src={plapsterLogo}
                alt="Plapster Designer Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#5BCEFA]/20 text-slate-900 border border-[#5BCEFA]/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5BCEFA] fill-current" />
            <span>Welcome to Plapster</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-['Outfit']">
            Surrender Your Control
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 max-w-sm mx-auto">
            Before we let you enter, darling... we need to know who you are and ensure you're old enough to handle this.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Name Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              What should we call you, darling?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Good girl / Slut / Master / AJ / or your name..."
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#5BCEFA] focus:border-transparent transition-all shadow-inner"
              maxLength={30}
              autoFocus
            />
          </div>

          {/* 2. Age Gate Checkbox (18+) */}
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/90 shadow-2xs space-y-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={is18Plus}
                onChange={(e) => {
                  setIs18Plus(e.target.checked);
                  if (error) setError('');
                }}
                className="mt-0.5 w-5 h-5 rounded-md text-[#F5A9B8] border-slate-300 focus:ring-[#5BCEFA] cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                I confirm that I am at least <strong>18 years of age</strong> (adult) and consent to viewing adult niche Plap Vids. ♠
              </span>
            </label>

            {error && (
              <p className="text-xs font-bold text-red-500 pt-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-center text-slate-400 font-medium">
            🔒 Strictly client-side: your name and consent stay 100% in your browser.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!is18Plus}
            className={`w-full py-4 px-6 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all duration-300 cursor-pointer ${
              !is18Plus
                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400'
                : 'bg-gradient-to-r from-[#F5A9B8] to-[#5BCEFA] text-slate-950 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#F5A9B8]/30'
            }`}
          >
            <span>Enter Plapster</span>
            <span className="text-lg">♠</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
