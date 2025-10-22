import { getSongsById } from "@/lib/fetch";
import Player from "../_components/Player";
import Recomandation from "../_components/Recomandation";
import AdvanceSearch from "../_components/AdvanceSearch";
import Search from "@/components/page/search";

export const generateMetadata = async ({ params }) => {
    // Handle placeholder param for static export
    if (params.id === 'placeholder') {
        return {
            title: 'Music Player',
            description: 'Play your favorite songs',
        };
    }
    
    try {
        const title = await getSongsById(params.id);
        const data = await title.json();
        const song = data?.data[0];
        return {
            title: song.name,
            description: `Listen to "${song.name}" by ${data?.artists?.primary[0]?.name || "unknown"} from the album "${song.album?.name}".`,
            openGraph: {
                title: song.name,
                description: `Listen to "${song.name}" by ${data?.artists?.primary[0]?.name || "unknown"}.`,
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
                    musician: data?.artists?.primary[0]?.name || "unknown",
                },
            },
            twitter: {
                card: "summary_large_image",
                title: song.name,
                description: `Listen to "${song.name}" by ${data?.artists?.primary[0]?.name || "unknown"}.`,
                images: song.image?.[0]?.url,
            },
        };
    } catch (error) {
        return {
            title: 'Music Player',
            description: 'Play your favorite songs',
        };
    }
}

export default function Page({ params }) {
    // Don't render the player for the placeholder param
    if (params.id === 'placeholder') {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading player...</p>
            </div>
        );
    }
    
    return (
        <div>
            <Player id={params.id} />
            <Recomandation id={params.id} />
        </div>
    )
}