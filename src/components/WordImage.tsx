import { imageFor } from "@/content/de/images";

/** Ilustración (Twemoji) de una palabra, si existe. */
export function WordImage({ word, size = 28, className = "" }: { word: string; size?: number; className?: string }) {
  const src = imageFor(word);
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={size} height={size} className={`shrink-0 select-none ${className}`} draggable={false} />;
}
