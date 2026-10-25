import { Suspense } from "react";
import { SongList } from "@/components/songs/SongList";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SongList />
    </Suspense>
  );
}
