import Link from "next/link";

export default function ArtistCard({ image, name, id }) {
    return (
        <Link href={"/search/" + `${encodeURI(name.toLowerCase().split(" ").join("+"))}`} className="transition-transform duration-300 ease-in-out hover:scale-105 block">
            <div className="overflow-hidden h-[100px] w-[100px] rounded-full">
                <img src={image} alt={name} className="transition cursor-pointer rounded-full h-[100px] min-w-[100px] object-cover"/>
            </div>
            <div className="mt-2 text-center">
                <h1 className="text-sm max-w-[100px] text-ellipsis text-nowrap overflow-hidden">{name.split(" ")[0] || null} {name.split(" ")[1] || null}</h1>
            </div>
        </Link>
    )
}
