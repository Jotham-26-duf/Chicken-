"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  movieId: string;
}

export default function FavoriteButton({
  movieId,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      setIsFavorite(false);
      setLoading(false);
      return;
    }

    async function checkFavorite() {
      try {
        const response = await fetch("/api/favorites");

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const favorites = await response.json();

        const exists = favorites.some(
          (favorite: { movieId: string }) =>
            favorite.movieId === movieId
        );

        setIsFavorite(exists);
      } catch (error) {
        console.error("Failed to check favorite:", error);
      } finally {
        setLoading(false);
      }
    }

    checkFavorite();
  }, [movieId, session, status]);

  async function toggleFavorite() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Favorite error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <button
        type="button"
        disabled
        className="rounded-xl bg-[#2A2A2A] px-6 py-3 font-semibold text-gray-400"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`rounded-xl px-6 py-3 font-semibold transition ${
        isFavorite
          ? "bg-[#E040FB] text-white hover:brightness-110"
          : "bg-[#2A2A2A] text-[#FFFFFF] hover:bg-[#353535]"
      }`}
    >
      {isFavorite ? "♥ In Favorites" : "♡ Add to Favorites"}
    </button>
  );
}