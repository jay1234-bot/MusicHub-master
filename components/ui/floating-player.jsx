"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/components/music-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingPlayer({ audioRef, playing, togglePlayPause, currentTime, duration, formatTime }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const { current } = useMusic();

    // Show floating player when music is playing
    useEffect(() => {
        if (playing && currentTime > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [playing, currentTime]);

    const handleVolumeChange = (value) => {
        const newVolume = value[0] / 100;
        setVolume(newVolume);
        if (audioRef?.current) {
            audioRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            setVolume(1);
            if (audioRef?.current) {
                audioRef.current.volume = 1;
            }
            setIsMuted(false);
        } else {
            setVolume(0);
            if (audioRef?.current) {
                audioRef.current.volume = 0;
            }
            setIsMuted(true);
        }
    };

    const skipBackward = () => {
        if (audioRef?.current) {
            audioRef.current.currentTime = Math.max(0, currentTime - 10);
        }
    };

    const skipForward = () => {
        if (audioRef?.current) {
            audioRef.current.currentTime = Math.min(duration, currentTime + 10);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
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
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
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
                                >
                                    <SkipBack className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                    size="icon"
                                    variant="default"
                                    onClick={togglePlayPause}
                                    className="h-10 w-10 rounded-full hover:scale-105 transition-transform"
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
                                        className="w-full"
                                        thumbClassName="slider-glow-thumb"
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
                            >
                                {isExpanded ? '−' : '+'}
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 