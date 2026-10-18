import { StepList } from "@/components/blocks";
import { Eyebrow, Heading, Section, Split, Stack, Text } from "@/components/ui";
import { process } from "@/content/site";
import styles from "./Process.module.css";

export function Process() {
  return (
    <Section id="process" labelledBy="process-title" spacing="flush-top">
      <Split ratio="4:8">
        <Stack gap="6" className={styles.aside}>
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <Heading id="process-title" reveal>
            {process.title}
          </Heading>
          <Text tone="muted">{process.intro}</Text>
        </Stack>
        <StepList steps={process.steps} />
      </Split>
    </Section>
  );
}
