"use client"
import { Button } from "@/components/ui/button";
import { getSongsById, getSongsLyricsById } from "@/lib/fetch";
import { Download, Pause, Play, RedoDot, UndoDot, Repeat, Loader2, Bookmark, BookmarkCheck, Repeat1, Share2, Music2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
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

export default function Player({ id }) {
    const [data, setData] = useState([]);
    const [lyrics, setLyrics] = useState(null);
    const [playing, setPlaying] = useState(true);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const params = useSearchParams();
    const next = useContext(NextContext);
    const { current, setCurrent } = useMusic();

    const getSong = async () => {
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
    };

    const getLyrics = async () => {
        const get = await getSongsLyricsById(id);
        const data = await get.json();
        setLyrics(data.data.lyrics);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const togglePlayPause = () => {
        if (playing) {
            audioRef.current.pause();
            localStorage.setItem("p", "false");
        } else {
            audioRef.current.play();
            localStorage.setItem("p", "true");
        }
        setPlaying(!playing);
    };

    const downloadSong = async () => {
        setIsDownloading(true);
        const response = await fetch(audioURL);
        const datas = await response.blob();
        const url = URL.createObjectURL(datas);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name}.mp3`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('downloaded');
        setIsDownloading(false);
    };

    const handleSeek = (e) => {
        const seekTime = e[0];
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const loopSong = () => {
        audioRef.current.loop = !audioRef.current.loop;
        setIsLooping(!isLooping);
    };

    const handleShare = () => {
        try {
            navigator.share({
                url: `https://${window.location.host}/${data.id}`
            });
        }
        catch (e) {
            toast.error('Something went wrong!');
        }
    }


    useEffect(() => {
        getSong();
        localStorage.setItem("last-played", id);
        localStorage.removeItem("p");
        if (current) {
            audioRef.current.currentTime = parseFloat(current + 1);
        }
        const handleTimeUpdate = () => {
            try {
                setCurrentTime(audioRef.current.currentTime);
                setDuration(audioRef.current.duration);
                setCurrent(audioRef.current.currentTime);
            }
            catch (e) {
                setPlaying(false);
            }
        };
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, []);
    useEffect(() => {
        const handleRedirect = () => {
            if (currentTime === duration && !isLooping && duration !== 0) {
                window.location.href = `https://${window.location.host}/${next?.nextData?.id}`;
            }
        };
        if (isLooping || duration === 0) return;
        return handleRedirect();
    }, [currentTime, duration, isLooping, next?.nextData?.id]);
    return (
        <div className="mb-3 mt-10">
            <audio onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onLoadedData={() => setDuration(audioRef.current.duration)} autoPlay={playing} src={audioURL} ref={audioRef}></audio>
            <div className="grid gap-6 w-full">
                <div className="sm:flex px-6 md:px-20 lg:px-32 grid gap-8 w-full">
                    <div>
                        {data.length <= 0 ? (
                            <Skeleton className="w-[250px] aspect-square rounded-2xl h-[250px]" />
                        ) : (
                            <div className="relative">
                                <img src={data.image[2].url} className={`h-[250px] aspect-square bg-secondary/50 rounded-2xl w-[250px] object-cover animate-spin-slow ${playing ? '[animation-play-state:running]' : '[animation-play-state:paused]'}`} />
                                <img src={data.image[2].url} className="hidden dark:block absolute top-0 left-0 w-full h-full blur-3xl -z-10 opacity-75" />
                            </div>
                        )}
                    </div>
                    {data.length <= 0 ? (
                        <div className="flex flex-col justify-between w-full">
                            <div>
                                <Skeleton className="h-4 w-36 mb-2" />
                                <Skeleton className="h-3 w-16 mb-4" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-full rounded-full mb-2" />
                                <div className="w-full flex items-center justify-between">
                                    <Skeleton className="h-[9px] w-6" />
                                    <Skeleton className="h-[9px] w-6" />
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <Skeleton className="h-10 w-10" />
                                    <Skeleton className="h-10 w-10" />
                                    <Skeleton className="h-10 w-10" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-between w-full">
                            <div className="sm:mt-0 mt-3 animate-fade-in animate-slide-in-from-bottom-2">
                                <h1 className="text-4xl font-bold md:max-w-lg">{data.name}</h1>
                                <p className="text-lg text-muted-foreground mt-1">by <Link href={"/search/" + `${encodeURI(data.artists.primary[0].name.toLowerCase().split(" ").join("+"))}`} className="text-foreground">{data.artists.primary[0]?.name || "unknown"}</Link></p>
                            </div>
                            <div className="grid gap-2 w-full mt-5 sm:mt-0">
                                <Slider onValueChange={handleSeek} value={[currentTime]} max={duration} className="w-full" />
                                <div className="w-full flex items-center justify-between">
                                    <span className="text-sm">{formatTime(currentTime)}</span>
                                    <span className="text-sm">{formatTime(duration)}</span>
                                </div>
                                <div className="flex items-center mt-1 justify-between w-full sm:mt-2">
                                    <Button variant={playing ? "default" : "secondary"} className="gap-1 rounded-full" onClick={togglePlayPause}>
                                        {playing ? (
                                            <IoPause className="h-4 w-4" />
                                        ) : (
                                            <Play className="h-4 w-4" />
                                        )}
                                        {playing ? "Pause" : "Play"}
                                    </Button>
                                    <div className="flex items-center gap-2 sm:gap-3 sm:mt-0">
                                        <Button size="icon" variant="ghost" onClick={loopSong}>
                                            {!isLooping ? <Repeat className="h-4 w-4" /> : <Repeat1 className="h-4 w-4" />}
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={downloadSong}>
                                            {isDownloading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
                                        <Credenza>
                                            <CredenzaTrigger asChild>
                                                <Button size="icon" variant="ghost" onClick={getLyrics}><Music2 className="h-4 w-4" /></Button>
                                            </CredenzaTrigger>
                                            <CredenzaContent>
                                                <CredenzaHeader>
                                                    <CredenzaTitle>{data.name} - Lyrics</CredenzaTitle>
                                                </CredenzaHeader>
                                                <CredenzaBody>
                                                    <ScrollArea className="h-80">
                                                        {lyrics ? (
                                                            <p dangerouslySetInnerHTML={{ __html: lyrics.replace(/\n/g, '<br />') }} className="text-muted-foreground"></p>
                                                        ) : (
                                                            <div className="grid gap-2">
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-1/2" />
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
            {next.nextData && (
                <div className="mt-10 -mb-3 px-6 md:px-20 lg:px-32">
                    <Next name={next.nextData.name} artist={next.nextData.artist} image={next.nextData.image} id={next.nextData.id} />
                </div>
            )}
        </div>
    )
}
