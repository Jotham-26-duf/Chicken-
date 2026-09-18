
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  Clapperboard,
  Home,
  LogOut,
  Menu,
  Search,
  Tv,
  TrendingUp,
  X,
} from "lucide-react";

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

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchMovie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        !searchRef.current.contains(event.target as Node)
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
   * CLOSE MOBILE MENU ON RESIZE
   * ==========================================
   */

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
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
      router.push("/search");
      setShowResults(false);
      setMobileMenuOpen(false);
      return;
    }

    setShowResults(false);
    setMobileMenuOpen(false);

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
    setMobileMenuOpen(false);

    router.push(`/movies/${slug}`);
  }

  /*
   * ==========================================
   * CLOSE MENUS
   * ==========================================
   */

  function closeMenus() {
    setShowResults(false);
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#121212]/95 backdrop-blur-xl">
        {/* ================= MAIN NAVIGATION ================= */}

        <div className="mx-auto flex h-16 w-full items-center px-4 sm:h-18 sm:px-6 lg:px-8">
          {/* ================= LOGO ================= */}

          <Link
            href="/"
            onClick={closeMenus}
            className="shrink-0 text-xl font-extrabold tracking-wider sm:text-2xl"
          >
            <span className="text-[#00E5FF]">AG</span>
            <span className="text-[#E040FB]">
              TIMES
            </span>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#FFFFFF] transition hover:bg-white/10 hover:text-[#00E5FF]"
            >
              <Home size={17} />
              <span>Home</span>
            </Link>

            <Link
              href="/movies"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#FFFFFF] transition hover:bg-white/10 hover:text-[#00E5FF]"
            >
              <Clapperboard size={17} />
              <span>Movies</span>
            </Link>

            <Link
              href="/series"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#FFFFFF] transition hover:bg-white/10 hover:text-[#00E5FF]"
            >
              <Tv size={17} />
              <span>Series</span>
            </Link>

            <Link
              href="/trending"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#FFFFFF] transition hover:bg-white/10 hover:text-[#00E5FF]"
            >
              <TrendingUp size={17} />
              <span>Trending</span>
            </Link>
          </nav>

          {/* ================= RIGHT SIDE ================= */}

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}

            <button
              type="button"
              aria-label="Notifications"
              className="hidden rounded-full p-2.5 text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-white sm:block"
            >
              <Bell size={19} />
            </button>

            {/* Desktop Authentication */}

            {status === "loading" ? (
              <div className="hidden h-10 w-24 animate-pulse rounded-full bg-[#2A2A2A] sm:block" />
            ) : session?.user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#2A2A2A] px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2979FF] font-bold text-white">
                    {session.user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <span className="hidden max-w-[100px] truncate text-sm text-white md:block">
                    {session.user.name || "User"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/",
                    })
                  }
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-[#2A2A2A] px-3 py-2 text-sm font-semibold text-[#AAAAAA] transition hover:bg-[#353535] hover:text-white"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}

            {/* Mobile Menu Button */}

            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() =>
                setMobileMenuOpen((open) => !open)
              }
              className="rounded-full p-2.5 text-[#FFFFFF] transition hover:bg-[#2A2A2A] lg:hidden"
            >
              {mobileMenuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>
          </div>
        </div>

        {/* ================= SEARCH BAR ================= */}

        <div
          ref={searchRef}
          className="relative border-t border-white/5 bg-[#121212] px-4 py-3 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-7xl">
            <form
              onSubmit={handleSearch}
              className="relative"
            >
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]"
              />

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
                className="w-full rounded-full border border-white/10 bg-[#2A2A2A] py-3 pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-[#AAAAAA] focus:border-[#2979FF] focus:bg-[#303030] sm:py-3.5 sm:pr-24"
              />

              <button
                type="submit"
                className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-[#2979FF] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 sm:right-1.5 sm:px-4 sm:py-2"
              >
                <Search size={14} />
                <span className="hidden xs:inline">
                  Search
                </span>
              </button>
            </form>

            {/* ================= SEARCH RESULTS ================= */}

            {showResults && search.trim() && (
              <div className="absolute left-4 right-4 top-[calc(100%-2px)] overflow-hidden rounded-2xl border border-white/10 bg-[#1B1B1B] shadow-2xl sm:left-6 sm:right-6 lg:left-8 lg:right-8">
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
                            className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-3 text-left transition last:border-b-0 hover:bg-[#2A2A2A] sm:gap-4 sm:px-4"
                          >
                            <img
                              src={movie.image}
                              alt={movie.title}
                              className="h-14 w-10 shrink-0 rounded-md object-cover sm:h-16 sm:w-11"
                            />

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                                {movie.title}
                              </h3>

                              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#AAAAAA] sm:gap-2 sm:text-xs">
                                <span>{movie.year}</span>

                                <span>•</span>

                                <span className="truncate">
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

                            <span className="hidden shrink-0 text-lg text-[#AAAAAA] sm:block">
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
                    <Search
                      size={30}
                      className="mx-auto text-[#AAAAAA]"
                    />

                    <p className="mt-3 font-semibold text-white">
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
        </div>

        {/* ================= MOBILE NAVIGATION ================= */}

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#121212] px-4 py-4 shadow-2xl lg:hidden">
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={closeMenus}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]"
              >
                <Home size={19} />
                Home
              </Link>

              <Link
                href="/movies"
                onClick={closeMenus}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]"
              >
                <Clapperboard size={19} />
                Movies
              </Link>

              <Link
                href="/series"
                onClick={closeMenus}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]"
              >
                <Tv size={19} />
                Series
              </Link>

              <Link
                href="/trending"
                onClick={closeMenus}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]"
              >
                <TrendingUp size={19} />
                Trending
              </Link>

              {/* Mobile Account */}

              {status === "loading" ? (
                <div className="mt-2 h-11 animate-pulse rounded-xl bg-[#2A2A2A]" />
              ) : session?.user ? (
                <div className="mt-2 space-y-2 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-3 rounded-xl bg-[#2A2A2A] px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2979FF] font-bold text-white">
                      {session.user.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[#AAAAAA]">
                        Signed in as
                      </p>

                      <p className="truncate text-sm font-semibold text-white">
                        {session.user.name || "User"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-white"
                  >
                    <LogOut size={19} />
                    Logout
                  </button>
                </div>
              ) : null}
            </nav>
          </div>
        )}
      </header>

      {/* ================= NAVBAR SPACING ================= */}

      <div className="h-[116px] sm:h-[122px]" />
    </>
  );
}

