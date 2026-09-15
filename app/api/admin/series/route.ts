import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return redirect("/");
  }

  let series;

  try {
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
    const year = String(formData.get("year") ?? "").trim();
    const rating = String(formData.get("rating") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const language = String(formData.get("language") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (
      !title ||
      !slug ||
      !year ||
      !rating ||
      !image ||
      !language ||
      !description
    ) {
      return new Response("All required fields must be filled.", {
        status: 400,
      });
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return new Response(
        "Slug must contain only lowercase letters, numbers, and hyphens.",
        {
          status: 400,
        }
      );
    }

    if (!/^\d{4}$/.test(year)) {
      return new Response("Year must contain exactly 4 digits.", {
        status: 400,
      });
    }

    const existingSeries = await prisma.series.findUnique({
      where: {
        slug,
      },
    });

    if (existingSeries) {
      return new Response("A series with this slug already exists.", {
        status: 409,
      });
    }

    series = await prisma.series.create({
      data: {
        title,
        slug,
        year,
        rating,
        image,
        language,
        description,
      },
    });
  } catch (error) {
    console.error("Failed to create series:", error);

    return new Response("Failed to create series.", {
      status: 500,
    });
  }

  redirect(`/admin/series/${series.id}`);
}