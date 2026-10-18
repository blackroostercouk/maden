/**
 * Fixed-window rate limit kept in memory. It holds per server instance,
 * which is enough to blunt a single noisy client; for a hard limit across
 * many serverless instances, back this with a shared store (e.g. Redis).
 */
export function createRateLimit({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function allow(key: string, now: number = Date.now()) {
    // Drop expired entries so the map cannot grow without bound
    if (hits.size > 5_000) {
      for (const [entryKey, entry] of hits) if (entry.resetAt <= now) hits.delete(entryKey);
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

/** Best guess at the client address behind the hosting proxy. */
export function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}
