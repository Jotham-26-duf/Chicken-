"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface NavbarProps {
  sidebarOpen: boolean;
}


interface SearchMovie {
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
    movieId: string;
    genreId: string;
    genre: {
      id: string;
      name: string;
    };
  }[];
}


export default function Navbar({
  sidebarOpen,
}: NavbarProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchMovie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  /*
   * ==========================================
   * SEARCH DATABASE
   * ==========================================
   */

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();

    async function searchMovies() {
      try {
        setSearching(true);

        const response = await fetch(
          `/api/movies/search?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to search movies");
        }

        const data = await response.json();

        setResults(data);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Navbar search error:", error);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }

    const timer = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  /*
   * ==========================================
   * CLOSE SEARCH WHEN CLICKING OUTSIDE
   * ==========================================
   */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  /*
   * ==========================================
   * SUBMIT SEARCH
   * ==========================================
   */

  function handleSearch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    setShowResults(false);

    router.push(
      `/search?q=${encodeURIComponent(value)}`
    );
  }

  /*
   * ==========================================
   * OPEN MOVIE
   * ==========================================
   */

  function handleMovieClick(slug: string) {
    setShowResults(false);
    setSearch("");

    router.push(`/movies/${slug}`);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-[#121212]/95 backdrop-blur-xl">
      <div className="relative flex h-20 items-center justify-center px-6 lg:px-10">

        {/* Search */}
        <div
          ref={searchRef}
          className="relative w-full max-w-xl"
        >
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">

              {/* Search icon */}
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]">
                🔎
              </span>

              {/* Input */}
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setShowResults(true);
                  }
                }}
                placeholder="Search movies, series..."
                className="w-full rounded-full border border-white/10 bg-[#2A2A2A] py-3 pl-12 pr-24 text-sm text-[#FFFFFF] outline-none transition placeholder:text-[#AAAAAA] focus:border-[#2979FF] focus:bg-[#303030]"
              />

              {/* Enter hint */}
              {search.trim() && (
                <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md bg-[#121212] px-2 py-1 text-xs text-[#AAAAAA] sm:block">
                  Enter ↵
                </span>
              )}
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="h-11 shrink-0 rounded-full bg-[#2979FF] px-6 font-semibold text-white transition hover:scale-105 hover:brightness-110 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Search results */}
          {showResults && search.trim() && (
            <div className="absolute left-0 right-[92px] top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-white/10 bg-[#1B1B1B] shadow-2xl">

              {searching ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-[#AAAAAA]">
                    Searching...
                  </p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#AAAAAA]">
                      Movie Results
                    </p>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {results
                      .slice(0, 6)
                      .map((movie) => (
                        <button
                          key={movie.id}
                          type="button"
                          onClick={() =>
                            handleMovieClick(movie.slug)
                          }
                          className="flex w-full items-center gap-4 border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-[#2A2A2A]"
                        >
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="h-16 w-11 shrink-0 rounded-md object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-[#FFFFFF]">
                              {movie.title}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#AAAAAA]">
                              <span>{movie.year}</span>

                              <span>•</span>

                              <span>
                                {movie.genres
                                  .map(
                                    (movieGenre) =>
                                      movieGenre.genre.name
                                  )
                                  .join(" • ")}
                              </span>

                              <span>•</span>

                              <span className="flex items-center gap-1">
                                <span className="text-[#FFC107]">
                                  ★
                                </span>

                                {movie.rating}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs text-[#AAAAAA]">
                              {movie.description}
                            </p>
                          </div>

                          <span className="shrink-0 text-lg text-[#AAAAAA]">
                            →
                          </span>
                        </button>
                      ))}
                  </div>

                  {results.length > 6 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowResults(false);

                        router.push(
                          `/search?q=${encodeURIComponent(
                            search.trim()
                          )}`
                        );
                      }}
                      className="w-full border-t border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm font-semibold text-[#2979FF] transition hover:bg-[#353535]"
                    >
                      View all {results.length} results →
                    </button>
                  )}
                </>
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="text-3xl">
                    😔
                  </div>

                  <p className="mt-3 font-semibold text-[#FFFFFF]">
                    No movies found
                  </p>

                  <p className="mt-1 text-xs text-[#AAAAAA]">
                    Try another title, genre, year, or keyword.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="absolute right-6 flex items-center gap-3 lg:right-10">

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="hidden rounded-full p-3 text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF] sm:block"
          >
            🔔
          </button>

          {/* Authentication */}
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-[#2A2A2A]" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">

              {/* User */}
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#2A2A2A] px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2979FF] font-bold text-white">
                  {session.user.name
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <span className="hidden max-w-[120px] truncate text-sm text-[#FFFFFF] sm:block">
                  {session.user.name || "User"}
                </span>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={() =>
                  signOut({
                    callbackUrl: "/login",
                  })
                }
                className="rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-2 text-sm font-semibold text-[#AAAAAA] transition hover:bg-[#353535] hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex items-center gap-3 rounded-full border border-white/10 bg-[#2A2A2A] px-3 py-2 transition hover:bg-[#353535]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2979FF] font-bold text-white">
                U
              </div>

              <span className="hidden text-sm text-[#FFFFFF] sm:block">
                Sign In
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}