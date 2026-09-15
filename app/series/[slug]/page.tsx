
import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicSeriesPage({
  params,
}: PageProps) {
  const { slug } = await params;

  console.log("PUBLIC SERIES SLUG:", slug);

  const series = await prisma.series.findUnique({
    where: {
      slug: slug,
    },
    include: {
      seasons: {
        orderBy: {
          number: "asc",
        },
        include: {
          episodes: {
            orderBy: {
              number: "asc",
            },
          },
        },
      },
    },
  });

  console.log("PUBLIC SERIES RESULT:", series);

  if (!series) {
    notFound();
  }

  const totalEpisodes = series.seasons.reduce(
    (total, season) => total + season.episodes.length,
    0
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to AGTIMES
          </Link>

          <div className="mt-8 flex flex-col gap-8 md:flex-row">
            <img
              src={series.image}
              alt={series.title}
              className="h-80 w-56 rounded-xl object-cover shadow-xl"
            />

            <div className="flex-1">
              <h1 className="text-4xl font-bold">
                {series.title}
              </h1>

              <p className="mt-4 text-lg leading-8 text-gray-400">
                {series.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-400">
                <span>{series.year}</span>
                <span>⭐ {series.rating}</span>
                <span>{series.language}</span>
                <span>{series.seasons.length} Seasons</span>
                <span>{totalEpisodes} Episodes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-8 text-3xl font-bold">
          Episodes
        </h2>

        {series.seasons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900 p-10 text-center">
            <p className="text-gray-400">
              No episodes are available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {series.seasons.map((season) => (
              <section key={season.id}>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">
                    Season {season.number}
                  </h3>

                  {season.title && (
                    <p className="mt-1 text-gray-400">
                      {season.title}
                    </p>
                  )}
                </div>

                {season.episodes.length === 0 ? (
                  <div className="rounded-lg bg-gray-900 p-5 text-gray-500">
                    No episodes available.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {season.episodes.map((episode) => (
                      <article
                        key={episode.id}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-5"
                      >
                        <div className="flex flex-col gap-5 md:flex-row">
                          {episode.image && (
                            <img
                              src={episode.image}
                              alt={episode.title}
                              className="h-32 w-52 rounded-lg object-cover"
                            />
                          )}

                          <div className="flex-1">
                            <h4 className="text-xl font-semibold">
                              Episode {episode.number}:{" "}
                              {episode.title}
                            </h4>

                            {episode.description && (
                              <p className="mt-2 text-gray-400">
                                {episode.description}
                              </p>
                            )}

                            <div className="mt-5 flex flex-wrap gap-3">
                              {episode.streamUrl && (
                                <Link
                                  href={`/watch/episode/${episode.id}`}
                                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700"
                                >
                                  ▶ Watch
                                </Link>
                              )}

                              {episode.downloadUrl && (
                                <a
                                  href={episode.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg bg-green-600 px-5 py-2 font-semibold hover:bg-green-700"
                                >
                                  ↓ Download
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

