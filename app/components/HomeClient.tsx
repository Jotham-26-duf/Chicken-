"use client";

import { useState } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Hero from "./Hero";

interface Movie {
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

interface Genre {
  id: string;
  name: string;
}

interface HomeClientProps {
  movies: Movie[];
  genres: Genre[];
}

export default function HomeClient({
  movies,
  genres,
}: HomeClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /*
   * ==========================================
   * TOP RATED MOVIES
   * ==========================================
   */

  const topRatedMovies = [...movies].sort(
    (a, b) => Number(b.rating) - Number(a.rating)
  );

  /*
   * ==========================================
   * LATEST MOVIES
   * ==========================================
   */

  const latestMovies = [...movies].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  /*
   * ==========================================
   * GENRE ICONS
   * ==========================================
   */

  const genreIcons: Record<string, string> = {
    Action: "🎬",
    Comedy: "😂",
    Drama: "❤️",
    "Sci-Fi": "🚀",
    Horror: "👻",
    Adventure: "🌍",
    Romance: "💕",
    Thriller: "😱",
    Animation: "🎨",
    Fantasy: "🧙",
    Crime: "🕵️",
    Documentary: "📚",
  };

  return (
    <main
      id="top"
      className="min-h-screen bg-[#121212] text-[#FFFFFF]"
    >
      {/* Sidebar */}

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Navbar */ }

      <Navbar sidebarOpen={sidebarOpen} />

      {/* Main Content */}

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* ================= HERO ================= */}

        <Hero movies={movies} />

        {/* ================= TRENDING MOVIES ================= */}

        <section className="px-6 py-10 lg:px-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">
              🔥 Trending Movies
            </h2>

            <button
              type="button"
              className="text-sm font-medium text-[#2979FF] transition hover:text-[#5C6BC0]"
            >
              View All →
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {movies.map((movie) => (
              <div
                key={movie.slug}
                className="min-w-[180px] md:min-w-[210px]"
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
        </section>

        {/* ================= LATEST MOVIES ================= */}

        <section className="px-6 py-10 lg:px-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">
              🎬 Latest Movies
            </h2>

            <button
              type="button"
              className="text-sm font-medium text-[#2979FF] transition hover:text-[#5C6BC0]"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {latestMovies.map((movie) => (
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

        {/* ================= TOP RATED MOVIES ================= */}

        <section className="px-6 py-10 lg:px-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">
              ⭐ Top Rated
            </h2>

            <button
              type="button"
              className="text-sm font-medium text-[#2979FF] transition hover:text-[#5C6BC0]"
            >
              View All →
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {topRatedMovies.map((movie) => (
              <div
                key={movie.slug}
                className="min-w-[180px] md:min-w-[210px]"
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
        </section>

        {/* ================= POPULAR CATEGORIES ================= */}

        <section className="px-6 py-10 lg:px-10">
          <h2 className="mb-6 text-2xl font-bold text-[#FFFFFF]">
            🎭 Popular Categories
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {genres.slice(0, 5).map((genre) => (
              <Link
                key={genre.id}
                href={`/search?genre=${encodeURIComponent(
                  genre.name
                )}`}
                className="rounded-xl border border-white/10 bg-[#2A2A2A] p-6 text-left transition hover:-translate-y-1 hover:bg-[#2979FF]"
              >
                <span className="text-2xl">
                  {genreIcons[genre.name] ?? "🎭"}
                </span>

                <span className="mt-2 block font-bold text-[#FFFFFF]">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="border-t border-white/10 bg-[#121212] px-6 py-10 text-center lg:px-10">
          <h2 className="mb-2 text-xl font-extrabold tracking-wider">
            <span className="text-[#00E5FF]">
              AG
            </span>

            <span className="text-[#E040FB]">
              TIMES
            </span>
          </h2>

          <p className="text-sm text-[#AAAAAA]">
            Your entertainment platform.
          </p>

          <p className="mt-4 text-xs text-[#AAAAAA]">
            © 2026 AGTIMES
          </p>
        </footer>
      </div>
    </main>
  );
}