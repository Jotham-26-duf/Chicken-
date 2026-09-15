
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <section className="border-b border-white/10 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <Link
            href="/"
            className="text-sm text-[#AAAAAA] transition hover:text-white"
          >
            ← Back to AGTIMES
          </Link>

          <div className="mt-8">
            <h1 className="text-4xl font-extrabold">
              🎬 Movies
            </h1>

            <p className="mt-3 max-w-2xl text-[#AAAAAA]">
              Discover the latest movies available on AGTIMES.
              Browse our collection and choose something to watch.
            </p>
          </div>
        </div>
      </section>

      {/* Movies */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {movies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#1C1C1C] p-12 text-center">
            <div className="text-5xl">🎬</div>

            <h2 className="mt-5 text-2xl font-bold">
              No movies available
            </h2>

            <p className="mt-2 text-[#AAAAAA]">
              Movies will appear here when they are added.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                All Movies
              </h2>

              <span className="text-sm text-[#AAAAAA]">
                {movies.length}{" "}
                {movies.length === 1 ? "Movie" : "Movies"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.slug}`}
                  className="group overflow-hidden rounded-xl bg-[#2A2A2A] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="line-clamp-2 text-base font-bold">
                        {movie.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-300">
                        <span>{movie.year}</span>

                        <span>•</span>

                        <span>
                          ⭐ {movie.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

