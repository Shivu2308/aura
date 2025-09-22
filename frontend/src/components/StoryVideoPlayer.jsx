import React, { useEffect, useRef } from "react";

const StoryVideoPlayer = ({ media, isPaused, onProgress }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPaused) {
      video.pause();
    } else {
      video.play().catch(() => {}); 
    }
  }, [isPaused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      onProgress(progress);

      if (progress >= 100) {
        // jab video khatam ho jaye
        onProgress(100);
      }
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [onProgress]);

  return (
    <video
      ref={videoRef}
      src={media}
      className="w-full h-full object-contain"
      playsInline
      preload="auto"
    />
  );
};

export default StoryVideoPlayer;
