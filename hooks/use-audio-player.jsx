import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

export function useAudioPlayer(audioURL, initialPlaying = true) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(initialPlaying);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [volume, setVolumeState] = useState(() => {
        // Try to get volume from localStorage for persistence
        if (typeof window !== 'undefined') {
            const savedVolume = localStorage.getItem('audio-volume');
            return savedVolume ? parseFloat(savedVolume) : 1.0;
        }
        return 1.0;
    });
    const timeUpdateThrottleRef = useRef(0);
    const requestAnimationRef = useRef(null);

    // Throttled time update handler for better performance
    const handleTimeUpdate = useCallback(() => {
        try {
            if (audioRef.current) {
                // Throttle updates to reduce re-renders (every ~250ms)
                const now = Date.now();
                if (now - timeUpdateThrottleRef.current > 250) {
                    timeUpdateThrottleRef.current = now;
                    setCurrentTime(audioRef.current.currentTime);
                    if (!duration && audioRef.current.duration) {
                        setDuration(audioRef.current.duration);
                    }
                }
            }
        } catch (e) {
            setPlaying(false);
            setError('Error updating time');
        }
    }, [duration]);

    // Use requestAnimationFrame for smoother updates
    const updateTimeWithRAF = useCallback(() => {
        if (audioRef.current && playing) {
            handleTimeUpdate();
            requestAnimationRef.current = requestAnimationFrame(updateTimeWithRAF);
        }
    }, [handleTimeUpdate, playing]);

    // Optimized play/pause function
    const togglePlayPause = useCallback(() => {
        if (playing) {
            audioRef.current?.pause();
        } else {
            // Add play promise handling for better mobile experience
            const playPromise = audioRef.current?.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Play error:", error);
                    setPlaying(false);
                    setError('Unable to play audio');
                });
            }
        }
        setPlaying(!playing);
    }, [playing]);

    // Optimized seek function with debouncing
    const seekTimeoutRef = useRef(null);
    const seek = useCallback((time) => {
        if (audioRef.current) {
            // Clear any pending seek operations
            if (seekTimeoutRef.current) {
                clearTimeout(seekTimeoutRef.current);
            }
            
            // Update UI immediately for responsiveness
            setCurrentTime(time);
            
            // Debounce actual seek operation slightly for better performance
            // when user is dragging slider rapidly
            seekTimeoutRef.current = setTimeout(() => {
                audioRef.current.currentTime = time;
                seekTimeoutRef.current = null;
            }, 50);
        }
    }, []);

    // Optimized volume control with persistence
    const setVolume = useCallback((newVolume) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        if (audioRef.current) {
            audioRef.current.volume = clampedVolume;
        }
        setVolumeState(clampedVolume);
        
        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('audio-volume', clampedVolume.toString());
        }
    }, []);

    // Memoized loop control
    const setLoop = useCallback((loop) => {
        if (audioRef.current) {
            audioRef.current.loop = loop;
        }
    }, []);

    // Setup audio event listeners
    useEffect(() => {
        if (!audioURL) return;

        // Create audio element if it doesn't exist
        const audio = audioRef.current || new Audio();
        audioRef.current = audio;

        // Apply saved volume
        audio.volume = volume;
        
        // Preload metadata for faster loading
        audio.preload = 'metadata';

        // Set audio source with error handling
        try {
            audio.src = audioURL;
            audio.load();
        } catch (err) {
            console.error('Error loading audio:', err);
            setError('Failed to load audio');
            setIsLoading(false);
            return;
        }

        // Optimized event handlers
        const handleLoadedData = () => {
            setDuration(audio.duration);
            setIsLoading(false);
            setError(null);
            
            // Start RAF loop for smoother time updates
            if (playing && requestAnimationRef.current === null) {
                requestAnimationRef.current = requestAnimationFrame(updateTimeWithRAF);
            }
        };

        const handlePlay = () => {
            setPlaying(true);
            // Start RAF loop when playing
            if (requestAnimationRef.current === null) {
                requestAnimationRef.current = requestAnimationFrame(updateTimeWithRAF);
            }
        };

        const handlePause = () => {
            setPlaying(false);
            // Stop RAF loop when paused
            if (requestAnimationRef.current !== null) {
                cancelAnimationFrame(requestAnimationRef.current);
                requestAnimationRef.current = null;
            }
        };

        const handleEnded = () => {
            setPlaying(false);
            setCurrentTime(0);
            audio.currentTime = 0;
            
            // Stop RAF loop when ended
            if (requestAnimationRef.current !== null) {
                cancelAnimationFrame(requestAnimationRef.current);
                requestAnimationRef.current = null;
            }
        };

        const handleError = (e) => {
            console.error('Audio error:', e);
            setPlaying(false);
            setError('Error loading audio: ' + (e.message || 'Unknown error'));
            setIsLoading(false);
            
            // Stop RAF loop on error
            if (requestAnimationRef.current !== null) {
                cancelAnimationFrame(requestAnimationRef.current);
                requestAnimationRef.current = null;
            }
        };

        // Add event listeners - use passive option for better performance
        audio.addEventListener('loadeddata', handleLoadedData, { passive: true });
        // We don't need timeupdate listener since we're using RAF
        // audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('play', handlePlay, { passive: true });
        audio.addEventListener('pause', handlePause, { passive: true });
        audio.addEventListener('ended', handleEnded, { passive: true });
        audio.addEventListener('error', handleError, { passive: true });

        // Add stalled and waiting handlers for better UX
        const handleStalled = () => setIsLoading(true);
        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        
        audio.addEventListener('stalled', handleStalled, { passive: true });
        audio.addEventListener('waiting', handleWaiting, { passive: true });
        audio.addEventListener('canplay', handleCanPlay, { passive: true });

        // Initial play if needed with better error handling
        if (initialPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error('Initial play error:', error);
                    setPlaying(false);
                    // Don't set error for autoplay policy issues
                    if (error.name !== 'NotAllowedError') {
                        setError('Unable to play audio');
                    }
                });
            }
        }

        // Cleanup function
        return () => {
            // Remove all event listeners
            audio.removeEventListener('loadeddata', handleLoadedData);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('stalled', handleStalled);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('canplay', handleCanPlay);
            
            // Cancel any pending animations
            if (requestAnimationRef.current !== null) {
                cancelAnimationFrame(requestAnimationRef.current);
                requestAnimationRef.current = null;
            }
            
            // Cancel any pending seek operations
            if (seekTimeoutRef.current !== null) {
                clearTimeout(seekTimeoutRef.current);
                seekTimeoutRef.current = null;
            }
            
            // Pause audio
            audio.pause();
        };
    }, [audioURL, initialPlaying, playing, volume, updateTimeWithRAF]);

    // Update audio source when URL changes
    useEffect(() => {
        if (audioRef.current && audioURL) {
            setIsLoading(true);
            setError(null);
            audioRef.current.src = audioURL;
            audioRef.current.load();
        }
    }, [audioURL]);

    return {
        audioRef,
        playing,
        currentTime,
        duration,
        isLoading,
        error,
        togglePlayPause,
        seek,
        setVolume,
        setLoop,
        setPlaying
    };
}