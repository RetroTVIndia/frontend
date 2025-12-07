"use client";

import { useState, useRef, useEffect } from "react";

export default function Remote({
  isPlaying,
  onToggle,
  onNext,
  onVolumeUp,
  onVolumeDown,
}: {
  isPlaying?: boolean;
  onToggle?: () => void;
  onNext?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
}) {
  const [flashCHUp, setFlashCHUp] = useState(false);
  const [flashCHDown, setFlashCHDown] = useState(false);
  const [flashVolUp, setFlashVolUp] = useState(false);
  const [flashVolDown, setFlashVolDown] = useState(false);
  const flashDelay = 1000; // 1 second flash

  // Store timeout IDs for cleanup
  const timeoutCHUpRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutCHDownRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutVolUpRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutVolDownRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutCHUpRef.current) clearTimeout(timeoutCHUpRef.current);
      if (timeoutCHDownRef.current) clearTimeout(timeoutCHDownRef.current);
      if (timeoutVolUpRef.current) clearTimeout(timeoutVolUpRef.current);
      if (timeoutVolDownRef.current) clearTimeout(timeoutVolDownRef.current);
    };
  }, []);

  function handleChannelUp() {
    if (!isPlaying) return;

    // Clear any existing timeout
    if (timeoutCHUpRef.current) {
      clearTimeout(timeoutCHUpRef.current);
    }

    setFlashCHUp(true);
    timeoutCHUpRef.current = setTimeout(() => setFlashCHUp(false), flashDelay);

    onNext?.();
  }

  function handleChannelDown() {
    if (!isPlaying) return;

    // Clear any existing timeout
    if (timeoutCHDownRef.current) {
      clearTimeout(timeoutCHDownRef.current);
    }

    setFlashCHDown(true);
    timeoutCHDownRef.current = setTimeout(
      () => setFlashCHDown(false),
      flashDelay,
    );

    onNext?.();
  }

  function handleVolumeUp() {
    if (!isPlaying) return;

    // Clear any existing timeout
    if (timeoutVolUpRef.current) {
      clearTimeout(timeoutVolUpRef.current);
    }

    setFlashVolUp(true);
    timeoutVolUpRef.current = setTimeout(
      () => setFlashVolUp(false),
      flashDelay,
    );

    onVolumeUp?.();
  }

  function handleVolumeDown() {
    if (!isPlaying) return;

    // Clear any existing timeout
    if (timeoutVolDownRef.current) {
      clearTimeout(timeoutVolDownRef.current);
    }

    setFlashVolDown(true);
    timeoutVolDownRef.current = setTimeout(
      () => setFlashVolDown(false),
      flashDelay,
    );

    onVolumeDown?.();
  }

  return (
    <>
      <div className="width-[40px] height-[40px] remote absolute right-10 bottom-10 z-200 rounded-2xl border-3 px-5 pt-4 pb-15">
        <ul className="flex flex-col gap-3">
          <li
            className={`rounded-2xl border border-black text-center shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] ${isPlaying ? "remote-button-active text-green-500" : "remote-button-deactive text-red-500"}`}
          >
            <button
              className="cursor-pointer px-9 text-2xl text-shadow-lg/25 w-full rounded-2xl"
              onClick={onToggle}
            >
              POWER
            </button>
          </li>

          <li
            className={`rounded-2xl border border-black text-center shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] ${isPlaying ? "remote-button-active" : "remote-button-deactive"}`}
          >
            <button
              className={`text-2xl  px-9 text-shadow-lg/25 w-full rounded-2xl ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"} ${flashCHUp ? "text-green-500" : "text-black"} `}
              onClick={handleChannelUp}
              disabled={!isPlaying}
            >
              CH ▲
            </button>
          </li>

          <li
            className={`rounded-2xl border border-black text-center shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] ${isPlaying ? "remote-button-active" : "remote-button-deactive"}`}
          >
            <button
              className={`text-2xl  px-9 text-shadow-lg/25 w-full rounded-2xl ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"} ${flashCHDown ? "text-green-500" : "text-black"} `}
              onClick={handleChannelDown}
              disabled={!isPlaying}
            >
              CH ▼
            </button>
          </li>

          <li
            className={`rounded-2xl border border-black text-center shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] ${isPlaying ? "remote-button-active" : "remote-button-deactive"}`}
          >
            <button
              className={`text-2xl  px-9 text-shadow-lg/25 w-full rounded-2xl ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"} ${flashVolUp ? "text-green-500" : "text-black"} `}
              onClick={handleVolumeUp}
              disabled={!isPlaying}
            >
              VOL +
            </button>
          </li>

          <li
            className={`rounded-2xl border border-black text-center shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] ${isPlaying ? "remote-button-active" : "remote-button-deactive"}`}
          >
            <button
              className={`text-2xl  px-9 text-shadow-lg/25 w-full rounded-2xl ${isPlaying ? "cursor-pointer" : "cursor-not-allowed"} ${flashVolDown ? "text-green-500" : "text-black"} `}
              onClick={handleVolumeDown}
              disabled={!isPlaying}
            >
              VOL -
            </button>
          </li>

          {/* <li className={`border border-black rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center><button class ${isPlaying ? 'remote-button-active' : 'remote-button-deactive'}`}Name="text-2xl text-shadow-lg/25 cursor-pointer">MENU</button></li> */}
        </ul>
      </div>
    </>
  );
}
