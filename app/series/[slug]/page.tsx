import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import SiteBottom from "@/app/components/SiteBottom";
import { prisma } from "@/lib/prisma";

type PageProps = {
params: Promise<{
slug: string;
}>;
};

export const dynamic = "force-dynamic";

export default async function PublicSeriesPage({
params,
}: PageProps) {
const { slug } = await params;

const series = await prisma.series.findUnique({
where: {
slug,
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

if (!series) {
notFound();
}

const totalEpisodes = series.seasons.reduce(
(total, season) => total + season.episodes.length,
0
);

/*

* An episode is considered available when it has either
* a streaming URL or a download URL.
  */
  const availableEpisodes = series.seasons.reduce(
  (total, season) =>
  total +
  season.episodes.filter(
  (episode) =>
  Boolean(episode.streamUrl) ||
  Boolean(episode.downloadUrl)
  ).length,
  0
  );

/*

* Find other series for the Related Series section.
*
* We do not have a SeriesGenre relation in the current schema,
* so we use language/year to find relevant content.
*
* If there are not enough matches, we fill the section with
* the latest other series.
  */
  const relatedSeries = await prisma.series.findMany({
  where: {
  id: {
  not: series.id,
  },
  },
  orderBy: [
  {
  language: "asc",
  },
  {
  year: "desc",
  },
  {
  createdAt: "desc",
  },
  ],
  take: 4,
  });

return ( <main className="min-h-screen bg-[#121212] text-white"> <Navbar />

```
  {/* ================= SERIES HERO ================= */}

  <section className="border-b border-white/10 bg-[#121212]">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
        {/* POSTER */}

        <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-[#2A2A2A] shadow-2xl lg:mx-0">
          <img
            src={series.image}
            alt={series.title}
            className="aspect-[2/3] w-full object-cover"
          />
        </div>

        {/* INFORMATION */}

        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
            TV Series
          </p>

          <h1 className="mt-3 break-words text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {series.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#AAAAAA]">
            <span className="flex items-center gap-1 rounded-md bg-[#5C6BC0] px-2 py-1 text-xs font-semibold text-white">
              <span className="text-[#FFC107]">★</span>
              {series.rating}
            </span>

            <span>•</span>

            <span>{series.year}</span>

            <span>•</span>

            <span>
              {series.seasons.length}{" "}
              {series.seasons.length === 1
                ? "Season"
                : "Seasons"}
            </span>

            <span>•</span>

            <span>
              {totalEpisodes}{" "}
              {totalEpisodes === 1
                ? "Episode"
                : "Episodes"}
            </span>
          </div>

          {series.language && (
            <div className="mt-4">
              <span className="inline-flex rounded-full border border-white/10 bg-[#2A2A2A] px-3 py-1 text-xs font-medium text-[#AAAAAA]">
                {series.language}
              </span>
            </div>
          )}

          <p className="mt-6 max-w-3xl leading-7 text-[#AAAAAA]">
            {series.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#episodes"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
            >
              ▶ Watch Episodes
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ================= EPISODES ================= */}

  <section
    id="episodes"
    className="bg-[#121212]"
  >
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Episodes
        </h2>

        <p className="mt-2 text-sm text-[#AAAAAA]">
          Select a season to browse its available episodes.
        </p>
      </div>

      {series.seasons.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-[#1B1B1B] p-10 text-center">
          <p className="text-[#777777]">
            No episodes are available yet.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {series.seasons.map((season) => {
            const seasonAvailableEpisodes =
              season.episodes.filter(
                (episode) =>
                  Boolean(episode.streamUrl) ||
                  Boolean(episode.downloadUrl)
              );

            return (
              <section key={season.id}>
                {/* SEASON HEADER */}

                <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      Season {season.number}
                    </h3>

                    {season.title && (
                      <p className="mt-1 text-sm text-[#AAAAAA]">
                        {season.title}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-[#777777]">
                    {seasonAvailableEpisodes.length}{" "}
                    {seasonAvailableEpisodes.length === 1
                      ? "available episode"
                      : "available episodes"}
                  </p>
                </div>

                {season.episodes.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-[#1B1B1B] p-6 text-center">
                    <p className="text-sm text-[#777777]">
                      No episodes available.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {season.episodes.map((episode) => (
                      <article
                        key={episode.id}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-[#1B1B1B] transition hover:border-white/20"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* EPISODE IMAGE */}

                          {episode.image ? (
                            <div className="w-full shrink-0 sm:w-48">
                              <img
                                src={episode.image}
                                alt={episode.title}
                                className="aspect-video h-full w-full object-cover sm:min-h-[150px]"
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-video w-full shrink-0 items-center justify-center bg-[#252525] text-4xl text-[#555555] sm:aspect-auto sm:w-48">
                              ▶
                            </div>
                          )}

                          {/* EPISODE INFORMATION */}

                          <div className="flex min-w-0 flex-1 flex-col p-5">
                            <div className="flex items-start gap-3">
                              <span className="shrink-0 rounded-md bg-[#2A2A2A] px-2 py-1 text-xs font-bold text-[#00E5FF]">
                                E
                                {String(
                                  episode.number
                                ).padStart(2, "0")}
                              </span>

                              <h4 className="min-w-0 break-words text-lg font-bold text-white">
                                {episode.title}
                              </h4>
                            </div>

                            {episode.description && (
                              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#AAAAAA]">
                                {episode.description}
                              </p>
                            )}

                            <div className="mt-4 text-xs text-[#777777]">
                              Added{" "}
                              {episode.createdAt.toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>

                            {/* ACTIONS */}

                            <div className="mt-5 flex flex-wrap gap-2">
                              {episode.streamUrl && (
                                <Link
                                  href={`/watch/episode/${episode.id}`}
                                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#2979FF] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                                >
                                  ▶ Watch Episode
                                </Link>
                              )}

                              {episode.downloadUrl && (
                                <a
                                  href={
                                    episode.downloadUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#E040FB] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
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
            );
          })}
        </div>
      )}

      {availableEpisodes === 0 &&
        totalEpisodes > 0 && (
          <p className="mt-6 text-center text-sm text-[#777777]">
            Episodes have been added, but watch or download
            links are not available yet.
          </p>
        )}
    </div>
  </section>

  {/* ================= RELATED SERIES ================= */}

  {relatedSeries.length > 0 && (
    <section className="border-t border-white/10 bg-[#171717]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Related Series
          </h2>

          <p className="mt-2 text-sm text-[#AAAAAA]">
            Discover more series you may enjoy.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {relatedSeries.map((related) => (
            <Link
              key={related.id}
              href={`/series/${related.slug}`}
              className="group block min-w-0"
            >
              <div className="relative overflow-hidden rounded-xl bg-[#2A2A2A]">
                <img
                  src={related.image}
                  alt={related.title}
                  className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/60">
                  <div className="scale-0 rounded-full bg-[#2979FF] p-4 text-white shadow-xl transition duration-300 group-hover:scale-100">
                    ▶
                  </div>
                </div>
              </div>

              <h3 className="mt-3 truncate font-semibold text-white transition group-hover:text-[#00E5FF]">
                {related.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-[#AAAAAA]">
                  {related.year}
                </span>

                <span className="text-[#AAAAAA]">
                  •
                </span>

                <span className="flex items-center gap-1 rounded-md bg-[#5C6BC0] px-2 py-1 text-xs font-semibold text-white">
                  <span className="text-[#FFC107]">
                    ★
                  </span>
                  {related.rating}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )}

  <SiteBottom />
</main>


);
}
