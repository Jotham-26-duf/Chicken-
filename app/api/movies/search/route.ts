import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request){
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json([]);
    }

    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            explainer: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            year: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            translator: {
              contains: query,
              mode: "insensitive",
            },
          },

          {
            language: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            type: {
              contains: query,
              mode: "insensitive",
            },
          },

          { genres: {
              some: {
                genre: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
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
      take: 20,
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Movie search error:", error);

    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}











