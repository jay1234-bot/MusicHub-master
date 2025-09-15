import { getSongsById } from "@/lib/fetch";
import Player from "../(player)/_components/Player";
import Recomandation from "../(player)/_components/Recomandation";

export const generateMetadata = async ({ params }) => {
    try {
        const title = await getSongsById(params.id);
        const data = await title.json();
        const song = data?.data[0];
        
        if (!song) {
            return {
                title: "Song Not Found - MusicHub",
                description: "The requested song could not be found."
            };
        }
        
        return {
            title: `${song.name} - MusicHub`,
            description: `Listen to "${song.name}" by ${song.artists?.primary[0]?.name || "unknown"} from the album "${song.album?.name || 'Unknown Album'}".`,
            openGraph: {
                title: song.name,
                description: `Listen to "${song.name}" by ${song.artists?.primary[0]?.name || "unknown"}.`,
                type: "music.song",
                url: song.url,
                images: [
                    {
                        url: song.image[2]?.url || song.image[1]?.url || song.image[0]?.url,
                        width: 1200,
                        height: 630,
                        alt: song.name,
                    },
                ],
                music: {
                    album: song.album?.url,
                    release_date: song.releaseDate,
                    musician: song.artists?.primary[0]?.name || "unknown",
                },
            },
            twitter: {
                card: "summary_large_image",
                title: song.name,
                description: `Listen to "${song.name}" by ${song.artists?.primary[0]?.name || "unknown"}.`,
                images: song.image?.[0]?.url,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: "MusicHub",
            description: "Music streaming platform"
        };
    }
}

export default function Page({ params }) {
    return (
        <div>
            <Player id={params.id} />
            <Recomandation id={params.id} />
        </div>
    );
}