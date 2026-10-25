import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SONGS, getSong } from "@/content/de/songs";
import { SongView } from "@/components/songs/SongView";

export function generateStaticParams() {
  return SONGS.map((s) => ({ id: s.id }));
}

export default async function Page({ params }: PageProps<"/aprender/lieder/[id]">) {
  const { id } = await params;
  if (!getSong(id)) notFound();
  return (
    <Suspense fallback={null}>
      <SongView id={id} />
    </Suspense>
  );
}
