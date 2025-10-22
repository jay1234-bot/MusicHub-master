import Search from "../_components/Search";

export const generateMetadata = ({ params }) => {
    // Handle placeholder param for static export
    if (params.id === 'placeholder') {
        return {
            title: 'Search',
            description: 'Search for music',
        };
    }
    
    return {
        title: `Search Results - ${decodeURI(params.id).toLocaleUpperCase()}`,
        description: `Viewing search results for ${decodeURI(params.id)}`,
    };
};

export default function Page({ params }) {
    // Don't render the search for the placeholder param
    if (params.id === 'placeholder') {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading search...</p>
            </div>
        );
    }
    
    return(
        <Search params={params}/>
    )
}