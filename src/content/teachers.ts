import type { Tr } from "./types";

/**
 * Lehrkräfte para clases 1:1.
 *
 * Cada profesor tiene su propia "página de reservas" de Google Calendar
 * (Calendario → Crear → Programación de citas). Google muestra las horas libres,
 * crea el evento con enlace de Google Meet y envía la confirmación por correo.
 *
 * - bookingUrl: enlace para compartir (https://calendar.app.google/…)
 * - embedUrl:   enlace de "Insertar en el sitio web" (…/appointments/schedules/…?gv=true)
 *
 * Para agregar un profesor nuevo basta con sumar una entrada aquí.
 */
export type Teacher = {
  id: string;
  /** Nombre visible; vacío = se muestra solo el rol ("Lehrkraft für Deutsch"). */
  name?: string;
  role: { de: string; tr: Tr };
  emoji: string;
  languages: string[];
  focus: { de: string; tr: Tr }[];
  bookingUrl?: string;
  embedUrl?: string;
};

export const TEACHERS: Teacher[] = [
  {
    id: "deutsch-1",
    role: { de: "Lehrkraft für Deutsch", tr: { es: "Profesor(a) de alemán", en: "German teacher" } },
    emoji: "🧑‍🏫",
    languages: ["Deutsch", "Español", "English"],
    focus: [
      { de: "A1 – B1", tr: { es: "niveles A1 a B1", en: "levels A1 to B1" } },
      { de: "Goethe & TestDaF", tr: { es: "preparación de exámenes", en: "exam preparation" } },
      { de: "Sprechen üben", tr: { es: "práctica oral", en: "speaking practice" } },
    ],
    bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || undefined,
    embedUrl: process.env.NEXT_PUBLIC_BOOKING_EMBED_URL || undefined,
  },
];
