import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      seasonId: string;
    }>;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const { id: seriesId, seasonId } = await params;

  try {
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "").trim();
    const numberValue = String(formData.get("number") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const streamUrl = String(formData.get("streamUrl") ?? "").trim();
    const downloadUrl = String(formData.get("downloadUrl") ?? "").trim();

    if (!title || !numberValue) {
      return new Response("Episode title and number are required.", {
        status: 400,
      });
    }

    const number = Number(numberValue);

    if (!Number.isInteger(number) || number < 1) {
      return new Response(
        "Episode number must be a positive whole number.",
        {
          status: 400,
        }
      );
    }

    const season = await prisma.season.findFirst({
      where: {
        id: seasonId,
        seriesId,
      },
    });

    if (!season) {
      return new Response("Season not found.", {
        status: 404,
      });
    }

    const existingEpisode = await prisma.episode.findUnique({
      where: {
        seasonId_number: {
          seasonId,
          number,
        },
      },
    });

    if (existingEpisode) {
      return new Response(
        `Episode ${number} already exists in this season.`,
        {
          status: 409,
        }
      );
    }

    await prisma.episode.create({
      data: {
        title,
        number,
        description: description || null,
        image: image || null,
        streamUrl: streamUrl || null,
        downloadUrl: downloadUrl || null,
        seasonId,
      },
    });
  } catch (error) {
    console.error("Failed to create episode:", error);

    return new Response("Failed to create episode.", {
      status: 500,
    });
  }

  redirect(`/admin/series/${seriesId}`);
}