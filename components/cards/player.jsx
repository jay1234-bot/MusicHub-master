"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Repeat, Repeat1, Play, Pause, Download, SkipBack, SkipForward, ChevronDown, Maximize2 } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import { MusicContext } from "@/hooks/use-context";
import { Skeleton } from "../ui/skeleton";
import { useMusic } from "../music-provider";
import { motion } from "framer-motion";

function MinimizedPlayer({ data, playing, togglePlayPause, setExpanded }) {
    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 border-t border-border shadow-lg flex items-center justify-between px-4 py-2 md:px-10"
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            style={{ cursor: "default" }}
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {data?.image ? (
                    <img src={data?.image[1]?.url} alt={data?.name} className="rounded-md w-12 h-12 object-cover" />
                ) : (
                    <Skeleton className="rounded-md w-12 h-12" />
                )}
                <div className="min-w-0">
                    <div className="font-semibold truncate text-base">{data?.name || <Skeleton className="h-4 w-24" />}</div>
                    <div className="text-xs text-muted-foreground truncate">{data?.artists?.primary?.map(a => a.name).join(", ") || <Skeleton className="h-3 w-16" />}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="text-primary" onClick={togglePlayPause} aria-label={playing ? "Pause" : "Play"}>
                    {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setExpanded(true)} aria-label="Expand">
                    <Maximize2 className="h-6 w-6" />
                </Button>
            </div>
        </motion.div>
    );
}

function ExpandedPlayer({ data, playing, togglePlayPause, loopSong, isLooping, handleSeek, currentTime, duration, setExpanded, audioURL }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-2 py-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
            {/* Animated background */}
            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    background: "radial-gradient(ellipse at 60% 40%, #1e293b 60%, #0ea5e9 100%)",
                    backgroundSize: "cover",
                    animation: "bgMove 8s ease-in-out infinite alternate"
                }}
            />
            <style jsx global>{`
                @keyframes bgMove {
                    0% { filter: blur(0px) brightness(1); }
                    100% { filter: blur(2px) brightness(1.1); }
                }
            `}</style>
            <Button size="icon" variant="ghost" className="absolute top-4 left-4 md:top-6 md:left-6" onClick={() => setExpanded(false)} aria-label="Back">
                <ChevronDown className="h-7 w-7" />
            </Button>
            <div className="flex flex-col items-center w-full mt-8 md:mt-0">
                {data?.image ? (
                    <img
                        src={data?.image[2]?.url}
                        alt={data?.name}
                        className="rounded-full w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover shadow-2xl border-4 border-dark-800"
                        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
                    />
                ) : (
                    <Skeleton className="rounded-full w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72" />
                )}
            </div>
            <div className="mt-6 md:mt-8 text-center w-full">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 truncate max-w-xs mx-auto">
                    {data?.name || <Skeleton className="h-8 w-40 mx-auto" />}
                </h2>
                <p className="text-base sm:text-lg text-blue-300 font-medium truncate max-w-md mx-auto">
                    {data?.artists?.primary?.map(a => a.name).join(", ") || <Skeleton className="h-5 w-32 mx-auto" />}
                </p>
            </div>
            <div className="w-full max-w-xl mt-6 md:mt-8 px-1 sm:px-4">
                {duration ? (
                    <>
                        <Slider
                            thumbClassName="bg-blue-500"
                            trackClassName="h-2 bg-blue-900"
                            onValueChange={handleSeek}
                            value={[currentTime]}
                            max={duration}
                            className="w-full"
                        />
                        <div className="flex justify-between text-blue-100 text-xs sm:text-sm mt-2">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </>
                ) : (
                    <Skeleton className="h-2 w-full" />
                )}
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 md:mt-8 w-full">
                <Button size="icon" className="rounded-xl bg-dark-700 hover:bg-dark-600 text-blue-200" variant={!isLooping ? "ghost" : "secondary"} onClick={loopSong} aria-label="Loop">
                    {!isLooping ? <Repeat className="h-6 w-6" /> : <Repeat1 className="h-6 w-6" />}
                </Button>
                <Button size="icon" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={togglePlayPause} aria-label={playing ? "Pause" : "Play"}>
                    {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <Button size="icon" className="rounded-xl bg-dark-700 hover:bg-dark-600 text-blue-200" aria-label="Previous" disabled>
                    <SkipBack className="h-6 w-6" />
                </Button>
                <Button size="icon" className="rounded-xl bg-dark-700 hover:bg-dark-600 text-blue-200" aria-label="Download" onClick={() => window.open(audioURL, '_blank')}>
                    <Download className="h-6 w-6" />
                </Button>
            </div>
        </motion.div>
    );
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Player() {
    const [data, setData] = useState([]);
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioURL, setAudioURL] = useState("");
    const [isLooping, setIsLooping] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const values = useContext(MusicContext);
    const { current, setCurrent } = useMusic();

    useEffect(() => {
        if (values.music) {
            getSong();
            if (current) {
                audioRef.current.currentTime = parseFloat(current + 1);
            }
            setPlaying(localStorage.getItem("p") == "true" && true || !localStorage.getItem("p") && true);
            const handleTimeUpdate = () => {
                try {
                    setCurrentTime(audioRef.current.currentTime);
                    setDuration(audioRef.current.duration);
                    setCurrent(audioRef.current.currentTime);
                } catch (e) {
                    setPlaying(false);
                }
            };
            audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
                }
            };
        }
        // eslint-disable-next-line
    }, [values.music]);

    async function getSong() {
        const get = await getSongsById(values.music);
        const data = await get.json();
        setData(data.data[0]);
        if (data?.data[0]?.downloadUrl[2]?.url) {
            setAudioURL(data?.data[0]?.downloadUrl[2]?.url);
        } else if (data?.data[0]?.downloadUrl[1]?.url) {
            setAudioURL(data?.data[0]?.downloadUrl[1]?.url);
        } else {
            setAudioURL(data?.data[0]?.downloadUrl[0]?.url);
        }
    }

    function togglePlayPause(e) {
        e?.stopPropagation();
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    }

    function loopSong(e) {
        e?.stopPropagation();
        audioRef.current.loop = !audioRef.current.loop;
        setIsLooping(!isLooping);
    }

    function handleSeek(e) {
        const seekTime = e[0];
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    }

    return (
        <main>
            <audio
                autoPlay={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => setDuration(audioRef.current.duration)}
                src={audioURL}
                ref={audioRef}
            ></audio>
            {values.music && (
                expanded ? (
                    <ExpandedPlayer
                        data={data}
                        playing={playing}
                        togglePlayPause={togglePlayPause}
                        loopSong={loopSong}
                        isLooping={isLooping}
                        handleSeek={handleSeek}
                        currentTime={currentTime}
                        duration={duration}
                        setExpanded={setExpanded}
                        audioURL={audioURL}
                    />
                ) : (
                    <MinimizedPlayer
                        data={data}
                        playing={playing}
                        togglePlayPause={togglePlayPause}
                        setExpanded={setExpanded}
                    />
                )
            )}
            <style jsx global>{`
                .bg-grid-pattern {
                    background-color: #101624;
                    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .bg-dark-900 { background-color: #101624; }
                .bg-dark-800 { background-color: #1a2236; }
                .bg-dark-700 { background-color: #232b3e; }
                .bg-dark-600 { background-color: #2c3650; }
            `}</style>
        </main>
    );
}
