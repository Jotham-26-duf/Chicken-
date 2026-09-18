import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FeaturedSeriesButton from "./FeaturedSeriesButton";

export default async function AdminSeriesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const series = await prisma.series.findMany({
    include: {
      seasons: {
        include: {
          episodes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-white/10 bg-[#1A1A1A] p-6 md:block">
          <div className="mb-10 text-2xl font-bold">
            <span className="text-[#00E5FF]">AG</span>
            <span className="text-[#E040FB]">TIMES</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block rounded-xl px-4 py-3 text-[#AAAAAA] transition hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/movies"
              className="block rounded-xl px-4 py-3 text-[#AAAAAA] transition hover:bg-white/5 hover:text-white"
            >
              Movies
            </Link>

            <Link
              href="/admin/series"
              className="block rounded-xl bg-[#2979FF] px-4 py-3 font-medium"
            >
              Series
            </Link>

            <Link
              href="/admin/genres"
              className="block rounded-xl px-4 py-3 text-[#AAAAAA] transition hover:bg-white/5 hover:text-white"
            >
              Genres
            </Link>

            <Link
              href="/admin/users"
              className="block rounded-xl px-4 py-3 text-[#AAAAAA] transition hover:bg-white/5 hover:text-white"
            >
              Users
            </Link>

            <Link
              href="/"
              className="block rounded-xl px-4 py-3 text-[#AAAAAA] transition hover:bg-white/5 hover:text-white"
            >
              ← Back to Website
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-6 md:p-10">

          {/* Header */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#00E5FF]">
                SERIES MANAGEMENT
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Series
              </h1>

              <p className="mt-2 text-[#AAAAAA]">
                Manage your movie series, seasons, and episodes.
              </p>
            </div>

            <Link
              href="/admin/series/new"
              className="w-fit rounded-xl bg-[#2979FF] px-5 py-3 font-semibold transition hover:brightness-110"
            >
              + Add Series
            </Link>
          </div>

          {/* Series List */}
          {series.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#2A2A2A] p-10 text-center">
              <h2 className="text-xl font-semibold">
                No series yet
              </h2>

              <p className="mt-2 text-[#AAAAAA]">
                Start by adding your first movie series.
              </p>

              <Link
                href="/admin/series/new"
                className="mt-6 inline-block rounded-xl bg-[#2979FF] px-5 py-3 font-semibold"
              >
                + Add Series
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#2A2A2A]">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Series
                    </th>

                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Year
                    </th>

                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Rating
                    </th>

                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Seasons
                    </th>

                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Episodes
                    </th>

                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {series.map((item) => {
                    const episodeCount = item.seasons.reduce(
                      (total, season) =>
                        total + season.episodes.length,
                      0
                    );

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        {/* Series */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-20 w-14 rounded-lg object-cover"
                            />

                            <div>
                              <div className="font-medium">
                                {item.title}
                              </div>

                              <div className="mt-1 text-xs text-[#777777]">
                                {item.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Year */}
                        <td className="px-6 py-4 text-[#AAAAAA]">
                          {item.year}
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4 text-[#AAAAAA]">
                          {item.rating}
                        </td>

                        {/* Seasons */}
                        <td className="px-6 py-4 text-[#AAAAAA]">
                          {item.seasons.length}
                        </td>

                        {/* Episodes */}
                        <td className="px-6 py-4 text-[#AAAAAA]">
                          {episodeCount}
                        </td>

                        {/* Featured */}
                        <td className="px-6 py-4">
                          <FeaturedSeriesButton
                            seriesId={item.id}
                            isFeatured={item.isFeatured}
                          />
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/series/${item.id}`}
                            className="text-[#00E5FF] hover:text-[#E040FB]"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}