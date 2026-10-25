import { notFound } from "next/navigation";
import { german, getLevel } from "@/content/de/course";
import { LevelView } from "@/components/LevelView";

export function generateStaticParams() {
  return german.levels.map((l) => ({ level: l.id }));
}

export default async function Page({ params }: PageProps<"/aprender/de/[level]">) {
  const { level } = await params;
  if (!getLevel(level)) notFound();
  return <LevelView levelId={level} />;
}
