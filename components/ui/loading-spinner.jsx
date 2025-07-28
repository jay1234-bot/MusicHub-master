import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function LoadingSpinner({ size = "default", text = "Loading..." }) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  const textSizes = {
    small: "text-xs",
    default: "text-sm",
    large: "text-base"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-purple-200 dark:border-slate-700"></div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-600 dark:border-t-purple-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Music className={`${sizeClasses[size]} text-purple-600 dark:text-purple-400`} />
        </motion.div>
      </motion.div>
      
      {text && (
        <motion.p
          className={`${textSizes[size]} text-slate-600 dark:text-slate-400 font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function PulseLoader({ size = "default" }) {
  const sizeClasses = {
    small: "w-2 h-2",
    default: "w-3 h-3",
    large: "w-4 h-4"
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-purple-600 dark:bg-purple-400 rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function WaveLoader({ size = "default" }) {
  const sizeClasses = {
    small: "w-1 h-3",
    default: "w-1 h-6",
    large: "w-2 h-8"
  };

  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-gradient-to-t from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-full`}
          animate={{
            height: ["20%", "100%", "20%"]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
} 