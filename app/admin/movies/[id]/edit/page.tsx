import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MovieForm from "@/app/components/admin/MovieForm";

interface EditMoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMoviePage({
  params,
}: EditMoviePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const [movie, genres] = await Promise.all([
    prisma.movie.findUnique({
      where: {
        id,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    }),

    prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!movie) {
    notFound();
  }

  const initialData = {
    id: movie.id,
    title: movie.title,
    slug: movie.slug,
    year: movie.year,
    rating: movie.rating,
    image: movie.image,
    description: movie.description,
    explainer: movie.explainer,
    translator: movie.translator,
    language: movie.language,
    type: movie.type,
    streamUrl: movie.streamUrl ?? "",
    downloadUrl: movie.downloadUrl ?? "",
    genreIds: movie.genres.map((item) => item.genreId),
  };

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#00E5FF]">
            ADMIN PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Edit Movie
          </h1>

          <p className="mt-2 text-[#AAAAAA]">
            Update the information for "{movie.title}".
          </p>
        </div>

        <MovieForm
          mode="edit"
          genres={genres}
          initialData={initialData}
        />
      </div>
    </main>
  );
}