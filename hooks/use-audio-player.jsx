import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioPlayer(audioURL, initialPlaying = true) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(initialPlaying);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoized time update handler for better performance
    const handleTimeUpdate = useCallback(() => {
        try {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                setDuration(audioRef.current.duration);
            }
        } catch (e) {
            setPlaying(false);
            setError('Error updating time');
        }
    }, []);

    // Memoized play/pause function
    const togglePlayPause = useCallback(() => {
        if (playing) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setPlaying(!playing);
    }, [playing]);

    // Memoized seek function
    const seek = useCallback((time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    // Memoized volume control
    const setVolume = useCallback((volume) => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, volume));
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
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedData = () => {
            setDuration(audio.duration);
            setIsLoading(false);
            setError(null);
        };

        const handlePlay = () => {
            setPlaying(true);
        };

        const handlePause = () => {
            setPlaying(false);
        };

        const handleError = (e) => {
            setPlaying(false);
            setIsLoading(false);
            setError('Error loading audio');
            console.error('Audio error:', e);
        };

        const handleEnded = () => {
            setPlaying(false);
        };

        // Add event listeners
        audio.addEventListener('loadeddata', handleLoadedData);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('error', handleError);
        audio.addEventListener('ended', handleEnded);

        // Cleanup
        return () => {
            audio.removeEventListener('loadeddata', handleLoadedData);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [handleTimeUpdate]);

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