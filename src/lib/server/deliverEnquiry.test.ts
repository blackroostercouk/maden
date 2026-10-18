import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverEnquiry, DeliveryNotConfiguredError, type EnquiryRecord } from "./deliverEnquiry";

const record: EnquiryRecord = {
  name: "Jane Okafor",
  email: "jane@yourbrand.com",
  brand: "Okafor & Co",
  store: "",
  plan: "Shopify Plus",
  areas: ["Checkout"],
  brief: "Trade customers should see net-30 terms at checkout.",
  budget: "",
  timing: "",
  receivedAt: "2026-10-17T12:00:00.000Z",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("deliverEnquiry", () => {
  it("emails the studio through Resend when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ENQUIRY_TO_EMAIL", "studio@moden.test, second@moden.test");
    vi.stubEnv("ENQUIRY_FROM_EMAIL", "Moden <enquiries@moden.test>");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await deliverEnquiry(record);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(["studio@moden.test", "second@moden.test"]);
    expect(body.reply_to).toBe("jane@yourbrand.com");
    expect(body.subject).toBe("New app enquiry from Jane Okafor (Okafor & Co)");
    expect(body.text).toContain("Plan: Shopify Plus");
  });

  it("throws when Resend refuses the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ENQUIRY_TO_EMAIL", "studio@moden.test");
    vi.stubEnv("ENQUIRY_FROM_EMAIL", "enquiries@moden.test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad", { status: 422 })));
    await expect(deliverEnquiry(record)).rejects.toThrow(/422/);
  });

  it("refuses in production when email is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "production");
    await expect(deliverEnquiry(record)).rejects.toBeInstanceOf(DeliveryNotConfiguredError);
  });
});
