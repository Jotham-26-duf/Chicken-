import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| UPDATE FEATURED STATUS
|--------------------------------------------------------------------------
*/

export async function PATCH(
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
          error: "You are not authorized to perform this action.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    if (typeof body.isFeatured !== "boolean") {
      return NextResponse.json(
        {
          error: "isFeatured must be a boolean.",
        },
        { status: 400 }
      );
    }

    const series = await prisma.series.findUnique({
      where: {
        id,
      },
    });

    if (!series) {
      return NextResponse.json(
        {
          error: "Series not found.",
        },
        { status: 404 }
      );
    }

    const updatedSeries = await prisma.series.update({
      where: {
        id,
      },
      data: {
        isFeatured: body.isFeatured,
      },
      select: {
        id: true,
        isFeatured: true,
      },
    });

    return NextResponse.json(updatedSeries, {
      status: 200,
    });
  } catch (error) {
    console.error("Update series featured error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update featured status.",
      },
      { status: 500 }
    );
  }
}