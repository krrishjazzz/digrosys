import { NextResponse } from "next/server";
import {
  CLOUDINARY_FOLDER,
  getCloudinary,
  isCloudinaryConfigured,
  toMediaAsset,
  type MediaAsset,
} from "@/lib/cloudinary";

export const runtime = "nodejs";
export const revalidate = 60;

/** Public list of portfolio media from Cloudinary folder */
export async function GET() {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ ok: true, items: [] as MediaAsset[], configured: false });
  }

  try {
    const cloudinary = getCloudinary();
    const folder = CLOUDINARY_FOLDER;

    const [images, videos] = await Promise.all([
      cloudinary.api.resources({
        type: "upload",
        resource_type: "image",
        prefix: folder,
        max_results: 100,
        context: true,
        tags: true,
      }),
      cloudinary.api.resources({
        type: "upload",
        resource_type: "video",
        prefix: folder,
        max_results: 50,
        context: true,
        tags: true,
      }),
    ]);

    const items = [
      ...(images.resources || []).map(toMediaAsset),
      ...(videos.resources || []).map(toMediaAsset),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ ok: true, items, configured: true });
  } catch (err) {
    console.error("[media]", err);
    return NextResponse.json(
      {
        ok: false,
        items: [],
        configured: true,
        error: err instanceof Error ? err.message : "Failed to list media",
      },
      { status: 500 }
    );
  }
}

/** Delete a Cloudinary asset (admin session cookie or password header) */
export async function DELETE(request: Request) {
  const password = request.headers.get("x-admin-password");
  const cookie = request.headers.get("cookie") || "";
  const hasSession = cookie.includes("digrosys_admin=1");
  const authed =
    hasSession ||
    Boolean(password && password === process.env.ADMIN_PASSWORD);

  if (!authed) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 500 });
  }

  const body = (await request.json()) as {
    publicId: string;
    resourceType?: "image" | "video";
  };

  if (!body.publicId) {
    return NextResponse.json({ ok: false, error: "Missing publicId" }, { status: 400 });
  }

  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(body.publicId, {
    resource_type: body.resourceType || "image",
  });

  return NextResponse.json({ ok: true });
}
