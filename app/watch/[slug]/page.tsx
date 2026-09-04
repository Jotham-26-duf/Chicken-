import Link from "next/link";
import { movies } from "../../data/movies";

interface WatchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WatchPage({
  params,
}: WatchPageProps) {
  const { slug } = await params;

  const movie = movies.find((movie) => movie.slug === slug);

  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#121212] px-6 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Movie Not Found
          </h1>

          <p className="mt-3 text-[#AAAAAA]">
            The movie you are looking for does not exist.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-[#FFFFFF]">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#121212]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Link href="/" className="text-2xl font-bold">
            <span className="text-[#00E5FF]">
              AG
            </span>
            <span className="text-[#E040FB]">
              TIMES
            </span>
          </Link>

          <Link
            href={`/movies/${movie.slug}`}
            className="rounded-lg bg-[#2A2A2A] px-4 py-2 text-sm font-medium text-[#FFFFFF] transition hover:bg-[#353535]"
          >
            ← Movie Details
          </Link>

        </div>
      </header>

      {/* Watch section */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
            Now Watching
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {movie.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#AAAAAA]">
            <span>{movie.year}</span>

            <span>•</span>

            <span>
              {movie.genres.join(" • ")}
            </span>

            <span>•</span>

            <span className="flex items-center gap-1">
              <span className="text-[#FFC107]">
                ★
              </span>

              {movie.rating}
            </span>
          </div>
        </div>

        {/* Video player */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">

          <div className="aspect-video">

            <video
              controls
              className="h-full w-full"
              poster={movie.image}
            >
              <source
                src="/videos/sample.mp4"
                type="video/mp4"
              />

              Your browser does not support video playback.
            </video>

          </div>

        </div>

        {/* Description */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">

          <div>
            <h2 className="text-2xl font-bold">
              About {movie.title}
            </h2>

            <p className="mt-4 leading-7 text-[#AAAAAA]">
              {movie.description}
            </p>

            <p className="mt-4 leading-7 text-[#AAAAAA]">
              {movie.explainer}
            </p>
          </div>

          {/* Movie information */}
          <div className="rounded-2xl bg-[#2A2A2A] p-6">

            <h2 className="text-lg font-bold">
              Movie Information
            </h2>

            <div className="mt-5 space-y-4 text-sm">

              <div>
                <p className="text-[#AAAAAA]">
                  Type
                </p>

                <p className="mt-1 font-medium">
                  {movie.type}
                </p>
              </div>

              <div>
                <p className="text-[#AAAAAA]">
                  Language
                </p>

                <p className="mt-1 font-medium">
                  {movie.language}
                </p>
              </div>

              <div>
                <p className="text-[#AAAAAA]">
                  Translator
                </p>

                <p className="mt-1 font-medium">
                  {movie.translator}
                </p>
              </div>

              <div>
                <p className="text-[#AAAAAA]">
                  Genres
                </p>

                <p className="mt-1 font-medium">
                  {movie.genres.join(", ")}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-[#AAAAAA]">
        © 2026 AGTIMES. All rights reserved.
      </footer>

    </main>
  );
}