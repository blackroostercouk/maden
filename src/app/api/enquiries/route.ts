import { HONEYPOT_FIELD, sanitiseEnquiry, validateEnquiry } from "@/lib/enquiry";
import { deliverEnquiry, DeliveryNotConfiguredError } from "@/lib/server/deliverEnquiry";
import { clientAddress, createRateLimit } from "@/lib/server/rateLimit";
import { isSameOrigin } from "@/lib/server/request";

/**
 * Receives enquiries from the form, checks them with the same rules as the
 * form and hands them to deliverEnquiry (email in production).
 */
const MAX_BODY_BYTES = 16 * 1024;
const allow = createRateLimit({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Cross-site requests are not accepted." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "The request body must be JSON." }, { status: 415 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return Response.json({ error: "The enquiry is too large." }, { status: 413 });
  }
  if (!allow(clientAddress(request))) {
    return Response.json(
      { error: "Too many enquiries. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let raw: unknown;
  try {
    const body = await request.text();
    if (body.length > MAX_BODY_BYTES) {
      return Response.json({ error: "The enquiry is too large." }, { status: 413 });
    }
    raw = JSON.parse(body);
  } catch {
    return Response.json({ error: "The request body must be JSON." }, { status: 400 });
  }

  // Bots fill the hidden field; answer as if it worked and drop it
  const trap = (raw as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim()) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const enquiry = sanitiseEnquiry(raw);
  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  try {
    await deliverEnquiry({ ...enquiry, receivedAt: new Date().toISOString() });
  } catch (error) {
    console.error(
      error instanceof DeliveryNotConfiguredError ? error.message : "Could not deliver enquiry",
      error,
    );
    return Response.json({ error: "The enquiry could not be sent." }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
