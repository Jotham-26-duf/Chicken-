import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

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
| UPDATE MOVIE
|--------------------------------------------------------------------------
*/
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "You are not authorized to perform this action.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

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
          error: "Please fill in all required fields.",
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
    | Validate image
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
    | Check movie
    |--------------------------------------------------------------------------
    */

    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      return NextResponse.json(
        {
          error: "Movie not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate slug
    |--------------------------------------------------------------------------
    */

    const existingMovie =
      await prisma.movie.findFirst({
        where: {
          slug: slug.trim(),
          NOT: {
            id,
          },
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
    | Update movie
    |--------------------------------------------------------------------------
    */

    await prisma.movie.update({
      where: {
        id,
      },
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
    | Replace genres
    |--------------------------------------------------------------------------
    */

    await prisma.movieGenre.deleteMany({
      where: {
        movieId: id,
      },
    });

    await prisma.movieGenre.createMany({
      data: uniqueGenreIds.map((genreId) => ({
        movieId: id,
        genreId,
      })),
    });

    /*
    |--------------------------------------------------------------------------
    | Get updated movie
    |--------------------------------------------------------------------------
    */

    const updatedMovie =
      await prisma.movie.findUnique({
        where: {
          id,
        },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      });

    return NextResponse.json(updatedMovie, {
      status: 200,
    });
  } catch (error) {
    console.error("Update movie error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update movie.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE MOVIE
|--------------------------------------------------------------------------
*/

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "You are not authorized to perform this action.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    /*
    |--------------------------------------------------------------------------
    | Check if movie exists
    |--------------------------------------------------------------------------
    */

    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      return NextResponse.json(
        {
          error: "Movie not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete movie genre relationships
    |--------------------------------------------------------------------------
    */

    await prisma.movieGenre.deleteMany({
      where: {
        movieId: id,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Delete movie
    |--------------------------------------------------------------------------
    */

    await prisma.movie.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message: "Movie deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete movie error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete movie.",
      },
      { status: 500 }
    );
  }
}