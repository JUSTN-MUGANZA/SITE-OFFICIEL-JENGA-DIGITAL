"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Vidéo de présentation de l'agence : lecture automatique, muette et en boucle.
 * Un bouton permet de la mettre en pause ; elle reste en pause si le visiteur préfère réduire les animations.
 */
export function Showreel() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    // L'événement « pause » met ensuite le bouton à jour.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0a0e16] shadow-[0_40px_80px_-30px_rgba(10,14,22,0.55)] ring-1 ring-border">
      <video
        ref={ref}
        className="block aspect-video w-full"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/jenga-presentation-poster.jpg"
        aria-label="Vidéo de présentation de JENGA Digital : nos services, notre approche et nos coordonnées à Bukavu."
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {/* Grand écran : 1080p ; téléphone et tablette : 720p, plus léger. WebM d'abord, MP4 en secours. */}
        <source src="/video/jenga-presentation-1080.webm" type="video/webm" media="(min-width: 1024px)" />
        <source src="/video/jenga-presentation-1080.mp4" type="video/mp4" media="(min-width: 1024px)" />
        <source src="/video/jenga-presentation-720.webm" type="video/webm" />
        <source src="/video/jenga-presentation-720.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}
        className="absolute bottom-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:bottom-5 sm:right-5"
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
