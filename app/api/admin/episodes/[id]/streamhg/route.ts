
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response("Unauthorized.", {
      status: 401,
    });
  }

  if (session.user.role !== "ADMIN") {
    return new Response("Forbidden.", {
      status: 403,
    });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const fileCode = String(body.fileCode ?? "").trim();

    if (!fileCode) {
      return new Response("StreamHG file code is required.", {
        status: 400,
      });
    }

    const episode = await prisma.episode.findUnique({
      where: {
        id,
      },
    });

    if (!episode) {
      return new Response("Episode not found.", {
        status: 404,
      });
    }

    const apiKey = process.env.STREAMHG_API_KEY;

    if (!apiKey) {
      return new Response("STREAMHG_API_KEY is not configured.", {
        status: 500,
      });
    }

    const apiUrl =
      `https://streamhgapi.com/api/file/direct_link` +
      `?key=${encodeURIComponent(apiKey)}` +
      `&file_code=${encodeURIComponent(fileCode)}` +
      `&hls=1`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    console.log("STREAMHG DIRECT LINK RESPONSE:", data);

    if (!response.ok || data.status !== 200) {
      return new Response(
        data.msg || "StreamHG direct link request failed.",
        {
          status: 502,
        }
      );
    }

    const streamUrl = data.result?.hls_direct;

    if (!streamUrl) {
      return new Response(
        "StreamHG did not return an HLS stream URL.",
        {
          status: 502,
        }
      );
    }

    await prisma.episode.update({
      where: {
        id,
      },
      data: {
        streamUrl,
      },
    });

    return Response.json({
      success: true,
      streamUrl,
    });
  } catch (error) {
    console.error("Failed to connect StreamHG:", error);

    return new Response("Failed to connect StreamHG.", {
      status: 500,
    });
  }
}

