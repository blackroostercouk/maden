import type { PageFacts } from "./html";
import { signatures, type Signature } from "./signatures";
import type { Confidence, DetectedApp } from "./types";

const hostnameOf = (resource: string) => {
  try {
    return new URL(resource, "https://placeholder.invalid").hostname.toLowerCase();
  } catch {
    return "";
  }
};

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/** "judge.me" matches judge.me and cdn.judge.me, not notjudge.me. */
function resourceMatches(resource: string, host: string) {
  const lower = resource.toLowerCase();
  if (host.includes("/")) return lower.includes(host);
  const name = hostnameOf(resource);
  if (!name) return false;
  // A dotless token such as "omnisnippet" is a brand fragment inside a hostname
  return host.includes(".") ? name === host || name.endsWith(`.${host}`) : name.includes(host);
}

const shorten = (text: string) => (text.length > 70 ? `${text.slice(0, 67)}…` : text);

function match(
  signature: Signature,
  page: PageFacts,
): { confidence: Confidence; evidence: string } | null {
  for (const host of signature.hosts) {
    const resource = page.resources.find((candidate) => resourceMatches(candidate, host));
    if (resource)
      return { confidence: "confirmed", evidence: shorten(resource.replace(/^https?:\/\//, "")) };
  }

  // Inline scripts: the app's domain written out in its own setup code
  for (const host of signature.hosts) {
    if (
      host.includes(".") &&
      new RegExp(`(?<![a-z0-9-])${escape(host)}`).test(page.inlineScripts)
    ) {
      return { confidence: "confirmed", evidence: `${host} in page script` };
    }
  }

  for (const marker of signature.markers ?? []) {
    if (new RegExp(`(?:^|[\\s"'.#=/])${escape(marker)}`).test(page.markup)) {
      return { confidence: "likely", evidence: `“${marker}” markup` };
    }
  }
  return null;
}

export type ScannedPage = { page: PageFacts; kind: "home" | "product" };

/** Looks through the scanned pages and returns each app once, at its best confidence. */
export function detectApps(pages: ScannedPage[]): DetectedApp[] {
  const found = new Map<string, DetectedApp>();
  const seenOn = new Map<string, Set<ScannedPage["kind"]>>();

  for (const { page, kind } of pages) {
    for (const signature of signatures) {
      const result = match(signature, page);
      if (!result) continue;
      seenOn.set(signature.id, (seenOn.get(signature.id) ?? new Set()).add(kind));
      const earlier = found.get(signature.id);
      if (earlier && (earlier.confidence === "confirmed" || result.confidence === "likely"))
        continue;
      found.set(signature.id, {
        id: signature.id,
        name: signature.name,
        category: signature.category,
        scope: "Home page",
        ...result,
      });
    }
  }

  for (const [id, app] of found) {
    const kinds = seenOn.get(id);
    app.scope =
      kinds?.has("home") && kinds.has("product")
        ? "Every page"
        : kinds?.has("product")
          ? "Product pages"
          : "Home page";
  }
  return [...found.values()];
}
