"use client";

import { ChangeEvent, useState } from "react";

interface StreamHGFile {
  filecode: string;
  filename: string;
  status: string;
}

interface StreamHGUploadProps {
  onUploaded?: (file: StreamHGFile) => void;
}

export default function StreamHGUpload({
  onUploaded,
}: StreamHGUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] =
    useState<StreamHGFile | null>(null);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  }

  async function handleUpload() {
    setError("");
    setUploadedFile(null);

    if (!selectedFile) {
      setError("Please select a video first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("title", title);
      formData.append("description", description);

      const response = await fetch("/api/streamhg/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Server returned invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Video upload failed.");
      }

      if (!data.file) {
        throw new Error("StreamHG did not return a file.");
      }

      setUploadedFile(data.file);
      onUploaded?.(data.file);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          Upload Movie Video
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Upload your video directly to StreamHG.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="streamhg-file"
          className="block text-sm font-medium text-zinc-700"
        >
          Video file
        </label>

        <input
          id="streamhg-file"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm"
        />

        {selectedFile && (
          <p className="text-sm text-zinc-500">
            Selected:{" "}
            <span className="font-medium text-zinc-800">
              {selectedFile.name}
            </span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="streamhg-title"
          className="block text-sm font-medium text-zinc-700"
        >
          Video title
        </label>

        <input
          id="streamhg-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Movie title"
          disabled={uploading}
          className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="streamhg-description"
          className="block text-sm font-medium text-zinc-700"
        >
          Description
        </label>

        <textarea
          id="streamhg-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Video description"
          rows={4}
          disabled={uploading}
          className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload to StreamHG"}
      </button>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {uploadedFile && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="font-semibold text-green-800">
            Upload successful
          </h3>

          <div className="mt-3 space-y-1 text-sm text-green-700">
            <p>
              <strong>File:</strong> {uploadedFile.filename}
            </p>

            <p>
              <strong>File code:</strong> {uploadedFile.filecode}
            </p>

            <p>
              <strong>Status:</strong> {uploadedFile.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}