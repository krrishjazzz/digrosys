import { promises as fs } from "fs";
import path from "path";
import type { EnquiryPayload } from "@/lib/enquiry";

export type LeadSource = "website" | "connect" | "other";
export type LeadStatus = "new" | "contacted" | "closed";

export type Lead = {
  id: string;
  createdAt: string;
  source: LeadSource;
  status: LeadStatus;
  name: string;
  company: string;
  phone: string;
  email: string;
  budget: string;
  services: string;
  details: string;
};

const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");

async function ensureFile() {
  try {
    await fs.access(LEADS_PATH);
  } catch {
    await fs.mkdir(path.dirname(LEADS_PATH), { recursive: true });
    await fs.writeFile(LEADS_PATH, "[]", "utf8");
  }
}

export async function readLeads(): Promise<Lead[]> {
  await ensureFile();
  const raw = await fs.readFile(LEADS_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeLeads(leads: Lead[]) {
  await ensureFile();
  await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2), "utf8");
}

export async function addLead(
  data: EnquiryPayload & { source?: LeadSource }
): Promise<Lead> {
  const leads = await readLeads();
  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    source: data.source || "website",
    status: "new",
    name: data.name,
    company: data.company,
    phone: data.phone,
    email: data.email,
    budget: data.budget,
    services: data.services,
    details: data.details,
  };
  leads.unshift(lead);
  await writeLeads(leads);
  return lead;
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<Lead, "status" | "source">>
): Promise<Lead | null> {
  const leads = await readLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...patch };
  await writeLeads(leads);
  return leads[idx];
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await readLeads();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false;
  await writeLeads(next);
  return true;
}

export function isAdminRequest(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const password = request.headers.get("x-admin-password");
  return (
    cookie.includes("digrosys_admin=1") ||
    Boolean(password && password === process.env.ADMIN_PASSWORD)
  );
}
