// import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/prisma/client";
// import { movies } from "../app/data/movies";

// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   throw new Error("DATABASE_URL is not set");
// }

// const adapter = new PrismaPg({
//   connectionString,
// });

// const prisma = new PrismaClient({
//   adapter,
// });

// async function main() {
//   console.log("🌱 Starting database seed...");

//   for (const movie of movies) {
//     const createdMovie = await prisma.movie.upsert({
//       where: {
//         slug: movie.slug,
//       },

//       update: {
//         title: movie.title,
//         year: movie.year,
//         rating: movie.rating,
//         image: movie.image,
//         description: movie.description,
//         explainer: movie.explainer,
//         translator: movie.translator,
//         language: movie.language,
//         type: movie.type,
//       },

//       create: {
//         title: movie.title,
//         slug: movie.slug,
//         year: movie.year,
//         rating: movie.rating,
//         image: movie.image,
//         description: movie.description,
//         explainer: movie.explainer,
//         translator: movie.translator,
//         language: movie.language,
//         type: movie.type,
//       },
//     });

//     // Connect the movie to its genres
//     for (const genreName of movie.genres) {
//       const genre = await prisma.genre.upsert({
//         where: {
//           name: genreName,
//         },
//         update: {},
//         create: {
//           name: genreName,
//         },
//       });

//       await prisma.movieGenre.upsert({
//         where: {
//           movieId_genreId: {
//             movieId: createdMovie.id,
//             genreId: genre.id,
//           },
//         },
//         update: {},
//         create: {
//           movieId: createdMovie.id,
//           genreId: genre.id,
//         },
//       });
//     }

//     console.log(`✅ Seeded: ${movie.title}`);
//   }

//   console.log("🎉 Database seed completed!");
// }

// main()
//   .catch((error) => {
//     console.error("❌ Seed failed:", error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });