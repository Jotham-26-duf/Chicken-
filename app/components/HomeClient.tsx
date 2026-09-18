"use client";

import Link from "next/link";
import MovieCard from "./MovieCard";
import Navbar from "./Navbar";
import Hero from "./Hero";
import SiteBottom from "./SiteBottom";

interface HomeMovie {
  id: string;
  title: string;
  slug: string;
  year: string;
  rating: string;
  image: string;
  description: string;
  explainer: string;
  translator: string;
  language: string;
  type: string;
  streamUrl: string | null;
  downloadUrl: string | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;

  genres: {
    movieId: string;
    genreId: string;
    genre: {
      id: string;
      name: string;
    };
  }[];
}

interface HomeGenre {
  id: string;
  name: string;

  movies: {
    movie: {
      id: string;
      title: string;
      image: string;
      createdAt: Date;
    };
  }[];
}

interface HomeSeries {
  id: string;
  title: string;
  slug: string;
  year: string;
  rating: string;
  image: string;
  language: string;
  description: string;
  isFeatured: boolean;
}

interface HomeClientProps {
  movies: HomeMovie[];
  genres: HomeGenre[];
  series: HomeSeries[];
  featuredMovies: HomeMovie[];
  featuredSeries: HomeSeries[];
}

export default function HomeClient({
  movies,
  genres,
  series,
  featuredMovies,
  featuredSeries,
}: HomeClientProps) {
  const trendingMovies = movies.slice(0, 10);

  const latestMovies = movies.slice(0, 10);

  const topRatedMovies = [...movies]
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 10);

  /*
  |--------------------------------------------------------------------------
  | HERO MOVIES
  |--------------------------------------------------------------------------
  |
  | If there are featured movies, use them.
  | If no movie is featured, use the latest movies as a fallback.
  |
  */

  const heroMovies =
    featuredMovies.length > 0
      ? featuredMovies
      : movies.slice(0, 5);

  return (
    <main
      id="top"
      className="min-h-screen bg-[#121212] text-[#FFFFFF]"
    >
      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= HERO ================= */}

      <Hero movies={heroMovies} />

      {/* ================= TRENDING MOVIES ================= */}

      {trendingMovies.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2979FF]">
                  What people are watching
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Trending Movies
                </h2>
              </div>

              <Link
                href="/trending"
                className="text-sm font-semibold text-[#2979FF] transition hover:text-[#00E5FF]"
              >
                View All →
              </Link>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {trendingMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="w-[170px] shrink-0 sm:w-[190px] md:w-[210px]"
                >
                  <MovieCard
                    title={movie.title}
                    year={movie.year}
                    rating={movie.rating}
                    image={movie.image}
                    slug={movie.slug}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FEATURED SERIES ================= */}

      {featuredSeries.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E040FB]">
                  Selected for you
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Featured Series
                </h2>
              </div>

              <Link
                href="/series"
                className="text-sm font-semibold text-[#2979FF] transition hover:text-[#00E5FF]"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {featuredSeries.slice(0, 10).map((item) => (
                <Link
                  key={item.id}
                  href={`/series/${item.slug}`}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-[#1B1B1B] transition hover:-translate-y-1 hover:border-[#2979FF]/50"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-[#2A2A2A]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="truncate font-semibold text-white">
                      {item.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-xs text-[#AAAAAA]">
                      <span>{item.year}</span>

                      <span>•</span>

                      <span>★ {item.rating}</span>
                    </div>

                    {item.language && (
                      <p className="mt-1 truncate text-xs text-[#777777]">
                        {item.language}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= LATEST SERIES ================= */}

      {series.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E040FB]">
                  New episodes and stories
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Latest Series
                </h2>
              </div>

              <Link
                href="/series"
                className="text-sm font-semibold text-[#2979FF] transition hover:text-[#00E5FF]"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {series.slice(0, 10).map((item) => (
                <Link
                  key={item.id}
                  href={`/series/${item.slug}`}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-[#1B1B1B] transition hover:-translate-y-1 hover:border-[#2979FF]/50"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-[#2A2A2A]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="truncate font-semibold text-white">
                      {item.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-xs text-[#AAAAAA]">
                      <span>{item.year}</span>

                      <span>•</span>

                      <span>★ {item.rating}</span>
                    </div>

                    {item.language && (
                      <p className="mt-1 truncate text-xs text-[#777777]">
                        {item.language}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= LATEST MOVIES ================= */}

      {latestMovies.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
                  Recently added
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Latest Movies
                </h2>
              </div>

              <Link
                href="/movies"
                className="text-sm font-semibold text-[#2979FF] transition hover:text-[#00E5FF]"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {latestMovies.map((movie) => (
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
          </div>
        </section>
      )}

      {/* ================= TOP RATED ================= */}

      {topRatedMovies.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFC107]">
                  Highly rated
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Top Rated
                </h2>
              </div>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {topRatedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="w-[170px] shrink-0 sm:w-[190px] md:w-[210px]"
                >
                  <MovieCard
                    title={movie.title}
                    year={movie.year}
                    rating={movie.rating}
                    image={movie.image}
                    slug={movie.slug}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= POPULAR CATEGORIES ================= */}

      {genres.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E040FB]">
                Explore by type
              </p>

              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                Popular Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {genres.map((genre) => {
                const featuredMovie = genre.movies[0]?.movie;

                return (
                  <Link
                    key={genre.id}
                    href={`/category/${genre.id}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1B1B1B] text-center transition hover:-translate-y-1 hover:border-[#2979FF]/50 hover:bg-[#222222]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#2A2A2A]">
                      {featuredMovie ? (
                        <img
                          src={featuredMovie.image}
                          alt={`${genre.name} featured movie`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl">
                          🎬
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B] via-transparent to-transparent" />
                    </div>

                    <div className="p-4">
                      <h3 className="truncate font-semibold text-white">
                        {genre.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#777777]">
                        Explore movies
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= SUPPORT + FOOTER ================= */}

      <SiteBottom />
    </main>
  );
}