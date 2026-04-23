"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import {
  formatProductionPrice,
  type ProductionEdition,
  type ProductionProduct,
  type ProductionSellable,
  type ProductionTrack,
} from "@/data/production.products";

import { useProductionCart } from "../cart/ProductionCartProvider";

const PLAYER_SYNC_EVENT = "zone21-production-product-play";

interface ProductionProductExperienceProps {
  artistName: string;
  artistSlug: string;
  product: ProductionProduct;
}

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

function PurchaseButton({
  label,
  onClick,
  subtle = false,
  inverted = false,
}: {
  label: string;
  onClick: () => void;
  subtle?: boolean;
  inverted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        subtle
          ? inverted
            ? "inline-flex items-center justify-center rounded-full border border-[#EAE8E3]/14 bg-[#EAE8E3]/[0.06] px-5 py-3 text-[#EAE8E3] transition-colors duration-300 hover:bg-[#EAE8E3]/[0.12]"
            : "inline-flex items-center justify-center rounded-full border border-[#121110]/12 px-5 py-3 text-[#121110] transition-colors duration-300 hover:border-[#121110]/28"
          : "inline-flex items-center justify-center rounded-full bg-[#121110] px-5 py-3 text-[#F7F5F0] transition-colors duration-300 hover:bg-[#2A2826]"
      }
    >
      <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em]">
        {label}
      </span>
    </button>
  );
}

export default function ProductionProductExperience({
  artistName,
  artistSlug,
  product,
}: ProductionProductExperienceProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rangeId = useId();
  const { addItem } = useProductionCart();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const previewSrc = product.preview?.src;
  const hasPreview = Boolean(previewSrc);
  const tracks = product.tracks ?? [];
  const editions = product.editions ?? [];
  const durationLabel =
    hasPreview && duration > 0
      ? formatTime(duration)
      : product.preview?.durationLabel ?? "0:45";

  useEffect(() => {
    function handlePlayerSync(event: Event) {
      const customEvent = event as CustomEvent<{ id?: string }>;

      if (customEvent.detail?.id !== product.id) {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
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

      await audioRef.current.play();
      setIsPlaying(true);
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

  function addToCart(item: ProductionSellable, message: string) {
    addItem(item);
    setFeedbackMessage(message);
  }

  function handleAddAlbum() {
    addToCart(product, `${product.name} a été ajouté au panier.`);
  }

  function handleAddTrack(track: ProductionTrack) {
    addToCart(track, `${track.name} a été ajouté au panier.`);
  }

  function handleAddEdition(edition: ProductionEdition) {
    addToCart(edition, `${edition.name} a été ajouté au panier.`);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#121110] text-[#EAE8E3]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,179,155,0.22),_transparent_34%),radial-gradient(circle_at_80%_0%,_rgba(234,232,227,0.14),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.03),_rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#171615]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-36 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-end">
          <div className="relative aspect-square w-full max-w-[300px] overflow-hidden bg-[#1B1A19] shadow-[0_26px_80px_rgba(0,0,0,0.35)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 300px, 300px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121110]/32 to-transparent" />
          </div>

          <div className="flex flex-col gap-5">
            <Link
              href={`/prod/${artistSlug}`}
              className="w-fit font-sans text-[0.65rem] uppercase tracking-[0.24em] text-[#EAE8E3]/46 transition-colors duration-300 hover:text-[#EAE8E3]"
            >
              {artistName}
            </Link>

            <div>
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-[#C5B39B]">
                {product.kind}
              </p>
              <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-[#EAE8E3] md:text-7xl lg:text-[5.8rem]">
                {product.name}
              </h1>
            </div>

            <p className="max-w-3xl font-sans text-base font-light leading-relaxed text-[#EAE8E3]/68 md:text-lg">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-[#EAE8E3]/52">
              <span>{tracks.length || 1} pistes</span>
              <span className="h-3 w-px bg-[#EAE8E3]/12" />
              <span>{durationLabel}</span>
              <span className="h-3 w-px bg-[#EAE8E3]/12" />
              <span>{formatProductionPrice(product.priceCents, product.currency)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#EAE8E3]/8 bg-[#171615] text-[#EAE8E3]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-6 py-6 md:px-12">
          <button
            type="button"
            onClick={handleTogglePlayback}
            disabled={!hasPreview}
            aria-label={isPlaying ? "Mettre en pause" : "Lire le preview"}
            className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#C5B39B] text-[#121110] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <PurchaseButton label="Acheter l'album" onClick={handleAddAlbum} />

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-[#EAE8E3]/10 px-7 py-4 text-[#EAE8E3]/74 transition-colors duration-300 hover:border-[#EAE8E3]/22 hover:text-[#EAE8E3]"
          >
            <span className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em]">
              Demande privée
            </span>
          </Link>

          {feedbackMessage ? (
            <p className="font-sans text-sm font-light leading-relaxed text-[#C5B39B]">
              {feedbackMessage}
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-[#F7F5F0]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="rounded-[2rem] bg-[#121110] p-5 text-[#EAE8E3] shadow-[0_24px_80px_rgba(18,17,16,0.12)] md:p-7">
            <div className="flex items-end justify-between gap-4 border-b border-[#EAE8E3]/10 pb-5">
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-[#EAE8E3]/36">
                  Album Tracklist
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[#EAE8E3]">
                  Titres disponibles
                </h2>
              </div>

              <div className="font-sans text-[0.66rem] uppercase tracking-[0.18em] text-[#C5B39B]">
                Acheter chaque piste
              </div>
            </div>

            <div className="mt-4 rounded-[1.3rem] border border-[#EAE8E3]/8 bg-[#EAE8E3]/[0.03] p-4">
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

            <div className="mt-4 space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="grid gap-4 rounded-[1.4rem] border border-[#EAE8E3]/8 px-4 py-5 md:grid-cols-[68px_minmax(0,1fr)_110px_120px_170px] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTogglePlayback}
                      disabled={!hasPreview}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#EAE8E3]/[0.06] text-[#EAE8E3] transition-colors duration-300 hover:bg-[#EAE8E3]/[0.1] disabled:cursor-default disabled:opacity-40"
                    >
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <span className="font-sans text-[0.66rem] uppercase tracking-[0.2em] text-[#EAE8E3]/46">
                      {track.trackNumber.toString().padStart(2, "0")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-serif text-2xl tracking-[-0.03em] text-[#EAE8E3]">
                      {track.name}
                    </p>
                    <p className="mt-2 truncate font-sans text-sm font-light leading-relaxed text-[#EAE8E3]/54">
                      {track.shortDescription}
                    </p>
                  </div>

                  <div className="font-sans text-[0.64rem] uppercase tracking-[0.18em] text-[#EAE8E3]/46">
                    {track.kind}
                  </div>

                  <div className="font-sans text-[0.64rem] uppercase tracking-[0.18em] text-[#C5B39B]">
                    {formatProductionPrice(track.priceCents, track.currency)}
                  </div>

                  <div className="flex items-center justify-start md:justify-end">
                    <PurchaseButton
                      label={track.ctaLabel ?? "Acheter la piste"}
                      onClick={() => handleAddTrack(track)}
                      subtle
                      inverted
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[#121110]/10 bg-white px-6 py-6">
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.26em] text-[#121110]/38">
                Album complet
              </p>
              <h3 className="mt-4 font-serif text-3xl text-[#121110]">
                {product.name}
              </h3>
              <p className="mt-4 font-sans text-base font-light leading-relaxed text-[#121110]/66">
                {product.description}
              </p>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#121110]/8 pt-5">
                <span className="font-sans text-[0.66rem] uppercase tracking-[0.18em] text-[#121110]/42">
                  Prix album
                </span>
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#121110]">
                  {formatProductionPrice(product.priceCents, product.currency)}
                </span>
              </div>

              <div className="mt-6">
                <PurchaseButton
                  label="Acheter l'album complet"
                  onClick={handleAddAlbum}
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#121110]/10 bg-white px-6 py-6">
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.26em] text-[#121110]/38">
                Inclus
              </p>
              <div className="mt-5 grid gap-3">
                {product.includes.map((item) => (
                  <div
                    key={item}
                    className="border border-[#121110]/8 px-4 py-4 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#121110]/68"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {editions.length ? (
              <div className="rounded-[2rem] border border-[#121110]/10 bg-white px-6 py-6">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.26em] text-[#121110]/38">
                  Précommandes
                </p>

                <div className="mt-5 grid gap-4">
                  {editions.map((edition) => (
                    <div
                      key={edition.id}
                      className="rounded-[1.4rem] border border-[#121110]/8 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-2xl text-[#121110]">
                            {edition.name}
                          </p>
                          <p className="mt-2 font-sans text-[0.66rem] uppercase tracking-[0.18em] text-[#121110]/46">
                            Précommande
                          </p>
                        </div>

                        <span className="font-sans text-[0.66rem] uppercase tracking-[0.18em] text-[#121110]">
                          {formatProductionPrice(
                            edition.priceCents,
                            edition.currency,
                          )}
                        </span>
                      </div>

                      <p className="mt-4 font-sans text-sm font-light leading-relaxed text-[#121110]/64">
                        {edition.releaseLabel}
                      </p>

                      <div className="mt-4">
                        <PurchaseButton
                          label={edition.ctaLabel ?? "Précommander"}
                          onClick={() => handleAddEdition(edition)}
                          subtle
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

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
        />
      ) : null}
    </>
  );
}
