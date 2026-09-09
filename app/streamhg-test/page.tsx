import StreamHGUpload from "@/app/components/admin/StreamHGUpload";

export default function StreamHGTestPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">
            StreamHG Integration
          </h1>

          <p className="mt-2 text-zinc-600">
            Test uploading a movie video to StreamHG.
          </p>
        </div>

        <StreamHGUpload />
      </div>
    </main>
  );
}