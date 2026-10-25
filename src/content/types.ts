/**
 * Tipos del contenido de los cursos.
 * Estructura pensada para crecer: idioma → nivel → unidad.
 * Más adelante se suman otros idiomas (inglés…) y rutas de examen (TestDaF, IELTS…).
 */

/** Texto en el idioma nativo del estudiante (por ahora español o inglés). */
export type Localized = { es: string; en: string };

export type LevelId = "a1-1" | "a1-2" | "a2-1" | "a2-2" | "b1-1" | "b1-2";

export type UnitMeta = {
  number: number; // 1–20
  /** Título en el idioma que se aprende */
  title: string;
  /** Traducción del tema */
  topic: Localized;
};

export type Level = {
  id: LevelId;
  label: string; // "A1.1"
  name: Localized;
  description: Localized;
  units: UnitMeta[]; // siempre 20
};

export type Course = {
  lang: "de"; // luego: "en", …
  name: Localized;
  nativeName: string;
  levels: Level[];
};

/* ─────────────── Contenido detallado de una unidad ─────────────── */

/** Bloques de la explicación teórica (estilo Khan Academy) */
export type TheoryBlock =
  | { type: "heading"; text: Localized }
  | { type: "paragraph"; text: Localized }
  | {
      type: "phrases";
      title?: Localized;
      items: { de: string; meaning: Localized; note?: Localized }[];
    }
  | {
      type: "table";
      title?: Localized;
      columns: Localized[];
      rows: string[][];
    }
  | { type: "tip"; text: Localized }
  | { type: "example"; de: string; meaning: Localized };

export type Reading = {
  title: string;
  kind: Localized; // "Diálogo", "Correo", …
  lines: { speaker?: string; de: string }[];
  glossary: { de: string; meaning: Localized }[];
  questions?: { q: Localized; a: Localized }[];
};

export type Exercise =
  | {
      id: string;
      type: "choice";
      prompt: Localized;
      sentence?: string;
      options: string[];
      answer: number;
      explanation: Localized;
    }
  | {
      id: string;
      type: "fill";
      prompt: Localized;
      /** Usa ___ donde va la respuesta */
      sentence: string;
      answers: string[]; // respuestas aceptadas
      hint?: Localized;
      explanation: Localized;
    }
  | {
      id: string;
      type: "order";
      prompt: Localized;
      words: string[]; // en orden correcto
      explanation: Localized;
    }
  | {
      id: string;
      type: "match";
      prompt: Localized;
      pairs: { de: string; meaning: Localized }[];
    };

export type UnitContent = {
  level: LevelId;
  number: number;
  goals: Localized[];
  video: { src?: string; poster?: string; duration?: string; description: Localized };
  theory: TheoryBlock[];
  readings: Reading[];
  exercises: Exercise[];
  guide?: { href: string; pages?: number };
};
