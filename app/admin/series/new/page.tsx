import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NewSeriesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const genres = await prisma.genre.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto min-h-screen max-w-4xl p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/series"
            className="text-sm text-[#00E5FF] hover:text-[#E040FB]"
          >
            ← Back to Series
          </Link>

          <p className="mt-8 text-sm font-medium text-[#00E5FF]">
            SERIES MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Add Series
          </h1>

          <p className="mt-2 text-[#AAAAAA]">
            Create a new movie series.
          </p>
        </div>

        {/* Form */}
        <form
          action="/api/admin/series"
          method="POST"
          className="space-y-6 rounded-2xl border border-white/10 bg-[#2A2A2A] p-6 md:p-8"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium"
            >
              Series Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="The Last Kingdom"
              className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-medium"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              required
              placeholder="the-last-kingdom"
              className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
            />

            <p className="mt-2 text-xs text-[#777777]">
              Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          {/* Year + Rating */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium"
              >
                Year
              </label>

              <input
                id="year"
                name="year"
                type="text"
                required
                placeholder="2026"
                className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-medium"
              >
                Rating
              </label>

              <input
                id="rating"
                name="rating"
                type="text"
                required
                placeholder="8.5"
                className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium"
            >
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              required
              placeholder="https://example.com/series-image.jpg"
              className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
            />
          </div>

          {/* Language */}
          <div>
            <label
              htmlFor="language"
              className="mb-2 block text-sm font-medium"
            >
              Language
            </label>

            <input
              id="language"
              name="language"
              type="text"
              required
              placeholder="English"
              className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Write a description of the series..."
              className="w-full resize-y rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
            />
          </div>

          {/* Genres */}
          <div>
            <label
              htmlFor="genreIds"
              className="mb-2 block text-sm font-medium"
            >
              Genres
            </label>

            <select
              id="genreIds"
              name="genreIds"
              multiple
              required
              className="min-h-40 w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white outline-none transition focus:border-[#2979FF]"
            >
              {genres.map((genre) => (
                <option
                  key={genre.id}
                  value={genre.id}
                  className="bg-[#1A1A1A]"
                >
                  {genre.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-[#777777]">
              Hold Ctrl while clicking to select multiple genres.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Link
              href="/admin/series"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold text-[#AAAAAA] transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-[#2979FF] px-5 py-3 font-semibold transition hover:brightness-110"
            >
              Create Series
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}