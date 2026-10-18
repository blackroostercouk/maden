import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const deliverEnquiry = vi.fn();
vi.mock("@/lib/server/deliverEnquiry", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/server/deliverEnquiry")>()),
  deliverEnquiry,
}));

const valid = {
  name: "Jane Okafor",
  email: "jane@yourbrand.com",
  plan: "Shopify Plus",
  brief: "Trade customers should see net-30 terms at checkout.",
};

let ip = 0;
function post(body: unknown, headers: Record<string, string> = {}) {
  ip += 1;
  return new Request("http://moden.test/api/enquiries", {
    method: "POST",
    headers: {
      host: "moden.test",
      origin: "http://moden.test",
      "content-type": "application/json",
      "x-forwarded-for": `10.0.0.${ip}`,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function loadRoute() {
  vi.resetModules();
  return import("./route");
}

beforeEach(() => {
  deliverEnquiry.mockReset();
  deliverEnquiry.mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("POST /api/enquiries", () => {
  it("delivers a valid enquiry", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post(valid));
    expect(response.status).toBe(201);
    expect(deliverEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jane Okafor", receivedAt: expect.any(String) }),
    );
  });

  it("returns field errors for an invalid enquiry", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ ...valid, email: "nope" }));
    expect(response.status).toBe(422);
    expect((await response.json()).errors.email).toBeDefined();
    expect(deliverEnquiry).not.toHaveBeenCalled();
  });

  it("rejects posts from another site", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post(valid, { origin: "https://evil.test" }));
    expect(response.status).toBe(403);
  });

  it("rejects bodies that are not JSON", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post("{oops"))).status).toBe(400);
    expect((await POST(post(valid, { "content-type": "text/plain" }))).status).toBe(415);
  });

  it("rejects oversized bodies", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ ...valid, brief: "x".repeat(20_000) }));
    expect(response.status).toBe(413);
  });

  it("quietly drops submissions that fill the honeypot", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ ...valid, website: "https://spam.test" }));
    expect(response.status).toBe(201);
    expect(deliverEnquiry).not.toHaveBeenCalled();
  });

  it("limits repeated posts from one address", async () => {
    const { POST } = await loadRoute();
    const headers = { "x-forwarded-for": "10.9.9.9" };
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(post(valid, headers))).status);
    expect(statuses).toEqual([201, 201, 201, 201, 201, 429]);
  });

  it("reports a delivery failure without leaking details", async () => {
    deliverEnquiry.mockRejectedValue(new Error("Resend responded 500: secret"));
    const { POST } = await loadRoute();
    const response = await POST(post(valid));
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain("secret");
  });
});
