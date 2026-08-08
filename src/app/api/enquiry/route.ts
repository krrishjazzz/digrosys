import { NextResponse } from "next/server";
import { contact } from "@/lib/contact";
import {
  buildEnquiryEmailHtml,
  buildWhatsAppEnquiryUrl,
  isValidEnquiry,
  type EnquiryPayload,
} from "@/lib/enquiry";
import { addLead } from "@/lib/leads";

export const runtime = "nodejs";

/**
 * Enquiry intake — fans out to:
 * 0) Lead dashboard store (data/leads.json)
 * 1) Email (Resend if configured, else FormSubmit → digrosys@gmail.com)
 * 2) Google Sheet (GOOGLE_SHEETS_WEBHOOK_URL)
 * 3) WhatsApp deep-link (always returned for client open)
 */
export async function POST(request: Request) {
  let body: Partial<EnquiryPayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEnquiry(body)) {
    return NextResponse.json(
      { ok: false, error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  const data = body;
  const timestamp = new Date().toISOString();
  const channels = {
    lead: false,
    email: false,
    sheet: false,
  };
  const errors: string[] = [];

  // —— 0. Save to lead tracker (always) ——
  try {
    await addLead({
      ...data,
      source: data.source || "website",
    });
    channels.lead = true;
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "Lead save failed");
  }

  // —— 1. Email ——
  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "DIGROSYS Website <onboarding@resend.dev>",
          to: [process.env.ENQUIRY_TO_EMAIL || contact.email],
          reply_to: data.email,
          subject: `New enquiry — ${data.name} · ${data.company}`,
          html: buildEnquiryEmailHtml(data),
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend failed: ${errText}`);
      }
      channels.email = true;
    } else if (process.env.WEB3FORMS_ACCESS_KEY) {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: `New enquiry — ${data.name} · ${data.company}`,
          from_name: data.name,
          name: data.name,
          company: data.company,
          phone: data.phone,
          email: data.email,
          budget: data.budget,
          services: data.services,
          message: data.details,
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!json.success) throw new Error("Web3Forms failed");
      channels.email = true;
    } else {
      // Zero-config fallback → digrosys@gmail.com (confirm once via FormSubmit email)
      const res = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          budget: data.budget,
          services: data.services,
          message: data.details,
          _subject: `New DIGROSYS enquiry — ${data.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error(`FormSubmit status ${res.status}`);
      channels.email = true;
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "Email send failed");
  }

  // —— 2. Google Sheet (Apps Script web app) ——
  // Note: use text/plain so Google's redirect doesn't drop the POST body
  const sheetUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (sheetUrl) {
    try {
      const res = await fetch(sheetUrl, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          timestamp,
          ...data,
          source: data.source || "website",
        }),
      });
      // Apps Script often returns 200 even when writing succeeds after redirect
      if (!res.ok && res.status !== 302) {
        throw new Error(`Sheet webhook status ${res.status}`);
      }
      channels.sheet = true;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Sheet write failed");
    }
  }

  // —— 3. WhatsApp (always) ——
  const whatsappUrl = buildWhatsAppEnquiryUrl(data, contact.phoneRaw.replace("+", ""));

  // Lead save alone is enough for success; WA always available
  if (!channels.lead && !channels.email && !channels.sheet) {
    return NextResponse.json(
      {
        ok: true,
        partial: true,
        channels,
        whatsappUrl,
        warning:
          "Lead store unavailable — open WhatsApp to send this enquiry directly.",
        errors,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    ok: true,
    channels,
    whatsappUrl,
    errors: errors.length ? errors : undefined,
  });
}
