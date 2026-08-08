"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Film, ImageIcon, LogOut, Trash2, Upload } from "lucide-react";
import type { MediaAsset } from "@/lib/cloudinary";

export default function AdminMediaPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media", { cache: "no-store" });
      const json = (await res.json()) as { items?: MediaAsset[] };
      setItems(json.items || []);
    } catch {
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Probe session cookie via sign endpoint with empty params? Better: try login state from sessionStorage + cookie
    const saved = sessionStorage.getItem("digrosys-admin");
    if (saved === "1") {
      setAuthed(true);
      void loadMedia();
    }
  }, [loadMedia]);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Login failed");
      sessionStorage.setItem("digrosys-admin", "1");
      setAuthed(true);
      await loadMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const onLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    sessionStorage.removeItem("digrosys-admin");
    setAuthed(false);
    setPassword("");
  };

  const onDelete = async (item: MediaAsset) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res = await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicId: item.publicId,
        resourceType: item.type,
      }),
    });
    if (!res.ok) {
      alert("Delete failed — re-login and try again");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  if (!authed) {
    return (
      <div className="min-h-[100dvh] bg-[#F7F7F5] flex items-center justify-center px-6">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm rounded-[20px] border border-black/8 bg-white p-8 shadow-sm"
        >
          <p className="font-heading text-xs tracking-[0.28em] text-[#B08A1B] mb-3">
            DIGROSYS
          </p>
          <h1 className="font-heading text-2xl text-[#111] mb-2">Media Admin</h1>
          <p className="text-sm text-[#111]/55 mb-6">
            Upload your commercial photos &amp; videos to Cloudinary. They appear on the website Portfolio.
          </p>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-[#111]/40 mb-2">
            Admin password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 h-12 w-full rounded-xl border border-black/10 px-4 text-[#111] outline-none focus:border-[#B08A1B]"
            required
            autoComplete="current-password"
          />
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-[#111] text-white text-[12px] uppercase tracking-[0.14em]"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F7F7F5] text-[#111]">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#B08A1B]">
              DIGROSYS Admin
            </p>
            <h1 className="font-heading text-xl">Portfolio Media</h1>
          </div>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{
              folder: "digrosys/portfolio",
              multiple: true,
              maxFiles: 20,
              sources: ["local", "url", "camera"],
              resourceType: "auto",
              clientAllowedFormats: [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "gif",
                "mp4",
                "mov",
                "webm",
              ],
              maxFileSize: 100_000_000,
            }}
            onSuccess={() => {
              void loadMedia();
            }}
            onQueuesEnd={() => {
              void loadMedia();
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#B08A1B] px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-[#111]"
              >
                <Upload size={16} />
                Upload photos / videos
              </button>
            )}
          </CldUploadWidget>

          <button
            type="button"
            onClick={() => void loadMedia()}
            className="inline-flex min-h-12 items-center rounded-full border border-black/10 bg-white px-5 text-[12px] uppercase tracking-[0.14em]"
          >
            Refresh
          </button>

          <p className="basis-full text-sm text-[#111]/50 sm:basis-auto">
            Files upload to Cloudinary and show on the homepage Portfolio automatically.
          </p>
        </div>

        {loading && <p className="text-sm text-[#111]/45 mb-4">Loading…</p>}

        {!loading && items.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-black/15 bg-white p-12 text-center">
            <Upload className="mx-auto mb-4 text-[#B08A1B]" size={28} />
            <p className="font-heading text-xl mb-2">No media yet</p>
            <p className="text-sm text-[#111]/55">
              Click Upload and select photos or videos from your shoots.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[20px] border border-black/8 bg-white"
            >
              <div className="relative aspect-[4/5] bg-black/5">
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    controls
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
                  {item.type === "video" ? (
                    <Film size={12} />
                  ) : (
                    <ImageIcon size={12} />
                  )}
                  {item.type}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-heading text-[15px]">{item.title}</p>
                  <p className="mt-1 text-xs text-[#111]/45">{item.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void onDelete(item)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-red-600 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
