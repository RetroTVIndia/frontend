"use client";

export default function Remote({ isPlaying, onToggle, onNext, onVolumeUp, onVolumeDown }: { isPlaying?: boolean; onToggle?: () => void; onNext?: () => void; onVolumeUp?: () => void; onVolumeDown?: () => void; }) {
  return (
    <>
        <div className="absolute right-10 bottom-10 width-[40px] height-[40px] px-5 pt-4 pb-15 z-200 border-3 rounded-2xl remote">
            <ul className="flex flex-col gap-3">
                <li className="border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center">
                    <button
                        className="text-2xl text-shadow-lg/25 cursor-pointer"
                        onClick={onToggle}
                    >
                        POWER
                    </button>
                </li>

                <li className="border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center">
                    <button 
                        className={`text-2xl text-shadow-lg/25 ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => {
                            if (!isPlaying) return;
                            onNext?.();
                        }}
                        disabled={!isPlaying}
                    >
                        CH ▲
                    </button>
                </li>

                <li className="border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center">
                    <button 
                        className={`text-2xl text-shadow-lg/25 ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => {
                            if (!isPlaying) return;
                            onNext?.();
                        }}
                        disabled={!isPlaying}
                    >
                        CH ▼
                    </button>
                </li>

                <li className="border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center">
                    <button 
                        className={`text-2xl text-shadow-lg/25 ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => {
                            if (!isPlaying) return;
                            onVolumeUp?.();
                        }}
                        disabled={!isPlaying}
                    >
                        VOL +
                    </button>
                </li>

                <li className="border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center">
                    <button 
                        className={`text-2xl text-shadow-lg/25 ${isPlaying ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => {
                            if (!isPlaying) return;
                            onVolumeDown?.();
                        }}
                        disabled={!isPlaying}
                    >
                        VOL -
                    </button>
                </li>

                <li className="border border-black px-9 rounded-2xl shadow-[0_0px_9px_4px_rgba(0,0,0,0.6)] text-center"><button className="text-2xl text-shadow-lg/25 cursor-pointer">MENU</button></li>

            </ul>
        </div>
    </>
  );
}