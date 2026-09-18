"use client";

import { useState } from "react";

interface FeaturedMovieButtonProps {
  movieId: string;
  isFeatured: boolean;
}

export default function FeaturedMovieButton({
  movieId,
  isFeatured: initialIsFeatured,
}: FeaturedMovieButtonProps) {
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
  const [loading, setLoading] = useState(false);

  async function toggleFeatured() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/movies/${movieId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFeatured: !isFeatured,
        }),
      });

      const responseText = await response.text();

      let data: {
        id?: string;
        isFeatured?: boolean;
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
          data.error || `Failed to update featured status (${response.status}).`
        );
      }

      if (typeof data.isFeatured !== "boolean") {
        throw new Error(
          "The server did not return the updated featured status."
        );
      }

      setIsFeatured(data.isFeatured);
    } catch (error) {
      console.error("Featured movie update error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update featured status."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFeatured}
      disabled={loading}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
        isFeatured
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {loading ? "Saving..." : isFeatured ? "ON" : "OFF"}
    </button>
  );
}