import { getAlbumById } from "@/lib/fetch";
import Album from "../_components/Album";

export const generateMetadata = async ({ params }) => {
    // Handle placeholder param for static export
    if (params.id === 'placeholder') {
        return {
            title: 'Album',
            description: 'View album details',
        };
    }
    
    try {
        const title = await getAlbumById(params.id);
        const data = await title.json();
        return {
            title: `Album - ${data.data.name}`,
        };
    } catch (error) {
        return {
            title: 'Album',
            description: 'View album details',
        };
    }
}

export default function Page({ params }) {
    // Don't render the album for the placeholder param
    if (params.id === 'placeholder') {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading album...</p>
            </div>
        );
    }
    
    return (
        <main>
            <Album id={params.id} />
        </main>
    )
}