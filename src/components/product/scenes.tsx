import type { ReactNode } from "react";
import {
  ChatBubble,
  MockButton,
  MockCard,
  MockChips,
  MockHeader,
  MockOption,
  MockRow,
  Pill,
  Toggle,
} from "@/components/mock";
import type { ProductSlug } from "@/content/products";

/** Interface cards for each product page, as in the landing scenes. Decorative: the parent labels each scene. */
type ProductScene = { heroA: ReactNode; heroB: ReactNode; example: ReactNode };

export const scenes: Record<ProductSlug, ProductScene> = {
  membership: {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Member</Pill>}>Speckled mug</MockHeader>
        <MockRow label="Price" value="£30.00" />
        <MockRow label="Member price" value="£24.00" />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Tiers</MockHeader>
        <MockRow label="Starter" value="£6 / month" />
        <MockRow label="Plus" value="£12 / month" />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app" trailing={<Pill>Active</Pill>}>
            Your membership
          </MockHeader>
          <MockRow label="Plan" value="Plus, £12.00" />
          <MockRow label="Saved this year" value="£86.00" />
          <MockButton variant="outline">Cancel membership</MockButton>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Per market</MockHeader>
          <MockChips items={["£12 UK", "€14 EU", "$15 US"]} />
        </MockCard>
      </>
    ),
  },
  gifts: {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Free</Pill>}>Gift added</MockHeader>
        <MockRow label="Deodorant sample, With orders over £60" value="£0.00" />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Rule</MockHeader>
        <MockRow label="Cart total" value="over £60" />
        <MockRow label="Gift" value="Sample" />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app">Your basket</MockHeader>
          <MockRow label="Face wash, Quantity 2" value="£64.00" />
          <MockRow label="Deodorant sample, Free gift" value="£0.00" />
          <MockRow label="Total" value="£64.00" />
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Rules</MockHeader>
          <MockChips items={["By product", "By quantity", "By total"]} />
        </MockCard>
      </>
    ),
  },
  favourites: {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>2 saved</Pill>}>Favourites</MockHeader>
        <MockRow label="Linen shirt" value="£68.00" />
        <MockRow label="Canvas tote" value="£32.00" />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Reminder</MockHeader>
        <MockRow label="Sent after" value="2 days" />
        <MockRow label="Opens" value="Filled cart" />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app">Still thinking?</MockHeader>
          <MockRow label="Linen shirt, Size M" value="£68.00" />
          <MockRow label="Canvas tote, Natural" value="£32.00" />
          <MockButton>Go to my cart</MockButton>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Flow</MockHeader>
          <MockChips items={["Saved", "Reminded", "Bought"]} />
        </MockCard>
      </>
    ),
  },
  assistant: {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Online</Pill>}>Assistant</MockHeader>
        <MockRow label="Answers from" value="Your catalogue" />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Suggested</MockHeader>
        <MockRow label="Enamel pot" value="£58.00" />
        <MockRow label="Compact whisk set" value="£18.00" />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app">Ask us anything</MockHeader>
          <ChatBubble from="customer">Something for a small kitchen?</ChatBubble>
          <ChatBubble from="agent">
            Two ideas: the enamel pot nests, and the whisk set folds flat.
          </ChatBubble>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Settings</MockHeader>
          <MockOption label="Hand over when unsure" trailing={<Toggle />} />
        </MockCard>
      </>
    ),
  },
};
