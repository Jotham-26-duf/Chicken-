"use client";

import { useEffect, useState } from "react";

interface HeroMovie {
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

interface HeroProps {
  movies: HeroMovie[];
}

export default function Hero({ movies }: HeroProps) {
  const [current, setCurrent] = useState(0);

  const heroMovies = movies.slice(0, 5);

  useEffect(() => {
    if (heroMovies.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrent(
        (value) => (value + 1) % heroMovies.length
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [heroMovies.length]);

  /*
   * If there are no movies in the database,
   * show a simple empty state.
   */
  if (heroMovies.length === 0) {
    return (
      <section className="relative flex h-[600px] items-center justify-center bg-[#121212]">
        <p className="text-lg text-[#AAAAAA]">
          No featured movies available.
        </p>
      </section>
    );
  }

  /*
   * Make sure current is always valid
   * when the number of movies changes.
   */
  const safeCurrent =
    current >= heroMovies.length ? 0 : current;

  const movie = heroMovies[safeCurrent];

  const genres = movie.genres
    .map((movieGenre) => movieGenre.genre.name)
    .join(" • ");

  return (
    <section className="relative h-[600px] overflow-hidden bg-[#121212]">
      {/* Background image */}
      <div
        key={movie.id}
        className="absolute inset-0 animate-[heroZoom_6s_ease-in-out] bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.image})`,
        }}
      />

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-[#121212]/20" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/20" />

      {/* Content */}
      <div
        key={`content-${movie.id}`}
        className="relative z-10 flex h-full items-center px-8 pt-16 lg:px-14"
      >
        <div className="max-w-2xl animate-[fadeIn_1s_ease-in-out]">
          {/* Label */}
          <p className="mb-4 text-sm font-bold uppercase tracking-[4px] text-[#00E5FF]">
            Featured Movie
          </p>

          {/* Title */}
          <h1 className="mb-5 text-5xl font-extrabold text-[#FFFFFF] md:text-7xl">
            {movie.title}
          </h1>

          {/* Movie information */}
          <div className="mb-5 flex flex-wrap gap-3">
            <span className="rounded-lg bg-[#2A2A2A] px-3 py-2 text-sm text-[#FFFFFF]">
              {movie.year}
            </span>

            <span className="flex items-center gap-1 rounded-lg bg-[#5C6BC0] px-3 py-2 text-sm font-semibold text-white">
              <span className="text-[#FFC107]">
                ★
              </span>

              {movie.rating}
            </span>

            <span className="rounded-lg bg-[#2A2A2A] px-3 py-2 text-sm text-[#FFFFFF]">
              {genres || movie.type}
            </span>
          </div>

          {/* Description */}
          <p className="mb-8 max-w-xl leading-7 text-[#FFFFFF]">
            {movie.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="rounded-lg bg-[#2979FF] px-7 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-105 hover:brightness-110"
            >
              ▶ Watch Now
            </button>

            <button
              type="button"
              className="rounded-lg bg-[#2A2A2A] px-7 py-3 font-bold text-[#FFFFFF] transition hover:bg-[#353535]"
            >
              + My List
            </button>
          </div>
        </div>
      </div>

      {/* Previous */}
      {heroMovies.length > 1 && (
        <button
          type="button"
          aria-label="Previous movie"
          onClick={() =>
            setCurrent(
              (safeCurrent - 1 + heroMovies.length) %
                heroMovies.length
            )
          }
          className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#2A2A2A]/80 text-3xl text-white backdrop-blur-md transition hover:bg-[#2979FF]"
        >
          ‹
        </button>
      )}

      {/* Next */}
      {heroMovies.length > 1 && (
        <button
          type="button"
          aria-label="Next movie"
          onClick={() =>
            setCurrent(
              (safeCurrent + 1) % heroMovies.length
            )
          }
          className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#2A2A2A]/80 text-3xl text-white backdrop-blur-md transition hover:bg-[#2979FF]"
        >
          ›
        </button>
      )}

      {/* Indicators */}
      {heroMovies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroMovies.map((heroMovie, index) => (
            <button
              type="button"
              key={heroMovie.id}
              aria-label={`Show ${heroMovie.title}`}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                index === safeCurrent
                  ? "w-8 bg-[#2979FF]"
                  : "w-2 bg-[#AAAAAA]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}