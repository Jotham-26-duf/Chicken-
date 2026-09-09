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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in." },
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

    if (uniqueGenreIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Please select at least one genre.",
        },
        { status: 400 }
      );
    }

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

        genres: {
          create: uniqueGenreIds.map(
            (genreId) => ({
              genre: {
                connect: {
                  id: genreId,
                },
              },
            })
          ),
        },
      },

      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return NextResponse.json(movie, {
      status: 201,
    });
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