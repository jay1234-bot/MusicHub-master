"use client"
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/components/music-provider";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Performance optimization: use intersection observer to detect visibility
function useIsVisible(ref) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });
        
        observer.observe(ref.current);
        
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);

    return isVisible;
}

// Memoize the component for better performance
const FloatingPlayer = memo(function FloatingPlayer({ audioRef, playing, togglePlayPause, currentTime, duration, formatTime }) {
    // Use localStorage for volume persistence
    const [volume, setVolume] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedVolume = localStorage.getItem('audio-volume');
            return savedVolume ? parseFloat(savedVolume) : 1.0;
        }
        return 1.0;
    });
    const [isMuted, setIsMuted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { current } = useMusic();
    const playerRef = useRef(null);
    
    // Use intersection observer to only animate when visible
    const isInViewport = useIsVisible(playerRef);

    // Show floating player when music is playing
    useEffect(() => {
        if (playing && currentTime > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
        
        // Apply saved volume to audio element
        if (audioRef?.current && volume !== undefined) {
            audioRef.current.volume = volume;
            setIsMuted(volume === 0);
        }
    }, [playing, currentTime, audioRef, volume]);

    // Memoized volume change handler
    const handleVolumeChange = useCallback((value) => {
        const newVolume = value[0] / 100;
        setVolume(newVolume);
        if (audioRef?.current) {
            audioRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('audio-volume', newVolume.toString());
        }
    }, [audioRef]);

    // Memoized mute toggle
    const toggleMute = useCallback(() => {
        if (isMuted) {
            const prevVolume = volume === 0 ? 1 : volume;
            setVolume(prevVolume);
            if (audioRef?.current) {
                audioRef.current.volume = prevVolume;
            }
            setIsMuted(false);
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('audio-volume', prevVolume.toString());
            }
        } else {
            if (audioRef?.current) {
                audioRef.current.volume = 0;
            }
            setIsMuted(true);
            
            // Don't save muted state to localStorage to preserve previous volume
        }
    }, [isMuted, volume, audioRef]);

    // Memoized skip functions
    const skipBackward = useCallback(() => {
        if (audioRef?.current) {
            audioRef.current.currentTime = Math.max(0, currentTime - 10);
        }
    }, [audioRef, currentTime]);

    const skipForward = useCallback(() => {
        if (audioRef?.current) {
            audioRef.current.currentTime = Math.min(duration, currentTime + 10);
        }
    }, [audioRef, currentTime, duration]);
    
    // Memoize progress percentage calculation
    const progressPercentage = useMemo(() => {
        return (currentTime / duration) * 100 || 0;
    }, [currentTime, duration]);
    
    // Memoize formatted time strings
    const formattedCurrentTime = useMemo(() => formatTime(currentTime), [formatTime, currentTime]);
    const formattedDuration = useMemo(() => formatTime(duration), [formatTime, duration]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={playerRef}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 30,
                        // Use reduced motion for better performance
                        ...(isInViewport ? {} : { duration: 0 })
                    }}
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
                    // Add hardware acceleration for smoother animations
                    style={{ 
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)'
                    }}
                >
                    <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4 min-w-[300px] max-w-[400px]">
                        {/* Progress Bar */}
                        <div className="mb-3">
                            <Slider 
                                value={[currentTime]} 
                                max={duration} 
                                className="w-full"
                                thumbClassName="slider-glow-thumb"
                                trackClassName="slider-animated-range"
                                aria-label="Playback progress"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{formattedCurrentTime}</span>
                                <span>{formattedDuration}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            {/* Main Controls */}
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={skipBackward}
                                    className="h-8 w-8 rounded-full hover:bg-purple-500/10"
                                    aria-label="Skip backward"
                                >
                                    <SkipBack className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                    size="icon"
                                    variant="default"
                                    onClick={togglePlayPause}
                                    className="h-10 w-10 rounded-full hover:scale-105 transition-transform"
                                    aria-label={playing ? "Pause" : "Play"}
                                >
                                    {playing ? (
                                        <Pause className="h-4 w-4" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                </Button>
                                
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={skipForward}
                                    className="h-8 w-8 rounded-full hover:bg-purple-500/10"
                                    aria-label="Skip forward"
                                >
                                    <SkipForward className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={toggleMute}
                                    className="h-8 w-8 rounded-full hover:bg-purple-500/10"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? (
                                        <VolumeX className="h-4 w-4" />
                                    ) : (
                                        <Volume2 className="h-4 w-4" />
                                    )}
                                </Button>
                                
                                <div className="w-20">
                                    <Slider
                                        value={[isMuted ? 0 : volume * 100]}
                                        max={100}
                                        onValueChange={handleVolumeChange}
                                        className="w-full transition-all duration-200"
                                        thumbClassName="slider-glow-thumb"
                                        aria-label="Volume"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expand Button */}
                        <motion.div
                            className="absolute -top-2 -right-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="h-6 w-6 rounded-full text-xs"
                                aria-label={isExpanded ? "Collapse player" : "Expand player"}
                            >
                                {isExpanded ? '−' : '+'}
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
export default FloatingPlayer;
