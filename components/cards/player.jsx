"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Repeat, Repeat1, Play, Pause, Download, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import { MusicContext } from "@/hooks/use-context";
import { Skeleton } from "../ui/skeleton";
import { useMusic } from "../music-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function Player() {
    const [data, setData] = useState([]);
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioURL, setAudioURL] = useState("");
    const [isLooping, setIsLooping] = useState(false);
    const values = useContext(MusicContext);

    const getSong = async () => {
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
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const togglePlayPause = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
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
    }, [values.music]);

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-grid-pattern bg-dark-900">
            <audio
                autoPlay={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => setDuration(audioRef.current.duration)}
                src={audioURL}
                ref={audioRef}
            ></audio>
            <AnimatePresence>
                {values.music && (
                    <motion.div
                        className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-6"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    >
                        {/* Album Art */}
                        <div className="flex flex-col items-center">
                            {data?.image ? (
                                <img
                                    src={data?.image[2]?.url}
                                    alt={data?.name}
                                    className="rounded-full w-72 h-72 object-cover shadow-2xl border-4 border-dark-800"
                                    style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
                                />
                            ) : (
                                <Skeleton className="rounded-full w-72 h-72" />
                            )}
                        </div>
                        {/* Song Info */}
                        <div className="mt-8 text-center">
                            <h2 className="text-3xl font-extrabold text-white mb-2 truncate max-w-xs mx-auto">
                                {data?.name || <Skeleton className="h-8 w-40 mx-auto" />}
                            </h2>
                            <p className="text-lg text-gray-300 font-medium truncate max-w-md mx-auto">
                                {data?.artists?.primary?.map(a => a.name).join(", ") || <Skeleton className="h-5 w-32 mx-auto" />}
                            </p>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full mt-8">
                            {duration ? (
                                <>
                                    <Slider
                                        thumbClassName="bg-blue-500"
                                        trackClassName="h-2 bg-gray-700"
                                        onValueChange={handleSeek}
                                        value={[currentTime]}
                                        max={duration}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-white text-sm mt-2">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </>
                            ) : (
                                <Skeleton className="h-2 w-full" />
                            )}
                        </div>
                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <Button size="icon" className="rounded-xl bg-dark-700 hover:bg-dark-600 text-white" variant={!isLooping ? "ghost" : "secondary"} onClick={loopSong} aria-label="Loop">
                                {!isLooping ? <Repeat className="h-6 w-6" /> : <Repeat1 className="h-6 w-6" />}
                            </Button>
                            <Button size="icon" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={togglePlayPause} aria-label={playing ? "Pause" : "Play"}>
                                {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                            </Button>
                            <Button size="icon" className="rounded-xl bg-dark-700 hover:bg-dark-600 text-white" aria-label="Previous" disabled>
                                <SkipBack className="h-6 w-6" />
                            </Button>
                            <Button size="icon" className="rounded-xl bg-dark-700 hover:bg-dark-600 text-white" aria-label="Download" onClick={() => window.open(audioURL, '_blank')}>
                                <Download className="h-6 w-6" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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
