
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SeriesManagerPage({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const series = await prisma.series.findUnique({
    where: {
      id,
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
    redirect("/admin/series");
  }

  const totalEpisodes = series.seasons.reduce(
    (total, season) => total + season.episodes.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-800 bg-gray-900 p-6">
        <h1 className="mb-8 text-2xl font-bold">AGTIMES ADMIN</h1>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/movies"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            Movies
          </Link>

          <Link
            href="/admin/series"
            className="block rounded-lg bg-gray-800 px-4 py-3"
          >
            Series
          </Link>

          <Link
            href="/admin/genres"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            Genres
          </Link>

          <Link
            href="/admin/users"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            Users
          </Link>

          <Link
            href="/"
            className="mt-8 block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            ← Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/series"
            className="mb-3 inline-block text-sm text-gray-400 hover:text-white"
          >
            ← Back to Series
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">{series.title}</h2>

              <p className="mt-2 text-gray-400">
                Manage seasons and episodes for this series.
              </p>
            </div>

            <a
              href="#add-season"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
            >
              + Add Season
            </a>
          </div>
        </div>

        {/* Series Information */}
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex gap-6">
            <img
              src={series.image}
              alt={series.title}
              className="h-48 w-32 rounded-lg object-cover"
            />

            <div>
              <h3 className="text-xl font-bold">{series.title}</h3>

              <p className="mt-2 text-gray-400">
                {series.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                <span>Year: {series.year}</span>
                <span>Rating: {series.rating}</span>
                <span>Language: {series.language}</span>
                <span>Seasons: {series.seasons.length}</span>
                <span>Episodes: {totalEpisodes}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Add Season */}
        <section
          id="add-season"
          className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6"
        >
          <h3 className="text-2xl font-bold">Add Season</h3>

          <form
            action={`/api/admin/series/${series.id}/seasons`}
            method="POST"
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label
                htmlFor="season-number"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Season Number
              </label>

              <input
                id="season-number"
                name="number"
                type="number"
                min="1"
                required
                placeholder="1"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="season-title"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Season Title
              </label>

              <input
                id="season-title"
                name="title"
                type="text"
                placeholder="Season 1"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                + Add Season
              </button>
            </div>
          </form>
        </section>

        {/* Seasons */}
        <section>
          <h3 className="mb-4 text-2xl font-bold">Seasons</h3>

          {series.seasons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900 p-10 text-center">
              <p className="text-gray-400">
                No seasons have been added yet.
              </p>

              <a
                href="#add-season"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                + Add First Season
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {series.seasons.map((season) => (
                <div
                  key={season.id}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                >
                  {/* Season Header */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold">
                        Season {season.number}
                      </h4>

                      {season.title && (
                        <p className="text-gray-400">
                          {season.title}
                        </p>
                      )}

                      <p className="mt-1 text-sm text-gray-500">
                        {season.episodes.length} episode
                        {season.episodes.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <a
                      href={`#add-episode-${season.id}`}
                      className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
                    >
                      + Add Episode
                    </a>
                  </div>

                  {/* Add Episode */}
                  <div
                    id={`add-episode-${season.id}`}
                    className="mb-6 rounded-lg border border-gray-800 bg-gray-950 p-5"
                  >
                    <h5 className="text-lg font-semibold">
                      Add Episode to Season {season.number}
                    </h5>

                    <form
                      action={`/api/admin/series/${series.id}/seasons/${season.id}/episodes`}
                      method="POST"
                      className="mt-4 space-y-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`episode-number-${season.id}`}
                            className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Episode Number
                          </label>

                          <input
                            id={`episode-number-${season.id}`}
                            name="number"
                            type="number"
                            min="1"
                            required
                            placeholder="1"
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`episode-title-${season.id}`}
                            className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Episode Title
                          </label>

                          <input
                            id={`episode-title-${season.id}`}
                            name="title"
                            type="text"
                            required
                            placeholder="Episode 1"
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`episode-description-${season.id}`}
                          className="mb-2 block text-sm font-medium text-gray-300"
                        >
                          Description
                        </label>

                        <textarea
                          id={`episode-description-${season.id}`}
                          name="description"
                          rows={3}
                          placeholder="Episode description..."
                          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`episode-image-${season.id}`}
                          className="mb-2 block text-sm font-medium text-gray-300"
                        >
                          Episode Image URL
                        </label>

                        <input
                          id={`episode-image-${season.id}`}
                          name="image"
                          type="url"
                          placeholder="https://..."
                          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`episode-stream-${season.id}`}
                          className="mb-2 block text-sm font-medium text-gray-300"
                        >
                          Watch / Stream URL
                        </label>

                        <input
                          id={`episode-stream-${season.id}`}
                          name="streamUrl"
                          type="url"
                          placeholder="https://..."
                          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`episode-download-${season.id}`}
                          className="mb-2 block text-sm font-medium text-gray-300"
                        >
                          Download URL
                        </label>

                        <input
                          id={`episode-download-${season.id}`}
                          name="downloadUrl"
                          type="url"
                          placeholder="https://..."
                          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="rounded-lg bg-green-600 px-5 py-3 font-semibold hover:bg-green-700"
                      >
                        + Add Episode
                      </button>
                    </form>
                  </div>

                  {/* Episodes */}
                  {season.episodes.length === 0 ? (
                    <p className="text-gray-500">
                      No episodes added yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {season.episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h5 className="font-semibold">
                                Episode {episode.number}:{" "}
                                {episode.title}
                              </h5>

                              {episode.description && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {episode.description}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {episode.streamUrl && (
                                <span className="rounded bg-blue-900 px-3 py-1 text-xs">
                                  Watch URL
                                </span>
                              )}

                              {episode.downloadUrl && (
                                <span className="rounded bg-green-900 px-3 py-1 text-xs">
                                  Download URL
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
