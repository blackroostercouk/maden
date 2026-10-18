import type { ReactNode } from "react";
import cup from "@/assets/images/cup.webp";
import serum from "@/assets/images/serum.webp";
import {
  MockButton,
  MockCaption,
  MockCard,
  MockChecks,
  MockChips,
  MockHeader,
  MockLineItem,
  MockOption,
  MockRow,
  MockStat,
  MockTable,
  Pill,
  Toggle,
} from "@/components/mock";
import type { LandingSlug } from "@/content/landings";

/**
 * The interface illustrations for each landing page. `hero` is the pair of
 * small cards that float over the photograph; `example` is the larger set
 * shown on the rings backdrop further down the page. All decorative: the
 * parent describes each scene with role="img" and an aria-label.
 */
type LandingScene = { heroA: ReactNode; heroB: ReactNode; example: ReactNode };

export const scenes: Record<LandingSlug, LandingScene> = {
  "pricing-and-discounts": {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Active</Pill>}>Volume pricing</MockHeader>
        <MockRow label="10 to 49 units" value="−8%" />
        <MockRow label="50 units or more" value="−15%" />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Basket, trade customer</MockHeader>
        <MockLineItem image={cup} title="Speckled sage mug" meta="Qty 24" value="£672.00" />
        <MockRow label="Trade price, 8% off" value="−£53.76" />
        <MockRow label="Total" value="£618.24" total />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app" trailing={<Pill>Draft</Pill>}>
            Trade pricing rule
          </MockHeader>
          <MockOption label="Customer tag is trade" trailing={<Toggle on />} selected />
          <MockOption label="Quantity of 10 or more" trailing={<Toggle on />} selected />
          <MockOption label="Stacks with free delivery" trailing={<Toggle />} />
          <MockButton>Publish rule</MockButton>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Preview basket</MockHeader>
          <MockRow label="24 × Speckled sage mug" value="£672.00" />
          <MockRow label="Trade price" value="−£53.76" />
          <MockRow label="Total" value="£618.24" total />
        </MockCard>
      </>
    ),
  },

  "checkout-customisation": {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Passed</Pill>}>Checks</MockHeader>
        <MockChecks items={["Postcode is deliverable", "Gift note under 200 characters"]} />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Delivery, step 2 of 3</MockHeader>
        <MockOption label="Nominated day, Thu 23 Oct" trailing={<Toggle on />} selected />
        <MockRow label="Delivery" value="£4.50" />
        <MockRow label="Total" value="£63.00" total />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader dot>Choose your delivery day</MockHeader>
          <MockOption label="Wednesday 22 Oct" />
          <MockOption label="Thursday 23 Oct" trailing={<Toggle on />} selected />
          <MockOption label="Friday 24 Oct" />
          <MockCaption>Order before 2pm for next-day dispatch.</MockCaption>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Order summary</MockHeader>
          <MockRow label="Gift wrap" value="£3.50" />
          <MockRow label="Delivery" value="£4.50" />
          <MockRow label="Total" value="£63.00" total />
        </MockCard>
      </>
    ),
  },

  "erp-and-warehouse-integrations": {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Healthy</Pill>}>Stock sync</MockHeader>
        <MockStat
          value="312"
          caption="SKUs restocked from the ERP"
          bars={[0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.75, 1]}
        />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Last 10 minutes</MockHeader>
        <MockTable
          rows={[
            { label: "Order 4821 to 3PL", status: "Sent" },
            { label: "Stock levels", status: "Synced" },
            { label: "Tracking written back", status: "Done" },
          ]}
        />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app" trailing={<Pill tone="warning">Retrying</Pill>}>
            Sync monitor
          </MockHeader>
          <MockTable
            rows={[
              { label: "Order 4827 to 3PL", status: "Sent" },
              { label: "Order 4828 to 3PL", status: "Sent" },
              { label: "Order 4829 to 3PL", status: "Retry in 2 min" },
            ]}
          />
          <MockCaption>Attempt 2 of 3 · timeout from the 3PL</MockCaption>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Alerts</MockHeader>
          <MockChips items={["Email", "Slack", "Only if it still fails"]} />
        </MockCard>
      </>
    ),
  },

  "b2b-and-wholesale": {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Net 30</Pill>}>Trade account</MockHeader>
        <MockRow label="Company" value="Fern and Co" />
        <MockRow label="Price list" value="Trade 2026" />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Reorder, last month&apos;s order</MockHeader>
        <MockLineItem
          image={serum}
          title="Rosemary face oil"
          meta="Qty 12, trade price £18.70"
          value="£224.40"
        />
        <MockOption label="Net-30 terms" trailing={<Toggle on />} selected />
        <MockRow label="Total" value="£224.40" total />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app" trailing={<Pill>Approved</Pill>}>
            Trade order
          </MockHeader>
          <MockLineItem
            image={serum}
            title="Rosemary face oil"
            meta="Trade price £18.70"
            value="× 12"
          />
          <MockRow label="Subtotal" value="£224.40" />
          <MockRow label="Payment terms" value="Net 30" />
          <MockRow label="Total" value="£224.40" total />
          <MockButton>Repeat this order</MockButton>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Account</MockHeader>
          <MockRow label="Credit limit" value="£5,000" />
          <MockRow label="Available" value="£4,775.60" />
        </MockCard>
      </>
    ),
  },

  "product-configurators": {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader>Glaze</MockHeader>
        <MockChips items={["Sage", "Oat", "Navy", "Clay"]} />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Your mug</MockHeader>
        <MockLineItem
          image={cup}
          title="Speckled stoneware mug"
          meta="Initials on base: M.A."
          value="£28.00"
        />
        <MockRow label="Engraved initials" value="£4.00" />
        <MockRow label="Total" value="£32.00" total />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app">Make it yours</MockHeader>
          <MockOption label="Glaze: sage" trailing={<Toggle on />} selected />
          <MockOption label="Initials on the base" trailing={<Toggle on />} selected />
          <MockCaption>Up to three letters. Added to the price live.</MockCaption>
          <MockButton>Add to basket, £32.00</MockButton>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Production slip</MockHeader>
          <MockRow label="Glaze" value="Sage" />
          <MockRow label="Engraving" value="M.A." />
          <MockRow label="Lead time" value="5 days" />
        </MockCard>
      </>
    ),
  },

  "membership-and-subscriptions": {
    heroA: (
      <MockCard width="full" depth={-1}>
        <MockHeader trailing={<Pill>Active</Pill>}>Member portal</MockHeader>
        <MockRow label="Plan" value="Monthly" />
        <MockRow label="Next box" value="12 Nov" />
      </MockCard>
    ),
    heroB: (
      <MockCard width="full" depth={1.4}>
        <MockHeader dot>Price by market</MockHeader>
        <MockRow label="United Kingdom" value="£12.00 / month" />
        <MockRow label="Eurozone" value="€14.00 / month" />
        <MockRow label="United States" value="$15.00 / month" />
      </MockCard>
    ),
    example: (
      <>
        <MockCard width="lg" float>
          <MockHeader variant="app" trailing={<Pill>Active</Pill>}>
            Your membership
          </MockHeader>
          <MockRow label="Plan" value="Monthly, £12.00" />
          <MockRow label="Next box" value="12 November" />
          <MockOption label="Skip next month" trailing={<Toggle />} />
          <MockButton variant="outline">Pause or change plan</MockButton>
        </MockCard>
        <MockCard width="md" float>
          <MockHeader dot>Same perks, local price</MockHeader>
          <MockChips items={["£12 UK", "€14 EU", "$15 US"]} />
        </MockCard>
      </>
    ),
  },
};
