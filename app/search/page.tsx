
import Link from "next/link";
import MovieCard from "../components/MovieCard";
import { prisma } from "../../lib/prisma";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    genre?: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() || "";
  const selectedGenre = params.genre?.trim() || "";

  const searchText = query.toLowerCase();
  const genreText = selectedGenre.toLowerCase();

  /*
   * Get genres from PostgreSQL
   */
  const genres = await prisma.genre.findMany({
    orderBy: {
      name: "asc",
    },
  });

  /*
   * Get movies from PostgreSQL
   * together with their genres.
   */
  const movies = await prisma.movie.findMany({
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * Filter movies based on the search
   * text and selected genre.
   */
  const results = movies.filter((movie) => {
    /*
     * Convert the database relationship:
     *
     * movie.genres
     *
     * into:
     *
     * ["Action", "Drama", "Thriller"]
     */
    const movieGenres = movie.genres.map(
      (movieGenre) => movieGenre.genre.name
    );

    /*
     * Search matching
     */
    const matchesSearch =
      !searchText ||
      movie.title.toLowerCase().includes(searchText) ||
      movie.description.toLowerCase().includes(searchText) ||
      movie.explainer.toLowerCase().includes(searchText) ||
      movieGenres.some((genre) =>
        genre.toLowerCase().includes(searchText)
      ) ||
      movie.year.toLowerCase().includes(searchText) ||
      movie.translator.toLowerCase().includes(searchText) ||
      movie.language.toLowerCase().includes(searchText) ||
      movie.type.toLowerCase().includes(searchText);

    /*
     * Genre matching
     */
    const matchesGenre =
      !genreText ||
      movieGenres.some(
        (genre) => genre.toLowerCase() === genreText
      ) ||
      movie.type.toLowerCase() === genreText;

    return matchesSearch && matchesGenre;
  });

  return (
    <main className="min-h-screen bg-[#121212] px-6 py-28 text-[#FFFFFF] lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
            Browse
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#FFFFFF]">
            Movies
          </h1>

          <p className="mt-3 text-[#AAAAAA]">
            Search and browse movies by genre.
          </p>
        </div>

        {/* ================= GENRES ================= */}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">
              Genres
            </h2>

            {(query || selectedGenre) && (
              <Link
                href="/search"
                className="text-sm font-medium text-[#2979FF] transition hover:text-[#00E5FF]"
              >
                Clear Filters
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => {
              const isActive =
                selectedGenre.toLowerCase() ===
                genre.name.toLowerCase();

              return (
                <Link
                  key={genre.id}
                  href={`/search?genre=${encodeURIComponent(
                    genre.name
                  )}`}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#2979FF] bg-[#2979FF] text-white"
                      : "border-white/10 bg-[#2A2A2A] text-[#FFFFFF] hover:border-[#2979FF] hover:bg-[#2979FF]"
                  }`}
                >
                  {genre.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ================= SEARCH INFORMATION ================= */}

        {(query || selectedGenre) && (
          <div className="mt-10 rounded-xl border border-white/10 bg-[#2A2A2A] px-5 py-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">

              <span className="text-[#AAAAAA]">
                Showing:
              </span>

              {query && (
                <span className="rounded-md bg-[#121212] px-3 py-1 text-[#FFFFFF]">
                  Search: {query}
                </span>
              )}

              {selectedGenre && (
                <span className="rounded-md bg-[#5C6BC0] px-3 py-1 text-white">
                  Genre: {selectedGenre}
                </span>
              )}

            </div>
          </div>
        )}

        {/* ================= RESULTS ================= */}

        {!query && !selectedGenre ? (

          <section className="mt-10">

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#FFFFFF]">
                All Movies
              </h2>

              <p className="mt-2 text-sm text-[#AAAAAA]">
                Browse all available movies.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.slug}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  image={movie.image}
                  slug={movie.slug}
                />
              ))}
            </div>

          </section>

        ) : results.length === 0 ? (

          /* ================= NO RESULTS ================= */

          <section className="mt-10 rounded-2xl bg-[#2A2A2A] px-6 py-16 text-center">

            <div className="text-5xl">
              😔
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#FFFFFF]">
              No Movies Found
            </h2>

            <p className="mt-3 text-[#AAAAAA]">
              We couldn't find any movies matching your
              search or selected genre.
            </p>

            <Link
              href="/search"
              className="mt-6 inline-flex rounded-lg bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
            >
              View All Movies
            </Link>

          </section>

        ) : (

          /* ================= MOVIE RESULTS ================= */

          <section className="mt-10">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-[#FFFFFF]">
                {selectedGenre
                  ? `${selectedGenre} Movies`
                  : "Search Results"}
              </h2>

              <p className="mt-2 text-sm text-[#AAAAAA]">
                {results.length}{" "}
                {results.length === 1
                  ? "movie"
                  : "movies"}{" "}
                found
              </p>

            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((movie) => (
                <MovieCard
                  key={movie.slug}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  image={movie.image}
                  slug={movie.slug}
                />
              ))}
            </div>

          </section>
        )}
      </div>
    </main>
  );
}

