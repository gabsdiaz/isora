import { notFound } from "next/navigation";
import { ALL_THEMES, GAMES, getTheme, type GameId } from "@/content/de/themes";
import { GameView } from "@/components/games/GameView";

export function generateStaticParams() {
  return GAMES.flatMap((g) => ALL_THEMES.map((t) => ({ game: g.id, theme: t.id })));
}

export default async function Page({ params }: PageProps<"/aprender/spiele/[game]/[theme]">) {
  const { game, theme } = await params;
  if (!GAMES.some((g) => g.id === game) || !getTheme(theme)) notFound();
  return <GameView gameId={game as GameId} themeId={theme} />;
}
