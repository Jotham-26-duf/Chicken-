import { NextResponse } from "next/server";

const STREAMHG_API =
  "https://streamhgapi.com/api";

export async function GET() {
  try {
    const apiKey = process.env.STREAMHG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "STREAMHG_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${STREAMHG_API}/account/info?key=${encodeURIComponent(apiKey)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: "StreamHG returned an invalid response.",
          status: response.status,
          response: text,
        },
        { status: 502 }
      );
    }

    if (!response.ok || data.status !== 200) {
      return NextResponse.json(
        {
          error: data.msg || "Unable to connect to StreamHG.",
          details: data,
        },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({
      success: true,
      account: data.result,
    });
  } catch (error) {
    console.error("StreamHG account error:", error);

    return NextResponse.json(
      {
        error: "Failed to connect to StreamHG.",
      },
      { status: 500 }
    );
  }
}