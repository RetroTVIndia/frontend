"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BACKEND_URL } from "@/lib/config";

interface Video {
  title: string;
  years: string;
  youtube_urls: string[];
  category?: string;
}

interface Props {
  category?: string;
  onShowChange?: (name: string) => void;
  onCategoryChange?: (category: string) => void;
}

export type VideoPlayerHandle = {
  play: () => void;
  stop: () => void;
  playNext: () => void;
  isPlaying?: () => boolean;
  // volume helpers: value range 0-100
  setVolume?: (v: number) => void;
  changeVolume?: (delta: number) => void;
  getVolume?: () => number;
  getShowName?: () => string;
};

function VideoPlayer(
  { category, onShowChange, onCategoryChange }: Props,
  ref: React.Ref<VideoPlayerHandle>,
) {
  const [video, setVideo] = useState<Video | null>(null);
  const [ytId, setYtId] = useState("");
  const playerRef = useRef<YTPlayer | null>(null);
  // The YouTube Player constructor accepts either an element id or an Element.
  // We'll store a real HTMLDivElement once it's mounted.
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(100);
  const [showName, setShowName] = useState("");

  // (Global YT typings live in `src/types/global.d.ts`.)

  // Load YT IFrame API once
  useEffect(() => {
    if (window.YT) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API Ready");
    };
  }, []);

  const getYouTubeId = (url: string) => {
    const ytRegex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = ytRegex.exec(url);
    // Use nullish coalescing to ensure we always return a string (never undefined)
    return match?.[1] ?? "";
  };

  const stopPlayback = () => {
    // If a YT player exists, destroy it to fully detach it from the DOM
    // and remove event listeners. This ensures a subsequent play() will
    // recreate a fresh player tied to the rendered iframe element.
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        // swallow any destruction errors but continue clearing state
        console.warn("Failed to destroy YT player:", err);
      }
      playerRef.current = null;
    }

    setPlaying(false);
    // Remove any iframe DOM inside the container so when we recreate a
    // YT.Player it can reattach cleanly.
    try {
      if (iframeRef.current) {
        iframeRef.current.innerHTML = "";
      }
    } catch (err) {
      console.warn("Failed to clear iframe container:", err);
    }

    setVideo(null);
    setYtId("");
    // Clear category when stopping
    try {
      onCategoryChange?.("");
    } catch (err) {
      console.warn("onCategoryChange callback failed:", err);
    }
  };

  const play = () => {
    console.debug(
      "VideoPlayer.play() called. playerRef.current:",
      playerRef.current,
      "ytId:",
      ytId,
    );

    if (playerRef.current) {
      try {
        playerRef.current.playVideo();
        setPlaying(true);
        return;
      } catch (err) {
        console.warn("playVideo failed, will try to refetch:", err);
        // fall through and fetch a fresh video
      }
    }

    // No player yet — load one by fetching a video (it will autoplay).
    void fetchRandomVideo();
  };

  const playNext = () => {
    void fetchRandomVideo();
  };

  const fetchRandomVideo = async (): Promise<void> => {
    console.debug("fetchRandomVideo: starting (will stop existing playback)");
    stopPlayback();

    const url = category
      ? `${BACKEND_URL}/random?category=${category}`
      : `${BACKEND_URL}/random`;

    const res = await fetch(url);
    if (!res.ok) {
      alert("Failed to fetch video");
      return;
    }

    // The backend guarantees this shape for /random
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await res.json();
    if (!data.youtube_urls || data.youtube_urls.length === 0) {
      alert("No videos available");
      return;
    }

    const randomUrl =
      data.youtube_urls[Math.floor(Math.random() * data.youtube_urls.length)]!;

    const id = getYouTubeId(randomUrl);
    setVideo(data);
    setYtId(id);
    // Do not use data.title. We'll obtain the canonical title from the
    // YouTube player once it's ready (via getVideoData().title) or when
    // playback begins. Clear current showName and let the player fill it.
    setShowName("");
    try {
      onShowChange?.("");
    } catch (err) {
      console.warn("onShowChange callback failed:", err);
    }
    // Extract category from backend response or use the filter category
    const videoCategory = data.category_name || category || "";
    try {
      onCategoryChange?.(videoCategory);
    } catch (err) {
      console.warn("onCategoryChange callback failed:", err);
    }
    console.debug("fetchRandomVideo: fetched and set ytId", id);
  };

  // Expose methods to parent via ref (after functions are defined)
  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(v)));
    setVolumeState(clamped);
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(clamped);
      } catch (err) {
        console.warn("Failed to set player volume:", err);
      }
    }
  };

  const changeVolume = (delta: number) => {
    setVolumeState((prev) => {
      const next = Math.max(0, Math.min(100, Math.round(prev + delta)));
      return next;
    });
  };

  // Whenever the `volume` state changes, apply it to the YT player if present.
  useEffect(() => {
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(volume);
      } catch (err) {
        console.warn("Failed to apply volume to player:", err);
      }
    }
  }, [volume]);

  useImperativeHandle(ref, () => ({
    play,
    stop: stopPlayback,
    playNext,
    isPlaying: () => playing,
    setVolume,
    changeVolume,
    getVolume: () => volume,
    getShowName: () => showName,
  }));

  // Create YT Player. Use a stable dependency array ([ytId]) to avoid
  // changing the hook signature between HMR updates. If `ytId` is set but
  // the DOM container hasn't mounted yet (`iframeRef.current` is null),
  // schedule a short retry so the player is created once the ref exists.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!ytId || !window.YT) return;

    const createPlayer = () => {
      if (!iframeRef.current) return;

      // At this point iframeRef.current is an HTMLDivElement and window.YT is
      // present; create the player.
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: ytId,
        playerVars: {
          enablejsapi: 1,
          playerapiid: "ytplayer",
          version: 3,
          autoplay: 0,
          autohide: 1,
          controls: 0,
          fs: 0,
          rel: 0,
          origin: window.location.origin,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          wmode: "opaque",
          playsinline: 1,
          widgetid: 1,
          disablekb: 1,
        },
        events: {
          onReady: (event: YTPlayerEvent) => {
            const duration = event.target.getDuration();
            console.log("Duration:", duration);

            // Try to read the canonical YouTube-provided title and inform parent.
            try {
              const info = event.target.getVideoData?.();
              const ytTitle = info?.title ?? "";
              if (ytTitle) {
                setShowName(ytTitle);
                try {
                  onShowChange?.(ytTitle);
                } catch (err) {
                  console.warn("onShowChange callback failed:", err);
                }
              }
            } catch (err) {
              console.warn("Failed to read YT title onReady:", err);
            }

            // Ensure player volume is initialized to our current state.
            try {
              if (typeof event.target.setVolume === "function") {
                event.target.setVolume(volume);
              }
            } catch (err) {
              console.warn("Failed to set initial volume:", err);
            }

            const safeStart = Math.max(
              5,
              Math.floor(Math.random() * (duration - 20)),
            );

            event.target.seekTo(safeStart, true);

            setTimeout(() => {
              event.target.playVideo();
            }, 100);
          },
          onError: () => {
            console.log("Video failed. Loading next...");
            void fetchRandomVideo();
          },
          onStateChange: (event: YTPlayerEvent) => {
            // PLAYING → hide our overlay that masks the iframe (prevents
            // YouTube's transient UI like title/overlay from showing).
            if (event.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              // When playback begins, refresh title from YT metadata.
              try {
                const info = event.target.getVideoData?.();
                const ytTitle = info?.title ?? "";
                if (ytTitle) {
                  setShowName(ytTitle);
                  try {
                    onShowChange?.(ytTitle);
                  } catch (err) {
                    console.warn("onShowChange callback failed:", err);
                  }
                }
              } catch (err) {
                console.warn("Failed to read YT title onStateChange:", err);
              }
            }

            // PAUSED or BUFFERING -> keep overlay hidden once played
            if (event.data === window.YT.PlayerState.PAUSED) {
              // leaving setPlaying(true) so UI stays visible to user
            }

            // END of video → pick next one and reset playing state
            if (event.data === window.YT.PlayerState.ENDED) {
              setPlaying(false);
              void fetchRandomVideo();
            }
          },
        },
      });
    };

    // If container is not yet mounted, retry shortly once.
    if (!iframeRef.current) {
      const t = window.setTimeout(() => {
        createPlayer();
      }, 50);

      return () => {
        window.clearTimeout(t);
      };
    }

    createPlayer();

    // Clean up previous player when ytId changes or the component unmounts.
    return () => {
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === "function") {
            playerRef.current.destroy();
          }
        } catch (err) {
          console.warn("Failed to cleanup YT player:", err);
        }
        playerRef.current = null;
      }
    };
  }, [ytId]);

  return (
    <div className="flex flex-col items-center gap-4">
      {video && (
        <div className="relative h-[550px] w-[1000px] overflow-hidden">
          <div
            ref={iframeRef}
            className="absolute left-[-40px] h-full w-full"
          ></div>

          {/* Overlay to mask initial YouTube UI until playback begins. */}
          <div
            aria-hidden
            // Make the overlay intercept pointer events while the player is
            // not playing (opacity 1) and also while playing we keep it on
            // the DOM with pointer handlers to prevent accidental clicks on
            // the iframe that would pause playback.
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              position: "absolute",
              inset: 0,
              background: "transparent",
              opacity: 1,
              pointerEvents: "auto",
              zIndex: 50,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default forwardRef(VideoPlayer);
