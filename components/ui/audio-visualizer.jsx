"use client"
import { useEffect, useRef, useState, memo } from 'react';

// Memoized component to prevent unnecessary re-renders
const defaultExport = AudioVisualizer;
export { defaultExport as default, AudioVisualizer };
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const dataArrayRef = useRef(null);
    const gradientRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const frameCountRef = useRef(0);
    const lastFrameTimeRef = useRef(0);

    // Initialize audio context and analyzer only once
    useEffect(() => {
        if (!audioRef?.current || !canvasRef.current) return;

        const audio = audioRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize with alpha: false
        
        // Set canvas size with debounced resize handler
        const resizeCanvas = () => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            
            // Pre-create gradient once after resize
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#a855f7');
            gradient.addColorStop(0.5, '#ec4899');
            gradient.addColorStop(1, '#3b82f6');
            gradientRef.current = gradient;
        };

        // Debounced resize handler
        let resizeTimeout;
        const debouncedResize = () => {
            cancelAnimationFrame(animationRef.current);
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                if (isPlaying) requestAnimationFrame(draw);
            }, 250);
        };

        resizeCanvas();
        window.addEventListener('resize', debouncedResize);

        // Audio context setup - only create once
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
            
            // Optimize FFT size for better performance
            analyserRef.current.fftSize = 128; // Reduced from 256 for better performance
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
            
            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
        }

        // Optimized draw function with frame limiting
        const draw = (timestamp) => {
            if (!isPlaying) {
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            // Limit to ~30fps for better performance
            if (timestamp - lastFrameTimeRef.current < 33) {
                animationRef.current = requestAnimationFrame(draw);
                return;
            }
            
            lastFrameTimeRef.current = timestamp;
            frameCountRef.current++;
            
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const bufferLength = analyserRef.current.frequencyBinCount;
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            // Use pre-created gradient
            ctx.fillStyle = gradientRef.current;
            
            // Only apply shadow every other frame for performance
            const useShadow = frameCountRef.current % 2 === 0;
            if (useShadow) {
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 5; // Reduced blur for better performance
            }

            // Draw bars in batches for better performance
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }

            // Reset shadow after drawing
            if (useShadow) ctx.shadowBlur = 0;

            animationRef.current = requestAnimationFrame(draw);
        };

        if (isPlaying) {
            setIsVisible(true);
            // Resume audio context if suspended (needed for Chrome)
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
            animationRef.current = requestAnimationFrame(draw);
        } else {
            setIsVisible(false);
            if (canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimeout);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, audioRef]);

    return (
        <div className="relative w-full h-20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl overflow-hidden">
            <canvas
                ref={canvasRef}
                className={`w-full h-full transition-opacity duration-500 ${
                    isVisible ? 'opacity-100' : 'opacity-30'
                }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
    );
});
