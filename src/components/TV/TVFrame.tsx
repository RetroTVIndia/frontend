"use client";

import React, { useState, useEffect } from "react";

export default function TVFrame({
  children,
  isPlaying,
  onToggle,
  onNext,
  onVolumeUp,
  onVolumeDown,
  showName,
  category,
}: {
  children: React.ReactNode;
  isPlaying?: boolean;
  onToggle?: () => void;
  onNext?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  showName?: string;
  category?: string;
}) {
  const [staticPrevOpacity, setStaticPrevOpacity] = useState("opacity-0");
  const staticCurrentOpacity = isPlaying
    ? showName && showName.length > 0
      ? "opacity-10"
      : "opacity-100"
    : "opacity-0";
  const [enableFade, setEnableFade] = useState(false);
  const [categoryOpacity, setCategoryOpacity] = useState("opacity-100");

  useEffect(() => {
    const isFade =
      staticPrevOpacity === "opacity-100" &&
      staticCurrentOpacity === "opacity-10";

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

  // Handle category fade-out animation
  useEffect(() => {
    const shouldShow =
      isPlaying &&
      category &&
      category.length > 0 &&
      showName &&
      showName.length > 0;

    if (shouldShow) {
      // Reset to visible when category appears
      setCategoryOpacity("opacity-100");

      // Start fading after 2 seconds
      const fadeTimer = setTimeout(() => {
        setCategoryOpacity("opacity-0");
      }, 2000);

      return () => {
        clearTimeout(fadeTimer);
      };
    } else {
      // Immediately hide when condition is no longer met
      setCategoryOpacity("opacity-0");
    }
  }, [isPlaying, category, showName]);

  return (
    <div className="relative mx-auto w-[1100px]">
      {/* -------------- MAIN TV UI -------------- */}
      {/* Blank TV Screen */}
      <img
        src="/tvbackclean.png"
        className="pointer-events-none z-60 w-full select-none"
        alt="tv-frame"
      />

      {/* Main Video Player */}
      <div className="absolute top-[6px] left-[92px] h-[550px] w-[1000px] overflow-y-hidden">
        {children}
      </div>

      {/* Static Overlay */}
      <img
        src="/tvstatic.gif"
        aria-hidden
        className={`absolute top-[30px] left-[92px] h-[530px] w-[900px] ${enableFade ? "transition-opacity duration-1200" : ""} ${staticPrevOpacity} `}
        style={{ pointerEvents: "none" }}
      />

      {/* TV Frame */}
      <img
        src="/tvstencil.png"
        className="pointer-events-none absolute inset-0 top-[0px] z-61 w-full select-none"
        alt="tv-mask"
      />

      {/* -------------- TV BUTTONS -------------- */}
      {/* Play/Stop */}
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Stop" : "Play"}
        className={`absolute top-[610px] left-[650.7px] z-100 h-[29] w-[29] cursor-pointer rounded-full border-0`}
      ></button>

      {/* On light */}
      <div
        aria-hidden
        className={`tv-indicator-glow absolute top-[617px] left-[589px] z-100 h-[16px] w-[16px] rounded-full border-0 ease-in-out ${isPlaying ? "tv-indicator-animated opacity-100" : "opacity-0"}`}
      />

      {/* Next button */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Next"
        className={`absolute top-[617.2px] left-[553px] z-100 h-[14px] w-[14px] rounded-full border-0 ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"}`}
        disabled={!isPlaying}
      />

      {/* Previous button */}
      <button
        onClick={() => {
          if (!isPlaying) return;
          onNext?.();
        }}
        aria-label="Previous"
        className={`absolute top-[617.2px] left-[526px] z-100 h-[14px] w-[14px] rounded-full border-0 ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"}`}
        disabled={!isPlaying}
      />

      {/* Volume Up */}
      <button
        onClick={() => {
          onVolumeUp?.();
        }}
        aria-label="Volume Up"
        className={`absolute top-[617.2px] left-[497.3px] z-100 h-[14px] w-[14px] rounded-full border-0 ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"}`}
        disabled={!isPlaying}
      />

      {/* Volume Down */}
      <button
        onClick={() => {
          onVolumeDown?.();
        }}
        aria-label="Volume Down"
        className={`absolute top-[617.2px] left-[469.9px] z-100 h-[14px] w-[14px] rounded-full border-0 ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"}`}
        disabled={!isPlaying}
      />

      {/* -------------- INFO TEXT -------------- */}
      {isPlaying &&
        category &&
        category.length > 0 &&
        showName &&
        showName.length > 0 && (
          <div
            className={`absolute top-[80px] right-[170px] z-[100] bg-black/50 px-5 text-2xl text-green-500 transition-opacity duration-1000 ${categoryOpacity}`}
          >
            {category}
          </div>
        )}

      {/* Info text */}
      <div
        className={`tv-info-glow tv-info-animated absolute top-[716px] left-[10px] z-100 w-full text-center text-2xl text-white italic`}
      >
        {isPlaying
          ? showName && showName.length > 0
            ? showName
            : "Loading..."
          : "Hit the play button to start"}
      </div>
    </div>
  );
}
