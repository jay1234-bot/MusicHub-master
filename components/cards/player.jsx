"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ExternalLink, Repeat, Repeat1, X, Play } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import Link from "next/link";
import { MusicContext } from "@/hooks/use-context";
import { Skeleton } from "../ui/skeleton";
import { IoPause } from "react-icons/io5";
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
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
        }
    }, [values.music]);

    // Animation variants
    const playerVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
        exit: { y: 100, opacity: 0, transition: { duration: 0.2 } },
    };
    const coverVariants = {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
        exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
    };
    const infoVariants = {
        initial: { x: 30, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
        exit: { x: 30, opacity: 0, transition: { duration: 0.2 } },
    };

    return (
        <main>
            <audio autoPlay={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onLoadedData={() => setDuration(audioRef.current.duration)} src={audioURL} ref={audioRef}></audio>
            <AnimatePresence>
                {values.music && (
                    <motion.div
                        className="shadow-2xl fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={playerVariants}
                        style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", background: "rgba(24,24,32,0.85)" }}
                    >
                        <motion.div
                            className="max-w-xl w-full m-2 rounded-2xl border border-border bg-background/80 pointer-events-auto flex flex-col gap-0"
                            layout
                        >
                            <div className="w-full px-4 pt-3">
                                {!duration ? (
                                    <Skeleton className="h-1 w-full" />
                                ) : (
                                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Slider
                                            thumbClassName="hidden"
                                            trackClassName="h-1 transition-[height] group-hover:h-2 rounded-none"
                                            onValueChange={handleSeek}
                                            value={[currentTime]}
                                            max={duration}
                                            className="w-full group"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2">
                                <motion.div className="relative flex items-center gap-3" variants={coverVariants} initial="initial" animate="animate" exit="exit">
                                    <img
                                        src={data.image ? data?.image[1]?.url : ""}
                                        alt={data?.name}
                                        className="rounded-xl aspect-square h-14 w-14 bg-secondary shadow-lg object-cover"
                                    />
                                    {/* Blurred background for dark mode */}
                                    <img
                                        src={data.image ? data?.image[1]?.url : ""}
                                        alt={data?.name}
                                        className="rounded-xl h-[120%] min-w-[120%] opacity-30 hidden dark:block absolute top-0 left-0 right-0 blur-3xl -z-10"
                                    />
                                </motion.div>
                                <motion.div className="flex-1 min-w-0" variants={infoVariants} initial="initial" animate="animate" exit="exit">
                                    {!data?.name ? (
                                        <Skeleton className="h-4 w-32" />
                                    ) : (
                                        <Link href={`/${values.music}`} className="block font-semibold text-base truncate hover:underline">
                                            <motion.span
                                                initial={{ x: 0 }}
                                                animate={{ x: data?.name.length > 18 ? [0, -120, 0] : 0 }}
                                                transition={{ repeat: data?.name.length > 18 ? Infinity : 0, duration: 6, ease: "linear" }}
                                                style={{ display: "inline-block", minWidth: 120 }}
                                            >
                                                {data?.name}
                                            </motion.span>
                                            <ExternalLink className="inline ml-1 h-3.5 w-3.5 text-muted-foreground align-middle" />
                                        </Link>
                                    )}
                                    {!data?.artists?.primary[0]?.name ? (
                                        <Skeleton className="h-3 w-14 mt-1" />
                                    ) : (
                                        <div className="text-xs text-muted-foreground truncate">
                                            {data?.artists?.primary[0]?.name}
                                        </div>
                                    )}
                                </motion.div>
                                <div className="flex items-center gap-1">
                                    <motion.div whileTap={{ scale: 0.85 }}>
                                        <Button
                                            size="icon"
                                            className="p-0 h-9 w-9"
                                            variant={!isLooping ? "ghost" : "secondary"}
                                            onClick={loopSong}
                                            aria-label="Loop"
                                        >
                                            {!isLooping ? <Repeat className="h-4 w-4" /> : <Repeat1 className="h-4 w-4" />}
                                        </Button>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.85 }}>
                                        <Button
                                            size="icon"
                                            className="p-0 h-10 w-10 text-lg"
                                            onClick={togglePlayPause}
                                            aria-label={playing ? "Pause" : "Play"}
                                        >
                                            <AnimatePresence mode="wait" initial={false}>
                                                {playing ? (
                                                    <motion.span
                                                        key="pause"
                                                        initial={{ scale: 0.7, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.7, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex items-center justify-center"
                                                    >
                                                        <IoPause className="h-6 w-6" />
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="play"
"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ExternalLink, Link2Icon, Pause, PauseCircle, Play, Repeat, Repeat1, X } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import Link from "next/link";
import { MusicContext } from "@/hooks/use-context";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { IoPause } from "react-icons/io5";
import { useMusic } from "../music-provider";

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
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
        }
    }, [values.music]);
    return (
        <main>
            <audio autoPlay={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onLoadedData={() => setDuration(audioRef.current.duration)} src={audioURL} ref={audioRef}></audio>
            {values.music && <div className="shadow-lg fixed grid bottom-0 max-w-[500px] md:border-l md:border-r md:rounded-md md:!rounded-b-none md:ml-auto right-0 left-0 border-border overflow-hidden border-t-none z-50 bg-background gap-3">
                <div className="w-full">
                    {!duration ? <Skeleton className="h-1 w-full" /> : (
                        <Slider thumbClassName="hidden" trackClassName="h-1 transition-[height] group-hover:h-2 rounded-none" onValueChange={handleSeek} value={[currentTime]} max={duration} className="w-full group" />
                    )}
                </div>
                <div className="grid gap-2 p-3 pt-0">
                    <div className="flex items-center justify-between gap-3">
                        <div className="relative flex items-center gap-2 w-full">
                            <img src={data.image ? data?.image[1]?.url : ""} alt={data?.name} className="rounded-md aspect-square h-12 w-12 bg-secondary hover:opacity-85 transition cursor-pointer" />
                            <img src={data.image ? data?.image[1]?.url : ""} alt={data?.name} className="rounded-md h-[110%] min-w-[110%] opacity-40 hidden dark:block absolute top-0 left-0 right-0 blur-3xl -z-10" />
                            <div>
                                {!data?.name ? <Skeleton className="h-4 w-32" /> : (
                                    <>
                                        <Link href={`/${values.music}`} className="text-base hover:opacity-85 transition font-medium flex md:hidden gap-2 items-center">{data?.name?.slice(0, 10)}{data?.name?.length >= 11 ? ".." : ""}<ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /></Link>
                                        <Link href={`/${values.music}`} className="text-base hover:opacity-85 transition font-medium gap-2 items-center hidden md:flex">{data?.name}<ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /></Link>
                                    </>
                                )}
                                {!data?.artists?.primary[0]?.name ? <Skeleton className="h-3 w-14 mt-1" /> : (
                                    <>
                                        <h2 className="block md:hidden text-xs -mt-0.5 text-muted-foreground">{data?.artists?.primary[0]?.name.slice(0, 20)}{data?.artists?.primary[0]?.name.length > 20 ? ".." : ""}</h2>
                                        <h2 className="hidden md:block text-xs -mt-0.5 text-muted-foreground">{data?.artists?.primary[0]?.name}</h2>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="icon" className="p-0 h-9 w-9" variant={!isLooping ? "ghost" : "secondary"} onClick={loopSong}>
                                {!isLooping ? <Repeat className="h-3.5 w-3.5" /> : <Repeat1 className="h-3.5 w-3.5" />}
                            </Button>
                            <Button size="icon" className="p-0 h-9 w-9" onClick={togglePlayPause}>{playing ? <IoPause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
                            <Button size="icon" className="p-0 h-9 w-9" variant="secondary" onClick={() => { values.setMusic(null); setCurrent(0); localStorage.clear(); audioRef.current.currentTime = 0; audioRef.current.src = null; setAudioURL(null); }}>
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>}
        </main >
    )
}
