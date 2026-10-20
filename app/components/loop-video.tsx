"use client";

import { useEffect, useRef, useState } from "react";

// A silent loop is decoration: it only plays without a reduced-motion preference, and it can always be paused.
export function LoopVideo({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative">
      <video ref={ref} muted loop playsInline preload="metadata" poster={poster} width={854} height={480} className={className} aria-hidden="true">
        <source src={src} type="video/webm" />
      </video>
      <button type="button" onClick={toggle} className="btn btn-quiet absolute bottom-3 right-3 min-h-11 px-4 py-2">
        {playing ? "Pause video" : "Play video"}
      </button>
    </div>
  );
}
