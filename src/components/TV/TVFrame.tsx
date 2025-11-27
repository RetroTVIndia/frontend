"use client";

import React from "react";

export default function TVFrame({ children, isPlaying, onToggle, onNext, onVolumeUp, onVolumeDown }: { children: React.ReactNode; isPlaying?: boolean; onToggle?: () => void; onNext?: () => void; onVolumeUp?: () => void; onVolumeDown?: () => void }) {
  return (
    <div className="relative w-[900px] mx-auto">
      {/* TV FRAME */}
      <img
        src="/tvbackclean.webp"
        className="w-full pointer-events-none select-none"
        alt="tv-frame"
      />

      {/* SCREEN SLOT */}
      <div className="absolute top-[30px] left-[92px] w-[715px] h-[420px] overflow-y-hidden">
        {children}
      </div>

      {/* MASK OVERLAY */}
      <img
        src="/tvstencil.webp"
        className="w-full absolute top-[30px] inset-0 pointer-events-none select-none"
        alt="tv-mask"
      />

      {/* Single toggle button (play/stop) */}
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Stop" : "Play"}
        className={`absolute top-[498px] left-[531px] w-[26px] h-[26px] rounded-full border-0 z-[60]`}
      >
      </button>

      {/* On light — only active while playing */}
      <div
        aria-hidden
        className={`absolute top-[505px] left-[482px] w-[13px] h-[13px] rounded-full border-0 z-[60] bg-green-600 tv-indicator-glow transition-opacity duration-700 ease-in-out ${isPlaying ? 'opacity-100 tv-indicator-animated' : 'opacity-0'}`}
      />

      {/* Previous button — only active while playing */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Previous"
        className={`absolute top-[504.5px] left-[429.5px] w-[13px] h-[13px] rounded-full bg-transparent border-0 z-[60] ${isPlaying ? '' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Next button — only active while playing */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Next"
        className={`absolute top-[504.5px] left-[451.5px] w-[13px] h-[13px] rounded-full bg-transparent border-0 z-[60] ${isPlaying ? '' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Volume Down */}
      <button
        onClick={() => {
          onVolumeDown?.();
        }}
        aria-label="Volume Down"
        className={`absolute top-[504.5px] left-[384px] w-[13px] h-[13px] rounded-full bg-transprent border-0 z-[60]  ${isPlaying ? '' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Volume Up */}
      <button
        onClick={() => {
          onVolumeUp?.();
        }}
        aria-label="Volume Up"
        className={`absolute top-[504.5px] left-[406.5px] w-[13px] h-[13px] rounded-full bg-transparent border-0 z-[60]  ${isPlaying ? '' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />
    </div>
  );
}
