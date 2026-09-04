"use client";

import Link from "next/link";

interface MovieCardProps {
  title: string;
  year: string;
  rating: string;
  image: string;
  slug: string;
}

export default function MovieCard({
  title,
  year,
  rating,
  image,
  slug,
}: MovieCardProps) {
  return (
    <Link
      href={`/movies/${slug}`}
      className="group block w-full text-left"
    >
      {/* Poster */}
      <div className="relative overflow-hidden rounded-xl bg-[#2A2A2A]">
        <img
          src={image}
          alt={title}
          className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/60">
          <div className="scale-0 rounded-full bg-[#2979FF] p-4 text-white shadow-xl transition duration-300 group-hover:scale-100">
            ▶
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 truncate font-semibold text-[#FFFFFF] transition group-hover:text-[#00E5FF]">
        {title}
      </h3>

      {/* Information */}
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="text-[#AAAAAA]">
          {year}
        </span>

        <span className="text-[#AAAAAA]">
          •
        </span>

        <span className="flex items-center gap-1 rounded-md bg-[#5C6BC0] px-2 py-1 text-xs font-semibold text-white">
          <span className="text-[#FFC107]">
            ★
          </span>
          {rating}
        </span>
      </div>
    </Link>
  );
}