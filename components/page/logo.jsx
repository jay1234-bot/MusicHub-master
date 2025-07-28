import Link from "next/link";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function Logo() {
    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const iconVariants = {
        hidden: { rotate: -180, opacity: 0 },
        visible: { 
            rotate: 0, 
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2
            }
        }
    };

    return (
        <Link href="/" className="select-none">
            <motion.div 
                className="flex items-center gap-2"
                variants={logoVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <motion.div
                        className="absolute inset-0 w-6 h-6 bg-purple-500/20 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
                
                <div className="flex flex-col">
                    <motion.h1 
                        className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                        whileHover={{ 
                            backgroundPosition: "200% 50%",
                            transition: { duration: 0.5 }
                        }}
                        style={{ backgroundSize: "200% 100%" }}
                    >
                        MusicHub
                    </motion.h1>
                    <motion.p 
                        className="text-xs text-slate-500 dark:text-slate-400 -mt-1"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Your Music Companion
                    </motion.p>
                </div>
            </motion.div>
        </Link>
    )
}
