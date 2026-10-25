# Isora

Plataforma de aprendizaje de idiomas enfocada en preparación de exámenes (TestDaF, Goethe, IELTS, TOEFL…). Primera versión: alemán, niveles A1.1 – B1.2 (20 unidades cada uno).

## Correr en tu computador

```bash
npm install
cp .env.example .env.local   # llena los datos de Firebase (opcional: sin ellos corre en modo demo)
npm run dev                  # abre http://localhost:3000
```

## Estructura

```
src/
  app/                    páginas (inicio, bienvenida, aprender/…)
  components/             interfaz (encabezado, unidad, ejercicios…)
  content/
    types.ts              formato del contenido
    de/course.ts          temario: niveles y títulos de las 120 unidades
    de/units/             contenido de cada unidad (video, teoría, lectura, ejercicios, guía)
  lib/                    sesión (login Google), idioma nativo, progreso, pronunciación
```

**Agregar una unidad:** crea `src/content/de/units/<nivel>/<nn>-<tema>.ts` siguiendo el ejemplo de `a1-1/01-vorstellung.ts` y regístrala en `src/content/de/units/index.ts`.

## Tecnologías

Next.js · TypeScript · Tailwind CSS · Firebase (Auth con Google + Firestore) · Vercel
