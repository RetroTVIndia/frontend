"use client";

import { useRef, useState, useEffect } from "react";
import TVFrame from "./TVFrame";
import VideoPlayer from "./VideoPlayer";
import type { VideoPlayerHandle } from "./VideoPlayer";

export default function TV({ category }: { category?: string }) {
  const playerRef = useRef<VideoPlayerHandle | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Optional: keep local state in sync if player exposes isPlaying
  useEffect(() => {
    const check = () => setIsPlaying(!!playerRef.current?.isPlaying?.());
    check();
  }, []);

  return (
    <div className="flex justify-center">
      <TVFrame
        isPlaying={isPlaying}
        onToggle={() => {
          if (playerRef.current?.isPlaying?.()) {
            playerRef.current.stop();
            setIsPlaying(false);
          } else {
            playerRef.current?.play();
            setIsPlaying(true);
          }
        }}
        onNext={() => {
          if (!playerRef.current?.isPlaying?.()) return;
          playerRef.current?.playNext();
        }}
      >
        <VideoPlayer ref={playerRef} category={category} />
      </TVFrame>
    </div>
  );
}
