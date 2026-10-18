import { clientAddress } from "./rateLimit";

/** Only accept posts made from this site's own pages. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

type Guarded = { response: Response } | { body: unknown };

/**
 * The checks every JSON POST endpoint needs, in order: same site, JSON, small,
 * not too frequent. Returns either the error response to send or the parsed body.
 */
export async function guardJsonPost(
  request: Request,
  { allow, maxBytes }: { allow: (key: string) => boolean; maxBytes: number },
): Promise<Guarded> {
  const fail = (error: string, status: number, headers?: HeadersInit) => ({
    response: Response.json({ error }, { status, headers }),
  });

  if (!isSameOrigin(request)) return fail("Cross-site requests are not accepted.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail("The request body must be JSON.", 415);
  }
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes)
    return fail("The request is too large.", 413);
  if (!allow(clientAddress(request))) {
    return fail("Too many requests. Try again in a few minutes.", 429, { "Retry-After": "600" });
  }
  try {
    const text = await request.text();
    if (text.length > maxBytes) return fail("The request is too large.", 413);
    return { body: JSON.parse(text) };
  } catch {
    return fail("The request body must be JSON.", 400);
  }
}
