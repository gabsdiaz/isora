"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reproductor de Spotify embebido (iFrame API oficial).
 * https://developer.spotify.com/documentation/embeds/references/iframe-api
 *
 * Sin iniciar sesión en Spotify, el reproductor suele sonar solo un fragmento de 30 s;
 * con la sesión abierta en el navegador suena la canción completa.
 */
type PlaybackUpdate = { data: { isPaused: boolean; isBuffering: boolean; duration: number; position: number } };
export type EmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  destroy: () => void;
  addListener: (event: "ready" | "playback_update" | "playback_started", cb: (e: PlaybackUpdate) => void) => void;
};
type IFrameAPI = {
  createController: (el: HTMLElement, opts: { uri: string; width?: string | number; height?: string | number }, cb: (c: EmbedController) => void) => void;
};

let apiPromise: Promise<IFrameAPI> | null = null;
function loadApi(): Promise<IFrameAPI> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<IFrameAPI>((resolve, reject) => {
    const w = window as unknown as { __spotifyApi?: IFrameAPI; onSpotifyIframeApiReady?: (api: IFrameAPI) => void };
    if (w.__spotifyApi) return resolve(w.__spotifyApi);
    w.onSpotifyIframeApiReady = (api) => {
      w.__spotifyApi = api;
      resolve(api);
    };
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    s.onerror = () => reject(new Error("spotify-load"));
    document.body.appendChild(s);
    setTimeout(() => reject(new Error("spotify-timeout")), 12000);
  }).catch((e) => {
    apiPromise = null;
    throw e;
  });
  return apiPromise;
}

/** Acepta un enlace de canción de Spotify (open.spotify.com/…/track/ID o spotify:track:ID) y devuelve la URI. */
export function parseSpotifyTrack(input: string): string | null {
  const m = input.trim().match(/(?:spotify:track:|open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(?:embed\/)?track\/)([A-Za-z0-9]{22})/);
  return m ? `spotify:track:${m[1]}` : null;
}
export const spotifySearchUrl = (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}`;
export const spotifyOpenUrl = (uri: string) => `https://open.spotify.com/track/${uri.split(":").pop()}`;

/**
 * Monta el reproductor dentro de `box` y expone su estado.
 * La posición se interpola entre los avisos de Spotify para tener precisión de ~100 ms.
 */
export function useSpotifyPlayer(uri: string | null) {
  // Elemento donde va el reproductor (ref de callback: <div ref={attach} />)
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const ctrl = useRef<EmbedController | null>(null);
  const clock = useRef({ position: 0, at: 0, paused: true });
  const [readyFor, setReadyFor] = useState<string | null>(null);
  const [errorFor, setErrorFor] = useState<string | null>(null);
  const [info, setInfo] = useState({ paused: true, duration: 0 });

  useEffect(() => {
    if (!uri || !host) return;
    let alive = true;
    const el = document.createElement("div");
    host.appendChild(el);
    const timer = setTimeout(() => alive && setErrorFor(uri), 15000);
    loadApi()
      .then((api) => {
        if (!alive) return;
        api.createController(el, { uri, width: "100%", height: 152 }, (c) => {
          if (!alive) return c.destroy();
          ctrl.current = c;
          c.addListener("ready", () => {
            clearTimeout(timer);
            if (alive) setReadyFor(uri);
          });
          c.addListener("playback_update", (e) => {
            const d = e.data;
            clock.current = { position: d.position, at: performance.now(), paused: d.isPaused || d.isBuffering };
            setInfo((i) => (i.paused === d.isPaused && i.duration === d.duration ? i : { paused: d.isPaused, duration: d.duration }));
          });
        });
      })
      .catch(() => alive && setErrorFor(uri));
    return () => {
      alive = false;
      clearTimeout(timer);
      try {
        ctrl.current?.pause();
        ctrl.current?.destroy();
      } catch {
        /* el iframe ya no existe */
      }
      ctrl.current = null;
      host.innerHTML = "";
    };
  }, [uri, host]);

  /** Posición actual en ms */
  const position = useCallback(() => {
    const c = clock.current;
    return c.paused ? c.position : c.position + (performance.now() - c.at);
  }, []);
  const seek = useCallback((ms: number) => {
    ctrl.current?.seek(Math.max(0, Math.floor(ms / 1000)));
    clock.current = { ...clock.current, position: Math.max(0, Math.floor(ms / 1000) * 1000), at: performance.now() };
  }, []);
  const play = useCallback(() => ctrl.current?.resume(), []);
  const pause = useCallback(() => ctrl.current?.pause(), []);

  const status: "none" | "loading" | "ready" | "error" = !uri ? "none" : errorFor === uri ? "error" : readyFor === uri ? "ready" : "loading";
  // Los fragmentos de prueba de Spotify duran 30 s
  const preview = info.duration > 0 && info.duration <= 31000;
  const player = { status, paused: info.paused, duration: info.duration, preview, position, seek, play, pause };
  // [dónde montar el reproductor, estado y controles]
  return [setHost, player] as const;
}
export type SpotifyPlayer = ReturnType<typeof useSpotifyPlayer>[1];
