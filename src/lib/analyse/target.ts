/**
 * Turns whatever a person types into a store address we are willing to fetch.
 * Pure string work, so the search box can use it for instant feedback and
 * the server can use it as the first line of defence.
 */

export type ParsedTarget = { url: URL; host: string; origin: string };

const BLOCKED_SUFFIXES = [".local", ".localhost", ".internal", ".lan", ".home", ".corp", ".test"];

/** A hostname that could be a public website: letters, digits, hyphens, at least one dot. */
const HOSTNAME = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;

export function parseTarget(input: string): ParsedTarget | null {
  const text = input.trim();
  if (!text || text.length > 300 || /\s/.test(text)) return null;

  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;

  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  // Raw IP addresses never reach DNS, so they could skip the address check
  if (host.startsWith("[") || /^[\d.]+$/.test(host)) return null;
  if (!HOSTNAME.test(host)) return null;
  if (host === "localhost" || BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) return null;

  return { url, host, origin: `https://${host}` };
}

/** "https://www.Allbirds.com/products/x?y=1" becomes "www.allbirds.com". */
export function displayHost(input: string) {
  return parseTarget(input)?.host ?? input.trim();
}
