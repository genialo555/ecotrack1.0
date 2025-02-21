'use client';

import { useEffect, useRef } from 'react';

export default function TestVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.error("Video playback failed:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-2xl aspect-video relative">
        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          style={{ background: 'black' }}
        >
          <source src="/videos/login.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>
    </div>
  );
}
