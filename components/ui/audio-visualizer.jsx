"use client"
import { useEffect, useRef, useState } from 'react';

export default function AudioVisualizer({ isPlaying, audioRef }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!audioRef?.current || !canvasRef.current) return;

        const audio = audioRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Audio context setup
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);

        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!isPlaying) {
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#a855f7');
                gradient.addColorStop(0.5, '#ec4899');
                gradient.addColorStop(1, '#3b82f6');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                // Add glow effect
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 10;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                ctx.shadowBlur = 0;

                x += barWidth + 1;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        if (isPlaying) {
            setIsVisible(true);
            draw();
        } else {
            setIsVisible(false);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            audioContext.close();
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
} 