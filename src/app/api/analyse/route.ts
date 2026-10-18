import { analyseStore } from "@/lib/analyse/analyse";
import { toReport } from "@/lib/analyse/report";
import { createRateLimit } from "@/lib/server/rateLimit";
import { guardJsonPost } from "@/lib/server/request";

/**
 * Store intelligence: reads a public Shopify store and answers with the report
 * the page at /intelligence renders. Each call fetches several pages, so it is
 * limited per address.
 */
const allow = createRateLimit({ limit: 12, windowMs: 10 * 60 * 1000 });

// A full read opens a handful of pages in parallel; give slow stores room
export const maxDuration = 30;

export async function POST(request: Request) {
  const guarded = await guardJsonPost(request, { allow, maxBytes: 1024 });
  if ("response" in guarded) return guarded.response;

  const url = (guarded.body as { url?: unknown } | null)?.url;
  if (typeof url !== "string") {
    return Response.json({ error: "Send the store address as { url }." }, { status: 400 });
  }

  const result = await analyseStore(url);
  if (!result.ok) {
    // The page's notice codes
    const code = result.reason === "invalid-url" ? "invalid" : result.reason;
    return Response.json({ ok: false, code });
  }
  return Response.json({ ok: true, report: toReport(result.analysis) });
}
