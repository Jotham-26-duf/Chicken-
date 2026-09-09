import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [movieCount, genreCount, userCount] = await Promise.all([
    prisma.movie.count(),
    prisma.genre.count(),
    prisma.user.count(),
  ]);

  const movies = await prisma.movie.findMany({
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
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
              className="block rounded-xl bg-[#2979FF] px-4 py-3 font-medium"
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
          <div className="mb-10">
            <p className="text-sm font-medium text-[#00E5FF]">
              ADMIN PANEL
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-[#AAAAAA]">
              Welcome, {session.user.name}.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Movies */}
            <div className="rounded-2xl border border-white/10 bg-[#2A2A2A] p-6">
              <p className="text-sm text-[#AAAAAA]">
                Movies
              </p>

              <p className="mt-3 text-3xl font-bold">
                {movieCount}
              </p>

              <p className="mt-2 text-sm text-[#AAAAAA]">
                Total movies
              </p>
            </div>

            {/* Genres */}
            <div className="rounded-2xl border border-white/10 bg-[#2A2A2A] p-6">
              <p className="text-sm text-[#AAAAAA]">
                Genres
              </p>

              <p className="mt-3 text-3xl font-bold">
                {genreCount}
              </p>

              <p className="mt-2 text-sm text-[#AAAAAA]">
                Available genres
              </p>
            </div>

            {/* Users */}
            <div className="rounded-2xl border border-white/10 bg-[#2A2A2A] p-6">
              <p className="text-sm text-[#AAAAAA]">
                Users
              </p>

              <p className="mt-3 text-3xl font-bold">
                {userCount}
              </p>

              <p className="mt-2 text-sm text-[#AAAAAA]">
                Registered users
              </p>
            </div>
          </div>

          {/* Movies */}
          <div className="mt-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Movies
                </h2>

                <p className="mt-1 text-sm text-[#AAAAAA]">
                  Recently added movies.
                </p>
              </div>

              <Link
                href="/admin/movies/new"
                className="w-fit rounded-xl bg-[#2979FF] px-5 py-3 font-semibold transition hover:brightness-110"
              >
                + Add Movie
              </Link>
            </div>

            {movies.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#2A2A2A] p-8 text-center">
                <p className="text-[#AAAAAA]">
                  No movies have been added yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#2A2A2A]">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                        Movie
                      </th>

                      <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                        Year
                      </th>

                      <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                        Rating
                      </th>

                      <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                        Genres
                      </th>

                      <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {movies.map((movie) => (
                      <tr
                        key={movie.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        {/* Movie */}
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {movie.title}
                          </div>

                          <div className="mt-1 text-xs text-[#777777]">
                            {movie.slug}
                          </div>
                        </td>

                        {/* Year */}
                        <td className="px-6 py-4 text-[#AAAAAA]">
                          {movie.year}
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4 text-[#AAAAAA]">
                          {movie.rating}
                        </td>

                        {/* Genres */}
                        <td className="px-6 py-4 text-[#AAAAAA]">
                          {movie.genres.length > 0
                            ? movie.genres
                                .map(
                                  (item) =>
                                    item.genre.name
                                )
                                .join(", ")
                            : "No genre"}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/movies/${movie.id}/edit`}
                            className="text-[#00E5FF] hover:text-[#E040FB]"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}