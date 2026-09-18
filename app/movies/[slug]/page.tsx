import Link from "next/link";
import { notFound } from "next/navigation";

import FavoriteButton from "@/app/components/FavoriteButton";
import MovieCard from "@/app/components/MovieCard";
import Navbar from "@/app/components/Navbar";
import SiteBottom from "@/app/components/SiteBottom";
import { prisma } from "@/lib/prisma";

interface MovieDetailsPageProps {
params: Promise<{
slug: string;
}>;
}

export const dynamic = "force-dynamic";

export default async function MovieDetailsPage({
params,
}: MovieDetailsPageProps) {
const { slug } = await params;

const movie = await prisma.movie.findUnique({
where: {
slug,
},
include: {
genres: {
include: {
genre: true,
},
},
downloads: {
orderBy: {
createdAt: "asc",
},
},
},
});

if (!movie) {
notFound();
}

const genreNames = movie.genres.map(
(movieGenre) => movieGenre.genre.name
);

const genreIds = movie.genres.map(
(movieGenre) => movieGenre.genreId
);

/*

* New movies use MovieDownload records.
*
* Old movies may still have downloadUrl.
* We keep supporting that old field.
  */
  const downloads =
  movie.downloads.length > 0
  ? movie.downloads
  : movie.downloadUrl
  ? [
  {
  id: "legacy",
  part: "Download Movie",
  url: movie.downloadUrl,
  },
  ]
  : [];

/*

* Find movies related to the current movie.
*
* When the current movie has genres, we look for other movies
* sharing at least one of those genres.
*
* If it has no genres, we simply show the latest movies.
  */
  const relatedMovies = await prisma.movie.findMany({
  where: {
  id: {
  not: movie.id,
  },
  ...(genreIds.length > 0
  ? {
  genres: {
  some: {
  genreId: {
  in: genreIds,
  },
  },
  },
  }
  : {}),
  },
  orderBy: {
  createdAt: "desc",
  },
  take: 4,
  });

return ( <main className="min-h-screen bg-[#121212] text-white"> <Navbar />

```
  {/* ================= MOVIE HERO ================= */}

  <section className="border-b border-white/10 bg-[#121212]">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
        {/* POSTER */}

        <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-[#2A2A2A] shadow-2xl lg:mx-0">
          <img
            src={movie.image}
            alt={movie.title}
            className="aspect-[2/3] w-full object-cover"
          />
        </div>

        {/* INFORMATION */}

        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#AAAAAA]">
            <span>{movie.year}</span>

            <span>•</span>

            <span className="flex items-center gap-1 rounded-md bg-[#5C6BC0] px-2 py-1 text-xs font-semibold text-white">
              <span className="text-[#FFC107]">★</span>
              {movie.rating}
            </span>

            {movie.type && (
              <>
                <span>•</span>
                <span>{movie.type}</span>
              </>
            )}
          </div>

          <h1 className="mt-4 break-words text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {movie.title}
          </h1>

          {genreNames.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {genreNames.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-white/10 bg-[#2A2A2A] px-3 py-1 text-xs font-medium text-[#AAAAAA]"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <p className="mt-6 max-w-3xl leading-7 text-[#AAAAAA]">
            {movie.description}
          </p>

          {/* ACTIONS */}

          <div className="mt-8 flex flex-wrap gap-3">
            {movie.streamUrl && (
              <Link
                href={`/watch/${movie.slug}`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
              >
                ▶ Watch Now
              </Link>
            )}

            <FavoriteButton movieId={movie.id} />
          </div>

          {/* DOWNLOADS */}

          <div className="mt-8">
            <h2 className="text-xl font-bold text-white">
              Downloads
            </h2>

            {downloads.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {downloads.map((download) => (
                  <a
                    key={download.id}
                    href={download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E040FB] px-5 py-3 font-semibold text-white transition hover:brightness-110"
                  >
                    ↓ {download.part}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#777777]">
                No download is available for this movie yet.
              </p>
            )}
          </div>

          {/* EXTRA INFORMATION */}

          <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#777777]">
                Language
              </p>

              <p className="mt-1 break-words font-medium text-white">
                {movie.language}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#777777]">
                Translator
              </p>

              <p className="mt-1 break-words font-medium text-white">
                {movie.translator}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#777777]">
                Type
              </p>

              <p className="mt-1 break-words font-medium text-white">
                {movie.type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ================= EXPLAINER ================= */}

  <section className="border-b border-white/10 bg-[#171717]">
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-white">
        Movie Explanation
      </h2>

      <div className="mt-5 whitespace-pre-line leading-8 text-[#AAAAAA]">
        {movie.explainer}
      </div>
    </div>
  </section>

  {/* ================= WATCH ================= */}

  {movie.streamUrl && (
    <section className="bg-[#121212]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-6 text-center sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            Ready to Watch?
          </h2>

          <p className="mt-2 text-sm text-[#AAAAAA]">
            Start watching {movie.title}.
          </p>

          <Link
            href={`/watch/${movie.slug}`}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            ▶ Watch Movie
          </Link>
        </div>
      </div>
    </section>
  )}

  {/* ================= RELATED MOVIES ================= */}

  {relatedMovies.length > 0 && (
    <section className="border-t border-white/10 bg-[#121212]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Related Movies
          </h2>

          <p className="mt-2 text-sm text-[#AAAAAA]">
            Discover more movies you may enjoy.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {relatedMovies.map((relatedMovie) => (
            <MovieCard
              key={relatedMovie.id}
              title={relatedMovie.title}
              year={relatedMovie.year}
              rating={relatedMovie.rating}
              image={relatedMovie.image}
              slug={relatedMovie.slug}
            />
          ))}
        </div>
      </div>
    </section>
  )}

  <SiteBottom />
</main>


);
}
