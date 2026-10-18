import trainer from "@/assets/images/trainer.webp";
import { Scene } from "@/components/blocks";
import {
  ChatBubble,
  MockButton,
  MockCard,
  MockChips,
  MockDraft,
  MockHeader,
  MockLineItem,
  Pill,
} from "@/components/mock";
import { CheckList, Eyebrow, Heading, Section, Split, Stack, Text } from "@/components/ui";
import { ai } from "@/content/site";
import styles from "./AiFeatures.module.css";

export function AiFeatures() {
  return (
    <Section id="ai" labelledBy="ai-title" spacing="flush-top">
      <Split ratio="6:5" align="center" reverseOnStack>
        <Scene label={ai.sceneLabel} className={styles.scene}>
          <MockCard width="xl" float className={styles.assistant}>
            <MockHeader variant="app" trailing={<Pill>Draft</Pill>}>
              Catalogue assistant
            </MockHeader>
            <MockLineItem
              image={trainer}
              title="Moss suede trainer"
              meta="Written in your brand voice"
            />
            <MockDraft>
              Soft moss suede on a cushioned off-white sole. Made for long days on city pavements,
              with tonal laces and a padded collar.
            </MockDraft>
            <MockChips items={["Alt text ready", "SEO title ready", "5 tags"]} />
            <div className={styles.actions}>
              <MockButton>Approve and publish</MockButton>
              <MockButton variant="outline">Edit</MockButton>
            </div>
          </MockCard>
          <MockCard width="md" float className={styles.chat}>
            <MockHeader dot>Customer service</MockHeader>
            <ChatBubble from="customer">Where&apos;s my order #4821?</ChatBubble>
            <ChatBubble from="agent">
              It left the warehouse this morning and arrives on Thursday 22 October, as you chose at
              checkout.
            </ChatBubble>
          </MockCard>
        </Scene>

        <Stack gap="6">
          <Eyebrow>{ai.eyebrow}</Eyebrow>
          <Heading id="ai-title" reveal>
            {ai.title}
          </Heading>
          <Text tone="muted">{ai.intro}</Text>
          <CheckList items={[...ai.features]} detailTone="muted" />
        </Stack>
      </Split>
    </Section>
  );
}
