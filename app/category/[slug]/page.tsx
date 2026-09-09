import MovieCard from "../../components/MovieCard";
import { prisma } from "../../../lib/prisma";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.genre.findFirst({
    where: {
      name: {
        equals: slug,
        mode: "insensitive",
      },
    },
  });

  const categoryName = category?.name ?? slug;

  const categoryMovies = category
    ? await prisma.movie.findMany({
        where: {
          genres: {
            some: {
              genreId: category.id,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-[#121212] px-6 py-28 text-[#FFFFFF] lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
            Category
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#FFFFFF]">
            {categoryName}
          </h1>

          <p className="mt-3 text-[#AAAAAA]">
            Movies in the {categoryName} category
          </p>
        </div>

        {categoryMovies.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-[#2A2A2A] px-6 py-16 text-center">
            <div className="text-5xl">🎬</div>

            <h2 className="mt-5 text-2xl font-bold text-[#FFFFFF]">
              No Movies Found
            </h2>

            <p className="mt-3 text-[#AAAAAA]">
              There are no movies in the {categoryName} category yet.
            </p>
          </div>
        ) : (
          <section className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FFFFFF]">
                {categoryName} Movies
              </h2>

              <span className="rounded-md bg-[#5C6BC0] px-3 py-1 text-sm font-semibold text-white">
                {categoryMovies.length}{" "}
                {categoryMovies.length === 1 ? "Movie" : "Movies"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {categoryMovies.map((movie) => (
                <MovieCard
                  key={movie.slug}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  image={movie.image}
                  slug={movie.slug}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}