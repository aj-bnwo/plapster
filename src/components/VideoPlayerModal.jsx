import React, { useEffect, useRef, useState } from 'react';
import { X, Volume2 } from 'lucide-react';

export default function VideoPlayerModal({
  video,
  onClose,
  onVideoEnded,
}) {
  const videoRef = useRef(null);
  const [showUnmuteBadge, setShowUnmuteBadge] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    setShowUnmuteBadge(false);
    setIsUnmuted(false);

    // Attempt unmuted autoplay first
    videoEl.muted = false;
    const playPromise = videoEl.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsUnmuted(true);
        })
        .catch((err) => {
          console.warn('Unmuted autoplay blocked, falling back to muted:', err);
          videoEl.muted = true;
          videoEl.play()
            .then(() => {
              setShowUnmuteBadge(true);
            })
            .catch((playErr) => {
              console.error('Playback could not start:', playErr);
            });
        });
    }
  }, [video]);

  const handleUnmute = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = false;
      setIsUnmuted(true);
      setShowUnmuteBadge(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center animate-in fade-in duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Header Bar Overlay */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-none">
        {/* Video Info Pill */}
        <div className="bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 border border-white flex items-center gap-2 pointer-events-auto shadow-lg max-w-[75vw] sm:max-w-md">
          <span className="text-[#5BCEFA] font-black text-sm flex-shrink-0">♠</span>
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider hidden sm:inline">
            {video.category}
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-sm font-black text-slate-950 truncate">
            {video.title}
          </span>
        </div>

        {/* Apple Style Frosted Close Button */}
        <button
          onClick={onClose}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-slate-950 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer border border-white"
          title="Close player (Esc)"
          aria-label="Close video player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Frosted "Tap to Unmute 🔊" Badge */}
      {showUnmuteBadge && !isUnmuted && (
        <div className="absolute top-20 sm:top-24 z-30 pointer-events-auto animate-bounce">
          <button
            onClick={handleUnmute}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F5A9B8] to-[#5BCEFA] border-2 border-white text-slate-950 font-black text-sm shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>Tap to Unmute 🔊</span>
          </button>
        </div>
      )}

      {/* Video Viewport Container */}
      <div className="relative w-full h-full max-h-[92vh] max-w-[95vw] flex items-center justify-center p-2 sm:p-6">
        <video
          ref={videoRef}
          src={video.src}
          controls
          playsInline
          autoPlay
          onEnded={() => onVideoEnded(video)}
          className="max-h-full max-w-full rounded-2xl shadow-2xl bg-black object-contain border border-white/20"
        />
      </div>
    </div>
  );
}
