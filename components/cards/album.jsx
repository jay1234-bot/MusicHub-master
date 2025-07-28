import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, MoreHorizontal, Music, Star, Users } from "lucide-react";

export default function AlbumCard({ title, image, artist, id, desc, lang }) {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hover: {
            scale: 1.08,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const playButtonVariants = {
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
            {/* Animated Background */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                    background: [
                        "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)",
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)",
                        "linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)",
                        "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)"
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="overflow-hidden rounded-t-2xl">
                {image ? (
                    <motion.div 
                        className="relative cursor-pointer" 
                        variants={imageVariants}
                        whileHover="hover"
                    >
                        <Link href={`/${id}`}>
                            <img 
                                src={image} 
                                alt={title} 
                                className="h-[182px] w-full object-cover bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-600" 
                            />
                        </Link>
                        
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
                                <Play className="w-5 h-5 text-purple-600 dark:text-purple-400 -mr-0.5" />
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

                        {/* Album Type Badge */}
                        <motion.div 
                            className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                        >
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                                <Music className="w-3 h-3 text-purple-500" />
                            </div>
                        </motion.div>

                        {/* Rating Badge */}
                        <motion.div 
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                        >
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">4.8</span>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <Skeleton className="w-full h-[182px] rounded-t-2xl" />
                )}
            </div>

            {/* Content */}
            <div className="p-4 cursor-pointer">
                {title ? (
                    <Link href={`/${id}`}>
                        <motion.h1 
                            className="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            {title.slice(0, 20)}{title.length > 20 && '...'}
                        </motion.h1>
                    </Link>
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
                    <motion.div 
                        className="flex items-center gap-2 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Users className="w-3 h-3 text-slate-400" />
                        <p className="text-sm font-light text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200">
                            {artist.slice(0, 20)}{artist.length > 20 && '...'}
                        </p>
                    </motion.div>
                ) : (
                    <Skeleton className="w-10 h-2 mt-2" />
                )}

                {/* Language Badge */}
                {lang && (
                    <motion.div 
                        className="mt-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Badge 
                            variant="outline" 
                            className="font-normal bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors duration-200"
                        >
                            {lang}
                        </Badge>
                    </motion.div>
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