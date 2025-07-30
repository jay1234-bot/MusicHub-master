import NextProvider from "@/components/next-provider";
import Footer from "@/components/page/footer";
import Header from "@/components/page/header";

export default function RootLayout({ children }) {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <NextProvider>
                    {children}
                </NextProvider>
            </div>
            <Footer />
        </main>
    )
}