"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon, Mic, Sparkles, Music, TrendingUp, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Search() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const linkRef = useRef();
    const inpRef = useRef();

    const suggestions = [
        "Trending songs",
        "Romantic melodies",
        "Lofi beats",
        "Relaxing music",
        "Bollywood hits",
        "English songs",
        "Punjabi music",
        "Classical ragas"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            return;
        }
        setIsSearching(true);
        setTimeout(() => {
            linkRef.current.click();
            inpRef.current.blur();
            setQuery("");
            setIsSearching(false);
        }, 500);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
    };

    useEffect(() => {
        if (query.length > 0) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [query]);

    return (
        <>
            <Link href={"/search/" + query} ref={linkRef}></Link>
            <motion.div 
                className="relative w-full max-w-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <form onSubmit={handleSubmit} className="relative">
                    {/* Animated Background */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-xl"
                        animate={{
                            scale: isFocused ? 1.05 : 1,
                            opacity: isFocused ? 0.8 : 0.3
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    {/* Search Input Container */}
                    <motion.div
                        className="relative flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-lg overflow-hidden"
                        animate={{
                            scale: isFocused ? 1.02 : 1,
                            boxShadow: isFocused 
                                ? "0 20px 40px rgba(147, 51, 234, 0.2)" 
                                : "0 10px 30px rgba(0, 0, 0, 0.1)"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Left Icon */}
                        <motion.div
                            className="pl-4 pr-2 flex-shrink-0"
                            animate={{ 
                                rotate: isSearching ? 360 : 0,
                                scale: isFocused ? 1.1 : 1
                            }}
                            transition={{ 
                                duration: isSearching ? 1 : 0.3,
                                repeat: isSearching ? Infinity : 0,
                                ease: "linear"
                            }}
                        >
                            <SearchIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </motion.div>

                        {/* Input Field */}
                        <div className="flex-1 min-w-0">
                            <input
                                ref={inpRef}
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => {
                                    setIsFocused(false);
                                    setTimeout(() => setShowSuggestions(false), 200);
                                }}
                                autoComplete="off" 
                                type="search" 
                                className="w-full bg-transparent border-none outline-none text-lg placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-800 dark:text-slate-200 py-3 px-2" 
                                name="query" 
                                placeholder="Search for amazing music..." 
                            />
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-2 pr-4 flex-shrink-0">
                            {/* Voice Search Button */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="icon" 
                                    className="w-8 h-8 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                                >
                                    <Mic className="w-4 h-4" />
                                </Button>
                            </motion.div>

                            {/* Search Button */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button 
                                    type="submit"
                                    variant="ghost" 
                                    size="icon" 
                                    className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                                    disabled={isSearching}
                                >
                                    <AnimatePresence mode="wait">
                                        {isSearching ? (
                                            <motion.div
                                                key="loading"
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                        ) : (
                                            <motion.div
                                                key="search"
                                                initial={{ scale: 0, rotate: -90 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 90 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <SearchIcon className="w-4 h-4" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Floating Icons */}
                    <AnimatePresence>
                        {isFocused && (
                            <>
                                <motion.div
                                    className="absolute -top-2 -left-2 text-purple-400/60"
                                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <Music className="w-4 h-4" />
                                </motion.div>
                                <motion.div
                                    className="absolute -top-2 -right-2 text-pink-400/60"
                                    initial={{ opacity: 0, scale: 0, rotate: 180 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0, rotate: -180 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <Heart className="w-4 h-4" />
                                </motion.div>
                                <motion.div
                                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-blue-400/60"
                                    initial={{ opacity: 0, scale: 0, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <TrendingUp className="w-4 h-4" />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Search Suggestions */}
                    <AnimatePresence>
                        {showSuggestions && (
                            <motion.div
                                className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-2xl z-50"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Popular searches
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {suggestions
                                            .filter(suggestion => 
                                                suggestion.toLowerCase().includes(query.toLowerCase())
                                            )
                                            .slice(0, 6)
                                            .map((suggestion, index) => (
                                                <motion.button
                                                    key={suggestion}
                                                    type="button"
                                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <SearchIcon className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm">{suggestion}</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </>
    );
}
