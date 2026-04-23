"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { type ProductionProduct } from "@/data/production.products";

const PLAYER_SYNC_EVENT = "zone21-production-preview-play";

interface ProductionMiniPlayerProps {
  products: ProductionProduct[];
}

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function SkipBackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M7 6.5a1 1 0 0 1 1 1V11l6.12-4.08A1 1 0 0 1 15.67 7.75v8.5a1 1 0 0 1-1.55.83L8 13v3.5a1 1 0 1 1-2 0v-9a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M17 6.5a1 1 0 0 0-1 1V11L9.88 6.92a1 1 0 0 0-1.55.83v8.5a1 1 0 0 0 1.55.83L16 13v3.5a1 1 0 1 0 2 0v-9a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M8.72 6.54a1 1 0 0 1 1.53-.85l8.2 5.46a1 1 0 0 1 0 1.66l-8.2 5.46a1 1 0 0 1-1.53-.84V6.54Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M8 6.5A1.5 1.5 0 0 1 9.5 5h1A1.5 1.5 0 0 1 12 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 8 17.5v-11Zm4 0A1.5 1.5 0 0 1 13.5 5h1A1.5 1.5 0 0 1 16 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 12 17.5v-11Z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M10.2 6.52a1 1 0 0 1 1.68.73v9.5a1 1 0 0 1-1.68.73L6.8 14.5H4.75A1.75 1.75 0 0 1 3 12.75v-1.5C3 10.28 3.78 9.5 4.75 9.5H6.8l3.4-2.98Z" />
      <path d="M15.28 9.14a1 1 0 0 1 1.41.06 4.2 4.2 0 0 1 0 5.6 1 1 0 1 1-1.47-1.35 2.2 2.2 0 0 0 0-2.9 1 1 0 0 1 .06-1.4Z" />
      <path d="M17.82 6.86a1 1 0 0 1 1.41.02 7.48 7.48 0 0 1 0 10.24 1 1 0 1 1-1.43-1.4 5.48 5.48 0 0 0 0-7.44 1 1 0 0 1 .02-1.42Z" />
    </svg>
  );
}

function WaveBars({ isPlaying }: { isPlaying: boolean }) {
  const bars = [30, 54, 36, 66, 44, 58, 32, 72, 48, 38, 62, 28];

  return (
    <div className="grid h-14 grid-cols-12 items-end gap-1">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={`rounded-full bg-[#C5B39B]/70 transition-all duration-500 ${
            isPlaying ? "opacity-100" : "opacity-50"
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function ControlButton({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#C5B39B]/18 bg-[#EAE8E3]/[0.05] text-[#EAE8E3] transition-colors duration-300 hover:bg-[#EAE8E3]/[0.09] disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function ProductionMiniPlayerCard({
  product,
}: {
  product: ProductionProduct;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rangeId = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  const previewSrc = product.preview?.src;
  const hasPreview = Boolean(previewSrc);
  const durationLabel =
    hasPreview && duration > 0
      ? formatTime(duration)
      : product.preview?.durationLabel ?? "0:45";

  useEffect(() => {
    function handlePlayerSync(event: Event) {
      const customEvent = event as CustomEvent<{ id?: string }>;

      if (customEvent.detail?.id === product.id) {
        return;
      }

      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }

    window.addEventListener(
      PLAYER_SYNC_EVENT,
      handlePlayerSync as EventListener,
    );

    return () => {
      window.removeEventListener(
        PLAYER_SYNC_EVENT,
        handlePlayerSync as EventListener,
      );
    };
  }, [product.id]);

  async function handleTogglePlayback() {
    if (!audioRef.current || !hasPreview) {
      return;
    }

    if (audioRef.current.paused) {
      window.dispatchEvent(
        new CustomEvent(PLAYER_SYNC_EVENT, {
          detail: { id: product.id },
        }),
      );

      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasError(false);
      } catch {
        setHasError(true);
        setIsPlaying(false);
      }

      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  }

  function handleSeek(nextValue: string) {
    if (!audioRef.current || !hasPreview) {
      return;
    }

    const nextTime = Number(nextValue);

    if (!Number.isFinite(nextTime)) {
      return;
    }

    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-[#C5B39B]/18 bg-[#121110] p-5 shadow-[0_40px_120px_rgba(18,17,16,0.28)] md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,179,155,0.18),_transparent_38%),radial-gradient(circle_at_85%_15%,_rgba(234,232,227,0.12),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C5B39B]/70 to-transparent" />

      <div className="relative grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
        <div className="relative aspect-square w-full max-w-[160px] overflow-hidden border border-[#C5B39B]/16 bg-[#1A1918] shadow-[0_0_0_1px_rgba(234,232,227,0.04)] lg:max-w-[180px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 160px, 180px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121110]/40 to-transparent" />
        </div>

        <div className="grid gap-5">
          <div className="grid gap-4 rounded-[1.75rem] border border-[#C5B39B]/14 bg-[#EAE8E3]/[0.04] p-4 shadow-[inset_0_1px_0_rgba(234,232,227,0.05)]">
            <div className="flex items-center justify-center gap-3 md:gap-5">
              <ControlButton disabled={!hasPreview}>
                <SkipBackIcon />
              </ControlButton>

              <button
                type="button"
                onClick={handleTogglePlayback}
                disabled={!hasPreview}
                aria-label={isPlaying ? "Mettre en pause" : "Lire le preview"}
                className="relative inline-flex h-24 w-24 items-center justify-center rounded-full border border-[#C5B39B]/65 bg-[#EAE8E3]/[0.07] text-[#F7F5F0] shadow-[0_0_0_1px_rgba(234,232,227,0.08),0_0_40px_rgba(197,179,155,0.18)] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="pointer-events-none absolute inset-2 rounded-full border border-[#C5B39B]/25" />
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <ControlButton disabled={!hasPreview}>
                <SkipForwardIcon />
              </ControlButton>

              <ControlButton disabled={!hasPreview}>
                <VolumeIcon />
              </ControlButton>
            </div>

            <div className="grid gap-3 rounded-[1.35rem] border border-[#C5B39B]/10 bg-[#121110]/52 p-4">
              <div className="flex items-end justify-between gap-4">
                <p className="font-serif text-2xl tracking-[-0.03em] text-[#EAE8E3] md:text-3xl">
                  {product.name}
                </p>
              </div>

              <div className="max-w-xl">
                <WaveBars isPlaying={isPlaying} />
              </div>

              <div>
                <label htmlFor={rangeId} className="sr-only">
                  Progression du preview de {product.name}
                </label>
                <input
                  id={rangeId}
                  type="range"
                  min="0"
                  max={duration || 1}
                  step="0.1"
                  value={Math.min(currentTime, duration || 1)}
                  onChange={(event) => handleSeek(event.target.value)}
                  disabled={!hasPreview}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#EAE8E3]/12 accent-[#C5B39B] disabled:cursor-not-allowed disabled:opacity-35"
                />

                <div className="mt-3 flex items-center justify-between font-sans text-[0.62rem] uppercase tracking-[0.18em] text-[#EAE8E3]/38">
                  <span>{formatTime(currentTime)}</span>
                  <span>{hasPreview ? formatTime(duration) : durationLabel}</span>
                </div>
              </div>
            </div>

            {hasError ? (
              <p className="font-sans text-sm font-light leading-relaxed text-[#C98D8D]">
                Lecture impossible.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {hasPreview ? (
        <audio
          ref={audioRef}
          preload="metadata"
          src={previewSrc}
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration || 0);
          }}
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onEnded={() => {
            setCurrentTime(0);
            setIsPlaying(false);
          }}
          onPause={() => {
            setIsPlaying(false);
          }}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onError={() => {
            setHasError(true);
            setIsPlaying(false);
          }}
        />
      ) : null}
    </article>
  );
}

export default function ProductionMiniPlayer({
  products,
}: ProductionMiniPlayerProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-8 md:px-12 md:pb-12">
      <div className="mb-8">
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-[#121110]/38">
          A decouvrir
        </p>
        <h2 className="mt-4 font-serif text-3xl leading-none tracking-[-0.03em] text-[#121110] md:text-5xl">
          Titre en lumiere
        </h2>
      </div>

      <div className="grid gap-8">
        {products.map((product) => (
          <ProductionMiniPlayerCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
