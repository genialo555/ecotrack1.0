'use client';

import { useEffect, useRef } from 'react';

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setupVideo = async () => {
      try {
        // Configuration initiale
        video.playbackRate = 0.5;
        video.preload = 'auto';
        
        console.log('Starting video setup...');
        
        // Charger la vidéo
        await video.load();
        console.log('Video loaded');
        
        // Essayer de jouer la vidéo
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log('Video playing successfully');
        }
      } catch (error) {
        console.error('Error in video setup:', error);
      }
    };

    // Event listeners pour le débogage
    const onCanPlay = () => console.log('Video can play');
    const onPlaying = () => console.log('Video is playing');
    const onWaiting = () => console.log('Video is buffering');
    const onError = (e: Event) => console.error('Video error:', e);

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('error', onError);

    setupVideo();

    // Cleanup
    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/login.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
      
      {/* Overlay sombre optionnel */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default VideoSection;