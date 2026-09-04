
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        movie: {
          include: {
            genres: {
              include: {
                genre: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Get favorites error:", error);

    return NextResponse.json(
      { error: "Failed to load favorites." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const movieId = body.movieId;

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found." },
        { status: 404 }
      );
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        movieId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Add favorite error:", error);

    return NextResponse.json(
      { error: "Failed to add favorite." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const movieId = body.movieId;

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        movieId,
      },
    });

    return NextResponse.json({
      message: "Favorite removed.",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    return NextResponse.json(
      { error: "Failed to remove favorite." },
      { status: 500 }
    );
  }
}

