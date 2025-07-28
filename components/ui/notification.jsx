"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X, Music, Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";

const notificationTypes = {
  success: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    iconBg: "bg-green-500/20"
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    iconBg: "bg-red-500/20"
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    iconBg: "bg-yellow-500/20"
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    iconBg: "bg-blue-500/20"
  },
  music: {
    icon: Music,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    iconBg: "bg-purple-500/20"
  }
};

export default function Notification({ 
  message, 
  type = "info", 
  duration = 5000, 
  onClose, 
  show = true 
}) {
  const [isVisible, setIsVisible] = useState(show);
  const config = notificationTypes[type] || notificationTypes.info;
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`relative p-4 rounded-2xl backdrop-blur-xl border ${config.bgColor} ${config.borderColor} shadow-2xl`}>
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: `linear-gradient(135deg, ${config.color.replace('text-', '')} 0%, transparent 100%)`,
                opacity: 0.1
              }}
            />
            
            <div className="relative flex items-start gap-3">
              {/* Icon */}
              <motion.div
                className={`p-2 rounded-xl ${config.iconBg} ${config.color}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.p
                  className="text-slate-800 dark:text-slate-200 font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {message}
                </motion.p>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onClose?.(), 300);
                }}
                className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            {duration > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-b-2xl overflow-hidden"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: duration / 1000, ease: "linear" }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Notification Manager Hook
export function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message, duration) => addNotification(message, "success", duration);
  const showError = (message, duration) => addNotification(message, "error", duration);
  const showWarning = (message, duration) => addNotification(message, "warning", duration);
  const showInfo = (message, duration) => addNotification(message, "info", duration);
  const showMusic = (message, duration) => addNotification(message, "music", duration);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showMusic
  };
}

// Notification Container
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Special Music Notification
export function MusicNotification({ song, action = "added to playlist" }) {
  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-sm w-full"
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative p-4 rounded-2xl backdrop-blur-xl border border-purple-500/20 bg-purple-500/10 shadow-2xl">
        <div className="flex items-start gap-3">
          <motion.div
            className="p-2 rounded-xl bg-purple-500/20 text-purple-500"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Music className="w-5 h-5" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 dark:text-slate-200 font-medium">
              "{song}" {action}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-500" />
              </motion.div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Great choice!
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 