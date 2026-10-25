"use client";

import { useState } from "react";
import type { Voice } from "@/content/types";
import { speakGerman } from "@/lib/speech";
import { SpeakerIcon } from "./german/Gloss";

export function SpeakButton({ text, voice = "m", className = "" }: { text: string; voice?: Voice; className?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        setPlaying(true);
        await speakGerman(text, voice);
        setPlaying(false);
      }}
      aria-label={`Anhören: ${text}`}
      title="Anhören"
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
        playing ? "border-wine bg-wine text-cream" : "border-line bg-paper text-cocoa hover:border-wine-light hover:text-wine"
      } ${className}`}
    >
      <SpeakerIcon size={15} />
    </button>
  );
}
