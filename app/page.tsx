import { prisma } from "../lib/prisma";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  const [movies, genres] = await Promise.all([
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
  ]);

  return (
    <HomeClient
      movies={movies}
      genres={genres}
    />
  );
}