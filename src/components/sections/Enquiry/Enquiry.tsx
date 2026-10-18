import { Eyebrow, Heading, Section, Split, Stack, Text } from "@/components/ui";
import { enquiry } from "@/content/site";
import styles from "./Enquiry.module.css";
import { EnquiryForm } from "./EnquiryForm";

/** `defaultAreas` ticks areas in the form, for pages about one kind of commission. */
export function Enquiry({ defaultAreas }: { defaultAreas?: string[] }) {
  return (
    <Section id="enquire" labelledBy="enquire-title" tone="raised" bordered>
      <Split ratio="4:7">
        <Stack gap="6" className={styles.aside}>
          <Eyebrow>{enquiry.eyebrow}</Eyebrow>
          <Heading id="enquire-title" reveal>
            {enquiry.title}
          </Heading>
          <Text tone="muted">{enquiry.intro}</Text>
        </Stack>
        <EnquiryForm defaultAreas={defaultAreas} />
      </Split>
    </Section>
  );
}
