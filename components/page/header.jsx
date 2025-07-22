"use client"
import { ModeToggle } from "../ModeToggle";
import Logo from "./logo";
import { Button } from "../ui/button";
import Search from "./search";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const path = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 md:px-20 lg:px-32">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <Logo />
                </div>
                {/* Center: Search (hidden on mobile) */}
                <div className="hidden md:flex flex-1 justify-center max-w-lg mx-4">
                    <Search />
                </div>
                {/* Right: Theme toggle & menu */}
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    {/* Hamburger menu for mobile */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>
            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden px-4 pb-4"
                    >
                        <Search />
                        <nav className="mt-4 flex flex-col gap-2">
                            <Link href="/" className="text-lg font-medium hover:text-primary transition" onClick={() => setMenuOpen(false)}>
                                Home
                            </Link>
                            {/* Add more nav links here if needed */}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
