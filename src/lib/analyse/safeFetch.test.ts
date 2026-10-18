import { describe, expect, it } from "vitest";
import { isPublicAddress, safeFetch } from "./safeFetch";

describe("isPublicAddress", () => {
  it("allows public addresses, including NAT64 ones that carry a public IPv4", () => {
    for (const address of ["8.8.8.8", "23.227.38.32", "2606:4700::1", "64:ff9b::17e3:2620"]) {
      expect(isPublicAddress(address), address).toBe(true);
    }
  });

  it("blocks private, loopback, link-local and metadata addresses", () => {
    for (const address of [
      "127.0.0.1",
      "10.1.2.3",
      "172.16.0.9",
      "192.168.1.1",
      "169.254.169.254",
      "100.64.0.1",
      "0.0.0.0",
      "::1",
      "fe80::1",
      "fd12::1",
      "::ffff:10.0.0.1",
      "64:ff9b::7f00:1",
      "64:ff9b::a00:1",
      "not-an-ip",
    ]) {
      expect(isPublicAddress(address), address).toBe(false);
    }
  });
});

describe("safeFetch", () => {
  it("refuses addresses that are not allowed before any connection", async () => {
    for (const url of [
      "http://127.0.0.1/",
      "https://localhost/",
      "https://192.168.0.1/",
      "ftp://example.com/",
    ]) {
      await expect(safeFetch(url), url).rejects.toThrow("Address is not allowed");
    }
  });
});
