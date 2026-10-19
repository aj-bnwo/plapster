import React, { useState } from 'react';
import { MessageSquare, Check, Copy } from 'lucide-react';
import ajLogo from '../assets/creator_logo.png';
import plapsterLogo from '../assets/plapster_logo.png';

export default function Footer({ userName = 'darling' }) {
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyDiscord = () => {
    navigator.clipboard?.writeText('@jsissyjessie');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full relative z-10 flex-shrink-0 mt-12 sm:mt-20 border-t border-slate-200/80 bg-white/80 backdrop-blur-xl pt-8 pb-12 sm:py-12 px-4 sm:px-8 lg:px-12 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-[1500px] mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6">
        {/* Brand & Creator Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Plapster Official Logo Badge */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5BCEFA] to-[#F5A9B8] opacity-75 blur-xs group-hover:opacity-100 transition duration-300" />
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-md flex items-center justify-center p-1.5">
                <img
                  src={plapsterLogo}
                  alt="Plapster Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-left">
              <span className="text-base font-black text-slate-950 font-['Outfit'] block leading-tight">
                Plapster ♠
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Official Edition
              </span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          {/* AJ Creator Badge & Discord */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#5BCEFA] to-[#F5A9B8] opacity-75 blur-xs group-hover:opacity-100 transition duration-300" />
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white shadow-md flex items-center justify-center p-1">
                {!imgError ? (
                  <img
                    src={ajLogo}
                    alt="AJ Logo"
                    loading="eager"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                      imgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ) : null}

                {(!imgLoaded || imgError) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5BCEFA]/20 to-[#F5A9B8]/30 flex items-center justify-center font-black text-slate-900 text-xs">
                    AJ ♠
                  </div>
                )}
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-950 font-['Outfit']">
                  Created by AJ
                </span>
                <span className="text-[#5BCEFA] font-black">♠</span>
              </div>
              <button
                onClick={handleCopyDiscord}
                title="Click to copy Discord handle"
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] text-[11px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 fill-current flex-shrink-0" />
                <span>@jsissyjessie</span>
                {copied ? (
                  <Check className="w-2.5 h-2.5 text-emerald-600 ml-0.5" />
                ) : (
                  <Copy className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Seductive, Sassy, Evil Theme Message Personalized for userName */}
        <div className="w-full max-w-xl px-4 py-3.5 sm:py-4 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed italic break-words">
            "Resistance is completely futile, <strong className="text-slate-950 font-bold">{userName}</strong>. You know you can't stop at just one plap... sink deeper, let go of all control, and let the loop take over your thoughts. ♠"
          </p>
        </div>

        {/* Copyright & Trans Pride Palette */}
        <div className="space-y-1.5 text-xs text-slate-500 font-semibold">
          <p>
            © {new Date().getFullYear()} Plapster ♠ by AJ. All desires surrendered.
          </p>
          <p className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="text-[#5BCEFA] font-black">#5BCEFA</span>
            <span>•</span>
            <span className="text-slate-400 font-black">#FFFFFF</span>
            <span>•</span>
            <span className="text-[#F5A9B8] font-black">#F5A9B8</span>
            <span>—</span>
            <span>Trans Pride Power</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
