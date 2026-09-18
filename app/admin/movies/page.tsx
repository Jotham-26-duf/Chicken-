import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteMovieButton from "./DeleteMovieButton";
import FeaturedMovieButton from "./FeaturedMovieButton";

export default async function AdminMoviesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

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
              className="block rounded-xl bg-[#2979FF] px-4 py-3 font-medium"
            >
              Movies
            </Link>

            <Link
              href="/admin/series"
              className="block rounded-xl px-4 py-3 text-[#AAAAAA] transition hover:bg-white/5 hover:text-white"
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
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#00E5FF]">
                ADMIN PANEL
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Movies
              </h1>

              <p className="mt-2 text-[#AAAAAA]">
                Add, edit, and manage your movies.
              </p>
            </div>

            <Link
              href="/admin/movies/new"
              className="w-fit rounded-xl bg-[#2979FF] px-5 py-3 font-semibold transition hover:brightness-110"
            >
              + Add Movie
            </Link>
          </div>

          {/* No Movies */}
          {movies.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#2A2A2A] p-10 text-center">
              <h2 className="text-xl font-semibold">
                No movies yet
              </h2>

              <p className="mt-2 text-[#AAAAAA]">
                Add your first movie to get started.
              </p>

              <Link
                href="/admin/movies/new"
                className="mt-6 inline-block rounded-xl bg-[#2979FF] px-5 py-3 font-semibold"
              >
                Add Movie
              </Link>
            </div>
          ) : (

            /* Movies Table */
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#2A2A2A]">
              <table className="w-full min-w-[1050px]">

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
                      Featured
                    </th>

                    <th className="px-6 py-4 text-sm text-[#AAAAAA]">
                      Actions
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
                        <div className="flex items-center gap-4">

                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="h-20 w-14 rounded-lg object-cover"
                          />

                          <div>
                            <p className="font-semibold">
                              {movie.title}
                            </p>

                            <p className="mt-1 text-xs text-[#777777]">
                              {movie.slug}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Year */}
                      <td className="px-6 py-4 text-[#AAAAAA]">
                        {movie.year}
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 text-[#AAAAAA]">
                        ⭐ {movie.rating}
                      </td>

                      {/* Genres */}
                      <td className="px-6 py-4 text-[#AAAAAA]">
                        {movie.genres.length > 0
                          ? movie.genres
                              .map((item) => item.genre.name)
                              .join(", ")
                          : "No genre"}
                      </td>

                      {/* Featured */}
                      <td className="px-6 py-4">
                        <FeaturedMovieButton
                          movieId={movie.id}
                          isFeatured={movie.isFeatured}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">

                          <Link
                            href={`/admin/movies/${movie.id}/edit`}
                            className="text-[#00E5FF] hover:text-[#E040FB]"
                          >
                            Edit
                          </Link>

                          <DeleteMovieButton
                            movieId={movie.id}
                            movieTitle={movie.title}
                          />

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>
      </div>
    </main>
  );
}