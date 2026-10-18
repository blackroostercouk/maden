import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { formatEnquiry, type Enquiry } from "@/lib/enquiry";

/**
 * Where enquiries go.
 * With RESEND_API_KEY, ENQUIRY_TO_EMAIL and ENQUIRY_FROM_EMAIL set, each
 * enquiry is emailed to the studio (reply goes straight to the sender).
 * Without them, development appends to .data/enquiries.ndjson and
 * production refuses, so a missing setting never loses an enquiry silently.
 */
export type EnquiryRecord = Enquiry & { receivedAt: string };

const DATA_FILE = path.join(process.cwd(), ".data", "enquiries.ndjson");
const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 10_000;

export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super(
      "Enquiry delivery is not configured: set RESEND_API_KEY, ENQUIRY_TO_EMAIL and ENQUIRY_FROM_EMAIL.",
    );
  }
}

function emailSettings() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  return apiKey && to && from ? { apiKey, to, from } : null;
}

async function sendEmail(
  record: EnquiryRecord,
  settings: NonNullable<ReturnType<typeof emailSettings>>,
) {
  const subject = `New app enquiry from ${record.name}${record.brand ? ` (${record.brand})` : ""}`;
  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: settings.from,
      to: settings.to.split(",").map((address) => address.trim()),
      reply_to: record.email,
      subject,
      text: `${formatEnquiry(record)}\n\nReceived: ${record.receivedAt}`,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

async function appendToFile(record: EnquiryRecord) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await appendFile(DATA_FILE, `${JSON.stringify(record)}\n`, "utf8");
}

export async function deliverEnquiry(record: EnquiryRecord) {
  const settings = emailSettings();
  if (settings) return sendEmail(record, settings);
  if (process.env.NODE_ENV !== "production") return appendToFile(record);
  throw new DeliveryNotConfiguredError();
}
