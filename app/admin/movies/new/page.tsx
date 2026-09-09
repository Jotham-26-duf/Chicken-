import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import MovieForm from "@/app/components/admin/MovieForm";

export default async function NewMoviePage() {
  const session = await getServerSession(
    authOptions
  );

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
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/admin/movies"
            className="text-sm text-[#AAAAAA] transition hover:text-white"
          >
            ← Back to Movies
          </Link>

          <p className="mt-6 text-sm font-medium text-[#00E5FF]">
            ADMIN PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Add Movie
          </h1>

          <p className="mt-2 text-[#AAAAAA]">
            Add a new movie to AGTIMES.
          </p>
        </div>

        <MovieForm
          mode="create"
          genres={genres}
        />
      </div>
    </main>
  );
}