"use client"
import { Button } from "@/components/ui/button";
import { getSongsById, getSongsSuggestions } from "@/lib/fetch";
import { getSongsLyricsById } from "@/lib/lyrics";
import { Download, Pause, Play, Repeat, Loader2, Share2, Music2 } from "lucide-react";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NextContext } from "@/hooks/use-context";
import Next from "@/components/cards/next";
import { useMusic } from "@/components/music-provider";
import { IoPause } from "react-icons/io5";
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/ui/credenza"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudioPlayer } from "@/hooks/use-audio-player";

export default function Player({ id }) {
    const [data, setData] = useState([]);
    const [lyrics, setLyrics] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);
    const params = useSearchParams();
    const next = useContext(NextContext);
    const { current, setCurrent } = useMusic();

    // Use the custom audio hook for better performance
    const {
        audioRef,
        playing,
        currentTime,
        duration,
        isLoading: audioLoading,
        error: audioError,
        togglePlayPause,
        seek,
        setVolume,
        setLoop,
        setPlaying
    } = useAudioPlayer(audioURL, true);

    // Memoized functions for better performance
    const getSong = useCallback(async () => {
        try {
            setIsLoading(true);
        const get = await getSongsById(id);
        const data = await get.json();
        setData(data.data[0]);
        if (data?.data[0]?.downloadUrl[2]?.url) {
            setAudioURL(data?.data[0]?.downloadUrl[2]?.url);
        } else if (data?.data[0]?.downloadUrl[1]?.url) {
            setAudioURL(data?.data[0]?.downloadUrl[1]?.url);
        } else {
            setAudioURL(data?.data[0]?.downloadUrl[0]?.url);
        }
        } catch (error) {
            console.error('Error fetching song:', error);
            toast.error('Failed to load song');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const getSuggestions = useCallback(async () => {
        try {
            setSuggestionsLoading(true);
            const response = await getSongsSuggestions(id);
            const data = await response.json();
            setSuggestions(data.data || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            toast.error('Failed to load suggestions');
        } finally {
            setSuggestionsLoading(false);
        }
    }, [id]);

    const getLyrics = useCallback(async () => {
        try {
        const get = await getSongsLyricsById(id);
        const data = await get.json();
        setLyrics(data.data.lyrics);
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            toast.error('Failed to load lyrics');
    }
    }, [id]);

    const formatTime = useCallback((time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, []);

    const downloadSong = useCallback(async () => {
        if (!audioURL) return;
        
        setIsDownloading(true);
        try {
        const response = await fetch(audioURL);
        const datas = await response.blob();
        const url = URL.createObjectURL(datas);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name}.mp3`;
        a.click();
        URL.revokeObjectURL(url);
            toast.success('Downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Download failed');
        } finally {
        setIsDownloading(false);
        }
    }, [audioURL, data.name]);

    const handleSeek = useCallback((e) => {
        const seekTime = e[0];
        seek(seekTime);
    }, [seek]);

    const loopSong = useCallback(() => {
        const newLoopState = !isLooping;
        setLoop(newLoopState);
        setIsLooping(newLoopState);
    }, [isLooping, setLoop]);

    const handleShare = useCallback(() => {
        try {
            if (navigator.share) {
            navigator.share({
                url: `https://${window.location.host}/${data.id}`
            });
            } else {
                // Fallback for browsers that don't support navigator.share
                navigator.clipboard.writeText(`https://${window.location.host}/${data.id}`);
                toast.success('Link copied to clipboard');
        }
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }, [data.id]);

    // Update current time in music context
    useEffect(() => {
        setCurrent(currentTime);
    }, [currentTime, setCurrent]);

    useEffect(() => {
        getSong();
        getSuggestions();
        localStorage.setItem("last-played", id);
        localStorage.removeItem("p");
        
        if (current && audioRef.current) {
            audioRef.current.currentTime = parseFloat(current + 1);
        }
    }, [id, current, getSong, getSuggestions]);

    useEffect(() => {
        const handleRedirect = () => {
            if (currentTime === duration && !isLooping && duration !== 0) {
                window.location.href = `https://${window.location.host}/${next?.nextData?.id}`;
            }
        };
        if (isLooping || duration === 0) return;
        return handleRedirect();
    }, [currentTime, duration, isLooping, next?.nextData?.id]);

    // Handle audio errors
    useEffect(() => {
        if (audioError) {
            toast.error(audioError);
        }
    }, [audioError]);

    return (
        <div className="h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col">
            <audio 
                ref={audioRef}
                preload="metadata"
            />
            
            <div className="flex-1 flex flex-col justify-center gap-6 py-6">
                {/* Main Player Content */}
                <div className="flex flex-col lg:flex-row gap-8 w-full items-center lg:items-start">
                    {/* Album Art Section - Simplified */}
                    <div className="flex justify-center lg:justify-start flex-shrink-0">
                        {isLoading || data.length <= 0 ? (
                            <Skeleton className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] aspect-square rounded-xl" />
                        ) : (
                            <div className="relative">
                                <div className="overflow-hidden rounded-xl shadow-lg">
                                    <img 
                                        src={data.image[2].url} 
                                        className={`w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] aspect-square object-cover ${
                                            playing ? 'animate-pulse' : ''
                                        }`}
                                        alt={data.name}
                                        loading="eager"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Song Info and Controls Section - Simplified */}
                    <div className="flex flex-col justify-center w-full max-w-full lg:max-w-2xl mx-auto lg:mx-0">
                        {isLoading || data.length <= 0 ? (
                            <div className="flex flex-col justify-center w-full space-y-4">
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-3 w-full rounded-full" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-10" />
                                        <Skeleton className="h-3 w-10" />
                                    </div>
                                    <div className="flex items-center justify-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center w-full space-y-6">
                                {/* Song Info - Clean Typography */}
                                <div className="text-center lg:text-left">
                                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight break-words">
                                        {data.name}
                                    </h1>
                                    <p className="text-base md:text-lg text-muted-foreground mt-2 break-words">
                                        by{' '}
                                        <Link 
                                            href={"/search/" + `${encodeURI(data.artists.primary[0].name.toLowerCase().split(" ").join("+"))}`} 
                                            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                                        >
                                            {data.artists.primary[0]?.name || "unknown"}
                                        </Link>
                                    </p>
                                </div>

                                {/* Player Controls - Clean Layout */}
                                <div className="space-y-4">
                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <Slider 
                                            onValueChange={handleSeek} 
                                            value={[currentTime]} 
                                            max={duration} 
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Control Buttons - Minimal */}
                                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                        {/* Main Play Button */}
                                        <Button 
                                            variant={playing ? "default" : "secondary"} 
                                            className="gap-2 rounded-full px-6 py-4 text-base font-medium hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                                            onClick={togglePlayPause}
                                        >
                                        {playing ? (
                                                <IoPause className="h-5 w-5" />
                                            ) : (
                                                <Play className="h-5 w-5" />
                                            )}
                                            {playing ? "Pause" : "Play"}
                                        </Button>
                                        
                                        {/* Secondary Controls - Minimal */}
                                        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                                            <Button 
                                                size="icon" 
                                                variant={isLooping ? "default" : "outline"} 
                                                onClick={loopSong}
                                                className="h-10 w-10 rounded-full"
                                            >
                                                <Repeat className="h-4 w-4" />
                                            </Button>
                                            
                                            <Button 
                                                size="icon" 
                                                variant="outline" 
                                                onClick={downloadSong}
                                                className="h-10 w-10 rounded-full"
                                            >
                                                {isDownloading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Download className="h-4 w-4" />
                                                )}
                                            </Button>
                                            
                                            <Button 
                                                size="icon" 
                                                variant="outline" 
                                                onClick={handleShare}
                                                className="h-10 w-10 rounded-full"
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                            
                                        <Credenza>
                                            <CredenzaTrigger asChild>
                                                    <Button 
                                                        size="icon" 
                                                        variant="outline" 
                                                        onClick={getLyrics}
                                                        className="h-10 w-10 rounded-full"
                                                    >
                                                        <Music2 className="h-4 w-4" />
                                                    </Button>
                                            </CredenzaTrigger>
                                                <CredenzaContent className="max-w-2xl w-[90vw]">
                                                <CredenzaHeader>
                                                        <CredenzaTitle className="text-xl font-bold">
                                                            {data.name} - Lyrics
                                                        </CredenzaTitle>
                                                </CredenzaHeader>
                                                <CredenzaBody>
                                                        <ScrollArea className="h-80">
                                                        {lyrics ? (
                                                                <div 
                                                                    dangerouslySetInnerHTML={{ __html: lyrics.replace(/\n/g, '<br />') }} 
                                                                    className="text-muted-foreground leading-relaxed prose max-w-none"
                                                                />
                                                        ) : (
                                                                <div className="grid gap-3">
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-full" />
                                                                    <Skeleton className="h-4 w-3/4" />
                                                            </div>
                                                        )}
                                                    </ScrollArea>
                                                </CredenzaBody>
                                            </CredenzaContent>
                                        </Credenza>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>

            {/* Song Suggestions Section */}
            <div className="px-4 sm:px-6 pb-6">
                <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
                {suggestionsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
                                <Skeleton className="w-12 h-12 rounded-md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {suggestions.map((song) => (
                            <Next 
                                key={song.id} 
                                next={false}
                                name={song.name} 
                                artist={song.artists.primary[0]?.name || "unknown"} 
                                image={song.image[2]?.url || song.image[1]?.url || song.image[0]?.url} 
                                id={song.id} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No suggestions available for this song
                    </div>
                )}
            </div>
        </div>
    )
}