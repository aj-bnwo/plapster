import React, { useRef, useState } from 'react';
import { Play, Clock, Eye, Sparkles } from 'lucide-react';
import { formatDuration, getWatchBadgeInfo } from '../utils/videoScanner';

export default function VideoCard({
  video,
  history,
  onPlay,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const watchInfo = getWatchBadgeInfo(video.src || video.id, history);
  const isDurationLoaded = video.duration !== null && video.duration !== undefined;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } catch (e) {}
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
  };

  return (
    <div
      onClick={() => onPlay(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 hover:border-[#5BCEFA] transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-[#5BCEFA]/15"
    >
      {/* Video Preview Canvas */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 rounded-t-3xl">
        <video
          ref={videoRef}
          src={video.src}
          muted
          playsInline
          loop
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-95' : 'opacity-65'
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          {/* Category Pill */}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-800 border border-white flex items-center gap-1 shadow-xs">
            <span className="text-[#5BCEFA] font-black">♠</span>
            <span className="truncate max-w-[110px]">{video.category}</span>
          </span>

          {/* Watch Info Badge */}
          {watchInfo.isNew ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#5BCEFA] text-slate-950 shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>Fresh</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/85 text-slate-700 border border-white/60 shadow-xs flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 text-[#F5A9B8]" />
              <span>{watchInfo.label}</span>
            </span>
          )}
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-[#F5A9B8] border-2 border-white flex items-center justify-center text-slate-900 group-hover:text-slate-950 transition-all duration-300 shadow-xl group-hover:scale-110">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
        </div>

        {/* Bottom Duration Badge */}
        <div className="absolute bottom-2.5 right-3 z-10">
          {!isDurationLoaded ? (
            <div className="h-5 w-14 rounded-full shimmer-skeleton border border-white/40" />
          ) : (
            <div className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-950/80 text-white flex items-center gap-1 shadow-xs">
              <Clock className="w-3 h-3 text-[#5BCEFA]" />
              <span>{formatDuration(video.duration)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white/60">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#F5A9B8] transition-colors line-clamp-1">
            {video.title}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
            {video.filename}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1 group-hover:text-[#5BCEFA] transition-colors">
            Tap to Plap
          </span>
          <span className="text-[#F5A9B8] group-hover:translate-x-0.5 transition-transform">
            ♠ Play →
          </span>
        </div>
      </div>
    </div>
  );
}
