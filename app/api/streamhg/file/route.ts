import { NextResponse } from "next/server";

const STREAMHG_API =
  "https://streamhgapi.com/api";

export async function GET(
  request: Request
) {
  try {
    const apiKey =
      process.env.STREAMHG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "STREAMHG_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const fileCode =
      searchParams.get("fileCode");

    if (!fileCode) {
      return NextResponse.json(
        {
          error:
            "fileCode is required.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${STREAMHG_API}/file/info?key=${encodeURIComponent(
        apiKey
      )}&file_code=${encodeURIComponent(
        fileCode
      )}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text =
      await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error:
            "StreamHG returned invalid file information.",
          response: text,
        },
        { status: 502 }
      );
    }

    if (
      !response.ok ||
      data.status !== 200
    ) {
      return NextResponse.json(
        {
          error:
            data.msg ||
            "Could not retrieve file information.",
          details: data,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      file: data.result?.[0] || null,
    });
  } catch (error) {
    console.error(
      "StreamHG file info error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to retrieve StreamHG file information.",
      },
      { status: 500 }
    );
  }
}