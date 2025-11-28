"use client";

import { useRef, useState, useEffect } from "react";
import TVFrame from "./TVFrame";
import VideoPlayer from "./VideoPlayer";
import type { VideoPlayerHandle } from "./VideoPlayer";

export default function TV({ category }: { category?: string }) {
  const playerRef = useRef<VideoPlayerHandle | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showName, setShowName] = useState<string | undefined>(undefined);

  // Optional: keep local state in sync if player exposes isPlaying
  useEffect(() => {
    const check = () => setIsPlaying(!!playerRef.current?.isPlaying?.());
    check();
  }, []);

  // When playback is active, poll the player for the show name until available.
  // Use onShowChange callback from VideoPlayer to update showName (no polling).

  return (
    <div className="flex justify-center">
      <TVFrame
        isPlaying={isPlaying}
        onToggle={() => {
          if (playerRef.current?.isPlaying?.()) {
            playerRef.current.stop();
            setIsPlaying(false);
            setShowName(undefined);
          } else {
            playerRef.current?.play();
            setIsPlaying(true);
            // clear current show name and let the poller pick up the new name
            setShowName(undefined);
          }
        }}
        onNext={() => {
          if (!playerRef.current?.isPlaying?.()) return;
          playerRef.current?.playNext();
          // clear show name so UI shows loading until poller updates it
          setShowName(undefined);
        }}
        showName={showName}
        onVolumeUp={() => {
          // increase by 10
          playerRef.current?.changeVolume?.(10);
        }}
        onVolumeDown={() => {
          // decrease by 10
          playerRef.current?.changeVolume?.(-10);
        }}
      >
  <VideoPlayer ref={playerRef} category={category} onShowChange={(name) => setShowName(name)} />
      </TVFrame>
    </div>
  );
}
