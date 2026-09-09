const { PrismaClient } = require("./generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.update({
    where: {
      email: "dufitumurengezijotham21@gmail.com",
    },
    data: {
      passwordHash: "$2b$12$xBI1/ohelw1V9RC50ejgjOi.AdF5fj8yQLL/9ghw/hAblLiWynxDa",
      role: "ADMIN",
    },
  });

  console.log("Admin password updated successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
