"use client";

/** Botones ▶ / ⏸ / ■ para escuchar un texto completo. */
export function PlayerControls({
  state,
  label,
  onPlay,
  onPause,
  onResume,
  onStop,
  small = false,
}: {
  state: "idle" | "playing" | "paused";
  label: string;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  small?: boolean;
}) {
  const main = small
    ? "rounded-full border border-line px-3.5 py-1.5 text-sm text-cocoa transition hover:border-wine-light hover:text-wine"
    : "rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream transition hover:bg-wine-light";
  const side = "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-cocoa transition hover:border-wine-light hover:text-wine";
  if (state === "idle")
    return (
      <button type="button" onClick={onPlay} className={main}>
        ▶ {label}
      </button>
    );
  return (
    <span className="inline-flex items-center gap-1.5">
      {state === "playing" ? (
        <button type="button" onClick={onPause} className={main} aria-label="Pause">
          ⏸ Pause
        </button>
      ) : (
        <button type="button" onClick={onResume} className={main} aria-label="Weiter">
          ▶ Weiter
        </button>
      )}
      <button type="button" onClick={onStop} className={side} aria-label="Stopp" title="Stopp">
        ■
      </button>
    </span>
  );
}
