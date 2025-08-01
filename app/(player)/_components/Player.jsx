"use client"
import { Button } from "@/components/ui/button";
import { getSongsById, getSongsLyricsById } from "@/lib/fetch";
import { Download, Pause, Play, RedoDot, UndoDot, Repeat, Loader2, Bookmark, BookmarkCheck, Repeat1, Share2, Music2 } from "lucide-react";
import { useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
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
import AudioVisualizer from "@/components/ui/audio-visualizer";

export default function Player({ id }) {
    const [data, setData] = useState([]);
    const [lyrics, setLyrics] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const [isLoading, setIsLoading] = useState(true);
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
        localStorage.setItem("last-played", id);
        localStorage.removeItem("p");
        
        if (current && audioRef.current) {
            audioRef.current.currentTime = parseFloat(current + 1);
        }
    }, [id, current, getSong]);

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
        <div className="h-screen w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-col">
            <audio 
                ref={audioRef}
                preload="metadata"
            />
            
            <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-6 lg:py-8">
                {/* Main Player Content */}
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 w-full items-center lg:items-start">
                    {/* Album Art Section - Responsive */}
                    <div className="flex justify-center lg:justify-start flex-shrink-0">
                        {isLoading || data.length <= 0 ? (
                            <Skeleton className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] 2xl:w-[400px] 2xl:h-[400px] aspect-square rounded-2xl" />
                        ) : (
                            <div className="relative group">
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                                    <img 
                                        src={data.image[2].url} 
                                        className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] 2xl:w-[400px] 2xl:h-[400px] aspect-square object-cover transition-all duration-500 ${
                                            playing ? 'animate-spin-slow' : ''
                                        }"
                                        alt={data.name}
                                        loading="eager"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl -z-10 opacity-75" />
                            </div>
                        )}
                    </div>

                    {/* Song Info and Controls Section - Responsive */}
                    <div className="flex flex-col justify-center w-full max-w-full lg:max-w-2xl mx-auto lg:mx-0 min-h-0 flex-1">
                        {isLoading || data.length <= 0 ? (
                            <div className="flex flex-col justify-center w-full space-y-4 sm:space-y-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 lg:w-80" />
                                    <Skeleton className="h-4 sm:h-6 w-24 sm:w-32" />
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    <Skeleton className="h-3 sm:h-4 w-full rounded-full" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 sm:h-4 w-8 sm:w-12" />
                                        <Skeleton className="h-3 sm:h-4 w-8 sm:w-12" />
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4">
                                        <Skeleton className="h-8 sm:h-12 w-8 sm:w-12 rounded-full" />
                                        <Skeleton className="h-6 sm:h-10 w-6 sm:w-10 rounded-full" />
                                        <Skeleton className="h-6 sm:h-10 w-6 sm:w-10 rounded-full" />
                                        <Skeleton className="h-6 sm:h-10 w-6 sm:w-10 rounded-full" />
                                        <Skeleton className="h-6 sm:h-10 w-6 sm:w-10 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ) : (
                            <div className="flex flex-col justify-center w-full space-y-4 sm:space-y-6 lg:space-y-8 min-h-0">
                                {/* Song Info - Responsive Typography */}
                                <div className="text-center lg:text-left animate-fade-in-scale">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight break-words">
                                        {data.name}
                                    </h1>
                                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mt-1 sm:mt-2 lg:mt-3 break-words">
                                        by{' '}
                                        <Link 
                                            href={"/search/" + `${encodeURI(data.artists.primary[0].name.toLowerCase().split(" ").join("+"))}`} 
                                            className="text-foreground hover:text-purple-500 transition-colors duration-200 font-medium"
                                        >
                                            {data.artists.primary[0]?.name || "unknown"}
                                        </Link>
                                    </p>
                            </div>

                                {/* Audio Visualizer - Hidden on small screens */}
                                <div className="hidden md:block">
                                    <AudioVisualizer isPlaying={playing} audioRef={audioRef} />
                                </div>

                                {/* Player Controls - Responsive */}
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Progress Bar */}
                                    <div className="space-y-2 sm:space-y-3">
                                        <Slider 
                                            onValueChange={handleSeek} 
                                            value={[currentTime]} 
                                            max={duration} 
                                            className="w-full"
                                            thumbClassName="slider-glow-thumb"
                                            trackClassName="slider-animated-range"
                                        />
                                        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Control Buttons - Responsive Layout */}
                                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6">
                                        {/* Main Play Button */}
                                        <Button 
                                            variant={playing ? "default" : "secondary"} 
                                            className="gap-1 sm:gap-2 rounded-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-medium hover:scale-105 transition-all duration-200 hover-glow w-full sm:w-auto"
                                            onClick={togglePlayPause}
                                        >
                                        {playing ? (
                                                <IoPause className="h-4 w-4 sm:h-5 sm:w-5" />
                                            ) : (
                                                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                                            )}
                                            {playing ? "Pause" : "Play"}
                                        </Button>
                                        
                                        {/* Secondary Controls */}
                                        <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={loopSong}
                                                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-200"
                                            >
                                                {!isLooping ? <Repeat className="h-4 w-4 sm:h-5 sm:w-5" /> : <Repeat1 className="h-4 w-4 sm:h-5 sm:w-5" />}
                                            </Button>
                                            
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={downloadSong}
                                                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full hover:bg-green-500/10 hover:text-green-500 transition-all duration-200"
                                            >
                                                {isDownloading ? (
                                                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                                ) : (
                                                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                                                )}
                                            </Button>
                                            
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={handleShare}
                                                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-all duration-200"
                                            >
                                                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </Button>
                                            
                                        <Credenza>
                                            <CredenzaTrigger asChild>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        onClick={getLyrics}
                                                        className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-all duration-200"
                                                    >
                                                        <Music2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </Button>
                                            </CredenzaTrigger>
                                                <CredenzaContent className="max-w-2xl w-[90vw] sm:w-auto">
                                                <CredenzaHeader>
                                                        <CredenzaTitle className="text-lg sm:text-xl font-bold">
                                                            {data.name} - Lyrics
                                                        </CredenzaTitle>
                                                </CredenzaHeader>
                                                <CredenzaBody>
                                                        <ScrollArea className="h-60 sm:h-80 custom-scrollbar">
                                                        {lyrics ? (
                                                                <div 
                                                                    dangerouslySetInnerHTML={{ __html: lyrics.replace(/\n/g, '<br />') }} 
                                                                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none text-sm sm:text-base"
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

            {/* Next Song Recommendation - Responsive */}
            {next.nextData && (
                <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-4 sm:pb-6 lg:pb-8">
                    <Next 
                        name={next.nextData.name} 
                        artist={next.nextData.artist} 
                        image={next.nextData.image} 
                        id={next.nextData.id} 
                    />
                </div>
            )}
        </div>
    )
}
