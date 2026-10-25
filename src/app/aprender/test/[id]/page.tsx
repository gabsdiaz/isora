import { notFound } from "next/navigation";
import { EXAMS, LEVEL_ORDER } from "@/content/de/exams";
import { TestView } from "@/components/exam/TestView";

const GATES = LEVEL_ORDER.slice(1).map((l) => `zugang-${l}`);

export function generateStaticParams() {
  return [...Object.keys(EXAMS), ...GATES].map((id) => ({ id }));
}

export default async function Page({ params }: PageProps<"/aprender/test/[id]">) {
  const { id } = await params;
  if (!EXAMS[id] && !GATES.includes(id)) notFound();
  return <TestView id={id} />;
}
