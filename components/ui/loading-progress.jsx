import { motion } from "framer-motion";
import { Music, Loader2 } from "lucide-react";

export default function LoadingProgress({ message = "Loading music...", progress = 0 }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/30 shadow-2xl max-w-sm w-full mx-4"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Icon */}
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Music className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            <motion.div
              className="absolute inset-0 w-12 h-12 bg-purple-500/20 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Progress Circle */}
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(147, 51, 234, 0.2)"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (progress * 251.2)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (progress * 251.2) }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* Message */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {message}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please wait while we prepare your music...
            </p>
          </motion.div>

          {/* Animated Dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SimpleLoader({ size = "default" }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-purple-200 border-t-purple-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
} 