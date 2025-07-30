import Link from "next/link";
import { Badge } from "../ui/badge";
import { Play } from "lucide-react";

export default function Next({ name, artist, image, id, next = true }) {
    return (
        <Link href={`/${id}`}>
            <div className="flex items-center gap-3 lg:gap-4 bg-secondary/50 hover:bg-secondary/80 p-3 lg:p-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg group">
                <div className="relative overflow-hidden rounded-lg">
                    <img 
                        src={image} 
                        className="aspect-square w-12 h-12 lg:w-16 lg:h-16 object-cover transition-transform duration-300 group-hover:scale-110" 
                        alt={name}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                    <h1 className="text-secondary-foreground text-sm lg:text-base font-medium text-ellipsis whitespace-nowrap overflow-hidden sm:max-w-md max-w-[150px] lg:max-w-lg xl:max-w-xl">
                        {name}
                    </h1>
                    <p className="mt-1 text-xs lg:text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                        by{' '}
                        <span className="text-secondary-foreground font-medium">
                            {artist}
                        </span>
                    </p>
                </div>
                <div className="flex-shrink-0">
                    {next && (
                        <Badge className="!font-normal bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200">
                            next
                        </Badge>
                    )}
                    {!next && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200">
                            <Play size={16} className="w-3 px-0 h-4" />
                        </Badge>
                    )}
                </div>
            </div>
        </Link>
    )
}
