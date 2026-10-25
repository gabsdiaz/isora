/** Pronunciación con la voz del navegador (gratis). Luego se puede cambiar por audios grabados. */
export function speakGerman(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text.replace(/[…]/g, ""));
  utter.lang = "de-DE";
  utter.rate = 0.9;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("de"));
  if (voice) utter.voice = voice;
  synth.speak(utter);
}
