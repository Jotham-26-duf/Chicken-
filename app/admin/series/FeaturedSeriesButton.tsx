"use client";

import { useState } from "react";

interface FeaturedSeriesButtonProps {
seriesId: string;
isFeatured: boolean;
}

export default function FeaturedSeriesButton({
seriesId,
isFeatured,
}: FeaturedSeriesButtonProps) {
const [featured, setFeatured] = useState(isFeatured);
const [loading, setLoading] = useState(false);

async function toggleFeatured() {
setLoading(true);


try {
  const response = await fetch(`/api/admin/series/${seriesId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isFeatured: !featured,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update featured status");
  }

  setFeatured(!featured);
} catch (error) {
  console.error("Featured series update failed:", error);
  alert("Failed to update featured status.");
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
        featured
          ? "bg-[#E040FB] text-white hover:brightness-110"
          : "bg-[#2A2A2A] text-[#AAAAAA] hover:bg-[#333333] hover:text-white"
      } disabled:cursor-not-allowed disabled:opacity-60`}
>
{loading ? "Updating..." : featured ? "Featured" : "Set Featured"} </button>
);
}
