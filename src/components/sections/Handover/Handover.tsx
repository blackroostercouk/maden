import { CheckList, Eyebrow, Heading, Section, Split, Stack } from "@/components/ui";
import { handover } from "@/content/site";

export function Handover() {
  return (
    <Section labelledBy="handover-title">
      <Split ratio="5:6">
        <Stack gap="6">
          <Eyebrow>{handover.eyebrow}</Eyebrow>
          <Heading id="handover-title" italic reveal>
            {handover.title}
          </Heading>
        </Stack>
        <CheckList items={[...handover.items]} variant="ruled" />
      </Split>
    </Section>
  );
}
