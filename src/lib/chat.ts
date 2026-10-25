"use client";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import { getFirebase } from "./firebase";

/**
 * Chat con una Lehrkraft (Firestore):
 *   chats/{uid}                 → resumen de la conversación del estudiante
 *   chats/{uid}/messages/{id}   → mensajes { from: "student" | "teacher", text, createdAt }
 * Las reglas (firestore.rules) dejan leer/escribir al propio estudiante y a las Lehrkräfte.
 */
export type ChatMessage = { id: string; from: "student" | "teacher"; text: string; createdAt: Date | null; name?: string };
export type ChatThread = {
  id: string;
  name: string;
  email: string;
  lastText: string;
  lastFrom: "student" | "teacher";
  updatedAt: Date | null;
  unreadTeacher: boolean;
  unreadStudent: boolean;
};

const toDate = (t: unknown) => ((t as Timestamp | null)?.toDate ? (t as Timestamp).toDate() : null);
export const MAX_LEN = 2000;

export function subscribeMessages(studentId: string, cb: (m: ChatMessage[]) => void, onError?: (e: Error) => void) {
  const { db } = getFirebase();
  if (!db) return () => {};
  const q = query(collection(db, "chats", studentId, "messages"), orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snap) =>
      cb(
        snap.docs.map((d) => {
          const x = d.data({ serverTimestamps: "estimate" });
          return { id: d.id, from: x.from, text: x.text, name: x.name, createdAt: toDate(x.createdAt) };
        }),
      ),
    (e) => onError?.(e),
  );
}

export function subscribeThread(studentId: string, cb: (t: ChatThread | null) => void) {
  const { db } = getFirebase();
  if (!db) return () => {};
  return onSnapshot(
    doc(db, "chats", studentId),
    (d) => {
      const x = d.data();
      cb(x ? ({ id: d.id, ...x, updatedAt: toDate(x.updatedAt) } as ChatThread) : null);
    },
    () => cb(null),
  );
}

export function subscribeInbox(cb: (t: ChatThread[]) => void, onError: (e: Error) => void) {
  const { db } = getFirebase();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "chats"), orderBy("updatedAt", "desc")),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: "estimate" }), updatedAt: toDate(d.data({ serverTimestamps: "estimate" }).updatedAt) }) as ChatThread)),
    onError,
  );
}

export async function sendMessage(studentId: string, from: "student" | "teacher", text: string, who: { name: string; email?: string }) {
  const { db } = getFirebase();
  const clean = text.trim().slice(0, MAX_LEN);
  if (!db || !clean) return;
  // El resumen primero: así existe la conversación antes del primer mensaje
  await setDoc(
    doc(db, "chats", studentId),
    {
      ...(from === "student" ? { name: who.name, email: who.email ?? "" } : {}),
      lastText: clean.slice(0, 140),
      lastFrom: from,
      updatedAt: serverTimestamp(),
      unreadTeacher: from === "student",
      unreadStudent: from === "teacher",
    },
    { merge: true },
  );
  await addDoc(collection(db, "chats", studentId, "messages"), { from, text: clean, name: who.name, createdAt: serverTimestamp() });
}

export async function markRead(studentId: string, as: "student" | "teacher") {
  const { db } = getFirebase();
  if (!db) return;
  await setDoc(doc(db, "chats", studentId), as === "teacher" ? { unreadTeacher: false } : { unreadStudent: false }, { merge: true }).catch(() => undefined);
}
