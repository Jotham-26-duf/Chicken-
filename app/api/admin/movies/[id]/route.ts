
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

function isValidImage(value: string) {
  // Allow local images stored inside public/images/movies/
  if (
    value.startsWith("/images/movies/") &&
    value.length > "/images/movies/".length
  ) {
    return true;
  }

  // Also allow normal external image URLs
  return isValidUrl(value);
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (typeof body.isFeatured !== "boolean") {
      return NextResponse.json(
        { error: "isFeatured must be a boolean." },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found." },
        { status: 404 }
      );
    }

    const updatedMovie =
      await prisma.movie.update({
        where: { id },
        data: {
          isFeatured: body.isFeatured,
        },
        select: {
          id: true,
          isFeatured: true,
        },
      });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error(
      "PATCH /api/admin/movies/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update featured status." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
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
      downloads,
      genreIds,
    } = body;

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
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug can only contain lowercase letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(String(year))) {
      return NextResponse.json(
        { error: "Year must contain exactly 4 digits." },
        { status: 400 }
      );
    }

    // Accept both local movie images and external image URLs.
    if (!isValidImage(String(image).trim())) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid image filename or image URL.",
        },
        { status: 400 }
      );
    }

    if (
      streamUrl &&
      !isValidUrl(String(streamUrl))
    ) {
      return NextResponse.json(
        { error: "Please provide a valid stream URL." },
        { status: 400 }
      );
    }

    if (
      downloadUrl &&
      !isValidUrl(String(downloadUrl))
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid legacy download URL.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(genreIds) || genreIds.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one genre." },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found." },
        { status: 404 }
      );
    }

    const duplicateSlug =
      await prisma.movie.findFirst({
        where: {
          slug,
          NOT: {
            id,
          },
        },
      });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          error:
            "Another movie already uses this slug.",
        },
        { status: 409 }
      );
    }

    const genres = await prisma.genre.findMany({
      where: {
        id: {
          in: genreIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (genres.length !== genreIds.length) {
      return NextResponse.json(
        { error: "One or more selected genres are invalid." },
        { status: 400 }
      );
    }

    const cleanedDownloads = Array.isArray(downloads)
      ? downloads
          .map((download: unknown) => {
            const item = download as {
              part?: unknown;
              url?: unknown;
            };

            return {
              part:
                typeof item.part === "string"
                  ? item.part.trim()
                  : "",
              url:
                typeof item.url === "string"
                  ? item.url.trim()
                  : "",
            };
          })
          .filter(
            (download: { part: string; url: string }) =>
              download.part && download.url
          )
      : [];

    for (const download of cleanedDownloads) {
      if (!isValidUrl(download.url)) {
        return NextResponse.json(
          {
            error: `Invalid download URL for ${download.part}.`,
          },
          { status: 400 }
        );
      }
    }

    await prisma.movieGenre.deleteMany({
      where: {
        movieId: id,
      },
    });

    await prisma.movieDownload.deleteMany({
      where: {
        movieId: id,
      },
    });

    const updatedMovie =
      await prisma.movie.update({
        where: { id },

        data: {
          title: String(title).trim(),
          slug: String(slug).trim(),
          year: String(year).trim(),
          rating: String(rating).trim(),
          image: String(image).trim(),
          description: String(description).trim(),
          explainer: String(explainer).trim(),
          translator: String(translator).trim(),
          language: String(language).trim(),
          type: String(type).trim(),

          streamUrl: streamUrl
            ? String(streamUrl).trim()
            : null,

          downloadUrl:
            cleanedDownloads.length > 0
              ? null
              : downloadUrl
              ? String(downloadUrl).trim()
              : null,

          genres: {
            create: genreIds.map((genreId: string) => ({
              genre: {
                connect: {
                  id: genreId,
                },
              },
            })),
          },

          downloads: {
            create: cleanedDownloads.map(
              (download: {
                part: string;
                url: string;
              }) => ({
                part: download.part,
                url: download.url,
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
          downloads: true,
        },
      });

    return NextResponse.json({
      movie: updatedMovie,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/movies/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update movie." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found." },
        { status: 404 }
      );
    }

    await prisma.movieGenre.deleteMany({
      where: {
        movieId: id,
      },
    });

    await prisma.movie.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Movie deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/movies/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete movie." },
      { status: 500 }
    );
  }
}

