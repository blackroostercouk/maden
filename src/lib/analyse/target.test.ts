import { describe, expect, it } from "vitest";
import { displayHost, parseTarget } from "./target";

describe("parseTarget", () => {
  it("accepts bare domains, full URLs and paths", () => {
    expect(parseTarget("allbirds.com")?.origin).toBe("https://allbirds.com");
    expect(parseTarget("  HTTPS://www.Allbirds.com/products/x?y=1 ")?.host).toBe(
      "www.allbirds.com",
    );
    expect(parseTarget("http://shop.brand.co.uk:443/")?.origin).toBe("https://shop.brand.co.uk");
  });

  it("rejects things that are not public store addresses", () => {
    for (const input of [
      "",
      "not a url",
      "localhost",
      "http://127.0.0.1",
      "http://2130706433",
      "https://[::1]/",
      "http://169.254.169.254/latest/meta-data",
      "printer.local",
      "intranet.internal",
      "singlelabel",
      "ftp://example.com",
      "https://user:pass@example.com",
      "https://example.com:8080",
      "-bad.example.com",
    ]) {
      expect(parseTarget(input), input).toBeNull();
    }
  });

  it("shows just the host", () => {
    expect(displayHost("https://www.allbirds.com/x")).toBe("www.allbirds.com");
    expect(displayHost("nonsense")).toBe("nonsense");
  });
});
