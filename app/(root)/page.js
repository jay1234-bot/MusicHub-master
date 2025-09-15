"use client"
import SongCard from "@/components/cards/song";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getSongsByQuery } from "@/lib/fetch";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ui/error-message";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Heart, Zap, Moon, Coffee, TrendingUp, Sparkles, Play, Star, Users, Clock, Headphones } from "lucide-react";

const SECTIONS = [
  { 
    key: "trending", 
    title: "🔥 Trending Now", 
    desc: "Most popular tracks this week",
    icon: TrendingUp,
    gradient: "from-orange-500 via-red-500 to-pink-600",
    bgGradient: "from-orange-500/10 via-red-500/10 to-pink-600/10",
    borderGradient: "from-orange-500/30 to-red-500/30"
  },
  { 
    key: "relaxing", 
    title: "🌙 Chill Vibes", 
    desc: "Perfect for unwinding and relaxation",
    icon: Moon,
    gradient: "from-blue-500 via-indigo-500 to-purple-600",
    bgGradient: "from-blue-500/10 via-indigo-500/10 to-purple-600/10",
    borderGradient: "from-blue-500/30 to-purple-500/30"
  },
  { 
    key: "romance", 
    title: "💞 Love Songs", 
    desc: "Romantic melodies for special moments",
    icon: Heart,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bgGradient: "from-pink-500/10 via-rose-500/10 to-red-500/10",
    borderGradient: "from-pink-500/30 to-rose-500/30"
  },
  { 
    key: "lofi", 
    title: "☕ Lo-Fi Beats", 
    desc: "Study and work with chill beats",
    icon: Coffee,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgGradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
    borderGradient: "from-emerald-500/30 to-teal-500/30"
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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Hero Section */}
      <motion.div 
        className="relative overflow-hidden"
        variants={sectionVariants}
      >
        {/* Multiple Background Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 dark:from-purple-600/10 dark:via-pink-600/10 dark:to-blue-600/10"></div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/2"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <div className="absolute inset-0 bg-pattern-dots opacity-20 dark:opacity-10"></div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => {
            const icons = [Music, Heart, Sparkles, Star];
            const Icon = icons[i % icons.length];
            
            return (
              <motion.div
                key={i}
                className="absolute text-purple-400/30 dark:text-purple-400/20"
                style={{
                  top: `${10 + (i * 10)}%`,
                  left: `${5 + (i * 15)}%`,
                }}
                animate={{ 
                  y: [0, -30, 0],
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 8 + (i * 2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              >
                <Icon size={20 + (i % 3) * 4} />
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-10 text-center padding-responsive py-20 sm:py-24 md:py-32">
          {/* Enhanced Title */}
          <motion.h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 30%, #3b82f6 60%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%"
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            initial={{ opacity: 0, y: 30 }}
          >
            MusicHub
          </motion.h1>
          
          {/* Enhanced Subtitle */}
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your ultimate destination for discovering amazing music. 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              Stream, explore, and enjoy
            </span> the perfect soundtrack for every moment.
          </motion.p>
          
          {/* Enhanced Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: Music, label: "High Quality", desc: "320kbps Audio" },
              { icon: Users, label: "1M+ Users", desc: "Growing Community" },
              { icon: Clock, label: "24/7 Streaming", desc: "Always Available" },
              { icon: Star, label: "Premium Free", desc: "No Ads" }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="glass-card px-4 py-3 sm:px-6 sm:py-4 rounded-2xl group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                        {stat.label}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {stat.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* CTA Button */}
          <motion.button
            className="group relative px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ animationDelay: '0.8s' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative flex items-center gap-3">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-lg sm:text-xl">Start Listening</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Content Sections */}
      <div className="relative padding-responsive pb-20">
        <AnimatePresence>
          {SECTIONS.map((section, index) => (
            <motion.section 
              key={section.key}
              className="mt-16 first:mt-0 relative"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Section Container with Enhanced Design */}
              <motion.div
                className="relative rounded-3xl p-6 sm:p-8 glass-card"
                whileHover={{ 
                  scale: 1.01,
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                style={{
                  background: `linear-gradient(135deg, ${section.bgGradient.replace('/10', '/5')})`,
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 rounded-3xl opacity-5">
                  <div className="absolute inset-0 bg-pattern-grid"></div>
                </div>
                
                {/* Section Header with Enhanced Design */}
                <motion.div 
                  className="relative flex items-center justify-between mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <motion.div 
                      className={`p-4 rounded-2xl bg-gradient-to-r ${section.gradient} shadow-xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <section.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                        {section.title}
                      </h2>
                      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                        {section.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* View All Button */}
                  <motion.button
                    className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${section.gradient} text-white rounded-xl font-medium opacity-80 hover:opacity-100 transition-opacity duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm">View All</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </motion.button>
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

                {/* Content with Enhanced Layout */}
                {!error[section.key] && (
                  <div className="relative">
                    <ScrollArea className="rounded-2xl">
                      <motion.div 
                        className="flex gap-4 sm:gap-6 pb-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {loading[section.key] || !songs[section.key]
                          ? Array.from({ length: 8 }).map((_, i) => (
                              <motion.div
                                key={i}
                                variants={cardVariants}
                                whileHover={{ 
                                  scale: 1.05,
                                  y: -8,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                <div className="w-[200px] h-[280px] rounded-2xl skeleton-shimmer" />
                              </motion.div>
                            ))
                          : songs[section.key].slice(0, 15).map((song, songIndex) => (
                              <motion.div
                                key={song.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: songIndex * 0.05 }}
                                whileHover={{ 
                                  scale: 1.05,
                                  y: -8,
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
                  </div>
                )}
              </motion.div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>

      {/* Enhanced Bottom CTA Section */}
      <motion.section 
        className="relative padding-responsive py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="relative glass-card rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl"></div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ready to dive in?</span>
            </motion.div>
            
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Your Music Journey
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Starts Here</span>
            </h3>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Join millions of music lovers discovering their next favorite song. 
              Explore curated playlists, trending hits, and hidden gems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="btn-primary px-8 py-4 text-lg font-semibold rounded-2xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Start Exploring
              </motion.button>
              
              <motion.button
                className="btn-ghost px-8 py-4 text-lg font-semibold rounded-2xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" />
                Create Playlist
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
}