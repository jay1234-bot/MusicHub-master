"use client";
import Player from "@/components/cards/player";
import Footer from "@/components/page/footer";
import Header from "@/components/page/header";
import Search from "@/components/page/search";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
    const pathname = usePathname();
    return (
        <main>
            <Header />
            <div className="px-6 sm:hidden mb-4">
                <Search />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
            <Player />
            <Footer />
        </main>
    )
}