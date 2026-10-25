import Link from "next/link";
import { APP_NAME } from "@/lib/brand";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="var(--color-wine)" />
      <path
        d="M11 27c3.5-9 6.5-14 9-14s5.5 5 9 14"
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="10.5" r="2.2" fill="var(--color-gold)" />
    </svg>
  );
}

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <LogoMark />
      <span className={`font-display text-2xl font-semibold ${light ? "text-cream" : "text-wine"}`}>{APP_NAME}</span>
    </Link>
  );
}
