"use client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useContext, useEffect } from "react";
import { MusicContext } from "@/hooks/use-context";
import { IoPlay } from "react-icons/io5";
import { motion } from "framer-motion";
import { Heart, MoreHorizontal, Pause, Volume2, Star, Clock } from "lucide-react";

export default function SongCard({ title, image, artist, id, desc }) {
    const ids = useContext(MusicContext);
    const setLastPlayed = () => {
        localStorage.clear();
        localStorage.setItem("last-played", id);
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.95, 
            y: 20,
            filter: "blur(10px)"
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.6,
                ease: [0.6, 0.05, -0.01, 0.9]
            }
        }
    };

    const imageVariants = {
        hover: {
            scale: 1.1,
            filter: "brightness(1.1) saturate(1.2)",
            transition: {
                duration: 0.4,
                ease: [0.6, 0.05, -0.01, 0.9]
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
                scale: 1.05, 
                y: -12,
                transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                }
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative h-fit w-[200px] sm:w-[220px] md:w-[240px] card-modern overflow-hidden transform-gpu"
        >
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            {/* Enhanced Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg"></div>
            
            <div className="relative overflow-hidden rounded-t-2xl">
                {image ? (
                    <motion.div 
                        className="relative cursor-pointer group/image" 
                        onClick={() => { ids.setMusic(id); setLastPlayed(); }}
                        variants={imageVariants}
                        whileHover="hover"
                    >
                        <img 
                            src={image} 
                            alt={title} 
                            className="h-[180px] sm:h-[200px] md:h-[220px] w-full object-cover blurz bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 transition-all duration-500" 
                            loading="lazy"
                        />
                        
                        {/* Enhanced Play Button Overlay */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-500 flex items-center justify-center"
                            variants={overlayVariants}
                            initial="hidden"
                            whileHover="visible"
                        >
                            <motion.div
                                className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full h-16 w-16 flex items-center justify-center shadow-2xl border border-white/20"
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <IoPlay className="w-7 h-7 text-purple-600 dark:text-purple-400 ml-1" />
                            </motion.div>
                        </motion.div>

                        {/* Enhanced Floating Action Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/image:opacity-100 transition-all duration-500">
                            <motion.button 
                                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Heart className="w-4 h-4 text-pink-500" />
                            </motion.button>
                            
                            <motion.button 
                                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <MoreHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </motion.button>
                        </div>

                        {/* Quality Badge */}
                        <motion.div 
                            className="absolute top-3 left-3 opacity-0 group-hover/image:opacity-100 transition-all duration-500"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Volume2 className="w-3 h-3" />
                                <span>HD</span>
                            </div>
                        </motion.div>

                        {/* Duration Badge */}
                        <motion.div 
                            className="absolute bottom-3 right-3 opacity-0 group-hover/image:opacity-100 transition-all duration-500"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                <Clock className="w-3 h-3" />
                                <span>3:45</span>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <div className="h-[180px] sm:h-[200px] md:h-[220px] w-full skeleton-shimmer rounded-t-2xl" />
                )}
            </div>

            {/* Enhanced Content Section */}
            <div className="p-4 sm:p-5 cursor-pointer relative">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-white/30 to-transparent dark:from-slate-800/50 dark:via-slate-800/30 rounded-b-2xl"></div>
                
                <div className="relative z-10" onClick={() => { ids.setMusic(id); setLastPlayed(); }}>
                    {title ? (
                        <motion.h1 
                            className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-2 leading-tight"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            {title.slice(0, 25)}{title.length > 25 && '...'}
                        </motion.h1>
                    ) : (
                        <div className="w-[80%] h-5 skeleton-shimmer rounded mt-2" />
                    )}
                    
                    {desc && (
                        <motion.p 
                            className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {desc.slice(0, 40)}{desc.length > 40 && '...'}
                        </motion.p>
                    )}
                    
                    {artist ? (
                        <motion.div
                            className="flex items-center justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                                {artist.slice(0, 20)}{artist.length > 20 && '...'}
                            </p>
                            
                            {/* Rating Stars */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${
                                            i < 4 
                                                ? 'text-yellow-400 fill-yellow-400' 
                                                : 'text-slate-300 dark:text-slate-600'
                                        }`} 
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="w-16 h-4 skeleton-shimmer rounded" />
                    )}
                </div>
            </div>

            {/* Enhanced Bottom Gradient Line with Animation */}
            <motion.div 
                className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
            />
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-purple-500/20"></div>
            </div>
        </motion.div>
    )
}
