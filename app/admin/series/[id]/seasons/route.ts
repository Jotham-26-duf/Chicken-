import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const { id: seriesId } = await params;

  try {
    const formData = await request.formData();

    const numberValue = String(formData.get("number") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();

    if (!numberValue) {
      return new Response("Season number is required.", {
        status: 400,
      });
    }

    const number = Number(numberValue);

    if (!Number.isInteger(number) || number < 1) {
      return new Response(
        "Season number must be a positive whole number.",
        {
          status: 400,
        }
      );
    }

    const series = await prisma.series.findUnique({
      where: {
        id: seriesId,
      },
    });

    if (!series) {
      return new Response("Series not found.", {
        status: 404,
      });
    }

    const existingSeason = await prisma.season.findUnique({
      where: {
        seriesId_number: {
          seriesId,
          number,
        },
      },
    });

    if (existingSeason) {
      return new Response(
        `Season ${number} already exists for this series.`,
        {
          status: 409,
        }
      );
    }

    await prisma.season.create({
      data: {
        number,
        title: title || null,
        seriesId,
      },
    });
  } catch (error) {
    console.error("Failed to create season:", error);

    return new Response("Failed to create season.", {
      status: 500,
    });
  }

  redirect(`/admin/series/${seriesId}`);
}