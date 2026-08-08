import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER || "digrosys/portfolio";

export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

export function getCloudinary() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Check .env.local");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export type MediaAsset = {
  id: string;
  publicId: string;
  type: "image" | "video";
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  title: string;
  category: string;
};

export function toMediaAsset(resource: {
  public_id: string;
  resource_type?: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  created_at?: string;
  context?: { custom?: Record<string, string> };
  tags?: string[];
}): MediaAsset {
  const custom = resource.context?.custom || {};
  const type = resource.resource_type === "video" ? "video" : "image";
  const filename = resource.public_id.split("/").pop() || resource.public_id;

  return {
    id: resource.public_id,
    publicId: resource.public_id,
    type,
    url: resource.secure_url,
    width: resource.width || 0,
    height: resource.height || 0,
    format: resource.format || "",
    bytes: resource.bytes || 0,
    createdAt: resource.created_at || "",
    title: custom.title || custom.caption || filename.replace(/[-_]/g, " "),
    category: custom.category || resource.tags?.[0] || "Work",
  };
}
