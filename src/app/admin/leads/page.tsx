"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  LogOut,
  Plus,
  Trash2,
  Globe,
  Link2,
  MoreHorizontal,
} from "lucide-react";
import type { Lead, LeadSource, LeadStatus } from "@/lib/leads";
import { cn } from "@/lib/utils";

type Tab = "website" | "connect" | "other" | "all";

const tabs: { id: Tab; label: string; icon: typeof Globe }[] = [
  { id: "website", label: "Website enquiries", icon: Globe },
  { id: "connect", label: "Connect card", icon: Link2 },
  { id: "other", label: "Other leads", icon: MoreHorizontal },
  { id: "all", label: "All", icon: Inbox },
];

const FIELD = "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#B08A1B]";
const LABEL = "mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-[#111]/45";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]",
        status === "new" && "bg-[#B08A1B]/15 text-[#8a6c14]",
        status === "contacted" && "bg-blue-50 text-blue-700",
        status === "closed" && "bg-black/5 text-[#111]/50"
      )}
    >
      {status}
    </span>
  );
}

export default function AdminLeadsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("website");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    website: 0,
    connect: 0,
    other: 0,
    new: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async (source: Tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?source=${source}`, { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const json = await res.json();
      setLeads(json.leads || []);
      if (json.counts) setCounts(json.counts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("digrosys-admin") === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) void load(tab);
  }, [authed, tab, load]);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Invalid password");
      return;
    }
    sessionStorage.setItem("digrosys-admin", "1");
    setAuthed(true);
  };

  const onLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    sessionStorage.removeItem("digrosys-admin");
    setAuthed(false);
  };

  const setStatus = async (id: string, status: LeadStatus) => {
    const res = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) void load(tab);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch("/api/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) void load(tab);
  };

  const onAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name") || "").trim(),
        company: String(fd.get("company") || "").trim() || "—",
        phone: String(fd.get("phone") || "").trim() || "—",
        email: String(fd.get("email") || "").trim() || "—",
        budget: String(fd.get("budget") || "").trim() || "—",
        services: String(fd.get("services") || "").trim() || "—",
        details: String(fd.get("details") || "").trim() || "—",
        source: (fd.get("source") as LeadSource) || "other",
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      e.currentTarget.reset();
      void load(tab);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-[100dvh] bg-[#F7F7F5] flex items-center justify-center px-6">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm rounded-[20px] border border-black/8 bg-white p-8"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#B08A1B] mb-3">
            DIGROSYS
          </p>
          <h1 className="font-heading text-2xl mb-2">Lead Tracker</h1>
          <p className="text-sm text-[#111]/55 mb-6">
            Website enquiries and other leads — password protected.
          </p>
          <label className={LABEL}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(FIELD, "mb-4")}
            required
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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#B08A1B]">
              DIGROSYS Admin
            </p>
            <h1 className="font-heading text-xl">Lead Tracker</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/media"
              className="rounded-full border border-black/10 px-4 py-2 text-sm"
            >
              Media
            </Link>
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#B08A1B] px-4 py-2 text-sm text-[#111]"
            >
              <Plus size={14} />
              Add lead
            </button>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                tab === id
                  ? "border-[#111] bg-[#111] text-white"
                  : "border-black/10 bg-white text-[#111]/70"
              )}
            >
              <Icon size={14} />
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px]",
                  tab === id ? "bg-white/20" : "bg-black/5"
                )}
              >
                {counts[id]}
              </span>
            </button>
          ))}
        </div>

        {counts.new > 0 && (
          <p className="mb-4 text-sm text-[#B08A1B]">
            {counts.new} new lead{counts.new === 1 ? "" : "s"} waiting
          </p>
        )}

        {showAdd && (
          <form
            onSubmit={onAdd}
            className="mb-6 grid gap-4 rounded-[20px] border border-black/8 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <p className="sm:col-span-2 lg:col-span-3 font-heading text-lg">
              Add lead manually
            </p>

            <div>
              <label className={LABEL}>Name *</label>
              <input name="name" required className={FIELD} placeholder="Full name" />
            </div>
            <div>
              <label className={LABEL}>Company</label>
              <input name="company" className={FIELD} placeholder="Brand / company" />
            </div>
            <div>
              <label className={LABEL}>Phone</label>
              <input name="phone" className={FIELD} placeholder="+91…" />
            </div>
            <div>
              <label className={LABEL}>Email</label>
              <input name="email" type="email" className={FIELD} placeholder="name@email.com" />
            </div>
            <div>
              <label className={LABEL}>Budget</label>
              <select name="budget" className={FIELD} defaultValue="">
                <option value="">Select budget</option>
                <option value="Under ₹2L">Under ₹2L</option>
                <option value="₹2L – ₹5L">₹2L – ₹5L</option>
                <option value="₹5L – ₹15L">₹5L – ₹15L</option>
                <option value="₹15L+">₹15L+</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Services</label>
              <select name="services" className={FIELD} defaultValue="">
                <option value="">Select service</option>
                <option value="Commercial Photography">Commercial Photography</option>
                <option value="Commercial Films">Commercial Films</option>
                <option value="Performance Marketing">Performance Marketing</option>
                <option value="Brand Identity">Brand Identity</option>
                <option value="Website Development">Website Development</option>
                <option value="Full Growth System">Full Growth System</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Source</label>
              <select name="source" className={FIELD} defaultValue="other">
                <option value="other">Other</option>
                <option value="connect">Connect card</option>
                <option value="website">Website enquiry</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={LABEL}>Project details / notes</label>
              <textarea
                name="details"
                className="min-h-24 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#B08A1B]"
                placeholder="Goals, timeline, notes…"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-[#111] px-5 py-2.5 text-sm text-white"
              >
                Save lead
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-full border border-black/10 px-5 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading && <p className="text-sm text-[#111]/45">Loading…</p>}

        {!loading && leads.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-black/15 bg-white p-10 text-center">
            <Inbox className="mx-auto mb-3 text-[#B08A1B]" size={28} />
            <p className="font-heading text-lg mb-1">No leads here yet</p>
            <p className="text-sm text-[#111]/50">
              {tab === "website"
                ? "New website contact form submissions will show up here."
                : "Add a lead manually or switch tabs."}
            </p>
          </div>
        )}

        {/* Desktop table with full headers */}
        {!loading && leads.length > 0 && (
          <>
            <div className="hidden overflow-x-auto rounded-[20px] border border-black/8 bg-white lg:block">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-black/8 bg-[#F7F7F5]">
                  <tr>
                    {[
                      "Date",
                      "Name",
                      "Company",
                      "Phone",
                      "Email",
                      "Budget",
                      "Services",
                      "Details",
                      "Source",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#111]/45 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-black/5 align-top last:border-0">
                      <td className="px-3 py-3 whitespace-nowrap text-[#111]/60">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-3 py-3 font-medium">{lead.name || "—"}</td>
                      <td className="px-3 py-3">{lead.company || "—"}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <a href={`tel:${lead.phone}`} className="hover:text-[#B08A1B]">
                          {lead.phone || "—"}
                        </a>
                      </td>
                      <td className="px-3 py-3 max-w-[180px] break-all">
                        <a href={`mailto:${lead.email}`} className="hover:text-[#B08A1B]">
                          {lead.email || "—"}
                        </a>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">{lead.budget || "—"}</td>
                      <td className="px-3 py-3">{lead.services || "—"}</td>
                      <td className="px-3 py-3 max-w-[220px]">
                        <p className="line-clamp-3 text-[#111]/70 whitespace-pre-wrap">
                          {lead.details && lead.details !== "—" ? lead.details : "—"}
                        </p>
                      </td>
                      <td className="px-3 py-3 capitalize whitespace-nowrap">
                        {lead.source}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1.5 min-w-[110px]">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              void setStatus(lead.id, e.target.value as LeadStatus)
                            }
                            className="h-8 rounded-lg border border-black/10 px-2 text-xs"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^0/, "91")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center rounded-lg bg-[#25D366]/15 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-[#128C7E]"
                          >
                            WhatsApp
                          </a>
                          <button
                            type="button"
                            onClick={() => void remove(lead.id)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-red-600"
                          >
                            <Trash2 size={11} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — every field labeled */}
            <div className="space-y-3 lg:hidden">
              {leads.map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-[20px] border border-black/8 bg-white p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className={LABEL}>Name</p>
                      <h2 className="font-heading text-lg">{lead.name || "—"}</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge status={lead.status} />
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#111]/45 capitalize">
                          {lead.source}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void remove(lead.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    {[
                      ["Date", formatDate(lead.createdAt)],
                      ["Company", lead.company || "—"],
                      ["Phone", lead.phone || "—"],
                      ["Email", lead.email || "—"],
                      ["Budget", lead.budget || "—"],
                      ["Services", lead.services || "—"],
                      ["Source", lead.source],
                      ["Status", lead.status],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className={LABEL}>{label}</dt>
                        <dd className="break-words">{value}</dd>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <dt className={LABEL}>Project details</dt>
                      <dd className="rounded-xl bg-[#F7F7F5] p-3 text-[#111]/70 whitespace-pre-wrap">
                        {lead.details && lead.details !== "—" ? lead.details : "—"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <label className="sr-only" htmlFor={`status-${lead.id}`}>
                      Status
                    </label>
                    <select
                      id={`status-${lead.id}`}
                      value={lead.status}
                      onChange={(e) =>
                        void setStatus(lead.id, e.target.value as LeadStatus)
                      }
                      className="h-9 rounded-full border border-black/10 px-3 text-xs"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^0/, "91")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-full bg-[#25D366]/15 px-4 text-[11px] uppercase tracking-[0.12em] text-[#128C7E]"
                    >
                      WhatsApp
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
