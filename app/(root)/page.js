"use client"
import SongCard from "@/components/cards/song";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getSongsByQuery } from "@/lib/fetch";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ui/error-message";

const SECTIONS = [
  { key: "trending", title: "🔥 Trending", desc: "Trending songs in India" },
  { key: "relaxing", title: "🎧 Relaxing", desc: "Top relaxing songs for peace" },
  { key: "romance", title: "💞 Romance", desc: "Top romance songs for mood" },
  { key: "lofi", title: "💤 Lofi", desc: "Top lofi songs to chill" },
];

export default function Page() {
  const [songs, setSongs] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchSection = async (section) => {
    setLoading(prev => ({ ...prev, [section.key]: true }));
    setError(prev => ({ ...prev, [section.key]: null }));
    try {
      const res = await getSongsByQuery(section.key);
      const data = await res.json();
      setSongs(prev => ({ ...prev, [section.key]: data.data.results }));
      setLoading(prev => ({ ...prev, [section.key]: false }));
    } catch (e) {
      setError(prev => ({ ...prev, [section.key]: "Failed to load. Please try again." }));
      setLoading(prev => ({ ...prev, [section.key]: false }));
    }
  };

  useEffect(() => {
    SECTIONS.forEach(section => {
      fetchSection(section);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <main className="px-6 py-5 md:px-20 lg:px-32">
      {SECTIONS.map(section => (
        <div className="mt-12 first:mt-0" key={section.key}>
          <div className="grid">
            <h1 className="text-2xl font-bold">{section.title}</h1>
            <p className="text-sm text-muted-foreground">{section.desc}</p>
          </div>
          {error[section.key] ? (
            <ErrorMessage message={error[section.key]} onRetry={() => fetchSection(section)} />
          ) : (
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
          )}
        </div>
      ))}
    </main>
  );
}
