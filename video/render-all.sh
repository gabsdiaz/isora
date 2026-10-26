#!/usr/bin/env bash
# Renderiza y publica varios videos seguidos: video/render-all.sh a1-1 02 03 04 …
# (el primer argumento es el nivel). Cada video se sube a GitHub (y por tanto a la web) apenas termina.
set -u
cd "$(dirname "$0")/.."
level="$1"; shift
label=$(echo "$level" | tr 'a-z' 'A-Z' | tr '-' '.')
for n in "$@"; do
  slug="de-$level-$n"
  echo "▶ $slug $(date +%H:%M)"
  if node video/render.mjs "$slug" > "video/out/$slug.render.log" 2>&1; then
    git add "public/videos/de/$level/$n."* src/content/generated/media.ts
    git commit -qm "Video $label Unidad $n (solo en alemán, subtítulos es/en)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RVjGrNmSHfb5weTikzFpcN" && (git push -q origin main || (sleep 5 && git push -q origin main))
    echo "✓ $slug $(tail -1 "video/out/$slug.render.log")"
  else
    echo "✗ $slug falló: $(tail -3 "video/out/$slug.render.log" | tr '\n' ' ')"
  fi
done
echo "FIN $(date +%H:%M)"
