"use client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useContext, useEffect } from "react";
import { MusicContext } from "@/hooks/use-context";
import { IoPlay } from "react-icons/io5";
import { motion } from "framer-motion";
import { Heart, MoreHorizontal } from "lucide-react";

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
            scale: 1.08,
            filter: "brightness(1.1)",
            transition: {
                duration: 0.4,
                ease: [0.6, 0.05, -0.01, 0.9]
            }
        }
    };

    const playButtonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.2,
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
                y: -8,
                transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                }
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative h-fit w-[200px] bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="overflow-hidden rounded-t-2xl">
                {image ? (
                    <motion.div 
                        className="relative cursor-pointer" 
                        onClick={() => { ids.setMusic(id); setLastPlayed(); }}
                        variants={imageVariants}
                        whileHover="hover"
                    >
                        <img 
                            src={image} 
                            alt={title} 
                            className="h-[182px] w-full object-cover blurz bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-600" 
                        />
                        
                        {/* Play Button Overlay */}
                        <motion.div 
                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                            variants={playButtonVariants}
                            initial="hidden"
                            whileHover="visible"
                        >
                            <motion.div
                                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IoPlay className="w-5 h-5 text-purple-600 dark:text-purple-400 -mr-0.5" />
                            </motion.div>
                        </motion.div>

                        {/* Floating Action Buttons */}
                        <motion.div 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            initial={{ x: 20, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                        >
                            <button className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                                <Heart className="w-3 h-3 text-pink-500" />
                            </button>
                        </motion.div>

                        <motion.div 
                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            initial={{ x: -20, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                        >
                            <button className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                                <MoreHorizontal className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                            </button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <Skeleton className="w-full h-[182px] rounded-t-2xl" />
                )}
            </div>

            {/* Content */}
            <div className="p-4 cursor-pointer">
                {title ? (
                    <div onClick={() => { ids.setMusic(id); setLastPlayed(); }}>
                        <motion.h1 
                            className="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            {title.slice(0, 20)}{title.length > 20 && '...'}
                        </motion.h1>
                    </div>
                ) : (
                    <Skeleton className="w-[70%] h-4 mt-2" />
                )}
                
                {desc && (
                    <motion.p 
                        className="text-xs text-slate-500 dark:text-slate-400 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {desc.slice(0, 30)}
                    </motion.p>
                )}
                
                {artist ? (
                    <motion.p 
                        className="text-sm font-light text-slate-600 dark:text-slate-400 mt-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {artist.slice(0, 20)}{artist.length > 20 && '...'}
                    </motion.p>
                ) : (
                    <Skeleton className="w-10 h-2 mt-2" />
                )}
            </div>

            {/* Bottom Gradient Line */}
            <motion.div 
                className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    )
}
