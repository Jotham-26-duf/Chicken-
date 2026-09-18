import { prisma } from "../lib/prisma";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  const [movies, genres, series, featuredMovies, featuredSeries] =
    await Promise.all([
      prisma.movie.findMany({
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
      }),

      prisma.genre.findMany({
        include: {
          movies: {
            take: 1,
            orderBy: {
              movie: {
                createdAt: "desc",
              },
            },
            include: {
              movie: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.series.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.movie.findMany({
        where: {
          isFeatured: true,
        },
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
      }),

      prisma.series.findMany({
        where: {
          isFeatured: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  return (
    <HomeClient
      movies={movies}
      genres={genres}
      series={series}
      featuredMovies={featuredMovies}
      featuredSeries={featuredSeries}
    />
  );
}