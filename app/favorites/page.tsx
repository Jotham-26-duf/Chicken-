"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MovieCard from "@/app/components/MovieCard";

interface FavoriteMovie {
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
  genres: {
    genre: {
      name: string;
    };
  }[];
}

interface Favorite {
  movie: FavoriteMovie;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    async function loadFavorites() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/favorites");

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load favorites.");
          return;
        }

        const movies = data.map(
          (favorite: Favorite) => favorite.movie
        );

        setFavorites(movies);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setError(
          "Something went wrong while loading your favorites."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#121212] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-400">
            Loading your favorites...
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="border-b border-[#2A2A2A]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-2xl font-bold"
          >
            <span className="text-[#00E5FF]">AG</span>
            <span className="text-[#E040FB]">TIMES</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-[#2A2A2A] px-4 py-2 text-sm text-gray-300 transition hover:bg-[#353535] hover:text-white"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            My Favorites
          </h1>

          <p className="mt-2 text-gray-400">
            Movies you have saved to your favorites.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-2xl bg-[#2A2A2A] px-6 py-16 text-center">
            <div className="mb-4 text-5xl">
              ♡
            </div>

            <h2 className="mb-2 text-2xl font-semibold">
              No favorites yet
            </h2>

            <p className="mb-6 text-gray-400">
              Start adding movies to your favorites and
              they will appear here.
            </p>

            <Link
              href="/"
              className="inline-block rounded-lg bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:bg-[#1565C0]"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-400">
              {favorites.length}{" "}
              {favorites.length === 1
                ? "movie"
                : "movies"}{" "}
              saved
            </p>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {favorites.map((movie) => (
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
          </>
        )}
      </section>
    </main>
  );
}