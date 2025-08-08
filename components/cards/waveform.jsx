"use client";
import { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Optimized and memoized Waveform component
const Waveform = memo(function Waveform({ playing, currentTime, duration, barCount = 30 }) {
  const bars = Array.from({ length: barCount }, (_, i) => i);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const barsRef = useRef([]);
  
  // Initialize bar heights only once
  useEffect(() => {
    barsRef.current = bars.map(() => Math.max(0.3, Math.random() * 0.7));
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [barCount]);

  return (
    <div className="flex items-end justify-center gap-0.5 h-12 will-change-transform">
      {bars.map((bar, index) => {
        const progress = currentTime / duration;
        const barProgress = (index / bars.length) - progress;
        const height = barsRef.current[index] + (playing ? 0.3 : 0);
        
        return (
          <motion.div
            key={index}
            className={`w-0.5 rounded-full ${
              barProgress < 0.1 ? 'bg-gradient-to-t from-purple-500 to-pink-500' : 
              'bg-gradient-to-t from-slate-400 to-slate-600'
            }`}
            style={{ 
              height: `${height * 100}%`,
              willChange: playing ? 'height' : 'auto'
            }}
            animate={{
              height: playing ? 
                [`${height * 100}%`, `${(height + 0.1) * 100}%`, `${height * 100}%`] : 
                `${height * 100}%`
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
});

export default Waveform;