
import { prisma } from "../lib/prisma";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  const [movies, genres, series] = await Promise.all([
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
      orderBy: {
        name: "asc",
      },
    }),

    prisma.series.findMany({
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
    />
  );
}

