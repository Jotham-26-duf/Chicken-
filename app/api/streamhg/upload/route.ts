import { NextResponse } from "next/server";

const STREAMHG_API =
  "https://streamhgapi.com/api";

export async function POST(request: Request) {
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

    const incomingFormData = await request.formData();

    const file = incomingFormData.get("file");
    const title = String(
      incomingFormData.get("title") || ""
    );

    const description = String(
      incomingFormData.get("description") || ""
    );

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No video file was provided.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "The selected video file is empty.",
        },
        { status: 400 }
      );
    }

    /*
     * STEP 1
     * Ask StreamHG for an upload server.
     */

    const serverResponse = await fetch(
      `${STREAMHG_API}/upload/server?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const serverText = await serverResponse.text();

    let serverData;

    try {
      serverData = JSON.parse(serverText);
    } catch {
      return NextResponse.json(
        {
          error: "StreamHG returned invalid upload-server data.",
          response: serverText,
        },
        { status: 502 }
      );
    }

    if (
      !serverResponse.ok ||
      serverData.status !== 200 ||
      !serverData.result
    ) {
      return NextResponse.json(
        {
          error:
            serverData.msg ||
            "Could not get StreamHG upload server.",
          details: serverData,
        },
        { status: 502 }
      );
    }

    const uploadServer = serverData.result;

    /*
     * STEP 2
     * Send the actual video to StreamHG.
     */

    const streamHgForm = new FormData();

    streamHgForm.append("key", apiKey);

    streamHgForm.append(
      "file",
      file,
      file.name
    );

    streamHgForm.append(
      "file_title",
      title || file.name
    );

    streamHgForm.append(
      "file_descr",
      description
    );

    streamHgForm.append(
      "file_public",
      "1"
    );

    /*
     * Keep uploaded files non-adult.
     */

    streamHgForm.append(
      "file_adult",
      "0"
    );

    const uploadResponse = await fetch(
      uploadServer,
      {
        method: "POST",
        body: streamHgForm,
      }
    );

    const uploadText =
      await uploadResponse.text();

    let uploadData;

    try {
      uploadData =
        JSON.parse(uploadText);
    } catch {
      return NextResponse.json(
        {
          error:
            "StreamHG returned an invalid upload response.",
          status: uploadResponse.status,
          response: uploadText,
        },
        { status: 502 }
      );
    }

    if (
      !uploadResponse.ok ||
      uploadData.status !== 200
    ) {
      return NextResponse.json(
        {
          error:
            uploadData.msg ||
            "StreamHG video upload failed.",
          details: uploadData,
        },
        {
          status:
            uploadResponse.status || 502,
        }
      );
    }

    /*
     * StreamHG normally returns:
     *
     * files: [
     *   {
     *      filecode: "...",
     *      filename: "...",
     *      status: "OK"
     *   }
     * ]
     */

    const uploadedFile =
      uploadData.files?.[0];

    if (!uploadedFile?.filecode) {
      return NextResponse.json(
        {
          error:
            "Upload completed but StreamHG did not return a file code.",
          details: uploadData,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,

      file: {
        filecode:
          uploadedFile.filecode,

        filename:
          uploadedFile.filename,

        status:
          uploadedFile.status,
      },
    });
  } catch (error) {
    console.error(
      "StreamHG upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected StreamHG upload error.",
      },
      { status: 500 }
    );
  }
}