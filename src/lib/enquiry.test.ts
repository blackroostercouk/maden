import { describe, expect, it } from "vitest";
import {
  emptyEnquiry,
  formatEnquiry,
  sanitiseEnquiry,
  validateEnquiry,
  type Enquiry,
} from "./enquiry";

const valid: Enquiry = {
  ...emptyEnquiry,
  name: "Jane Okafor",
  email: "jane@yourbrand.com",
  plan: "Shopify Plus",
  brief: "Trade customers should see net-30 terms at checkout.",
};

describe("validateEnquiry", () => {
  it("accepts a complete enquiry", () => {
    expect(validateEnquiry(valid)).toEqual({});
  });

  it("requires name, email, plan and a real brief", () => {
    expect(Object.keys(validateEnquiry(emptyEnquiry)).sort()).toEqual([
      "brief",
      "email",
      "name",
      "plan",
    ]);
  });

  it("rejects malformed emails", () => {
    for (const email of ["jane", "jane@", "jane@brand", "jane @brand.com"]) {
      expect(validateEnquiry({ ...valid, email }).email).toBeDefined();
    }
  });

  it("rejects briefs that are too short or too long", () => {
    expect(validateEnquiry({ ...valid, brief: "Too short" }).brief).toBeDefined();
    expect(validateEnquiry({ ...valid, brief: "x".repeat(5001) }).brief).toMatch(/under/);
  });
});

describe("sanitiseEnquiry", () => {
  it("returns an empty enquiry for non-object input", () => {
    expect(sanitiseEnquiry(null)).toEqual(emptyEnquiry);
    expect(sanitiseEnquiry("hello")).toEqual(emptyEnquiry);
  });

  it("drops unknown fields and wrong types", () => {
    const result = sanitiseEnquiry({ ...valid, name: 42, admin: true });
    expect(result.name).toBe("");
    expect(result).not.toHaveProperty("admin");
  });

  it("only keeps choices offered by the form", () => {
    const result = sanitiseEnquiry({
      ...valid,
      plan: "Free forever",
      budget: "£10,000 to £25,000",
      areas: ["Checkout", "Checkout", "Hacking", 3],
    });
    expect(result.plan).toBe("");
    expect(result.budget).toBe("£10,000 to £25,000");
    expect(result.areas).toEqual(["Checkout"]);
  });

  it("flattens line breaks in single-line fields so they cannot reach email headers", () => {
    const result = sanitiseEnquiry({ ...valid, name: "Jane\r\nBcc: x@evil.test\u0000" });
    expect(result.name).toBe("Jane Bcc: x@evil.test");
  });

  it("keeps line breaks in the brief and caps its length", () => {
    expect(sanitiseEnquiry({ ...valid, brief: "One\r\nTwo" }).brief).toBe("One\nTwo");
    expect(sanitiseEnquiry({ ...valid, brief: "x".repeat(9000) }).brief).toHaveLength(5001);
  });

  it("caps short fields", () => {
    expect(sanitiseEnquiry({ ...valid, brand: "b".repeat(500) }).brand).toHaveLength(200);
  });
});

describe("formatEnquiry", () => {
  it("leaves out optional fields that are empty", () => {
    const text = formatEnquiry(valid);
    expect(text).toContain("Name: Jane Okafor");
    expect(text).not.toContain("Brand:");
  });
});
