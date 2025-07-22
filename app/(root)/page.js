"use client"
import SongCard from "@/components/cards/song";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getSongsByQuery } from "@/lib/fetch";
import { useEffect, useState } from "react";

const SECTIONS = [
  { key: "trending", title: "🔥 Trending", desc: "Trending songs in India" },
  { key: "relaxing", title: "🎧 Relaxing", desc: "Top relaxing songs for peace" },
  { key: "romance", title: "💞 Romance", desc: "Top romance songs for mood" },
  { key: "lofi", title: "💤 Lofi", desc: "Top lofi songs to chill" },
];

export default function Page() {
  const [songs, setSongs] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    SECTIONS.forEach(section => {
      setLoading(prev => ({ ...prev, [section.key]: true }));
      getSongsByQuery(section.key).then(res => res.json()).then(data => {
        setSongs(prev => ({ ...prev, [section.key]: data.data.results }));
        setLoading(prev => ({ ...prev, [section.key]: false }));
      });
    });
  }, []);

  return (
    <main className="px-6 py-5 md:px-20 lg:px-32">
      {SECTIONS.map(section => (
        <div className="mt-12 first:mt-0" key={section.key}>
          <div className="grid">
            <h1 className="text-2xl font-bold">{section.title}</h1>
            <p className="text-sm text-muted-foreground">{section.desc}</p>
          </div>
          <ScrollArea className="rounded-md mt-6">
            <div className="flex gap-4">
              {loading[section.key] || !songs[section.key]
                ? Array.from({ length: 10 }).map((_, i) => <SongCard key={i} />)
                : songs[section.key].slice(0, 20).map(song => (
                  <SongCard
                    key={song.id}
                    id={song.id}
                    image={song.image[2]?.url}
                    title={song.name}
                    artist={song.artists.primary[0]?.name || "unknown"}
                  />
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </div>
      ))}
    </main>
  );
}
