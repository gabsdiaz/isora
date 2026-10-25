/**
 * Formato del contenido (alemán primero).
 * Todo lo visible está en alemán; la traducción (es/en) aparece solo al tocar.
 * Estructura: idioma → nivel → unidad. Luego se suman inglés y rutas de examen.
 */

/** Traducción al idioma nativo del estudiante. */
export type Tr = { es: string; en: string };

/** Texto alemán con su traducción (de + es + en). */
export type Tri = { de: string; es: string; en: string };

/** Voz del audio: m = masculina, f = femenina. */
export type Voice = "m" | "f";

export type LevelId = "a1-1" | "a1-2" | "a2-1" | "a2-2" | "b1-1" | "b1-2";

export type UnitMeta = {
  number: number; // 1–20
  /** Título en alemán */
  title: string;
  /** Tema traducido (se ve al tocar 🌐) */
  topic: Tr;
};

export type Level = {
  id: LevelId;
  label: string; // "A1.1"
  name: Tri;
  description: Tri;
  units: UnitMeta[]; // siempre 20
};

export type Course = {
  lang: "de";
  name: Tri;
  levels: Level[];
};

/* ─────────────── Vocabulario (alimenta el diccionario al tocar y, luego, las flashcards) ─────────────── */

export type VocabEntry = {
  de: string;
  tr: Tr;
  article?: "der" | "die" | "das";
  plural?: string;
  /** Formas flexionadas que también se reconocen al tocar */
  forms?: string[];
  /** Palabra de las instrucciones (no se muestra en la lista de vocabulario) */
  meta?: boolean;
};

/* ─────────────── Explicación (estilo Khan Academy) ─────────────── */

export type TheoryBlock =
  | { type: "heading"; text: Tri }
  | { type: "text"; text: Tri }
  | { type: "tip"; text: Tri }
  | { type: "example"; de: string; tr: Tr }
  | { type: "phrases"; title?: Tri; items: { de: string; tr: Tr; note?: Tri }[] }
  | {
      type: "table";
      title?: Tri;
      columns: string[];
      /** **x** resalta terminaciones: "komm**e**" */
      rows: string[][];
      note?: Tri;
    };

/* ─────────────── Lecturas ─────────────── */

export type Reading = {
  title: string;
  kind: Tri;
  /** Voz de cada personaje */
  speakers?: Record<string, Voice>;
  lines: { speaker?: string; de: string; tr: Tr }[];
  questions?: { q: Tri; a: Tri }[];
};

/* ─────────────── Ejercicios ─────────────── */

type ExBase = { id: string; prompt: Tri };

export type Exercise =
  | (ExBase & { type: "choice"; sentence?: string; options: string[]; answer: number; explanation: Tri })
  | (ExBase & { type: "listen"; audio: string; voice?: Voice; options: string[]; answer: number; explanation: Tri })
  | (ExBase & { type: "fill"; sentence: string; answers: string[]; hint?: Tri; explanation: Tri })
  | (ExBase & { type: "order"; words: string[]; explanation: Tri })
  | (ExBase & { type: "match"; pairs: { de: string; tr: Tr }[] })
  /** Richtig / Falsch con un texto corto (aviso, nota, e-mail), como en el Goethe A1 */
  | (ExBase & { type: "rf"; context?: string; contextTitle?: string; statement: string; answer: boolean; explanation: Tri })
  /** Escritura libre con modelo de respuesta */
  | (ExBase & { type: "write"; task: Tri; model: string });

/* ─────────────── Video (guion para el generador Manim) ─────────────── */

export type VideoBeat =
  | { type: "phrase"; de: string; tr: Tr; say?: Tri }
  | { type: "list"; title: Tri; items: { de: string; tr: Tr }[]; say?: Tri }
  | { type: "table"; title: Tri; columns: string[]; rows: string[][]; say?: Tri }
  | { type: "dialogue"; speakers: Record<string, Voice>; lines: { speaker: string; de: string; tr: Tr }[] }
  | { type: "rule"; text: Tri; say?: Tri }
  | { type: "transform"; from: string; to: string; say?: Tri; tr?: Tr };

export type VideoScript = {
  illustration?: string;
  intro: Tri;
  beats: VideoBeat[];
  outro: Tri;
};

/* ─────────────── Unidad ─────────────── */

export type UnitContent = {
  level: LevelId;
  number: number;
  goals: Tri[];
  vocab: VocabEntry[];
  video: VideoScript;
  theory: TheoryBlock[];
  readings: Reading[];
  exercises: Exercise[];
};
