import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WatchEpisodePage({
  params,
}: PageProps) {
  const { id } = await params;

  const episode = await prisma.episode.findUnique({
    where: {
      id,
    },
    include: {
      season: {
        include: {
          series: true,
        },
      },
    },
  });

  if (!episode) {
    notFound();
  }

  if (!episode.streamUrl) {
    return (
      <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/series/${episode.season.series.slug}`}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Series
          </Link>

          <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900 p-10 text-center">
            <h1 className="text-2xl font-bold">
              Video unavailable
            </h1>

            <p className="mt-3 text-gray-400">
              This episode does not have a streaming URL yet.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link
          href={`/series/${episode.season.series.slug}`}
          className="text-gray-400 hover:text-white"
        >
          ← Back to {episode.season.series.title}
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Episode {episode.number}: {episode.title}
          </h1>

          <p className="mt-2 text-gray-400">
            Season {episode.season.number}
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl bg-gray-900">
          <video
            controls
            playsInline
            className="aspect-video w-full"
            src={episode.streamUrl}
          >
            Your browser does not support video playback.
          </video>
        </div>

        {episode.description && (
          <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-bold">
              About this episode
            </h2>

            <p className="mt-3 leading-7 text-gray-400">
              {episode.description}
            </p>
          </div>
        )}

        {episode.downloadUrl && (
          <div className="mt-6">
            <a
              href={episode.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold hover:bg-green-700"
            >
              ↓ Download Episode
            </a>
          </div>
        )}
      </div>
    </main>
  );
}