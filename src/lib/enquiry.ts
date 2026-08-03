export type EnquiryPayload = {
  name: string;
  company: string;
  phone: string;
  email: string;
  budget: string;
  services: string;
  details: string;
};

export function buildWhatsAppEnquiryUrl(
  data: EnquiryPayload,
  phone = "918910481382"
) {
  const text = [
    `Hi Abhishek — new enquiry from the DIGROSYS website.`,
    ``,
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Budget: ${data.budget}`,
    `Service: ${data.services}`,
    ``,
    `Details:`,
    data.details,
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Open WhatsApp during the user click (avoids popup blockers). */
export function openWhatsApp(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function buildEnquiryEmailHtml(data: EnquiryPayload) {
  return `
    <h2>New DIGROSYS enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Company:</strong> ${escapeHtml(data.company)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Budget:</strong> ${escapeHtml(data.budget)}</p>
    <p><strong>Service:</strong> ${escapeHtml(data.services)}</p>
    <p><strong>Details:</strong></p>
    <p>${escapeHtml(data.details).replace(/\n/g, "<br/>")}</p>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isValidEnquiry(
  data: Partial<EnquiryPayload>
): data is EnquiryPayload {
  return Boolean(
    data.name?.trim() &&
      data.company?.trim() &&
      data.phone?.trim() &&
      data.email?.trim() &&
      data.budget?.trim() &&
      data.services?.trim() &&
      data.details?.trim()
  );
}

/** Browser → FormSubmit (more reliable than server on localhost) */
export async function sendEnquiryEmailClient(data: EnquiryPayload) {
  const res = await fetch("https://formsubmit.co/ajax/digrosys@gmail.com", {
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
      _replyto: data.email,
    }),
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };

  if (!res.ok) {
    throw new Error(json.message || `Email failed (${res.status})`);
  }

  // FormSubmit returns { success: "true" } or similar after activation
  return json;
}

/** Browser → Google Apps Script webhook */
export async function sendEnquirySheetClient(
  data: EnquiryPayload,
  webhookUrl: string
) {
  // no-cors: Apps Script often blocks reading the response, but still appends the row
  await fetch(webhookUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      ...data,
      source: "digrosys.com/contact",
    }),
  });
}
