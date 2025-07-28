"use client";
import { motion } from "framer-motion";
import { Music, Heart, Sparkles, Play, Pause, Volume2 } from "lucide-react";

// Music Note Loading Animation
export function MusicNoteLoader({ size = "md" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6", 
        lg: "w-8 h-8",
        xl: "w-12 h-12"
    };

    return (
        <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className={`${sizeClasses[size]} text-purple-500`}
                animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                }}
                transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Music className="w-full h-full" />
            </motion.div>
        </motion.div>
    );
}

// Pulse Loading Animation
export function PulseLoader({ color = "purple" }) {
    const colors = {
        purple: "bg-purple-500",
        pink: "bg-pink-500",
        blue: "bg-blue-500",
        green: "bg-green-500"
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${colors[color]}`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}

// Wave Loading Animation
export function WaveLoader({ color = "purple" }) {
    const colors = {
        purple: "bg-purple-500",
        pink: "bg-pink-500",
        blue: "bg-blue-500",
        green: "bg-green-500"
    };

    return (
        <div className="flex items-center justify-center gap-1">
            {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                    key={index}
                    className={`w-1 h-8 rounded-full ${colors[color]}`}
                    animate={{
                        height: [20, 40, 20],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: index * 0.1,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}

// Spinning Disc Loading Animation
export function SpinningDiscLoader({ size = "md" }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20"
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} relative`}
            animate={{ rotate: 360 }}
            transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <div className="w-full h-full rounded-full border-4 border-purple-200 dark:border-slate-700">
                <div className="w-full h-full rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 border-b-blue-500 border-l-purple-400" />
            </div>
            <motion.div
                className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <Music className="w-4 h-4 text-purple-500" />
            </motion.div>
        </motion.div>
    );
}

// Heartbeat Loading Animation
export function HeartbeatLoader({ size = "md" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12"
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} text-pink-500`}
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
            }}
            transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <Heart className="w-full h-full" />
        </motion.div>
    );
}

// Sparkles Loading Animation
export function SparklesLoader({ count = 5 }) {
    return (
        <div className="relative">
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${(index / count) * 100}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                </motion.div>
            ))}
        </div>
    );
}

// Music Player Loading Animation
export function MusicPlayerLoader() {
    return (
        <div className="flex items-center justify-center gap-4">
            <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <Play className="w-6 h-6 text-white -mr-0.5" />
            </motion.div>
            
            <div className="flex flex-col gap-2">
                <motion.div
                    className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-32"
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="h-1 bg-slate-300 dark:bg-slate-600 rounded-full w-24"
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
            </div>
        </div>
    );
}

// Full Screen Loading Animation
export function FullScreenLoader({ message = "Loading your music..." }) {
    return (
        <motion.div
            className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="text-center space-y-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Animated Logo */}
                <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto"
                    animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <Music className="w-10 h-10 text-white" />
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        MusicHub
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        {message}
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* Floating Icons */}
                <div className="relative">
                    <motion.div
                        className="absolute -top-4 -left-4 text-purple-400/60"
                        animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Heart className="w-6 h-6" />
                    </motion.div>
                    <motion.div
                        className="absolute -top-4 -right-4 text-pink-400/60"
                        animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, -10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                        <Sparkles className="w-6 h-6" />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Page Loading Animation
export function PageLoader({ title = "Loading..." }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
            <motion.div
                className="text-center space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <SpinningDiscLoader size="xl" />
                <motion.h1
                    className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {title}
                </motion.h1>
                <WaveLoader color="purple" />
            </motion.div>
        </div>
    );
} 