import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#F7F9FD]">
      {/* Sky Blue Orb (#5BCEFA) */}
      <div
        className="absolute -top-[12%] -left-[8%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full animate-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(91, 206, 250, 0.45) 0%, rgba(91, 206, 250, 0.18) 45%, transparent 75%)',
          filter: 'blur(110px)',
        }}
      />

      {/* Pastel Pink Orb (#F5A9B8) */}
      <div
        className="absolute top-[28%] -right-[10%] w-[62vw] h-[62vw] max-w-[850px] max-h-[850px] rounded-full animate-orb-2"
        style={{
          background: 'radial-gradient(circle, rgba(245, 169, 184, 0.45) 0%, rgba(245, 169, 184, 0.18) 45%, transparent 75%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Pure White / Sky Blue Center Sheen */}
      <div
        className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full animate-orb-3"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(91, 206, 250, 0.25) 40%, rgba(245, 169, 184, 0.25) 70%, transparent 80%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Subtle Apple-style clean dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.7) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
