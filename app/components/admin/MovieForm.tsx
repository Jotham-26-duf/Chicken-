"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface Genre {
  id: string;
  name: string;
}

interface MovieFormData {
  id?: string;
  title: string;
  slug: string;
  year: string;
  rating: string;
  image: string;
  description: string;
  explainer: string;
  translator: string;
  language: string;
  type: string;
  streamUrl: string;
  downloadUrl: string;
  genreIds: string[];
}

interface MovieFormProps {
  mode: "create" | "edit";
  genres: Genre[];
  initialData?: MovieFormData;
}

const emptyForm: MovieFormData = {
  title: "",
  slug: "",
  year: "",
  rating: "",
  image: "",
  description: "",
  explainer: "",
  translator: "",
  language: "",
  type: "",
  streamUrl: "",
  downloadUrl: "",
  genreIds: [],
};

export default function MovieForm({
  mode,
  genres,
  initialData,
}: MovieFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<MovieFormData>(
    initialData || emptyForm
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof MovieFormData,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function toggleGenre(genreId: string) {
    setForm((previous) => {
      const alreadySelected =
        previous.genreIds.includes(genreId);

      return {
        ...previous,
        genreIds: alreadySelected
          ? previous.genreIds.filter(
              (id) => id !== genreId
            )
          : [...previous.genreIds, genreId],
      };
    });
  }

  function createSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setForm((previous) => ({
      ...previous,
      title: value,
      ...(mode === "create"
        ? { slug: createSlug(value) }
        : {}),
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const cleanedGenreIds = [
        ...new Set(form.genreIds),
      ];

      if (cleanedGenreIds.length === 0) {
        throw new Error(
          "Please select at least one genre."
        );
      }

      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        year: form.year.trim(),
        rating: form.rating.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        explainer: form.explainer.trim(),
        translator: form.translator.trim(),
        language: form.language.trim(),
        type: form.type.trim(),
        streamUrl: form.streamUrl.trim(),
        downloadUrl: form.downloadUrl.trim(),
        genreIds: cleanedGenreIds,
      };

      const url =
        mode === "create"
          ? "/api/admin/movies"
          : `/api/admin/movies/${form.id}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Read the response as text first.
      // This prevents "Unexpected end of JSON input"
      // when the server returns an empty response.
      const responseText = await response.text();

      let data: {
        error?: string;
        message?: string;
      } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          console.error(
            "Server returned non-JSON response:",
            responseText
          );

          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to ${
              mode === "create"
                ? "create"
                : "update"
            } movie.`
        );
      }

      setSuccess(
        mode === "create"
          ? "Movie created successfully."
          : "Movie updated successfully."
      );

      setTimeout(() => {
        router.push("/admin/movies");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("Movie form error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Basic information */}
      <section className="rounded-xl border border-white/10 bg-[#181818] p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Basic Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Movie Title *
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                handleTitleChange(
                  event.target.value
                )
              }
              placeholder="e.g. The Great Adventure"
              required
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug *
            </label>

            <input
              type="text"
              value={form.slug}
              onChange={(event) =>
                updateField(
                  "slug",
                  event.target.value
                )
              }
              placeholder="the-great-adventure"
              required
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />

            <p className="mt-2 text-xs text-[#888]">
              Use lowercase letters, numbers and
              hyphens only.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Year *
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={form.year}
              onChange={(event) =>
                updateField(
                  "year",
                  event.target.value
                )
              }
              placeholder="2026"
              required
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Rating *
            </label>

            <input
              type="text"
              value={form.rating}
              onChange={(event) =>
                updateField(
                  "rating",
                  event.target.value
                )
              }
              placeholder="8.5"
              required
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Language *
            </label>

            <input
              type="text"
              value={form.language}
              onChange={(event) =>
                updateField(
                  "language",
                  event.target.value
                )
              }
              placeholder="Kinyarwanda"
              required
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Type *
            </label>

            <select
              value={form.type}
              onChange={(event) =>
                updateField(
                  "type",
                  event.target.value
                )
              }
              required
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            >
              <option value="">
                Select type
              </option>

              <option value="Movie">
                Movie
              </option>

              <option value="Series">
                Series
              </option>

              <option value="Documentary">
                Documentary
              </option>

              <option value="Animation">
                Animation
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="rounded-xl border border-white/10 bg-[#181818] p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Movie Image
        </h2>

        <label className="mb-2 block text-sm font-medium">
          Image URL *
        </label>

        <input
          type="url"
          value={form.image}
          onChange={(event) =>
            updateField(
              "image",
              event.target.value
            )
          }
          placeholder="https://example.com/movie.jpg"
          required
          className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
        />

        {form.image && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-[#888]">
              Preview
            </p>

            <img
              src={form.image}
              alt="Movie preview"
              className="h-64 w-full rounded-lg object-cover"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}
      </section>

      {/* Description */}
      <section className="rounded-xl border border-white/10 bg-[#181818] p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Movie Details
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description *
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              placeholder="Write a description of the movie..."
              rows={5}
              required
              className="w-full resize-y rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Explainer *
            </label>

            <textarea
              value={form.explainer}
              onChange={(event) =>
                updateField(
                  "explainer",
                  event.target.value
                )
              }
              placeholder="Who explained or narrated the movie?"
              rows={3}
              required
              className="w-full resize-y rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Translator *
            </label>

            <input
              type="text"
              value={form.translator}
              onChange={(event) =>
                updateField(
                  "translator",
                  event.target.value
                )
              }
              placeholder="Translator name"
              required
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="rounded-xl border border-white/10 bg-[#181818] p-6">
        <h2 className="mb-2 text-xl font-semibold">
          Genres
        </h2>

        <p className="mb-6 text-sm text-[#888]">
          Select at least one genre.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {genres.map((genre) => {
            const selected =
              form.genreIds.includes(genre.id);

            return (
              <label
                key={genre.id}
                className={`cursor-pointer rounded-lg border p-4 transition ${
                  selected
                    ? "border-[#00E5FF] bg-[#00E5FF]/10"
                    : "border-white/10 bg-[#101010] hover:border-white/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      toggleGenre(genre.id)
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm">
                    {genre.name}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* URLs */}
      <section className="rounded-xl border border-white/10 bg-[#181818] p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Movie Links
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Stream URL
            </label>

            <input
              type="url"
              value={form.streamUrl}
              onChange={(event) =>
                updateField(
                  "streamUrl",
                  event.target.value
                )
              }
              placeholder="https://example.com/stream"
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Download URL
            </label>

            <input
              type="url"
              value={form.downloadUrl}
              onChange={(event) =>
                updateField(
                  "downloadUrl",
                  event.target.value
                )
              }
              placeholder="https://example.com/download"
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/movies")
          }
          disabled={loading}
          className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#00E5FF] px-8 py-3 text-sm font-bold text-black transition hover:bg-[#00cfe8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create Movie"
            : "Update Movie"}
        </button>
      </div>
    </form>
  );
}