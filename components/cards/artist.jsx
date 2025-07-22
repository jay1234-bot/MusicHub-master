import Link from "next/link";
import { motion } from "framer-motion";

export default function ArtistCard({ image, name, id }) {
    return (
        <Link href={"/search/" + `${encodeURI(name.toLowerCase().split(" ").join("+"))}`}>
            <motion.div
                whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(14, 165, 233, 0.15)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="transition-transform duration-300 ease-in-out block bg-background/80 rounded-full"
            >
                <div className="overflow-hidden h-[100px] w-[100px] rounded-full">
                    <img src={image} alt={name} className="transition cursor-pointer rounded-full h-[100px] min-w-[100px] object-cover"/>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-sm max-w-[100px] text-ellipsis text-nowrap overflow-hidden">{name.split(" ")[0] || null} {name.split(" ")[1] || null}</h1>
                </div>
            </motion.div>
        </Link>
    )
}
