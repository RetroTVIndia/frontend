"use client";

import React, { useState, useEffect } from "react";
import { boolean } from "zod";

export default function TVFrame({ children, isPlaying, onToggle, onNext, onVolumeUp, onVolumeDown, showName }: { children: React.ReactNode; isPlaying?: boolean; onToggle?: () => void; onNext?: () => void; onVolumeUp?: () => void; onVolumeDown?: () => void; showName?: string }) {
  const [staticPrevOpacity, setStaticPrevOpacity] = useState("opacity-0");
  const staticCurrentOpacity = isPlaying
  ? (showName && showName.length > 0 ? "opacity-10" : "opacity-100")
  : "opacity-0";
  const shouldFade = staticPrevOpacity === "opacity-100" && staticCurrentOpacity === "opacity-10";
  const [enableFade, setEnableFade] = useState(false);

  useEffect(() => {
    const isFade = staticPrevOpacity === "opacity-100" && staticCurrentOpacity ===  "opacity-10";

    if (isFade) {
      // 1. Add transition immediately
      setEnableFade(true);

      // 2. Change opacity on NEXT FRAME
      requestAnimationFrame(() => {
        setStaticPrevOpacity(staticCurrentOpacity);
      });

    } else {
      // Always update instantly for all other transitions
      setEnableFade(false);
      setStaticPrevOpacity(staticCurrentOpacity);
    }
  }, [staticCurrentOpacity]);


  return (
    <div className="relative w-[1100px] mx-auto">
      {/* BLANK TV FRAME */}
      <img
        src="/tvbackclean.png"
        className="w-full pointer-events-none select-none z-60"
        alt="tv-frame"
      />

      {/* MAIN VIDEO SCREEN */}
      <div className="absolute top-[6px] left-[92px] w-[1000px] h-[550px] overflow-y-hidden">
        {children}
      </div>

      {/* STATIC OVERLAY */}
      <img
        src="/tvstatic.gif"
        aria-hidden
        className={`absolute top-[30px] left-[92px] w-[900px] h-[530px] 
          ${enableFade ? "transition-opacity duration-1200" : ""}
          ${staticPrevOpacity}
        `}
        style={{pointerEvents: "none" }}
      />

      {/* TV FRAME */}
      <img
        src="/tvstencil.png"
        className="w-full absolute top-[0px] inset-0 pointer-events-none select-none z-61"
        alt="tv-mask"
      />

      {/* Single toggle button (play/stop) */}
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Stop" : "Play"}
        className={`absolute top-[610px] left-[650.7px] w-[29] h-[29] rounded-full border-0 z-100 cursor-pointer`}
      >
      </button>

      {/* On light — only active while playing */}
      <div
        aria-hidden
        className={`absolute top-[617px] left-[589px] w-[16px] h-[16px] rounded-full border-0 z-100 tv-indicator-glow ease-in-out ${isPlaying ? 'opacity-100 tv-indicator-animated' : 'opacity-0'}`}
      />

      {/* Next button — only active while playing */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Next"
        className={`absolute top-[617.2px] left-[553px] w-[14px] h-[14px] rounded-full border-0 z-100 ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Previous button — only active while playing */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Previous"
        className={`absolute top-[617.2px] left-[526px] w-[14px] h-[14px] rounded-full border-0 z-100 ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Volume Down */}
      <button
        onClick={() => {
          onVolumeDown?.();
        }}
        aria-label="Volume Down"
        className={`absolute top-[617.2px] left-[497.3px] w-[14px] h-[14px] rounded-full border-0 z-100  ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Volume Up */}
      <button
        onClick={() => {
          onVolumeUp?.();
        }}
        aria-label="Volume Up"
        className={`absolute top-[617.2px] left-[469.9px] w-[14px] h-[14px] rounded-full border-0 z-100  ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        disabled={!isPlaying}
      />

      {/* Info text: show instruction when off, otherwise show show name */}
      <div className={`absolute top-[716px] left-[10px] w-full z-100 text-white text-center italic tv-info-glow tv-info-animated text-2xl`}>
        {isPlaying ? (showName && showName.length > 0 ? showName : "Loading...") : "Hit the play button to start"}
      </div>
    </div>
  );
}
