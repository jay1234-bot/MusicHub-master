"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Repeat, Repeat1, Play, Pause, Download, SkipBack, SkipForward, ChevronDown, Maximize2, Heart, Share2, Volume2, VolumeX, Shuffle } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import { MusicContext } from "@/hooks/use-context";
import { Skeleton } from "../ui/skeleton";
import { useMusic } from "../music-provider";
import { motion, AnimatePresence } from "framer-motion";

// Optimized Waveform Component
function Waveform({ playing, currentTime, duration }) {
  const bars = Array.from({ length: 30 }, (_, i) => i);
  
  return (
    <div className="flex items-end justify-center gap-0.5 h-12">
      {bars.map((bar, index) => {
        const progress = currentTime / duration;
        const barProgress = (index / bars.length) - progress;
        const height = Math.max(0.3, Math.random() * 0.7 + (playing ? 0.3 : 0));
        
        return (
          <motion.div
            key={index}
            className={`w-0.5 rounded-full ${
              barProgress < 0.1 ? 'bg-gradient-to-t from-purple-500 to-pink-500' : 
              'bg-gradient-to-t from-slate-400 to-slate-600'
            }`}
            style={{ height: `${height * 100}%` }}
            animate={{
              height: playing ? [`${height * 100}%`, `${(height + 0.1) * 100}%`, `${height * 100}%`] : `${height * 100}%`
            }}
            transition={{
              duration: 0.8,
              repeat: playing ? Infinity : 0,
              delay: index * 0.03,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
}

// Progress Circle Component
function ProgressCircle({ currentTime, duration, size = 120 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = currentTime / duration;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}

function MinimizedPlayer({ data, playing, togglePlayPause, setExpanded }) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/30 shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      style={{ cursor: "default" }}
    >
      <div className="relative flex items-center justify-between px-4 py-3 md:px-10">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {data?.image ? (
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={data?.image[1]?.url} 
                alt={data?.name} 
                className="rounded-xl w-14 h-14 object-cover shadow-lg border-2 border-white/20 dark:border-slate-700/30" 
              />
              {playing && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-purple-500/20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-purple-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <Skeleton className="rounded-xl w-14 h-14" />
          )}
          
          <div className="min-w-0 flex-1">
            <motion.div 
              className="font-semibold truncate text-base text-slate-800 dark:text-slate-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {data?.name || <Skeleton className="h-4 w-24" />}
            </motion.div>
            <motion.div 
              className="text-xs text-slate-600 dark:text-slate-400 truncate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {data?.artists?.primary?.map(a => a.name).join(", ") || <Skeleton className="h-3 w-16" />}
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 text-purple-600 dark:text-purple-400" 
              onClick={togglePlayPause} 
              aria-label={playing ? "Pause" : "Play"}
            >
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              size="icon" 
              variant="ghost"
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80" 
              onClick={() => setExpanded(true)} 
              aria-label="Expand"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ExpandedPlayer({ data, playing, togglePlayPause, loopSong, isLooping, handleSeek, currentTime, duration, setExpanded, audioURL }) {
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const backgrounds = [
    "radial-gradient(ellipse at 60% 40%, #1e293b 60%, #0ea5e9 100%)",
    "radial-gradient(ellipse at 40% 60%, #1e293b 60%, #ec4899 100%)",
    "radial-gradient(ellipse at 20% 80%, #1e293b 60%, #8b5cf6 100%)",
    "radial-gradient(ellipse at 80% 20%, #1e293b 60%, #f59e0b 100%)",
    "radial-gradient(ellipse at 50% 50%, #1e293b 60%, #10b981 100%)"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-4 py-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      {/* Dynamic Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          background: backgrounds[backgroundIndex],
          backgroundSize: "cover",
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ 
            background: backgrounds
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Optimized Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          size="icon" 
          variant="ghost" 
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 text-white" 
          onClick={() => setExpanded(false)} 
          aria-label="Back"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </motion.div>

      <div className="flex flex-col items-center w-full max-w-2xl">
        {/* Album Art with Progress Circle */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
        >
          {data?.image ? (
            <div className="relative">
              <img
                src={data?.image[2]?.url}
                alt={data?.name}
                className="rounded-3xl w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover shadow-2xl border-4 border-white/20"
                style={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.3))"
                }}
              />
              {playing && (
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-purple-500/20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-purple-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              )}
              
              {/* Progress Circle Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ProgressCircle currentTime={currentTime} duration={duration} size={120} />
              </div>
            </div>
          ) : (
            <Skeleton className="rounded-3xl w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80" />
          )}
        </motion.div>

        {/* Song Info */}
        <motion.div 
          className="text-center w-full mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 truncate max-w-xs mx-auto">
            {data?.name || <Skeleton className="h-10 w-40 mx-auto" />}
          </h2>
          <p className="text-lg sm:text-xl text-blue-200 font-medium truncate max-w-md mx-auto">
            {data?.artists?.primary?.map(a => a.name).join(", ") || <Skeleton className="h-6 w-32 mx-auto" />}
          </p>
        </motion.div>

        {/* Optimized Waveform */}
        <motion.div
          className="w-full max-w-md mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Waveform playing={playing} currentTime={currentTime} duration={duration} />
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-xl mb-8 px-4">
          {duration ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Slider
                thumbClassName="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white shadow-lg"
                trackClassName="h-3 bg-slate-700/50 backdrop-blur-sm rounded-full"
                onValueChange={handleSeek}
                value={[currentTime]}
                max={duration}
                className="w-full"
              />
              <div className="flex justify-between text-blue-100 text-sm mt-3">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </motion.div>
          ) : (
            <Skeleton className="h-3 w-full" />
          )}
        </div>

        {/* Control Buttons */}
        <motion.div 
          className="flex items-center justify-center gap-4 sm:gap-6 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white" 
              variant={!isLooping ? "ghost" : "secondary"} 
              onClick={loopSong} 
              aria-label="Loop"
            >
              {!isLooping ? <Repeat className="h-6 w-6" /> : <Repeat1 className="h-6 w-6" />}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg" 
              onClick={togglePlayPause} 
              aria-label={playing ? "Pause" : "Play"}
            >
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause className="h-8 w-8" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="h-8 w-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white" 
              aria-label="Previous" 
              disabled
            >
              <SkipBack className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white" 
              aria-label="Next" 
              disabled
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional Controls */}
        <motion.div 
          className="flex items-center justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white" 
              onClick={() => setIsLiked(!isLiked)}
              aria-label="Like"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white" 
              onClick={() => window.open(audioURL, '_blank')}
              aria-label="Download"
            >
              <Download className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white" 
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white" 
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </motion.div>
        </motion.div>
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
            <AnimatePresence>
                {values.music && (
                    expanded ? (
                        <ExpandedPlayer
                            key="expanded"
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
                            key="minimized"
                            data={data}
                            playing={playing}
                            togglePlayPause={togglePlayPause}
                            setExpanded={setExpanded}
                        />
                    )
                )}
            </AnimatePresence>
        </main>
    );
}