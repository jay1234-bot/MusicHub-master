import NextProvider from "@/components/next-provider";
import Footer from "@/components/page/footer";
import Header from "@/components/page/header";
import FloatingPlayer from "@/components/ui/floating-player";

export default function RootLayout({ children }) {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 w-full max-w-full overflow-hidden">
                <NextProvider>
                    {children}
                </NextProvider>
            </div>
            <Footer />
            <FloatingPlayer />
        </main>
    )
}