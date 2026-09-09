

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET() {
  try{
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        movie: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Favorites GET error:", error);
  
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const movieId = body?.movieId;

    if (!movieId || typeof movieId !== "string") {
      return NextResponse.json(
        { error: "movieId is required" },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });


    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        movieId,
      },
      include: {
        movie: true,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Favorites POST error:", error);

    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId is required" },
        { status: 400 }
      );
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        movieId,
      },
    });

    return NextResponse.json({
      success: true,
    });} 
    catch (error) {
    console.error("Favorites DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}








