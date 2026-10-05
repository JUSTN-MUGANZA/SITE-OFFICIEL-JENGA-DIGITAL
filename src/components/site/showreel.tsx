"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Vidéo de présentation de l'agence : lecture automatique, muette et en boucle.
 * Elle repart d'elle-même à la fin, quand elle revient à l'écran ou quand l'onglet redevient visible
 * (certains téléphones l'arrêtent sinon). Seul le bouton pause l'arrête durablement ; elle démarre en
 * pause si le visiteur préfère réduire les animations.
 */
export function Showreel() {
  const ref = useRef<HTMLVideoElement>(null);
  // Pause choisie par le visiteur (bouton ou réglage « réduire les animations »).
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let onScreen = true;

    const resume = () => {
      if (userPaused.current || !onScreen || document.hidden) return;
      if (video.ended) video.currentTime = 0;
      if (video.paused) void video.play().catch(() => {});
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      userPaused.current = true;
      video.pause();
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) resume();
      else video.pause();
    });
    observer.observe(video);

    // Filet de sécurité : si la lecture s'arrête sans raison (fin de boucle ratée, économie d'énergie…), on relance.
    const watchdog = window.setInterval(resume, 2000);
    document.addEventListener("visibilitychange", resume);
    return () => {
      observer.disconnect();
      window.clearInterval(watchdog);
      document.removeEventListener("visibilitychange", resume);
    };
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
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
        preload="auto"
        poster="/video/jenga-presentation-poster.jpg"
        aria-label="Vidéo de présentation de JENGA Digital : nos services, notre approche et nos coordonnées à Bukavu."
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={(e) => {
          // Au cas où la boucle native ne repart pas (vu sur certains navigateurs mobiles).
          const video = e.currentTarget;
          video.currentTime = 0;
          void video.play().catch(() => {});
        }}
      >
        {/* Grand écran : 1080p ; téléphone et tablette : 720p, plus léger. MP4 d'abord (lu partout), WebM en secours. */}
        <source src="/video/jenga-presentation-1080.mp4" type="video/mp4" media="(min-width: 1024px)" />
        <source src="/video/jenga-presentation-1080.webm" type="video/webm" media="(min-width: 1024px)" />
        <source src="/video/jenga-presentation-720.mp4" type="video/mp4" />
        <source src="/video/jenga-presentation-720.webm" type="video/webm" />
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
