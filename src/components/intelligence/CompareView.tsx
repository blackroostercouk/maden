import Link from "next/link";
import type { ReactNode } from "react";
import { compare } from "@/lib/analyse/compare";
import type { Report } from "@/lib/analyse/report";

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

function AppChips({ apps, empty }: { apps: Report["apps"]; empty: string }) {
  if (apps.length === 0) return <p className="muted small">{empty}</p>;
  return (
    <ul className="chips">
      {apps.map((app) => (
        <li className="chip" key={app.name} title={`${app.category}: ${app.evidence}`}>
          {app.name}
        </li>
      ))}
    </ul>
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="cmp-col">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

type CompareViewProps = { you: Report; them: Report; onRetry: () => void; showing: "you" | "them"; onShow: (which: "you" | "them") => void };

/** Two stores side by side: the figures, the apps that differ, and what we would suggest. */
export function CompareView({ you, them, onRetry, showing, onShow }: CompareViewProps) {
  const { rows, apps, suggestions } = compare(you, them);
  return (
    <>
      <section className="report-head container" aria-labelledby="compareTitle">
        <div className="report-title">
          <div style={{ display: "grid", gap: "var(--space-5)" }}>
            <p className="eyebrow">Comparison</p>
            <h2
              className="h-display h-3xl reveal"
              id="compareTitle"
              tabIndex={-1}
              style={{ fontSize: "clamp(2.4rem,1.3rem + 3.2vw,7rem)" }}
            >
              {you.store.name} <span className="accent italic">and</span> {them.store.name}
            </h2>
            <p className="lede" style={{ maxWidth: "52ch" }}>
              Read from both public storefronts. Where we say a store has no app of a kind, we mean we
              couldn&apos;t see one from outside.
            </p>
          </div>
          <div className="report-actions">
            <button className="btn sm" type="button" onClick={onRetry}>
              Compare other stores <Arrow />
            </button>
          </div>
        </div>
      </section>

      <section className="r-sec container" id="r-compare" aria-labelledby="cmpTitle">
        <div className="r-head">
          <p className="eyebrow">Side by side</p>
          <h2 className="h-display h-2xl" id="cmpTitle">
            Where the two differ.
          </h2>
        </div>
        <table className="cmp-table reveal">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Measure</span>
              </th>
              <th scope="col">{you.store.name}</th>
              <th scope="col">{them.store.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td className={row.lead === "you" ? "lead" : undefined}>{row.you}</td>
                <td className={row.lead === "them" ? "lead" : undefined}>{row.them}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted small cmp-note">Highlighted: ahead by more than 10%. For script weight, lighter is ahead.</p>
      </section>

      <section className="r-sec container" id="r-apps" aria-labelledby="cmpAppsTitle">
        <div className="r-head">
          <p className="eyebrow">Apps</p>
          <h2 className="h-display h-2xl" id="cmpAppsTitle">
            What each runs that the other doesn&apos;t.
          </h2>
        </div>
        <div className="cmp-cols reveal">
          <Column title={`Only ${you.store.name}`}>
            <AppChips apps={apps.onlyYou} empty="Nothing the other store doesn't also have." />
          </Column>
          <Column title={`Only ${them.store.name}`}>
            <AppChips apps={apps.onlyThem} empty="Nothing you don't also have." />
          </Column>
          <Column title="Both">
            <AppChips apps={apps.both} empty="No apps in common." />
          </Column>
        </div>
      </section>

      <section className="r-sec container" id="r-suggestions" aria-labelledby="sugTitle">
        <div className="r-head">
          <p className="eyebrow">What we&apos;d do</p>
          <h2 className="h-display h-2xl" id="sugTitle">
            Gaps worth closing.
          </h2>
          <p className="muted">
            Suggestions follow from what we found, not a sales script. Each one says why.
          </p>
        </div>
        <ul className="cmp-suggest reveal">
          {suggestions.map((s) => (
            <li className="cmp-card" key={s.id}>
              <h3>{s.title}</h3>
              <p className="muted">{s.reason}</p>
              <Link className="btn ghost sm" href={s.href}>
                {s.cta} <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="r-sec container" aria-label="Choose a full report">
        <fieldset className="filters" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="sr-only">Show the full report for</legend>
          {(
            [
              ["you", you.store.name],
              ["them", them.store.name],
            ] as const
          ).map(([value, label]) => (
            <label className="filter" key={value}>
              <input
                type="radio"
                name="fullReport"
                checked={showing === value}
                onChange={() => onShow(value)}
              />
              <span>Full report: {label}</span>
            </label>
          ))}
        </fieldset>
      </section>
    </>
  );
}
