import { notFound } from "next/navigation";
import { STORIES, getStory } from "@/content/de/stories";
import { StoryReader } from "@/components/stories/StoryReader";

export function generateStaticParams() {
  return STORIES.map((s) => ({ id: s.id }));
}

export default async function Page({ params }: PageProps<"/aprender/geschichten/[id]">) {
  const { id } = await params;
  const story = getStory(id);
  if (!story) notFound();
  return <StoryReader story={story} />;
}
