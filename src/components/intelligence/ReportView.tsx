"use client";

import { useState, type ReactNode } from "react";
import type { Report } from "@/lib/analyse/report";
import { fmt, initials, money } from "./helpers";

const VERDICT = {
  plus: { label: "Likely Shopify Plus", badge: "good" },
  standard: { label: "Likely a standard plan", badge: "" },
  unknown: { label: "Plan can't be told", badge: "caution" },
} as const;
const CONFIDENCE = ["", "Low confidence", "Medium confidence", "High confidence"];
const STATE_TEXT = { found: "Found", absent: "Not found", unknown: "Can't check" } as const;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);
const Tick = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 9.5l4 4L15 5" />
  </svg>
);

export function summaryText(r: Report) {
  const c = r.catalogue;
  return [
    `${r.store.name} (${r.query})`,
    `Shopify store · ${VERDICT[r.plan.verdict].label}`,
    `${fmt(c.products)} products, ${fmt(c.collections)} collections, ${fmt(c.variants)} variants`,
    `Theme: ${r.store.theme.name} ${r.store.theme.version || ""}`.trim(),
    `Apps (${r.apps.length}): ${r.apps.map((a) => a.name).join(", ")}`,
  ].join("\n");
}

function Chips({ items }: { items: string[] }) {
  return (
    <span className="chips">
      {items.map((item) => (
        <span className="chip" key={item}>
          {item}
        </span>
      ))}
    </span>
  );
}

type Row = { name: string; value: number };

function BarList({ rows, unit }: { rows: Row[]; unit: string }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <div className="barlist">
      {rows.map((row) => (
        <div
          className="bar"
          tabIndex={0}
          key={row.name}
          data-tip-title={row.name}
          data-tip-text={`${fmt(row.value)} ${unit}`}
        >
          <span className="name">{row.name}</span>
          <span className="track">
            <span className="fill" style={{ "--v": (row.value / max).toFixed(4) } as React.CSSProperties} />
          </span>
          <span className="val">{fmt(row.value)}</span>
        </div>
      ))}
    </div>
  );
}

function DataTable({ id, head, rows }: { id: string; head: [string, string]; rows: Array<[string, number]> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="table-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide table" : "Show as table"}
      </button>
      <table className="data-table" id={id} hidden={!open}>
        <thead>
          <tr>
            <th>{head[0]}</th>
            <th>{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <td>{a}</td>
              <td>{fmt(b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Chart({ title, sub, children, wide }: { title: string; sub: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="chart reveal" style={wide ? { gridColumn: "1/-1" } : undefined}>
      <div className="chart-title">
        <h3>{title}</h3>
        <span>{sub}</span>
      </div>
      {children}
    </div>
  );
}

type ReportViewProps = { report: Report; onRetry: () => void; onCopy: (text: string) => Promise<boolean> };

/** The results of one analysis: overview, plan, apps, catalogue and script weight. */
export function ReportView({ report: r, onRetry, onCopy }: ReportViewProps) {
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  const s = r.store;
  const c = r.catalogue;
  const cur = s.currency || "GBP";
  const v = VERDICT[r.plan.verdict] ?? VERDICT.unknown;
  const groups = r.apps.reduce<Record<string, Report["apps"]>>((m, a) => {
    (m[a.category] ||= []).push(a);
    return m;
  }, {});
  const groupNames = Object.keys(groups);
  const hostKb = r.storefront.hosts.reduce((t, h) => t + h.kb, 0);
  const when = new Date(r.analysedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const theme =
    s.theme.onlineStore2 === true
      ? "Online Store 2.0"
      : s.theme.onlineStore2 === false
        ? "Vintage theme"
        : "Theme generation unknown";

  const figures: Array<{ value: ReactNode; label: string; accent?: boolean }> = [
    { value: fmt(c.products), label: "Products" },
    { value: fmt(c.collections), label: "Collections" },
    { value: fmt(c.variants), label: "Variants" },
    { value: money(c.averagePrice, cur), label: "Average price" },
    { value: fmt(r.apps.length), label: "Apps detected", accent: true },
    {
      value: (
        <>
          {fmt(hostKb)}
          <small>KB</small>
        </>
      ),
      label: "Third-party scripts",
    },
  ];

  const profile: Array<[string, ReactNode]> = [
    ["Shopify domain", s.myshopifyDomain],
    [
      "Theme",
      <>
        {s.theme.name} {s.theme.version || ""}{" "}
        <span className="muted">
          {theme}
          {s.theme.themeStoreId ? ` · Theme Store #${s.theme.themeStoreId}` : " · Custom theme"}
        </span>
      </>,
    ],
    ["Storefront", s.headless ? "Headless (custom storefront)" : "Shopify Online Store"],
    ["Country", s.country],
    ["Currencies", <Chips key="cur" items={s.markets} />],
    ["Languages", <Chips key="lang" items={s.languages} />],
    ["Payments", <Chips key="pay" items={s.payments} />],
    [
      "Vendors",
      <>
        {fmt(c.vendors)} <span className="muted">brands in the catalogue</span>
      </>,
    ],
    ["Price range", `${money(c.priceRange.min, cur)} to ${money(c.priceRange.max, cur)}`],
    ["Product types", fmt(c.productTypes.length)],
  ];

  const sections: Array<[string, string, number?]> = [
    ["overview", "Overview"],
    ["plan", "Plan"],
    ["apps", "Apps", r.apps.length],
    ["catalogue", "Catalogue"],
    ["storefront", "Script weight"],
  ];

  const collections = c.topCollections
    .map((x) => ({ name: x.title, value: x.products }))
    .sort((a, b) => b.value - a.value);
  const maxBucket = Math.max(1, ...c.priceBuckets.map((x) => x.count));
  const foundSignals = r.plan.signals.filter((x) => x.state === "found").length;
  const appWord = r.apps.length === 1 ? "app" : "apps";

  const copy = async () => {
    setCopied((await onCopy(summaryText(r))) ? "done" : "failed");
    setTimeout(() => setCopied("idle"), 2200);
  };

  return (
    <>
      <section className="report-head container" aria-labelledby="reportTitle">
        <div className="report-title">
          <div style={{ display: "grid", gap: "var(--space-5)" }}>
            <div className="badges">
              <span className="badge good">
                <i />
                Runs on Shopify
              </span>
              <span className={`badge ${v.badge}`}>
                <i />
                {v.label}
              </span>
            </div>
            <h2
              className="h-display h-3xl reveal"
              id="reportTitle"
              tabIndex={-1}
              style={{ fontSize: "clamp(2.6rem,1.4rem + 3.6vw,8rem)" }}
            >
              {s.name}
            </h2>
            <p className="lede" style={{ maxWidth: "52ch" }}>
              {s.description}
            </p>
            <p className="meta">
              <a href={`https://${r.query}`} target="_blank" rel="noopener noreferrer">
                {r.query}
              </a>
              <span>Analysed {when}</span>
            </p>
          </div>
          <div className="report-actions">
            <button className="btn ghost sm" type="button" onClick={copy}>
              {copied === "done" ? "Copied" : copied === "failed" ? "Couldn't copy" : "Copy summary"}
            </button>
            <button className="btn sm" type="button" onClick={onRetry}>
              Analyse another store <Arrow />
            </button>
          </div>
        </div>
      </section>

      <nav className="subnav" aria-label="Report sections">
        <div className="container">
          <ol>
            {sections.map(([id, label, n]) => (
              <li key={id}>
                <a href={`#r-${id}`}>
                  {label}
                  {n ? <span className="count">{n}</span> : null}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <section className="r-sec container" id="r-overview" aria-labelledby="ovTitle">
        <h2 className="sr-only" id="ovTitle">
          Overview
        </h2>
        <div className="figures reveal">
          {figures.map((f) => (
            <div className="figure" key={f.label}>
              <span className={`value ${f.accent ? "accent" : ""}`}>{f.value}</span>
              <span className="label">{f.label}</span>
            </div>
          ))}
        </div>
        <dl className="profile reveal">
          {profile.map(([k, val]) => (
            <div className="kv" key={k}>
              <dt>{k}</dt>
              <dd>{val}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="r-sec container" id="r-plan" aria-labelledby="planTitle">
        <div className="r-head">
          <p className="eyebrow">Plan</p>
          <h2 className="h-display h-2xl" id="planTitle">
            {r.plan.verdict === "plus"
              ? "Signs of Shopify Plus."
              : r.plan.verdict === "standard"
                ? "No sign of Shopify Plus."
                : "Not enough to tell."}
          </h2>
          <p className="muted">
            Shopify doesn&apos;t publish which plan a store is on. We look for features that only Plus
            stores can use and weigh what we find.
          </p>
        </div>
        <div className="plan">
          <div className="verdict reveal">
            <p className="small accent">Our estimate</p>
            <p className="h-display h-xl italic">{v.label}</p>
            <div className="meter" role="img" aria-label={CONFIDENCE[r.plan.confidence]}>
              <div className="meter-track">
                {[1, 2, 3].map((n) => (
                  <i key={n} className={n <= r.plan.confidence ? "on" : ""} />
                ))}
              </div>
              <span className="small muted">
                {CONFIDENCE[r.plan.confidence]} · {foundSignals} of {r.plan.signals.length} signals found
              </span>
            </div>
          </div>
          <ul className="signals reveal">
            {r.plan.signals.map((sg) => (
              <li className="signal" key={sg.label}>
                <span className={`state ${sg.state}`} title={STATE_TEXT[sg.state]}>
                  {sg.state === "found" ? <Tick /> : sg.state === "absent" ? "–" : "?"}
                </span>
                <h3>
                  {sg.label} <span className="sr-only">: {STATE_TEXT[sg.state]}</span>
                </h3>
                <p>{sg.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="r-sec container" id="r-apps" aria-labelledby="appsTitle">
        <div className="r-head">
          <p className="eyebrow">Apps and integrations</p>
          <h2 className="h-display h-2xl" id="appsTitle">
            {fmt(r.apps.length)} {appWord} in {fmt(groupNames.length)}{" "}
            {groupNames.length === 1 ? "category" : "categories"}.
          </h2>
          <p className="muted">
            Detected from scripts, pixels and markup on the home page and a product page. Apps that only
            run in the admin or checkout can&apos;t be seen from outside.
          </p>
        </div>
        <fieldset className="filters" style={{ border: 0, padding: 0, margin: "0 0 var(--space-8)" }}>
          <legend className="sr-only">Filter apps by category</legend>
          {[["", "All", r.apps.length] as const, ...groupNames.map((g) => [g, g, groups[g].length] as const)].map(
            ([value, label, count]) => (
              <label className="filter" key={value || "all"}>
                <input
                  type="radio"
                  name="appFilter"
                  value={value}
                  checked={filter === value}
                  onChange={() => setFilter(value)}
                />
                <span>
                  {label}
                  <b>{count}</b>
                </span>
              </label>
            ),
          )}
        </fieldset>
        <div className="app-groups">
          {groupNames.map((g) => (
            <div className="app-group reveal" key={g} hidden={filter !== "" && filter !== g}>
              <h3>
                {g}
                <small>
                  {groups[g].length} {groups[g].length === 1 ? "app" : "apps"}
                </small>
              </h3>
              <ul className="app-list">
                {groups[g].map((a) => (
                  <li className="app" key={a.name}>
                    <span className="app-mono" aria-hidden="true">
                      {initials(a.name)}
                    </span>
                    <h4>{a.name}</h4>
                    <p className="evidence">
                      Found: <code>{a.evidence}</code>
                    </p>
                    <span className="chip scope">{a.scope}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="r-sec container" id="r-catalogue" aria-labelledby="catTitle">
        <div className="r-head">
          <p className="eyebrow">Catalogue</p>
          <h2 className="h-display h-2xl" id="catTitle">
            {fmt(c.products)} products across {fmt(c.collections)} collections.
          </h2>
          <p className="muted">
            Totals come from the store&apos;s own profile; the breakdowns below are read from up to its
            first 1,000 products. Collections can overlap, so their product counts add up to more than the
            catalogue.
          </p>
        </div>
        <div className="charts">
          <Chart title="Largest collections" sub="Products in each">
            <BarList rows={collections} unit="products" />
            <DataTable
              id="tblCollections"
              head={["Collection", "Products"]}
              rows={c.topCollections.map((x) => [x.title, x.products])}
            />
          </Chart>
          <Chart title="Product types" sub="Products of each type">
            <BarList rows={c.productTypes.map((x) => ({ name: x.name, value: x.count }))} unit="products" />
            <DataTable
              id="tblTypes"
              head={["Type", "Products"]}
              rows={c.productTypes.map((x) => [x.name, x.count])}
            />
          </Chart>
          <Chart title="Price distribution" sub={`Products by price, ${cur}`} wide>
            <div className="histo">
              <div className="histo-plot">
                {c.priceBuckets.map((b) => (
                  <div
                    className="col"
                    tabIndex={0}
                    key={b.label}
                    style={{ "--v": (b.count / maxBucket).toFixed(4) } as React.CSSProperties}
                    data-tip-title={b.label}
                    data-tip-text={`${fmt(b.count)} products`}
                  >
                    <span className="top">{fmt(b.count)}</span>
                    <span className="fill" />
                  </div>
                ))}
              </div>
              <div className="histo-axis" aria-hidden="true">
                {c.priceBuckets.map((b) => (
                  <span key={b.label}>{b.label}</span>
                ))}
              </div>
            </div>
            <DataTable
              id="tblPrices"
              head={["Price band", "Products"]}
              rows={c.priceBuckets.map((x) => [x.label, x.count])}
            />
          </Chart>
        </div>
        <div style={{ marginTop: "var(--space-block-fluid)", display: "grid", gap: "var(--space-6)" }}>
          <div className="chart-title">
            <h3>Recently added</h3>
            <span>Newest products in the feed</span>
          </div>
          <ul className="products reveal">
            {c.recentProducts.map((p) => (
              <li className="product" key={p.title}>
                <div className="img">
                  {p.image ? (
                    // Remote Shopify CDN image of an arbitrary store: next/image would need every host allowed
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" decoding="async" />
                  ) : (
                    "No image"
                  )}
                </div>
                <h4>{p.title}</h4>
                <p>
                  <span className="price">{money(p.price, cur)}</span> · {p.type} · {p.added}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="r-sec container" id="r-storefront" aria-labelledby="sfTitle">
        <div className="r-head">
          <p className="eyebrow">Script weight</p>
          <h2 className="h-display h-2xl" id="sfTitle">
            What the apps cost in page speed.
          </h2>
          <p className="muted">
            JavaScript that third-party apps add to the home page, by the host it loads from. Sizes add up
            the scripts written into the page; anything those scripts load afterwards isn&apos;t counted, so
            the real total is higher. Heavier pages take longer to become usable, especially on phones.
          </p>
        </div>
        <div className="weight">
          <div style={{ display: "grid", gap: "var(--space-5)" }} className="reveal">
            <p className="weight-fig">{fmt(hostKb)} KB</p>
            <p className="lede">
              of JavaScript from {fmt(r.storefront.thirdPartyHosts)} third-party hosts, across{" "}
              {fmt(r.storefront.scripts)} script tags on the home page.
            </p>
          </div>
          <Chart title="Heaviest script hosts" sub="Transfer size, KB">
            <BarList rows={r.storefront.hosts.map((h) => ({ name: h.host, value: h.kb }))} unit="KB" />
            <DataTable
              id="tblHosts"
              head={["Host", "KB"]}
              rows={r.storefront.hosts.map((h) => [h.host, h.kb])}
            />
          </Chart>
        </div>
      </section>
    </>
  );
}
