import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

export default function AlbumCard({ title, image, artist, id, desc, lang }) {
    return (
        <motion.div
            whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(14, 165, 233, 0.15)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-fit w-[200px] transition-transform duration-300 ease-in-out bg-background/80 rounded-xl"
        >
            <div className="overflow-hidden rounded-md">
                {image ? (
                    <Link href={`/${id}`}>
                        <img src={image} alt={title} className="h-[182px] w-full bg-secondary/60 rounded-md cursor-pointer" />
                    </Link>
                ) : (
                    <Skeleton className="w-full h-[182px]" />
                )}
            </div>
            <div className="cursor-pointer">
                {title ? (
                    <Link href={`/${id}`} className="mt-3 flex items-center justify-between">
                        <h1 className="text-base">{title.slice(0, 20)}{title.length > 20 && '...'}</h1>
                    </Link>
                ) : (
                    <Skeleton className="w-[70%] h-4 mt-2" />
                )}
                {desc && (
                    <p className="text-xs text-muted-foreground">{desc.slice(0, 30)}</p>
                )}
                {artist ? (
                    <>
                        <p className="text-sm font-light mb-1 text-muted-foreground">{artist.slice(0, 20)}{artist.length > 20 && '...'}</p>
                        {lang && <Badge variant="outline" className="font-normal">{lang}</Badge>}
                    </>
                ) : (
                    <Skeleton className="w-10 h-2 mt-2" />
                )}
            </div>
        </motion.div>
    )
}