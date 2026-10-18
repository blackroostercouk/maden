import type { PageFacts } from "./html";
import { safeFetch } from "./safeFetch";
import type { StorefrontWeight } from "./types";

const MAX_SCRIPTS_PER_HOST = 6;
const MAX_SCRIPTS_MEASURED = 24;
const MAX_HOSTS_SHOWN = 10;

/** Hosts that belong to Shopify itself, which are not "third party" for this purpose. */
const SHOPIFY_HOSTS = [
  "shopify.com",
  "shopifycdn.com",
  "shopifycloud.com",
  "shopifysvc.com",
  "myshopify.com",
  "shop.app",
];

const endsWithHost = (name: string, host: string) => name === host || name.endsWith(`.${host}`);

/** "www.brand.co.uk" → "brand.co.uk"; good enough to tell first-party from third-party scripts. */
function siteRoot(host: string) {
  const labels = host.replace(/^www\./, "").split(".");
  const secondLevel = ["co", "com", "org", "net", "gov", "ac"];
  const keep =
    labels.length > 2 &&
    labels[labels.length - 1].length === 2 &&
    secondLevel.includes(labels[labels.length - 2])
      ? 3
      : 2;
  return labels.slice(-keep).join(".");
}

/**
 * Which outside hosts the home page loads scripts from, and what each costs.
 * Sizes are the transfer sizes of the scripts written into the page's HTML;
 * anything those scripts fetch afterwards is not counted, so this is a floor.
 */
export async function measureStorefront(host: string, home: PageFacts): Promise<StorefrontWeight> {
  const root = siteRoot(host);
  const byHost = new Map<string, string[]>();

  for (const script of home.scripts) {
    let url: URL;
    try {
      url = new URL(script, `https://${host}/`);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") continue;
    const name = url.hostname.toLowerCase();
    if (endsWithHost(name, root) || SHOPIFY_HOSTS.some((shopify) => endsWithHost(name, shopify)))
      continue;
    const list = byHost.get(name) ?? [];
    if (!list.includes(url.href)) list.push(url.href);
    byHost.set(name, list);
  }

  // The busiest hosts first, a few scripts each, within a fixed budget of requests
  const queue: Array<{ host: string; url: string }> = [];
  for (const [name, urls] of [...byHost.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  )) {
    for (const url of urls.slice(0, MAX_SCRIPTS_PER_HOST)) queue.push({ host: name, url });
  }

  const sizes = await Promise.all(
    queue.slice(0, MAX_SCRIPTS_MEASURED).map(async ({ host: name, url }) => {
      try {
        const response = await safeFetch(url, {
          accept: "*/*",
          maxBytes: 800_000,
          timeoutMs: 6_000,
        });
        return response.status === 200 ? { host: name, bytes: response.wireBytes } : null;
      } catch {
        return null;
      }
    }),
  );

  const totals = new Map<string, number>();
  for (const size of sizes)
    if (size) totals.set(size.host, (totals.get(size.host) ?? 0) + size.bytes);

  return {
    scripts: home.scriptTags,
    thirdPartyHosts: byHost.size,
    hosts: [...totals.entries()]
      .map(([name, bytes]) => ({ host: name, kb: Math.max(1, Math.round(bytes / 1024)) }))
      .sort((a, b) => b.kb - a.kb)
      .slice(0, MAX_HOSTS_SHOWN),
  };
}
