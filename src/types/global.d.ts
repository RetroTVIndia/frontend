// Add minimal YouTube IFrame API typings used in this project.
// Keep this file small to avoid shipping full lib defs.

interface YTPlayerEvent {
  target: any;
  data?: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};
