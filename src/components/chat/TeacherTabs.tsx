"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Pestañas de la zona "Lehrkraft": chat y clases 1:1. */
export function TeacherTabs() {
  const path = usePathname();
  const tabs = [
    { href: "/aprender/chat", label: "💬 Chat" },
    { href: "/aprender/unterricht", label: "📅 Einzelstunde" },
  ];
  return (
    <nav className="mb-5 inline-flex rounded-full border border-line bg-paper p-1" aria-label="Lehrkraft">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`rounded-full px-4 py-1.5 text-sm transition ${path === t.href ? "bg-wine text-cream" : "text-cocoa hover:bg-cream-deep"}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
