
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

interface Series {
  id: string;
  title: string;
  slug: string;
  year: string;
  rating: string;
  image: string;
  description: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HomeClientProps {
  movies: Movie[];
  genres: Genre[];
  series: Series[];
}

export default function HomeClient({
  movies,
  genres,
  series,
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
   * LATEST SERIES
   * ==========================================
   */

  const latestSeries = [...series].sort(
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
      {/* ================= SIDEBAR ================= */}

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* ================= NAVBAR ================= */}

      <Navbar sidebarOpen={sidebarOpen} />

      {/* ================= MAIN CONTENT ================= */}

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

            <Link
              href="/trending"
              className="text-sm font-medium text-[#2979FF] transition hover:text-[#5C6BC0]"
            >
              View All →
            </Link>
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

        {/* ================= LATEST SERIES ================= */}

        {latestSeries.length > 0 && (
          <section className="px-6 py-10 lg:px-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FFFFFF]">
                📺 Latest Series
              </h2>

              <Link
                href="/series"
                className="text-sm font-medium text-[#2979FF] transition hover:text-[#5C6BC0]"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {latestSeries.map((item) => (
                <Link
                  key={item.id}
                  href={`/series/${item.slug}`}
                  className="group overflow-hidden rounded-xl bg-[#2A2A2A] transition hover:-translate-y-1"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="line-clamp-2 text-lg font-bold text-white">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-300">
                        <span>{item.year}</span>
                        <span>•</span>
                        <span>★ {item.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ================= LATEST MOVIES ================= */}

        <section className="px-6 py-10 lg:px-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">
              🎬 Latest Movies
            </h2>

            <Link
              href="/movies"
              className="text-sm font-medium text-[#2979FF] transition hover:text-[#5C6BC0]"
            >
              View All →
            </Link>
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

            <Link
              href="/trending"
              className="text-sm font-medium text-[#2979FF] transition hover:text-[#5C6BC0]"
            >
              View All →
            </Link>
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

        {/* ================= NEED HELP ================= */}

        <section className="px-6 py-10 lg:px-10">
          <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2979FF]/20 text-2xl">
              💬
            </div>

            <h2 className="text-2xl font-bold text-white">
              Need Help?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#AAAAAA]">
              Having trouble watching a movie, opening a series,
              or downloading an episode? Let us know about the
              problem and our team will help you.
            </p>

            <div className="mx-auto mt-6 max-w-xl">
              <textarea
                placeholder="Describe the issue you are experiencing..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-[#121212] p-4 text-sm text-white outline-none transition placeholder:text-[#666666] focus:border-[#2979FF]"
              />

              <button
                type="button"
                className="mt-4 rounded-xl bg-[#2979FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1565C0]"
              >
                Send Message
              </button>
            </div>
          </div>
        </section>

        {/* ================= WHATSAPP COMMUNITY ================= */}

        <section className="px-6 py-10 lg:px-10">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#151515] to-[#202020] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/20 text-3xl">
              💚
            </div>

            <h2 className="text-2xl font-bold text-white">
              Join Our WhatsApp Community
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#AAAAAA]">
              Stay updated with new movies, series, announcements,
              and important AGTIMES updates by joining our WhatsApp
              community.
            </p>

            <a
              href="https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
            >
              Join WhatsApp Community →
            </a>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="border-t border-white/10 bg-[#0D0D0D] px-6 py-12 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
            {/* Brand */}

            <div>
              <h2 className="text-2xl font-extrabold tracking-wider">
                <span className="text-[#00E5FF]">AG</span>
                <span className="text-[#E040FB]">TIMES</span>
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#AAAAAA]">
                Your entertainment platform for discovering and
                enjoying movies and series.
              </p>
            </div>

            {/* Quick Links */}

            <div>
              <h3 className="mb-4 font-bold text-white">
                Quick Links
              </h3>

              <div className="space-y-2 text-sm">
                <Link
                  href="/"
                  className="block text-[#AAAAAA] transition hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/movies"
                  className="block text-[#AAAAAA] transition hover:text-white"
                >
                  Movies
                </Link>

                <Link
                  href="/series"
                  className="block text-[#AAAAAA] transition hover:text-white"
                >
                  Series
                </Link>

                <Link
                  href="/trending"
                  className="block text-[#AAAAAA] transition hover:text-white"
                >
                  Trending
                </Link>
              </div>
            </div>

            {/* Contact */}

            <div>
              <h3 className="mb-4 font-bold text-white">
                Contact & Location
              </h3>

              <div className="space-y-3 text-sm text-[#AAAAAA]">
                <p>
                  📍 Rwanda
                </p>

                <p>
                  💬 WhatsApp Community
                </p>

                <p>
                  🎬 Movies & Series Platform
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-[#666666]">
              © 2026 AGTIMES. All rights reserved.
            </p>

            <p className="mt-2 text-xs text-[#555555]">
              AGTIMES is an entertainment platform.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

