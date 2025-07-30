"use client"
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Mic, 
    MicOff, 
    Filter, 
    X, 
    Music, 
    User, 
    Album,
    TrendingUp,
    Clock,
    Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdvancedSearch({ onSearch, placeholder = "Search songs, artists, albums..." }) {
    const [query, setQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        type: [],
        duration: [],
        sortBy: "relevance"
    });
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const recognitionRef = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                setIsListening(false);
                handleSearch(transcript);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    };

    const handleSearch = (searchQuery = query) => {
        if (searchQuery.trim()) {
            onSearch(searchQuery, selectedFilters);
            setShowSuggestions(false);
        }
    };

    const handleInputChange = (value) => {
        setQuery(value);
        if (value.trim()) {
            // Simulate suggestions based on input
            const mockSuggestions = [
                `${value} songs`,
                `${value} artist`,
                `${value} album`,
                `${value} playlist`
            ];
            setSuggestions(mockSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    };

    const clearFilters = () => {
        setSelectedFilters({
            type: [],
            duration: [],
            sortBy: "relevance"
        });
    };

    const filterOptions = {
        type: [
            { value: "song", label: "Songs", icon: Music },
            { value: "artist", label: "Artists", icon: User },
            { value: "album", label: "Albums", icon: Album }
        ],
        duration: [
            { value: "short", label: "Short (< 3 min)" },
            { value: "medium", label: "Medium (3-5 min)" },
            { value: "long", label: "Long (> 5 min)" }
        ],
        sortBy: [
            { value: "relevance", label: "Relevance", icon: TrendingUp },
            { value: "recent", label: "Recent", icon: Clock },
            { value: "popular", label: "Popular", icon: Star }
        ]
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 pr-20 h-12 rounded-xl border-2 focus:border-purple-500 transition-colors"
                    />
                    
                    {/* Voice Search Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={isListening ? stopListening : startListening}
                        className={`absolute right-2 h-8 w-8 rounded-lg transition-all ${
                            isListening 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'hover:bg-purple-500/10 hover:text-purple-500'
                        }`}
                    >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    {/* Filter Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-12 h-8 w-8 rounded-lg transition-all ${
                            showFilters 
                                ? 'bg-purple-500 text-white' 
                                : 'hover:bg-purple-500/10 hover:text-purple-500'
                        }`}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search Suggestions */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50"
                        >
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(suggestion);
                                        handleSearch(suggestion);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center gap-2"
                                >
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    {suggestion}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-muted/30 rounded-xl p-4 border border-border/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm">Filters</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-xs h-6 px-2"
                            >
                                Clear all
                            </Button>
                        </div>

                        {/* Filter Categories */}
                        <div className="space-y-4">
                            {/* Type Filter */}
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2">Type</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.type.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <Button
                                                key={option.value}
                                                variant={selectedFilters.type.includes(option.value) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleFilterChange('type', option.value)}
                                                className="h-7 px-3 text-xs"
                                            >
                                                <Icon className="h-3 w-3 mr-1" />
                                                {option.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Duration Filter */}
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2">Duration</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.duration.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant={selectedFilters.duration.includes(option.value) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleFilterChange('duration', option.value)}
                                            className="h-7 px-3 text-xs"
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2">Sort By</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.sortBy.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <Button
                                                key={option.value}
                                                variant={selectedFilters.sortBy === option.value ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedFilters(prev => ({ ...prev, sortBy: option.value }))}
                                                className="h-7 px-3 text-xs"
                                            >
                                                <Icon className="h-3 w-3 mr-1" />
                                                {option.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Apply Filters Button */}
                        <div className="mt-4 pt-4 border-t border-border/50">
                            <Button
                                onClick={() => handleSearch()}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 