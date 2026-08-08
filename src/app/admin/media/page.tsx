"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { Film, ImageIcon, LogOut, Trash2, Upload } from "lucide-react";
import type { MediaAsset } from "@/lib/cloudinary";
import {
  ADMIN_MEDIA_PREVIEW_COUNT,
  isPortfolioCategory,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_FILTERS,
  type PortfolioCategory,
} from "@/lib/portfolio-categories";

export default function AdminMediaPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadCategory, setUploadCategory] =
    useState<PortfolioCategory>("Work");
  const [filter, setFilter] = useState<(typeof PORTFOLIO_FILTERS)[number]>("All");
  const [showAll, setShowAll] = useState(false);

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

  const onCategoryChange = async (item: MediaAsset, category: string) => {
    const prev = item.category;
    setItems((list) =>
      list.map((i) => (i.id === item.id ? { ...i, category } : i))
    );

    const res = await fetch("/api/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicId: item.publicId,
        resourceType: item.type,
        category,
      }),
    });

    if (!res.ok) {
      setItems((list) =>
        list.map((i) => (i.id === item.id ? { ...i, category: prev } : i))
      );
      alert("Could not update category — re-login and try again");
    }
  };

  const filtered = useMemo(
    () =>
      filter === "All" ? items : items.filter((i) => i.category === filter),
    [filter, items]
  );

  const visible = showAll
    ? filtered
    : filtered.slice(0, ADMIN_MEDIA_PREVIEW_COUNT);

  const hasMore = filtered.length > ADMIN_MEDIA_PREVIEW_COUNT;

  const setFilterAndCollapse = (next: (typeof PORTFOLIO_FILTERS)[number]) => {
    setFilter(next);
    setShowAll(false);
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
          <div className="flex items-center gap-2">
            <Link
              href="/admin/leads"
              className="rounded-full border border-black/10 px-4 py-2 text-sm"
            >
              Leads
            </Link>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8 rounded-[20px] border border-black/8 bg-white p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#111]/40 mb-3">
            Upload with category
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="block min-w-[180px] flex-1">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-[#111]/45">
                Category
              </span>
              <select
                value={uploadCategory}
                onChange={(e) =>
                  setUploadCategory(e.target.value as PortfolioCategory)
                }
                className="h-12 w-full rounded-xl border border-black/10 bg-[#F7F7F5] px-4 text-sm outline-none focus:border-[#B08A1B]"
              >
                {PORTFOLIO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <CldUploadWidget
              key={uploadCategory}
              signatureEndpoint="/api/cloudinary/sign"
              options={{
                folder: "digrosys/portfolio",
                multiple: true,
                maxFiles: 20,
                sources: ["local", "url", "camera"],
                resourceType: "auto",
                tags: [uploadCategory],
                context: `category=${uploadCategory}`,
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
                  Upload to {uploadCategory}
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
          </div>
          <p className="mt-3 text-sm text-[#111]/50">
            Pick a category first — new uploads are tagged and filterable on the site Portfolio.
          </p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PORTFOLIO_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterAndCollapse(f)}
              className={
                filter === f
                  ? "shrink-0 rounded-full bg-[#111] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white"
                  : "shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#111]/65"
              }
            >
              {f}
              {f === "All"
                ? ` (${items.length})`
                : ` (${items.filter((i) => i.category === f).length})`}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-[#111]/45 mb-4">Loading…</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-black/15 bg-white p-12 text-center">
            <Upload className="mx-auto mb-4 text-[#B08A1B]" size={28} />
            <p className="font-heading text-xl mb-2">
              {items.length === 0 ? "No media yet" : "Nothing in this category"}
            </p>
            <p className="text-sm text-[#111]/55">
              {items.length === 0
                ? "Choose a category, then upload photos or videos."
                : "Try another filter or upload into this category."}
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
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
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-[15px]">{item.title}</p>
                  <label className="mt-2 block">
                    <span className="sr-only">Category</span>
                    <select
                      value={
                        isPortfolioCategory(item.category)
                          ? item.category
                          : "Work"
                      }
                      onChange={(e) =>
                        void onCategoryChange(item, e.target.value)
                      }
                      className="mt-1 h-9 w-full max-w-[180px] rounded-lg border border-black/10 bg-[#F7F7F5] px-2 text-xs outline-none focus:border-[#B08A1B]"
                    >
                      {!isPortfolioCategory(item.category) && (
                        <option value={item.category}>{item.category}</option>
                      )}
                      {PORTFOLIO_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </label>
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

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex min-h-12 items-center rounded-full border border-black/15 bg-white px-8 text-[12px] uppercase tracking-[0.14em]"
            >
              {showAll
                ? "Show less"
                : `Show all (${filtered.length})`}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
