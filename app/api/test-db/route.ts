import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const series = await prisma.series.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    return Response.json({
      count: series.length,
      series,
    });
  } catch (error) {
    console.error("DATABASE TEST ERROR:", error);

    return Response.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}