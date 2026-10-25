"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLevels } from "@/lib/levels";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";

/** Primer paso tras iniciar sesión: test de nivel o empezar desde cero. */
export default function Start() {
  const { user } = useSession();
  const { chooseStart } = useLevels();
  const { lang } = useT();
  const router = useRouter();
  const es = lang !== "en";

  return (
    <div className="mx-auto max-w-3xl py-4">
      <p className="text-center text-sm text-muted">{es ? `¡Hola, ${user?.name.split(" ")[0]}!` : `Hi, ${user?.name.split(" ")[0]}!`}</p>
      <h1 className="mt-1 text-center text-3xl font-semibold sm:text-5xl">Wie möchtest du starten?</h1>
      <p className="mt-2 text-center text-cocoa">{es ? "¿Cómo quieres empezar?" : "How would you like to start?"}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/aprender/test/einstufung"
          onClick={() => chooseStart("test")}
          className="group flex flex-col rounded-[2rem] border-2 border-wine/70 bg-sand p-7 shadow-md shadow-wine/10 transition hover:-translate-y-0.5 hover:bg-sand-deep"
        >
          <span className="text-5xl">🎯</span>
          <span className="mt-3 font-display text-3xl text-wine">Einstufungstest</span>
          <span className="mt-1 text-sm italic text-muted">{es ? "Test de nivel" : "Placement test"}</span>
          <span className="mt-3 flex-1 text-cocoa">
            {es
              ? "¿Ya sabes algo de alemán? Haz el test: gramática, lectura, comprensión auditiva y un poco de escritura. Te decimos tu nivel y abrimos los niveles que ya dominas."
              : "Already know some German? Take the test: grammar, reading, listening and a little writing. We'll tell you your level and unlock the levels you already master."}
          </span>
          <span className="mt-4 flex flex-wrap gap-1.5 text-xs text-cocoa">
            <span className="rounded-full bg-paper px-2.5 py-1">📝 Grammatik</span>
            <span className="rounded-full bg-paper px-2.5 py-1">📖 Lesen</span>
            <span className="rounded-full bg-paper px-2.5 py-1">🎧 Hören</span>
            <span className="rounded-full bg-paper px-2.5 py-1">✍️ Schreiben</span>
          </span>
          <span className="mt-5 inline-flex items-center justify-between rounded-full bg-wine px-5 py-3 font-medium text-cream transition group-hover:bg-wine-light">
            Test starten · ca. 20 Min. <span aria-hidden="true">→</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            chooseStart("scratch");
            router.push("/aprender/de/a1-1/1");
          }}
          className="group flex flex-col rounded-[2rem] border border-latte/60 bg-paper p-7 text-left transition hover:-translate-y-0.5 hover:border-cocoa-light"
        >
          <span className="text-5xl">🌱</span>
          <span className="mt-3 font-display text-3xl text-wine">Von Anfang an</span>
          <span className="mt-1 text-sm italic text-muted">{es ? "Empezar desde cero" : "Start from scratch"}</span>
          <span className="mt-3 flex-1 text-cocoa">
            {es
              ? "¿Nunca has estudiado alemán? Empieza en el A1.1, unidad 1: saludar, presentarte y tus primeras palabras."
              : "Never studied German? Start at A1.1, unit 1: greetings, introducing yourself and your first words."}
          </span>
          <span className="mt-5 inline-flex items-center justify-between rounded-full border border-cocoa/30 px-5 py-3 font-medium text-cocoa transition group-hover:border-cocoa">
            Mit A1.1 starten <span aria-hidden="true">→</span>
          </span>
        </button>
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        {es ? "Puedes hacer el test de nivel más tarde en cualquier momento desde el inicio." : "You can take the placement test any time later from the home page."}
      </p>
    </div>
  );
}
