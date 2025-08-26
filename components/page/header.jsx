"use client"
import { ModeToggle } from "../ModeToggle";
import Logo from "./logo";
import { Button } from "../ui/button";
import Search from "./search";
import { Menu, X, Music, Home, Search as SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const path = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const headerVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.6, 0.05, -0.01, 0.9]
            }
        }
    };

    const menuVariants = {
        hidden: { 
            opacity: 0, 
            y: -20,
            scale: 0.98,
            filter: "blur(8px)"
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.4,
                ease: [0.6, 0.05, -0.01, 0.9]
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <motion.header 
            className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-lg"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2 sm:py-4">
                {/* Left: Logo */}
                <motion.div 
                    className="flex items-center gap-2 sm:gap-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <Logo />
                    <motion.div
                        className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live Music</span>
                    </motion.div>
                </motion.div>

                {/* Center: Search (hidden on mobile) */}
                <motion.div 
                    className="hidden md:flex flex-1 justify-center max-w-lg mx-4 lg:mx-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative w-full max-w-md">
                        <Search />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ scale: 1.02 }}
                        />
                    </div>
                </motion.div>

                {/* Right: Theme toggle & menu */}
                <motion.div 
                    className="flex items-center gap-2 sm:gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ModeToggle />
                    </motion.div>
                    
                    {/* Hamburger menu for mobile */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="md:hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 h-8 w-8 sm:h-10 sm:w-10" 
                            onClick={() => setMenuOpen(!menuOpen)} 
                            aria-label="Menu"
                        >
                            <AnimatePresence mode="wait">
                                {menuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden px-2 sm:px-4 pb-4 sm:pb-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/30"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-3 sm:mt-4"
                        >
                            <Search />
                        </motion.div>
                        
                        <motion.nav 
                            className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link 
                                    href="/" 
                                    className="flex items-center gap-3 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 p-2 sm:p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50" 
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Home
                                </Link>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link 
                                    href="/search" 
                                    className="flex items-center gap-3 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 p-2 sm:p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50" 
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Search
                                </Link>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link 
                                    href="/player" 
                                    className="flex items-center gap-3 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 p-2 sm:p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50" 
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Player
                                </Link>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
