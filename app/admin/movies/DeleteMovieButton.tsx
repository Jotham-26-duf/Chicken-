"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteMovieButtonProps {
  movieId: string;
  movieTitle: string;
}

export default function DeleteMovieButton({
  movieId,
  movieTitle,
}: DeleteMovieButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movieTitle}"?`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/movies/${movieId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete movie.");
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-red-400 transition hover:text-red-300 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}