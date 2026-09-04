import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/app/components/FavoriteButton";
import { prisma } from "@/lib/prisma";

interface MovieDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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
    },
  });

  if (!movie) {
    notFound();
  }

  const genreNames = movie.genres.map(
    (movieGenre) => movieGenre.genre.name
  );

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="border-b border-[#2A2A2A] bg-[#121212]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-[#00E5FF]">AG</span>
            <span className="text-[#E040FB]">TIMES</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-[#2A2A2A] hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/search"
              className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-[#2A2A2A] hover:text-white"
            >
              Search
            </Link>
          </div>
        </div>
      </header>

      {/* Movie Details */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-[320px_1fr]">
          {/* Poster */}
          <div className="overflow-hidden rounded-2xl bg-[#2A2A2A]">
            <img
              src={movie.image}
              alt={movie.title}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-md bg-[#2A2A2A] px-3 py-1 text-gray-300">
                {movie.year}
              </span>

              <span className="rounded-md bg-[#5C6BC0] px-3 py-1 text-white">
                ⭐ {movie.rating}
              </span>

              {genreNames.map((genre) => (
                <span
                  key={genre}
                  className="rounded-md bg-[#2A2A2A] px-3 py-1 text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>

            <h1 className="mb-5 text-4xl font-bold md:text-5xl">
              {movie.title}
            </h1>

            <p className="mb-6 max-w-3xl text-lg leading-8 text-gray-300">
              {movie.description}
            </p>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-[#AAAAAA]">Translator</p>
                <p className="font-medium text-white">
                  {movie.translator}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#AAAAAA]">Language</p>
                <p className="font-medium text-white">
                  {movie.language}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#AAAAAA]">Type</p>
                <p className="font-medium text-white">{movie.type}</p>
              </div>

              <div>
                <p className="text-sm text-[#AAAAAA]">Genres</p>
                <p className="font-medium text-white">
                  {genreNames.join(" • ")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/watch/${movie.slug}`}
                className="rounded-lg bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:bg-[#1565C0]"
              >
                ▶ Watch Now
              </Link>

              <FavoriteButton movieId={movie.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Explainer */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-2xl bg-[#2A2A2A] p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold">
            Movie Explainer
          </h2>

          <p className="leading-8 text-gray-300">
            {movie.explainer}
          </p>
        </div>
      </section>

      {/* Watch / Trailer */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl bg-black">
          <div className="flex aspect-video items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-5xl">▶</div>

              <h2 className="mb-2 text-xl font-semibold">
                {movie.title}
              </h2>

              <p className="text-sm text-gray-400">
                Watch this movie from the authorized video source.
              </p>

              <Link
                href={`/watch/${movie.slug}`}
                className="mt-5 inline-block rounded-lg bg-[#2979FF] px-6 py-3 font-semibold transition hover:bg-[#1565C0]"
              >
                Go to Watch Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} AGTIMES. All rights reserved.</p>

          <div className="flex gap-5">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/favorites"
              className="transition hover:text-white"
            >
              Favorites
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}