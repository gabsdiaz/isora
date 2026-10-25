import { notFound } from "next/navigation";
import { german, getUnitMeta } from "@/content/de/course";
import { UnitView } from "@/components/unit/UnitView";

export function generateStaticParams() {
  return german.levels.flatMap((l) => l.units.map((u) => ({ level: l.id, unit: String(u.number) })));
}

export default async function Page({ params }: PageProps<"/aprender/de/[level]/[unit]">) {
  const { level, unit } = await params;
  const n = Number(unit);
  if (!getUnitMeta(level, n)) notFound();
  return <UnitView levelId={level} number={n} />;
}
