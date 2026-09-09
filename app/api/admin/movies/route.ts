import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/*
|--------------------------------------------------------------------------
| CREATE MOVIE
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Admin authorization
    |--------------------------------------------------------------------------
    */

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "You are not authorized to perform this action.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Read request body
    |--------------------------------------------------------------------------
    */

    const body = await request.json();

    const {
      title,
      slug,
      year,
      rating,
      image,
      description,
      explainer,
      translator,
      language,
      type,
      streamUrl,
      downloadUrl,
      genreIds,
    } = body;

    /*
    |--------------------------------------------------------------------------
    | Clean genre IDs
    |--------------------------------------------------------------------------
    */

    const uniqueGenreIds = [
      ...new Set(
        Array.isArray(genreIds)
          ? genreIds.filter(
              (genreId): genreId is string =>
                typeof genreId === "string"
            )
          : []
      ),
    ];

    /*
    |--------------------------------------------------------------------------
    | Validate required fields
    |--------------------------------------------------------------------------
    */

    if (
      !title ||
      !slug ||
      !year ||
      !rating ||
      !image ||
      !description ||
      !explainer ||
      !translator ||
      !language ||
      !type
    ) {
      return NextResponse.json(
        {
          error:
            "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate slug
    |--------------------------------------------------------------------------
    */

    if (
      typeof slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        slug.trim()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Slug can only contain lowercase letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate year
    |--------------------------------------------------------------------------
    */

    if (
      typeof year !== "string" ||
      !/^\d{4}$/.test(year.trim())
    ) {
      return NextResponse.json(
        {
          error:
            "Year must contain exactly 4 digits.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate image URL
    |--------------------------------------------------------------------------
    */

    if (
      typeof image !== "string" ||
      !isValidUrl(image.trim())
    ) {
      return NextResponse.json(
        {
          error: "Image must be a valid URL.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate stream URL
    |--------------------------------------------------------------------------
    */

    if (
      streamUrl &&
      (typeof streamUrl !== "string" ||
        !isValidUrl(streamUrl.trim()))
    ) {
      return NextResponse.json(
        {
          error:
            "Stream URL must be a valid URL.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate download URL
    |--------------------------------------------------------------------------
    */

    if (
      downloadUrl &&
      (typeof downloadUrl !== "string" ||
        !isValidUrl(downloadUrl.trim()))
    ) {
      return NextResponse.json(
        {
          error:
            "Download URL must be a valid URL.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate genres
    |--------------------------------------------------------------------------
    */

    if (uniqueGenreIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Please select at least one genre.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate slug
    |--------------------------------------------------------------------------
    */

    const existingMovie =
      await prisma.movie.findUnique({
        where: {
          slug: slug.trim(),
        },
      });

    if (existingMovie) {
      return NextResponse.json(
        {
          error:
            "A movie with this slug already exists.",
        },
        { status: 409 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check genres
    |--------------------------------------------------------------------------
    */

    const existingGenres =
      await prisma.genre.findMany({
        where: {
          id: {
            in: uniqueGenreIds,
          },
        },
        select: {
          id: true,
        },
      });

    if (
      existingGenres.length !==
      uniqueGenreIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "One or more selected genres do not exist.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create movie
    |--------------------------------------------------------------------------
    */

    const movie = await prisma.movie.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        year: year.trim(),
        rating: rating.trim(),
        image: image.trim(),
        description: description.trim(),
        explainer: explainer.trim(),
        translator: translator.trim(),
        language: language.trim(),
        type: type.trim(),

        streamUrl:
          typeof streamUrl === "string"
            ? streamUrl.trim() || null
            : null,

        downloadUrl:
          typeof downloadUrl === "string"
            ? downloadUrl.trim() || null
            : null,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Create movie-genre relationships
    |--------------------------------------------------------------------------
    */

    await prisma.movieGenre.createMany({
      data: uniqueGenreIds.map((genreId) => ({
        movieId: movie.id,
        genreId,
      })),
    });

    /*
    |--------------------------------------------------------------------------
    | Get created movie with genres
    |--------------------------------------------------------------------------
    */

    const createdMovie =
      await prisma.movie.findUnique({
        where: {
          id: movie.id,
        },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      createdMovie,
      { status: 201 }
    );
  } catch (error) {
    console.error("Create movie error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create movie.",
      },
      { status: 500 }
    );
  }
}