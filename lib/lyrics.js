// Mock function for lyrics since the API doesn't provide this
export const getSongsLyricsById = async (id) => {
    try {
        // Return a default message for now
        return {
            ok: true,
            json: () => Promise.resolve({
                lyrics: "Lyrics are not available at the moment.",
                error: false
            })
        };
    } catch (e) {
        console.error(e);
        return {
            ok: false,
            json: () => Promise.resolve({
                lyrics: "Error fetching lyrics.",
                error: true
            })
        };
    }
};
