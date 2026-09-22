import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const client = getResend();
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  if (!client) {
    console.log("[Email mock]", options.to, options.subject);
    return true;
  }

  const { error } = await client.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    console.error("Email send error:", error);
    return false;
  }
  return true;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildDownloadEmailHtml(params: {
  storeName: string;
  orderId: string;
  downloads: { fileName: string; url: string }[];
  expiresAt: Date;
}): string {
  const { storeName, orderId, downloads, expiresAt } = params;
  const links = downloads
    .map(
      (d) =>
        `<li style="margin:8px 0"><a href="${escapeHtml(d.url)}" style="color:#9E00FF">${escapeHtml(d.fileName)}</a></li>`
    )
    .join("");

  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h1 style="font-size:24px;font-weight:600">Your downloads are ready</h1>
      <p>Thank you for your purchase at <strong>${escapeHtml(storeName)}</strong>.</p>
      <p>Order ID: <code>${escapeHtml(orderId)}</code></p>
      <p>Click the links below to download your files. Links expire on <strong>${expiresAt.toLocaleString()}</strong>.</p>
      <ul>${links}</ul>
      <p style="color:#666;font-size:14px">If you have issues, reply to this email for support.</p>
    </div>
  `;
}
