import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import { BlockList, isIP } from "node:net";
import { createBrotliDecompress, createGunzip, createInflate } from "node:zlib";
import { parseTarget } from "./target";

/**
 * Fetches a public web page on behalf of a visitor without letting them
 * reach our own network. Every address a name resolves to is checked at
 * connection time (so DNS tricks cannot swap in a private one later),
 * redirects are re-checked, and size and time are capped.
 */
export type SafeResponse = {
  status: number;
  url: string;
  headers: Record<string, string>;
  body: string;
  truncated: boolean;
  /** Bytes that crossed the wire, before decompression. */
  wireBytes: number;
};

type Options = {
  maxBytes?: number;
  timeoutMs?: number;
  maxRedirects?: number;
  accept?: string;
};

const USER_AGENT = "Mozilla/5.0 (compatible; ModenStoreAnalyser/1.0)";

const privateRanges = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  privateRanges.addSubnet(network, prefix, "ipv4");
}
for (const [network, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
] as const) {
  privateRanges.addSubnet(network, prefix, "ipv6");
}

/** Eight 16-bit groups of an IPv6 address, or null if it does not parse. */
function ipv6Groups(address: string): number[] | null {
  let text = address.toLowerCase();
  const dotted = text.match(/^(.*:)(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (dotted) {
    const [a, b, c, d] = dotted.slice(2).map(Number);
    text = `${dotted[1]}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const [head, tail, extra] = text.split("::");
  if (extra !== undefined) return null;
  const left = head ? head.split(":") : [];
  const right = tail !== undefined && tail ? tail.split(":") : [];
  const fill = tail === undefined ? 0 : 8 - left.length - right.length;
  if (fill < 0 || (tail === undefined && left.length !== 8)) return null;
  const groups = [...left, ...Array(fill).fill("0"), ...right].map((group) =>
    Number.parseInt(group, 16),
  );
  return groups.length === 8 &&
    groups.every((group) => Number.isInteger(group) && group >= 0 && group <= 0xffff)
    ? groups
    : null;
}

export function isPublicAddress(address: string) {
  const family = isIP(address);
  if (family === 4) return !privateRanges.check(address, "ipv4");
  if (family === 6) {
    // ::ffff:10.0.0.1 is a private IPv4 address wearing an IPv6 coat
    const mapped = address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPublicAddress(mapped[1]);
    // NAT64 (64:ff9b::/96), used by IPv6-only networks, carries a real IPv4 address in its last 32 bits
    const groups = ipv6Groups(address);
    if (!groups) return false;
    if (groups.slice(0, 6).join(":") === [0x64, 0xff9b, 0, 0, 0, 0].join(":")) {
      return isPublicAddress(
        `${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${groups[7] & 255}`,
      );
    }
    return !privateRanges.check(address, "ipv6");
  }
  return false;
}

/** DNS lookup that refuses to hand back anything but public addresses. */
const publicLookup = ((
  hostname: string,
  options: dns.LookupOptions,
  callback: (...args: unknown[]) => void,
) => {
  dns.lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error);
    const list = addresses as dns.LookupAddress[];
    if (list.length === 0 || list.some((entry) => !isPublicAddress(entry.address))) {
      return callback(new Error("Address is not publicly reachable"));
    }
    if (options.all) return callback(null, list);
    return callback(null, list[0].address, list[0].family);
  });
}) as unknown as net_Lookup;

type net_Lookup = NonNullable<http.RequestOptions["lookup"]>;

function once(
  target: URL,
  options: Required<Options>,
): Promise<SafeResponse & { location?: string }> {
  return new Promise((resolve, reject) => {
    const client = target.protocol === "https:" ? https : http;
    const request = client.request(
      target,
      {
        method: "GET",
        lookup: publicLookup,
        timeout: options.timeoutMs,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: options.accept,
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en",
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const headers: Record<string, string> = {};
        for (const [key, value] of Object.entries(response.headers)) {
          if (value !== undefined) headers[key] = Array.isArray(value) ? value.join(", ") : value;
        }

        if (status >= 300 && status < 400 && headers.location) {
          response.resume();
          return resolve({
            status,
            url: target.href,
            headers,
            body: "",
            truncated: false,
            wireBytes: 0,
            location: headers.location,
          });
        }

        const encoding = headers["content-encoding"]?.toLowerCase();
        const decoder =
          encoding === "gzip"
            ? createGunzip()
            : encoding === "br"
              ? createBrotliDecompress()
              : encoding === "deflate"
                ? createInflate()
                : null;
        let wire = 0;
        response.on("data", (chunk: Buffer) => (wire += chunk.length));
        const stream = decoder ? response.pipe(decoder) : response;

        const chunks: Buffer[] = [];
        let size = 0;
        let truncated = false;
        const finish = () =>
          resolve({
            status,
            url: target.href,
            headers,
            body: Buffer.concat(chunks).toString("utf8"),
            truncated,
            wireBytes: wire,
          });

        stream.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > options.maxBytes) {
            truncated = true;
            chunks.push(chunk.subarray(0, chunk.length - (size - options.maxBytes)));
            response.destroy();
            stream.removeAllListeners("data");
            return finish();
          }
          chunks.push(chunk);
        });
        stream.on("end", finish);
        stream.on("error", () =>
          truncated ? undefined : reject(new Error("Could not read the response")),
        );
      },
    );
    request.on("timeout", () => request.destroy(new Error("Timed out")));
    request.on("error", reject);
    request.end();
  });
}

/** Fetch `input` (a public http(s) address), following up to a few redirects. */
export async function safeFetch(input: string, overrides: Options = {}): Promise<SafeResponse> {
  const options: Required<Options> = {
    maxBytes: 2_500_000,
    timeoutMs: 8_000,
    maxRedirects: 4,
    accept: "text/html,application/json;q=0.9,*/*;q=0.5",
    ...overrides,
  };

  let current = input;
  for (let hop = 0; hop <= options.maxRedirects; hop++) {
    const parsed = parseTarget(current);
    if (!parsed) throw new Error("Address is not allowed");
    // Keep the path and query, but only on a validated host
    const target = new URL(parsed.url.pathname + parsed.url.search, parsed.origin);
    const result = await once(target, options);
    if (!result.location) {
      const response = { ...result };
      delete response.location;
      return response;
    }
    current = new URL(result.location, target).href;
  }
  throw new Error("Too many redirects");
}
