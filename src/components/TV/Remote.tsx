"use client";

import { useState } from "react";

export default function Remote({ isPlaying, onToggle, onNext, onVolumeUp, onVolumeDown }: { isPlaying?: boolean; onToggle?: () => void; onNext?: () => void; onVolumeUp?: () => void; onVolumeDown?: () => void; }) {
    const [flashCHUp, setFlashCHUp] = useState(false);
    const [flashCHDown, setFlashCHDown] = useState(false);
    const [flashVolUp, setFlashVolUp] = useState(false);
    const [flashVolDown, setFlashVolDown] = useState(false);
    const flashDelay = 1000; // 1 second flash

    function handleChannelUp() {
      if (!isPlaying) return;

      setFlashCHUp(true);
      setTimeout(() => setFlashCHUp(false), flashDelay);

      onNext?.();
    }

    function handleChannelDown() {
      if (!isPlaying) return;

      setFlashCHDown(true);
      setTimeout(() => setFlashCHDown(false), flashDelay);

      onNext?.();
    }

    function handleVolumeUp() {
      if (!isPlaying) return;

      setFlashVolUp(true);
      setTimeout(() => setFlashVolUp(false), flashDelay);

      onVolumeUp?.();
    }

    function handleVolumeDown() {
      if (!isPlaying) return;

      setFlashVolDown(true);
      setTimeout(() => setFlashVolDown(false), flashDelay);

      onVolumeDown?.();
    }

    return (
    <>
        <div className="absolute right-10 bottom-10 width-[40px] height-[40px] px-5 pt-4 pb-15 z-200 border-3 rounded-2xl remote">
            <ul className="flex flex-col gap-3">
                <li className={`border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center ${isPlaying ? 'remote-button-active text-green-500' : 'remote-button-deactive  text-red-500'}`}>
                    <button
                        className="text-2xl text-shadow-lg/25 cursor-pointer"
                        onClick={onToggle}
                    >
                        POWER
                    </button>
                </li>

                <li className={`border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center ${isPlaying ? 'remote-button-active' : 'remote-button-deactive'}`}>
                    <button 
                        className={`text-2xl text-shadow-lg/25 
                            ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}
                            ${flashCHUp ? 'text-green-500': 'text-black'}    
                        `}
                        onClick={handleChannelUp}
                        disabled={!isPlaying}
                    >
                        CH ▲
                    </button>
                </li>

                <li className={`border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center ${isPlaying ? 'remote-button-active' : 'remote-button-deactive'}`}>
                    <button 
                        className={`text-2xl text-shadow-lg/25 
                            ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}
                            ${flashCHDown ? 'text-green-500': 'text-black'} 
                        `}
                        onClick={handleChannelDown}
                        disabled={!isPlaying}
                    >
                        CH ▼
                    </button>
                </li>

                <li className={`border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center ${isPlaying ? 'remote-button-active' : 'remote-button-deactive'}`}>
                    <button 
                        className={`text-2xl text-shadow-lg/25 
                            ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}
                            ${flashVolUp ? 'text-green-500': 'text-black'} 
                        `}
                        onClick={handleVolumeUp}
                        disabled={!isPlaying}
                    >
                        VOL +
                    </button>
                </li>

                <li className={`border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center ${isPlaying ? 'remote-button-active' : 'remote-button-deactive'}`}>
                    <button 
                        className={`text-2xl text-shadow-lg/25 
                            ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}
                            ${flashVolDown ? 'text-green-500': 'text-black'} 
                        `}
                        onClick={handleVolumeDown}
                        disabled={!isPlaying}
                    >
                        VOL -
                    </button>
                </li>

                {/* <li className={`border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center><button class ${isPlaying ? 'remote-button-active' : 'remote-button-deactive'}`}Name="text-2xl text-shadow-lg/25 cursor-pointer">MENU</button></li> */}

            </ul>
        </div>
    </>
    );
}