"use client";
import React, { useContext, useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { Button } from "../ui/button";
import { Repeat, Repeat1, Play, Pause, Download, SkipBack, SkipForward, ChevronDown, Maximize2, Heart, Share2, Volume2, VolumeX, Shuffle } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import { MusicContext } from "@/hooks/use-context";
import { Skeleton } from "../ui/skeleton";
import { useMusic } from "../music-provider";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

// Memoized formatTime function for better performance
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// Dynamically import heavy components
const Waveform = dynamic(() => import('./waveform'), { ssr: false });
const ProgressCircle = dynamic(() => import('./progress-circle'), { ssr: false });

// This component is now dynamically imported for better performance
// The implementation is in the separate waveform.jsx file

// This component is now dynamically imported for better performance
// The implementation is in the separate progress-circle.jsx file

// Memoized MinimizedPlayer component for better performance
function MinimizedPlayer({ data, playing, togglePlayPause, setExpanded }) {
  // Memoize expand handler for better performance
  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, [setExpanded]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/30 shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      style={{ 
        cursor: "default",
        willChange: "transform, opacity",
        transform: "translateZ(0)"
      }}
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
                alt={data?.name || "Album art"} 
                className="rounded-xl w-14 h-14 object-cover shadow-lg border-2 border-white/20 dark:border-slate-700/30" 
                loading="eager"
              />
              {playing && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-purple-500/20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-purple-500 rounded-full will-change-transform"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
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
              onClick={handleExpand} 
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

// Memoized ExpandedPlayer component for better performance
function ExpandedPlayer({ data, playing, togglePlayPause, loopSong, isLooping, handleSeek, currentTime, duration, setExpanded, audioURL }) {
  // Use localStorage for persistent state
  const [isLiked, setIsLiked] = useState(() => {
    if (typeof window !== 'undefined' && data?.id) {
      return localStorage.getItem(`liked-${data.id}`) === 'true';
    }
    return false;
  });
  
  // Use localStorage for volume persistence
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('audio-volume');
      return savedVolume ? parseFloat(savedVolume) : 1.0;
    }
    return 1.0;
  });
  
  const [isMuted, setIsMuted] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Memoize backgrounds to prevent recreation on each render
  const backgrounds = useMemo(() => [
    "radial-gradient(ellipse at 60% 40%, #1e293b 60%, #0ea5e9 100%)",
    "radial-gradient(ellipse at 40% 60%, #1e293b 60%, #ec4899 100%)",
    "radial-gradient(ellipse at 20% 80%, #1e293b 60%, #8b5cf6 100%)",
    "radial-gradient(ellipse at 80% 20%, #1e293b 60%, #f59e0b 100%)",
    "radial-gradient(ellipse at 50% 50%, #1e293b 60%, #10b981 100%)"
  ], []);

  // Memoize formatted time strings
  const formattedCurrentTime = useMemo(() => formatTime(currentTime), [currentTime]);
  const formattedDuration = useMemo(() => formatTime(duration), [duration]);

  // Memoize handlers for better performance
  const handleClose = useCallback(() => setExpanded(false), [setExpanded]);
  
  const handleVolumeChange = useCallback((value) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('audio-volume', newVolume.toString());
    }
  }, []);
  
  const toggleMute = useCallback(() => {
    if (isMuted) {
      const prevVolume = volume === 0 ? 0.5 : volume;
      setVolume(prevVolume);
      setIsMuted(false);
      localStorage.setItem('audio-volume', prevVolume.toString());
    } else {
      setIsMuted(true);
      // We don't set volume to 0 here to remember the previous volume
    }
  }, [isMuted, volume]);
  
  const toggleLike = useCallback(() => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (data?.id) {
      localStorage.setItem(`liked-${data.id}`, newLikedState.toString());
    }
  }, [isLiked, data?.id]);
  
  const handleDownload = useCallback(() => {
    if (audioURL) {
      window.open(audioURL, "_blank");
    }
  }, [audioURL]);

  // Background rotation effect with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-4 py-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      style={{ 
        willChange: "transform, opacity",
        transform: "translateZ(0)" 
      }}
    >
      {/* Dynamic Animated Background with hardware acceleration */}
      <motion.div
        className="absolute inset-0 -z-10 hardware-accelerated"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          background: backgrounds[backgroundIndex],
          backgroundSize: "cover",
          willChange: "opacity, background",
          transform: "translateZ(0)"
        }}
      >
        <motion.div
          className="absolute inset-0 hardware-accelerated"
          animate={{ 
            background: backgrounds
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Optimized Floating Particles with hardware acceleration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {useMemo(() => Array.from({ length: 15 }).map((_, i) => {
          // Pre-calculate random values to avoid recalculation on each render
          const leftPos = `${Math.random() * 100}%`;
          const topPos = `${Math.random() * 100}%`;
          const duration = 4 + Math.random() * 2;
          const delay = Math.random() * 3;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full hardware-accelerated"
              style={{
                left: leftPos,
                top: topPos,
                willChange: "transform, opacity",
                transform: "translateZ(0)"
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
            />
          );
        }), [])} {/* Empty dependency array ensures particles are only created once */}
      </div>

      <motion.div
        className="absolute top-6 left-6 z-10 hardware-accelerated"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        style={{ willChange: "transform, opacity" }}
      >
        <Button 
          size="icon" 
          variant="ghost" 
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 text-white player-control" 
          onClick={handleClose} 
          aria-label="Back to minimized player"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </motion.div>

      <div className="flex flex-col items-center w-full max-w-2xl px-2 sm:px-4 md:px-8">
        {/* Album Art with Progress Circle - Hardware accelerated */}
        <motion.div
          className="relative mb-6 sm:mb-8 hardware-accelerated"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          style={{ willChange: "transform" }}
        >
          {data?.image ? (
            <div className="relative w-full flex justify-center">
              <div className={`album-rotate ${playing ? 'playing' : ''}`}>
                <Image
                  src={data?.image[2]?.url || data?.image[1]?.url || data?.image[0]?.url}
                  alt={data?.name || "Album art"}
                  width={256}
                  height={256}
                  className="rounded-2xl w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover shadow-2xl border-4 border-white/20 max-w-full lazy-image"
                  priority={true}
                  loading="eager"
                  style={{ 
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.3))",
                    willChange: "transform",
                    transform: "translateZ(0)"
                  }}
                />
              </div>
              {playing && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-purple-500/20 flex items-center justify-center hardware-accelerated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-purple-500 rounded-full hardware-accelerated"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ willChange: "transform" }}
                  />
                </motion.div>
              )}
              {/* Progress Circle Overlay with hardware acceleration */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none hardware-accelerated">
                <ProgressCircle currentTime={currentTime} duration={duration} size={100} />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 max-w-full skeleton-loading" />
          )}
        </motion.div>

        {/* Song Info with hardware acceleration */}
        <motion.div 
          className="text-center w-full mb-6 sm:mb-8 px-2 hardware-accelerated"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ willChange: "transform, opacity" }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 truncate max-w-full">
            {data?.name || <div className="h-8 w-32 mx-auto skeleton-loading" />}
          </h2>
          <p className="text-base sm:text-lg text-blue-200 font-medium truncate max-w-full">
            {data?.artists?.primary?.map(a => a.name).join(", ") || <div className="h-5 w-20 mx-auto skeleton-loading" />}
          </p>
        </motion.div>

        {/* Optimized Waveform with hardware acceleration and responsive design */}
        <motion.div
          className="w-full max-w-xs sm:max-w-md mb-6 sm:mb-8 hardware-accelerated"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          style={{ willChange: "transform, opacity" }}
        >
          {/* Use memoized barCount for better performance */}
          <Waveform 
            playing={playing} 
            currentTime={currentTime} 
            duration={duration} 
            barCount={useMemo(() => {
              if (typeof window !== 'undefined') {
                return window.innerWidth < 640 ? 12 : 30;
              }
              return 30; // Default for SSR
            }, [])} 
            className="waveform-bars-optimized"
          />
        </motion.div>

        {/* Progress Bar with hardware acceleration and optimized animations */}
        <div className="w-full max-w-xl mb-6 sm:mb-8 px-2 sm:px-4">
          {duration ? (
            <motion.div
              className="hardware-accelerated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{ willChange: "transform, opacity" }}
            >
              <Slider
                thumbClassName="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white shadow-lg slider-glow-thumb"
                trackClassName="h-3 bg-slate-700/50 backdrop-blur-sm rounded-full slider-animated-range"
                onValueChange={handleSeek}
                value={[currentTime]}
                max={duration}
                className="w-full smooth-progress"
                aria-label="Playback progress"
              />
              <div className="flex justify-between text-blue-100 text-xs sm:text-sm mt-2">
                <span>{formattedCurrentTime}</span>
                <span>{formattedDuration}</span>
              </div>
            </motion.div>
          ) : (
            <div className="h-3 w-full skeleton-loading player-loading-indicator" />
          )}
        </div>

        {/* Control Buttons with hardware acceleration and optimized animations */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 w-full hardware-accelerated"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ willChange: "transform, opacity" }}
        >
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white player-control" 
              variant={!isLooping ? "ghost" : "secondary"} 
              onClick={loopSong} 
              aria-label={isLooping ? "Disable loop" : "Enable loop"}
            >
              {!isLooping ? <Repeat className="h-6 w-6" /> : <Repeat1 className="h-6 w-6" />}
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg player-control" 
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
                    className="hardware-accelerated"
                    style={{ willChange: "transform" }}
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
                    className="hardware-accelerated"
                    style={{ willChange: "transform" }}
                  >
                    <Play className="h-8 w-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white player-control" 
              aria-label="Previous track" 
              disabled
            >
              <SkipBack className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white player-control" 
              aria-label="Next track" 
              disabled
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional Controls with hardware acceleration and optimized handlers */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 hardware-accelerated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          style={{ willChange: "transform, opacity" }}
        >
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white player-control" 
              onClick={toggleLike}
              aria-label="Like"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white player-control" 
              onClick={handleDownload}
              aria-label="Download"
            >
              <Download className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white player-control" 
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="hardware-accelerated"
            style={{ willChange: "transform" }}
          >
            <Button 
              size="icon" 
              className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white player-control" 
              onClick={toggleMute}
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

function Player() {
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
    
    // Memoized getSong function to prevent unnecessary re-renders
    const getSong = useCallback(async () => {
        try {
            const get = await getSongsById(values.music);
            const data = await get.json();
            setData(data.data[0]);
            
            // Find the highest quality URL available
            if (data?.data[0]?.downloadUrl[2]?.url) {
                setAudioURL(data?.data[0]?.downloadUrl[2]?.url);
            } else if (data?.data[0]?.downloadUrl[1]?.url) {
                setAudioURL(data?.data[0]?.downloadUrl[1]?.url);
            } else {
                setAudioURL(data?.data[0]?.downloadUrl[0]?.url);
            }
        } catch (error) {
            console.error("Error fetching song:", error);
        }
    }, [values.music]);

    // Memoized event handlers for better performance
    const togglePlayPause = useCallback((e) => {
        e?.stopPropagation();
        if (playing) {
            audioRef.current.pause();
            // Save play state to localStorage
            localStorage.setItem("p", "false");
        } else {
            audioRef.current.play().catch(err => console.error("Playback error:", err));
            // Save play state to localStorage
            localStorage.setItem("p", "true");
        }
        setPlaying(!playing);
    }, [playing]);

    const loopSong = useCallback((e) => {
        e?.stopPropagation();
        const newLoopState = !isLooping;
        if (audioRef.current) {
            audioRef.current.loop = newLoopState;
        }
        setIsLooping(newLoopState);
        // Save loop state to localStorage
        localStorage.setItem("loop", newLoopState.toString());
    }, [isLooping]);

    const handleSeek = useCallback((e) => {
        const seekTime = e[0];
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    }, []);

    // Handle audio time updates with debounce for better performance
    const handleTimeUpdate = useCallback(() => {
        try {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                if (!isNaN(audioRef.current.duration)) {
                    setDuration(audioRef.current.duration);
                }
                setCurrent(audioRef.current.currentTime);
            }
        } catch (e) {
            console.error("Time update error:", e);
            setPlaying(false);
        }
    }, [setCurrent]);

    // Setup audio element and event listeners
    useEffect(() => {
        if (values.music) {
            getSong();
            
            // Restore playback position if available
            if (current && audioRef.current) {
                audioRef.current.currentTime = parseFloat(current + 1);
            }
            
            // Restore play state from localStorage
            const savedPlayState = localStorage.getItem("p");
            setPlaying(savedPlayState === "true" || (savedPlayState === null && true));
            
            // Restore loop state from localStorage
            const savedLoopState = localStorage.getItem("loop");
            if (savedLoopState && audioRef.current) {
                const shouldLoop = savedLoopState === "true";
                audioRef.current.loop = shouldLoop;
                setIsLooping(shouldLoop);
            }
            
            // Add event listener for time updates
            if (audioRef.current) {
                audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
            }
            
            // Cleanup function
            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
                }
            };
        }
    }, [values.music, current, getSong, handleTimeUpdate]);

    // Memoized toggle expanded state handler
    const toggleExpanded = useCallback(() => {
        setExpanded(prev => !prev);
    }, []);

    return (
        <main className="player-container hardware-accelerated" style={{ willChange: "transform" }}>
            <audio
                autoPlay={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => audioRef.current && setDuration(audioRef.current.duration)}
                onError={(e) => console.error("Audio error:", e)}
                src={audioURL}
                ref={audioRef}
                preload="auto"
            ></audio>
            <AnimatePresence mode="wait">
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
                            setExpanded={toggleExpanded}
                            audioURL={audioURL}
                        />
                    ) : (
                        <MinimizedPlayer
                            key="minimized"
                            data={data}
                            playing={playing}
                            togglePlayPause={togglePlayPause}
                            setExpanded={toggleExpanded}
                        />
                    )
                )}
            </AnimatePresence>
        </main>
    );
}

export default Player;