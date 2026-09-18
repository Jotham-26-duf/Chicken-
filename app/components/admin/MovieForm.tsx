
"use client";

import { useState } from "react";

interface Genre {
  id: string;
  name: string;
}

interface MovieDownload {
  id?: string;
  part: string;
  url: string;
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
  downloads?: MovieDownload[];
}

interface MovieFormProps {
  mode: "create" | "edit";
  genres: Genre[];
  initialData?: Partial<MovieFormData>;
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
  downloads: [],
};

export default function MovieForm({
  mode,
  genres,
  initialData,
}: MovieFormProps) {
  const [form, setForm] = useState<MovieFormData>({
    ...emptyForm,
    ...initialData,
    genreIds: initialData?.genreIds ?? [],
    downloads: initialData?.downloads ?? [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof MovieFormData,
    value: string | string[]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addDownloadPart() {
    setForm((current) => {
      const downloads = current.downloads ?? [];

      const nextPartNumber = downloads.length + 1;

      const nextPart = String.fromCharCode(
        64 + nextPartNumber
      );

      return {
        ...current,
        downloads: [
          ...downloads,
          {
            part: `Part ${nextPart}`,
            url: "",
          },
        ],
      };
    });
  }

  function updateDownloadPart(
    index: number,
    field: keyof MovieDownload,
    value: string
  ) {
    setForm((current) => {
      const downloads = [...(current.downloads ?? [])];

      downloads[index] = {
        ...downloads[index],
        [field]: value,
      };

      return {
        ...current,
        downloads,
      };
    });
  }

  function removeDownloadPart(index: number) {
    setForm((current) => ({
      ...current,
      downloads: (current.downloads ?? []).filter(
        (_, downloadIndex) => downloadIndex !== index
      ),
    }));
  }

  function toggleGenre(genreId: string) {
    setForm((current) => {
      const exists = current.genreIds.includes(genreId);

      return {
        ...current,
        genreIds: exists
          ? current.genreIds.filter((id) => id !== genreId)
          : [...current.genreIds, genreId],
      };
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const cleanedDownloads = (form.downloads ?? [])
      .map((download) => ({
        part: download.part.trim(),
        url: download.url.trim(),
      }))
      .filter((download) => download.part && download.url);

    const payload = {
      ...form,
      streamUrl: form.streamUrl.trim(),
      downloadUrl: form.downloadUrl.trim(),
      downloads: cleanedDownloads,
    };

    try {
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

      const responseText = await response.text();

      let data: {
        movie?: MovieFormData;
        error?: string;
      } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${
              mode === "create" ? "create" : "update"
            } movie (${response.status}).`
        );
      }

      setSuccess(
        mode === "create"
          ? "Movie created successfully."
          : "Movie updated successfully."
      );

      if (mode === "create") {
        setForm(emptyForm);
      }
    } catch (submitError) {
      console.error("Movie form error:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
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
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* BASIC INFORMATION */}

      <section className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-6">
        <h2 className="text-lg font-bold text-white">
          Basic Information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
              Movie Title
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              required
              className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              placeholder="Movie title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
              Slug
            </label>

            <input
              type="text"
              value={form.slug}
              onChange={(event) =>
                updateField("slug", event.target.value)
              }
              required
              className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              placeholder="movie-title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
              Year
            </label>

            <input
              type="text"
              value={form.year}
              onChange={(event) =>
                updateField("year", event.target.value)
              }
              required
              className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              placeholder="2026"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
              Rating
            </label>

            <input
              type="text"
              value={form.rating}
              onChange={(event) =>
                updateField("rating", event.target.value)
              }
              required
              className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              placeholder="8.5"
            />
          </div>
        </div>
      </section>

      {/* IMAGE */}

      <section className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-6">
        <h2 className="text-lg font-bold text-white">
          Image
        </h2>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
            Poster Image Name
          </label>

          <input
            type="text"
            value={
              form.image.startsWith("/images/movies/")
                ? form.image.replace(
                    "/images/movies/",
                    ""
                  )
                : form.image
            }
            onChange={(event) =>
              updateField(
                "image",
                `/images/movies/${event.target.value}`
              )
            }
            required
            className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
            placeholder="kung-fu-jungle.jpg"
          />

          <p className="mt-2 text-xs text-[#777777]">
            Put the image file inside public/images/movies/
          </p>
        </div>
      </section>

      {/* MOVIE DETAILS */}

      <section className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-6">
        <h2 className="text-lg font-bold text-white">
          Movie Details
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              placeholder="Movie description..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
              Explainer
            </label>

            <textarea
              value={form.explainer}
              onChange={(event) =>
                updateField(
                  "explainer",
                  event.target.value
                )
              }
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              placeholder="Movie explanation..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
                Translator
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
                required
                className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
                Language
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
                required
                className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
                Type
              </label>

              <input
                type="text"
                value={form.type}
                onChange={(event) =>
                  updateField(
                    "type",
                    event.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
                placeholder="Movie"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GENRES */}

      <section className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-6">
        <h2 className="text-lg font-bold text-white">
          Genres
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((genre) => {
            const selected = form.genreIds.includes(
              genre.id
            );

            return (
              <label
                key={genre.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  selected
                    ? "border-[#2979FF] bg-[#2979FF]/10"
                    : "border-white/10 bg-[#2A2A2A] hover:bg-[#353535]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() =>
                    toggleGenre(genre.id)
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm text-white">
                  {genre.name}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* MOVIE LINKS */}

      <section className="rounded-2xl border border-white/10 bg-[#1B1B1B] p-6">
        <div>
          <h2 className="text-lg font-bold text-white">
            Movie Links
          </h2>

          <p className="mt-1 text-sm text-[#AAAAAA]">
            Add the streaming link and one or more
            download parts.
          </p>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[#AAAAAA]">
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
            className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-white outline-none focus:border-[#2979FF]"
            placeholder="https://..."
          />
        </div>

        {/* DOWNLOAD PARTS */}

        <div className="mt-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-semibold text-white">
                Download Parts
              </h3>

              <p className="mt-1 text-xs text-[#AAAAAA]">
                Add Part A, Part B, Part C, etc.
              </p>
            </div>

            <button
              type="button"
              onClick={addDownloadPart}
              className="rounded-xl bg-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              + Add Download Part
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {(form.downloads ?? []).map(
              (download, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-[#2A2A2A] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-white">
                      Download Part {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        removeDownloadPart(index)
                      }
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-[#AAAAAA]">
                        Part Name
                      </label>

                      <input
                        type="text"
                        value={download.part}
                        onChange={(event) =>
                          updateDownloadPart(
                            index,
                            "part",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#1B1B1B] px-4 py-3 text-sm text-white outline-none focus:border-[#2979FF]"
                        placeholder="Part A"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-[#AAAAAA]">
                        MediaFire Download URL
                      </label>

                      <input
                        type="url"
                        value={download.url}
                        onChange={(event) =>
                          updateDownloadPart(
                            index,
                            "url",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#1B1B1B] px-4 py-3 text-sm text-white outline-none focus:border-[#2979FF]"
                        placeholder="https://www.mediafire.com/..."
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {(form.downloads ?? []).length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-white/10 px-5 py-8 text-center">
              <p className="text-sm text-[#AAAAAA]">
                No download parts added yet.
              </p>

              <button
                type="button"
                onClick={addDownloadPart}
                className="mt-3 text-sm font-semibold text-[#2979FF] hover:underline"
              >
                + Add Part A
              </button>
            </div>
          )}

          {/* OLD DOWNLOAD URL */}

          <div className="mt-6 border-t border-white/10 pt-5">
            <label className="mb-2 block text-xs font-medium text-[#AAAAAA]">
              Legacy Download URL
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
              className="w-full rounded-xl border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white outline-none focus:border-[#2979FF]"
              placeholder="Used only for older movies"
            />

            <p className="mt-2 text-xs text-[#777777]">
              You normally don't need this for new movies.
              Use Download Parts above instead.
            </p>
          </div>
        </div>
      </section>

      {/* SUBMIT */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#2979FF] px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Movie"
            : "Update Movie"}
        </button>
      </div>
    </form>
  );
}
