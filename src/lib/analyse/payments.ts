import type { PageFacts } from "./html";

/** Payment methods whose buttons or badges leave a recognisable mark in the page. */
const methods: Array<{ name: string; hosts?: string[]; markers: string[] }> = [
  { name: "Shop Pay", markers: ["shop-pay", "shop_pay", "shopify-payment-button"] },
  { name: "Apple Pay", markers: ["apple-pay", "apple_pay", "applepay"] },
  { name: "Google Pay", markers: ["google-pay", "google_pay", "gpay"] },
  {
    name: "PayPal",
    hosts: ["paypal.com", "paypalobjects.com"],
    markers: ["paypal-button", "paypal_express"],
  },
  { name: "Klarna", hosts: ["klarna.com"], markers: ["klarna-placement"] },
  { name: "Afterpay", hosts: ["afterpay.com"], markers: ["afterpay-placement"] },
  { name: "Clearpay", hosts: ["clearpay.co.uk", "clearpay.com"], markers: ["clearpay-placement"] },
  { name: "Amazon Pay", hosts: ["payments.amazon.com"], markers: ["amazon-pay"] },
];

const hostOf = (resource: string) => {
  try {
    return new URL(resource, "https://placeholder.invalid").hostname.toLowerCase();
  } catch {
    return "";
  }
};

/** Payment methods seen on any of the scanned pages, in a stable order. */
export function detectPayments(pages: PageFacts[]): string[] {
  return methods
    .filter((method) =>
      pages.some(
        (page) =>
          method.markers.some((marker) => page.markup.includes(marker)) ||
          page.resources.some((resource) =>
            method.hosts?.some((host) => {
              const name = hostOf(resource);
              return name === host || name.endsWith(`.${host}`);
            }),
          ),
      ),
    )
    .map((method) => method.name);
}
