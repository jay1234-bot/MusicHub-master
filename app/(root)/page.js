"use client"
import SongCard from "@/components/cards/song";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getSongsByQuery } from "@/lib/fetch";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ui/error-message";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Heart, Zap, Moon, Coffee, TrendingUp, Sparkles } from "lucide-react";

const SECTIONS = [
  { 
    key: "trending", 
    title: "🔥 Trending", 
    desc: "Trending songs in India",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10"
  },
  { 
    key: "relaxing", 
    title: "🎧 Relaxing", 
    desc: "Top relaxing songs for peace",
    icon: Moon,
    gradient: "from-blue-500 to-purple-500",
    bgGradient: "from-blue-500/10 to-purple-500/10"
  },
  { 
    key: "romance", 
    title: "💞 Romance", 
    desc: "Top romance songs for mood",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/10 to-rose-500/10"
  },
  { 
    key: "lofi", 
    title: "💤 Lofi", 
    desc: "Top lofi songs to chill",
    icon: Coffee,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function Page() {
  const [songs, setSongs] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchSection = async (section) => {
    setLoading(prev => ({ ...prev, [section.key]: true }));
    setError(prev => ({ ...prev, [section.key]: null }));
    try {
      const res = await getSongsByQuery(section.key);
      const data = await res.json();
      setSongs(prev => ({ ...prev, [section.key]: data.data.results }));
      setLoading(prev => ({ ...prev, [section.key]: false }));
    } catch (e) {
      setError(prev => ({ ...prev, [section.key]: "Failed to load. Please try again." }));
      setLoading(prev => ({ ...prev, [section.key]: false }));
    }
  };

  useEffect(() => {
    SECTIONS.forEach(section => {
      fetchSection(section);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <motion.main 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden px-6 py-16 md:px-20 lg:px-32"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 dark:from-purple-600/10 dark:via-pink-600/10 dark:to-blue-600/10">
          <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
        </div>
        
        {/* Floating Music Notes */}
        <motion.div
          className="absolute top-20 left-10 text-purple-400/30"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Music size={24} />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 text-pink-400/30"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Heart size={20} />
        </motion.div>

        <motion.div
          className="absolute top-60 left-20 text-blue-400/30"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Sparkles size={18} />
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            MusicHub
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the perfect soundtrack for every moment. 
            From trending hits to relaxing melodies, find your rhythm here.
          </motion.p>
          
          <motion.div 
            className="flex justify-center space-x-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Music</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <Music className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">High Quality</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="px-6 md:px-20 lg:px-32 pb-20">
        <AnimatePresence>
          {SECTIONS.map((section, index) => (
            <motion.div 
              key={section.key}
              className={`mt-16 first:mt-0 relative rounded-3xl p-8 bg-gradient-to-r ${section.bgGradient} border border-white/20 backdrop-blur-sm shadow-xl`}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              {/* Section Header */}
              <motion.div 
                className="flex items-center space-x-4 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${section.gradient} shadow-lg`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {section.desc}
                  </p>
                </div>
              </motion.div>

              {/* Error State */}
              {error[section.key] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ErrorMessage message={error[section.key]} onRetry={() => fetchSection(section)} />
                </motion.div>
              )}

              {/* Content */}
              {!error[section.key] && (
                <ScrollArea className="rounded-2xl">
                  <motion.div 
                    className="flex gap-6 pb-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {loading[section.key] || !songs[section.key]
                      ? Array.from({ length: 10 }).map((_, i) => (
                          <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{ 
                              scale: 1.05,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <SongCard />
                          </motion.div>
                        ))
                      : songs[section.key].slice(0, 20).map((song, songIndex) => (
                          <motion.div
                            key={song.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: songIndex * 0.05 }}
                            whileHover={{ 
                              scale: 1.05,
                              y: -5,
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <SongCard
                              id={song.id}
                              image={song.image[2]?.url}
                              title={song.name}
                              artist={song.artists.primary[0]?.name || "unknown"}
                            />
                          </motion.div>
                        ))}
                  </motion.div>
                  <ScrollBar orientation="horizontal" className="hidden sm:flex" />
                </ScrollArea>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <motion.div 
        className="text-center py-16 px-6 md:px-20 lg:px-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl p-8 border border-white/20 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Ready to discover more?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Explore our vast collection of music and find your perfect playlist.
          </p>
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Exploring
          </motion.button>
        </div>
      </motion.div>
    </motion.main>
  );
}