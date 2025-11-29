// Minimal YouTube IFrame API typings used in this project.
// Keep this file intentionally small and focused.

declare global {
  interface YTPlayer {
    playVideo: () => void;
    stopVideo: () => void;
    destroy: () => void;
    setVolume: (volume: number) => void;
    getDuration: () => number;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getVideoData?: () => { title?: string } | undefined;
  }

  interface YTPlayerEvent {
    target: YTPlayer;
    data?: number;
  }

  interface YTNamespace {
    Player: new (
      element: HTMLElement | string,
      options: {
        videoId: string;
        playerVars?: Record<string, unknown>;
        events?: {
          onReady?: (event: YTPlayerEvent) => void;
          onStateChange?: (event: YTPlayerEvent) => void;
          onError?: (event: YTPlayerEvent) => void;
        };
      },
    ) => YTPlayer;
    PlayerState: {
      UNSTARTED: number;
      ENDED: number;
      PLAYING: number;
      PAUSED: number;
      BUFFERING: number;
      CUED: number;
    };
  }

  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};
