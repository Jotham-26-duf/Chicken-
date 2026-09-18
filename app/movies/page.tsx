
import MovieCard from "@/app/components/MovieCard";
import Navbar from "@/app/components/Navbar";
import SiteBottom from "@/app/components/SiteBottom";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navbar />

      {/* ================= MOVIES HEADER ================= */}

      <section className="border-b border-white/10 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            Movies
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#AAAAAA] sm:text-base">
            Discover and watch our latest movies.
          </p>
        </div>
      </section>

      {/* ================= MOVIE LIST ================= */}

      <section className="bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {movies.length > 0 ? (
            <div
              className="
                grid
                grid-cols-2
                gap-x-3
                gap-y-7
                sm:grid-cols-3
                sm:gap-x-5
                sm:gap-y-9
                md:grid-cols-4
                lg:grid-cols-5
                lg:gap-x-6
                lg:gap-y-10
              "
            >
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  image={movie.image}
                  slug={movie.slug}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] px-4 py-12 text-center sm:px-6 sm:py-16">
              <h2 className="text-lg font-bold text-white sm:text-xl">
                No movies available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777777]">
                Movies will appear here when they are added by the admin.
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteBottom />
    </main>
  );
}

