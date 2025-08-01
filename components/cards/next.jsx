import Link from "next/link";
import { Badge } from "../ui/badge";
import { Play } from "lucide-react";

export default function Next({ name, artist, image, id, next = true }) {
    return (
        <Link href={`/${id}`}>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 bg-secondary/50 hover:bg-secondary/80 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg group">
                <div className="relative overflow-hidden rounded-lg">
                    <img 
                        src={image} 
                        className="aspect-square w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-cover transition-transform duration-300 group-hover:scale-110" 
                        alt={name}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                    <h1 className="text-secondary-foreground text-xs sm:text-sm lg:text-base font-medium text-ellipsis whitespace-nowrap overflow-hidden max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]">
                        {name}
                    </h1>
                    <p className="mt-0.5 sm:mt-1 text-xs lg:text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                        by{' '}
                        <span className="text-secondary-foreground font-medium">
                            {artist}
                        </span>
                    </p>
                </div>
                <div className="flex-shrink-0">
                    {next && (
                        <Badge className="!font-normal bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 text-xs sm:text-sm px-2 py-1">
                            next
                        </Badge>
                    )}
                    {!next && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 text-xs sm:text-sm px-2 py-1">
                            <Play size={12} className="w-2.5 h-2.5 sm:w-3 sm:h-3 px-0" />
                        </Badge>
                    )}
                </div>
            </div>
        </Link>
    )
}
