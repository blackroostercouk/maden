import type { Metadata } from "next";
import { CookieSettings } from "@/components/analytics";
import { Eyebrow, Heading, Section, Stack, Text } from "@/components/ui";
import { privacy } from "@/content/privacy";
import { brand } from "@/content/site";
import styles from "./page.module.css";

const title = `${privacy.metaTitle} | ${brand.legalName}`;

export const metadata: Metadata = {
  title,
  description: privacy.metaDescription,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description: privacy.metaDescription, type: "website" },
};

export default function Page() {
  return (
    <Section labelledBy="privacy-title">
      <Stack gap="8" className={styles.page}>
        <Stack gap="5">
          <Eyebrow>{privacy.eyebrow}</Eyebrow>
          <Heading as="h1" id="privacy-title">
            {privacy.title}
          </Heading>
          <Text size="lg" tone="soft">
            {privacy.intro}
          </Text>
          <Text tone="muted" size="sm">
            Updated {privacy.updated}
          </Text>
        </Stack>
        {privacy.sections.map((section) => (
          <Stack gap="3" key={section.title} as="section">
            <Heading as="h2" size="xl">
              {section.title}
            </Heading>
            {section.paragraphs.map((paragraph) => (
              <Text key={paragraph} tone="muted">
                {paragraph}
              </Text>
            ))}
          </Stack>
        ))}
        <Stack gap="3">
          <Text tone="muted">{privacy.changeChoice}</Text>
          <div>
            <CookieSettings className={styles.choice} />
          </div>
        </Stack>
      </Stack>
    </Section>
  );
}
