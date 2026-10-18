import { PrincipleList, Scene } from "@/components/blocks";
import { MockButton, MockCaption, MockCard, MockChecks, MockHeader, Pill } from "@/components/mock";
import { Eyebrow, Heading, Section, Split, Stack, Text } from "@/components/ui";
import { craft } from "@/content/site";

export function Craft() {
  const { review } = craft;
  return (
    <Section id="craft" labelledBy="craft-title" tone="raised" bordered>
      <Split ratio="6:5" align="center">
        <Stack gap="6">
          <Eyebrow>{craft.eyebrow}</Eyebrow>
          <Heading id="craft-title" reveal>
            {craft.title}
          </Heading>
          <Text size="lg" measure="narrow">
            {craft.lede}
          </Text>
          <PrincipleList items={craft.principles} />
        </Stack>
        <Scene label={craft.sceneLabel}>
          <MockCard width="xl" float>
            <MockHeader variant="app" trailing={<Pill>{review.status}</Pill>}>
              {review.title}
            </MockHeader>
            <MockCaption>{review.meta}</MockCaption>
            <MockChecks items={[...review.checks]} />
            <MockButton>{review.action}</MockButton>
          </MockCard>
        </Scene>
      </Split>
    </Section>
  );
}
