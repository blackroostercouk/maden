/** Copy for /privacy. It describes what this site actually does; update it when that changes. */
export const privacy = {
  metaTitle: "Privacy and cookies",
  metaDescription:
    "What data this website collects, why, who handles it, and how to change your cookie choice.",
  eyebrow: "Privacy",
  title: "Privacy and cookies.",
  updated: "18 October 2026",
  intro:
    "Moden builds custom Shopify apps. This page says what this website collects, why, and what you can do about it. It is short because we collect very little.",
  sections: [
    {
      title: "Enquiries",
      paragraphs: [
        "If you send the enquiry form we receive what you type into it: your name, email, brand, store address, Shopify plan, the areas you are interested in, your description, and your budget and timing if you give them.",
        "We use it to reply and to talk about your project. It reaches us by email, sent through Resend, our email delivery provider. We do not add you to a mailing list. We keep an enquiry for as long as we need it to deal with it and to keep a record of the conversation.",
      ],
    },
    {
      title: "Compare stores",
      paragraphs: [
        "When you use the comparison tool, we read the public pages of the store addresses you enter to build the report. We do not store those addresses or the results.",
        "To stop abuse we keep your IP address in the server's memory for about ten minutes, to count how many analyses you run. It is not written to a database.",
      ],
    },
    {
      title: "Analytics cookies",
      paragraphs: [
        "With your permission we use Google Analytics to see which pages are useful. It sets two cookies, _ga and _ga_*, which last up to two years, and sends information about your visit to Google, which may process it outside the UK.",
        "Nothing from Google loads until you press Accept. If you decline, nothing is set. We remember your choice in your browser's local storage, under the name moden-consent. That is not a cookie and is not sent to us.",
      ],
    },
    {
      title: "Hosting",
      paragraphs: [
        "This site is hosted on Vercel. Like any host, it processes technical data such as your IP address and the pages you request, to serve the site and keep it secure.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "Under UK data protection law you can ask to see the personal data we hold about you, correct it, have it deleted, or object to how we use it. You can also complain to the Information Commissioner's Office at ico.org.uk. To make a request, send us a message through the enquiry form and say what you need.",
        "Our lawful basis is your consent for analytics cookies, and steps taken at your request, or our legitimate interest in replying, for enquiries.",
      ],
    },
  ],
  changeChoice: "You can change your cookie choice at any time.",
} as const;
