"use client";

import React from "react";

export default function TVFrame({ children, isPlaying, onToggle, onNext, onVolumeUp, onVolumeDown, showName }: { children: React.ReactNode; isPlaying?: boolean; onToggle?: () => void; onNext?: () => void; onVolumeUp?: () => void; onVolumeDown?: () => void; showName?: string }) {
  console.log(showName);

  return (
    <div className="relative w-[900px] mx-auto">
      {/* TV FRAME */}
      <img
        src="/tvbackclean.webp"
        className="w-full pointer-events-none select-none z-60"
        alt="tv-frame"
      />

      {/* SCREEN SLOT */}
      <div className="absolute top-[30px] left-[92px] w-[715px] h-[420px] overflow-y-hidden">
        {children}
      </div>

      {/* GRAIN OVERLAY */}
      <img
        src="/tvstatic.gif"
        aria-hidden
        className={`absolute top-[30px] left-[92px] w-[715px] h-[435px] ${isPlaying ? (showName && showName.length > 0 ? "opacity-10" : "opacity-100") : "opacity-0"}`}
        style={{pointerEvents: "none" }}
      />

      {/* MASK OVERLAY */}
      <img
        src="/tvstencil.webp"
        className="w-full absolute top-[30px] inset-0 pointer-events-none select-none z-61"
        alt="tv-mask"
      />

      {/* Single toggle button (play/stop) */}
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Stop" : "Play"}
        className={`absolute top-[498px] left-[531px] w-[26px] h-[26px] rounded-full border-0 z-[60] cursor-pointer`}
      >
      </button>

      {/* On light — only active while playing */}
      <div
        aria-hidden
        className={`absolute top-[505px] left-[482px] w-[13px] h-[13px] rounded-full border-0 z-[60] tv-indicator-glow transition-opacity duration-700 ease-in-out ${isPlaying ? 'opacity-100 tv-indicator-animated' : 'opacity-0'}`}
      />

      {/* Previous button — only active while playing */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Previous"
        className={`absolute top-[504.5px] left-[429.5px] w-[13px] h-[13px] rounded-full bg-transparent border-0 z-[60] ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Next button — only active while playing */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Next"
        className={`absolute top-[504.5px] left-[451.5px] w-[13px] h-[13px] rounded-full bg-transparent border-0 z-[60] ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Volume Down */}
      <button
        onClick={() => {
          onVolumeDown?.();
        }}
        aria-label="Volume Down"
        className={`absolute top-[504.5px] left-[384px] w-[13px] h-[13px] rounded-full bg-transprent border-0 z-[60]  ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Volume Up */}
      <button
        onClick={() => {
          onVolumeUp?.();
        }}
        aria-label="Volume Up"
        className={`absolute top-[504.5px] left-[406.5px] w-[13px] h-[13px] rounded-full bg-transparent border-0 z-[60]  ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Info text: show instruction when off, otherwise show show name */}
      <div className={`absolute top-[587px] left-[10px] w-full z-[60] text-white text-center`}>
        <p className="tv-info-glow tv-info-animated italic">
          {isPlaying ? (showName && showName.length > 0 ? showName : "Loading...") : "Hit the play button to start"}
        </p>
      </div>
    </div>
  );
}
