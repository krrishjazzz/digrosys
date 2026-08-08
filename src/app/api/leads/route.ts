import { NextResponse } from "next/server";
import {
  addLead,
  deleteLead,
  isAdminRequest,
  readLeads,
  updateLead,
  type LeadSource,
  type LeadStatus,
} from "@/lib/leads";
import { isValidEnquiry } from "@/lib/enquiry";

export const runtime = "nodejs";

/** List leads (admin) */
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") as LeadSource | "all" | null;
  const leads = await readLeads();
  const filtered =
    !source || source === "all"
      ? leads
      : leads.filter((l) => l.source === source);

  const counts = {
    all: leads.length,
    website: leads.filter((l) => l.source === "website").length,
    connect: leads.filter((l) => l.source === "connect").length,
    other: leads.filter((l) => l.source === "other").length,
    new: leads.filter((l) => l.status === "new").length,
  };

  return NextResponse.json({ ok: true, leads: filtered, counts });
}

/** Manual lead (admin) or ensure website leads can also POST here */
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!isValidEnquiry(body)) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const source = (body.source as LeadSource) || "other";
  const lead = await addLead({ ...body, source });
  return NextResponse.json({ ok: true, lead });
}

/** Update status */
export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    status?: LeadStatus;
    source?: LeadSource;
  };

  if (!body.id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const lead = await updateLead(body.id, {
    status: body.status,
    source: body.source,
  });

  if (!lead) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const ok = await deleteLead(body.id);
  return NextResponse.json({ ok });
}
