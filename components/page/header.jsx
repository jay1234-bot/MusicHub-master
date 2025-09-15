"use client"
import { ModeToggle } from "../ModeToggle";
import Logo from "./logo";
import { Button } from "../ui/button";
import Search from "./search";
import { Menu, X, Music, Home, Search as SearchIcon, Sparkles, Radio } from "lucide-react";
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
                ease: [0.6, 0.05, -0.01, 0.9],
                staggerChildren: 0.1
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

    const menuItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const navItems = [
        { 
            href: "/", 
            label: "Home", 
            icon: Home, 
            active: path === "/",
            gradient: "from-purple-500 to-pink-500"
        },
        { 
            href: "/search", 
            label: "Search", 
            icon: SearchIcon, 
            active: path.startsWith("/search"),
            gradient: "from-blue-500 to-purple-500"
        },
        { 
            href: "/player", 
            label: "Player", 
            icon: Music, 
            active: path.startsWith("/player"),
            gradient: "from-pink-500 to-red-500"
        },
    ];

    return (
        <motion.header 
            className="sticky top-0 z-50 w-full glass border-b border-white/10 dark:border-white/5 shadow-xl backdrop-blur-3xl"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Enhanced Animated Background with Multiple Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/2 dark:to-transparent"></div>
            
            {/* Floating Particles Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            
            <div className="relative flex items-center justify-between padding-responsive py-3 sm:py-4">
                {/* Enhanced Left: Logo with Live Indicator */}
                <motion.div 
                    className="flex items-center gap-3 sm:gap-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <Logo />
                    <motion.div
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 backdrop-blur-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div 
                            className="w-2 h-2 bg-green-500 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Live Music</span>
                        <Sparkles className="w-3 h-3 text-green-500" />
                    </motion.div>
                </motion.div>

                {/* Enhanced Center: Search with Improved Design */}
                <motion.div 
                    className="hidden md:flex flex-1 justify-center max-w-lg mx-4 lg:mx-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative w-full max-w-md group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl"></div>
                        <div className="relative">
                            <Search />
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Right: Controls with Better Layout */}
                <motion.div 
                    className="flex items-center gap-2 sm:gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* Theme Toggle with Enhanced Animation */}
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                        <div className="relative">
                            <ModeToggle />
                        </div>
                    </motion.div>
                    
                    {/* Enhanced Hamburger Menu */}
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="md:hidden relative glass border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 h-10 w-10 sm:h-11 sm:w-11 transition-all duration-300" 
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
                                        <X className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Enhanced Mobile Menu with Modern Design */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden relative border-t border-white/10 dark:border-white/5 backdrop-blur-3xl bg-white/5 dark:bg-black/5"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
                        
                        <div className="relative padding-responsive py-4 sm:py-6">
                            {/* Mobile Search */}
                            <motion.div
                                variants={menuItemVariants}
                                className="mb-6"
                            >
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                    <div className="relative">
                                        <Search />
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Enhanced Navigation Links */}
                            <motion.nav 
                                className="space-y-2"
                                variants={menuVariants}
                            >
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.href}
                                            variants={menuItemVariants}
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link 
                                                href={item.href}
                                                className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                                                    item.active 
                                                        ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg' 
                                                        : 'hover:bg-white/10 dark:hover:bg-white/5'
                                                }`}
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                {/* Background Effects */}
                                                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                                
                                                {/* Icon with Enhanced Styling */}
                                                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                                                    item.active 
                                                        ? 'bg-white/20 shadow-lg' 
                                                        : 'bg-white/10 dark:bg-white/5 group-hover:bg-white/20 dark:group-hover:bg-white/10'
                                                }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                
                                                {/* Label with Better Typography */}
                                                <div className="flex-1">
                                                    <span className="text-lg font-semibold">
                                                        {item.label}
                                                    </span>
                                                    {item.active && (
                                                        <motion.div
                                                            className="h-0.5 bg-white/50 rounded-full mt-1"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    )}
                                                </div>
                                                
                                                {/* Active Indicator */}
                                                {item.active && (
                                                    <motion.div
                                                        className="w-2 h-2 bg-white rounded-full"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.nav>
                            
                            {/* Additional Mobile Features */}
                            <motion.div
                                variants={menuItemVariants}
                                className="mt-6 pt-6 border-t border-white/10 dark:border-white/5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Radio className="w-4 h-4" />
                                        <span>Now Playing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
