"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChoiceGroup, Field, Select, TextArea, TextInput } from "@/components/form";
import { Button, Heading, Text } from "@/components/ui";
import { enquiry as copy } from "@/content/site";
import {
  emptyEnquiry,
  formatEnquiry,
  HONEYPOT_FIELD,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";
import styles from "./Enquiry.module.css";

type Status = "editing" | "sending" | "sent" | "failed";

const FIELD_ORDER: EnquiryField[] = ["name", "email", "plan", "brief"];

export function EnquiryForm({ defaultAreas = [] }: { defaultAreas?: string[] }) {
  const [values, setValues] = useState<Enquiry>({ ...emptyEnquiry, areas: defaultAreas });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("editing");
  const [copied, setCopied] = useState(false);
  const [firstName, setFirstName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const failureTextRef = useRef<HTMLPreElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);

  // Arriving from an "enquiry" link puts the cursor in the first field
  useEffect(() => {
    const onArrive = (event: Event) => {
      const { hash } = (event as CustomEvent<{ hash: string }>).detail;
      if (hash !== "#enquire") return;
      formRef.current?.querySelector<HTMLElement>("#enquiry-name")?.focus({ preventScroll: true });
    };
    window.addEventListener("moden:arrive", onArrive);
    return () => window.removeEventListener("moden:arrive", onArrive);
  }, []);

  useEffect(() => {
    if (status === "sent" || status === "failed") noticeRef.current?.focus();
  }, [status]);

  const update = <K extends EnquiryField>(field: K, value: Enquiry[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleArea = (area: string, checked: boolean) =>
    update(
      "areas",
      checked ? [...values.areas, area] : values.areas.filter((item) => item !== area),
    );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: trapRef.current?.value ?? "" }),
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      setFirstName(values.name.trim().split(/\s+/)[0] ?? "");
      setValues(emptyEnquiry);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const copyEnquiry = async () => {
    const text = formatEnquiry(values);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const node = failureTextRef.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  if (status === "sent") {
    return (
      <div
        ref={noticeRef}
        className={`${styles.notice} ${styles.success}`}
        role="status"
        tabIndex={-1}
      >
        <Heading as="h3" size="xl">
          {copy.success.title}
        </Heading>
        <Text>
          Thank you{firstName ? `, ${firstName}` : ""}. {copy.success.text}
        </Text>
        <div>
          <Button variant="ghost" onClick={() => setStatus("editing")}>
            {copy.success.again}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div ref={noticeRef} className={styles.notice} role="alert" tabIndex={-1}>
        <Heading as="h3" size="xl">
          {copy.failure.title}
        </Heading>
        <Text tone="muted">{copy.failure.text}</Text>
        <pre ref={failureTextRef} className={styles.summary}>
          {formatEnquiry(values)}
        </pre>
        <div className={styles.actions}>
          <Button onClick={copyEnquiry}>{copied ? copy.failure.copied : copy.failure.copy}</Button>
          <Button variant="ghost" onClick={() => setStatus("editing")}>
            {copy.failure.retry}
          </Button>
        </div>
      </div>
    );
  }

  const errorId = (field: EnquiryField) => `enquiry-${field}-error`;
  const invalidProps = (field: EnquiryField) => ({
    invalid: Boolean(errors[field]),
    "aria-describedby": errors[field] ? errorId(field) : undefined,
    "data-field": field,
  });

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      {/* Spam trap: hidden from people and assistive tech, left empty by them */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="enquiry-website">Website</label>
        <input
          ref={trapRef}
          id="enquiry-website"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className={styles.pair}>
        <Field
          htmlFor="enquiry-name"
          label="Your name"
          error={errors.name}
          errorId={errorId("name")}
        >
          <TextInput
            id="enquiry-name"
            name="name"
            autoComplete="name"
            placeholder="Jane Okafor"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            {...invalidProps("name")}
          />
        </Field>
        <Field
          htmlFor="enquiry-email"
          label="Work email"
          error={errors.email}
          errorId={errorId("email")}
        >
          <TextInput
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@yourbrand.com"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            {...invalidProps("email")}
          />
        </Field>
      </div>

      <div className={styles.pair}>
        <Field htmlFor="enquiry-brand" label="Brand">
          <TextInput
            id="enquiry-brand"
            name="brand"
            autoComplete="organization"
            placeholder="Your brand name"
            value={values.brand}
            onChange={(event) => update("brand", event.target.value)}
          />
        </Field>
        <Field htmlFor="enquiry-store" label="Store address">
          <TextInput
            id="enquiry-store"
            name="store"
            inputMode="url"
            placeholder="yourbrand.myshopify.com"
            value={values.store}
            onChange={(event) => update("store", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Shopify plan" error={errors.plan} errorId={errorId("plan")}>
        <ChoiceGroup
          name="plan"
          type="radio"
          idPrefix="enquiry-plan"
          options={copy.plans}
          value={values.plan}
          describedBy={errors.plan ? errorId("plan") : undefined}
          onChange={(plan) => update("plan", plan)}
        />
      </Field>

      <Field label="The app is mainly about (choose any)">
        <ChoiceGroup
          name="areas"
          type="checkbox"
          idPrefix="enquiry-area"
          options={copy.areas}
          value={values.areas}
          onChange={toggleArea}
        />
      </Field>

      <Field
        htmlFor="enquiry-brief"
        label="What should the app do?"
        error={errors.brief}
        errorId={errorId("brief")}
      >
        <TextArea
          id="enquiry-brief"
          name="brief"
          placeholder={copy.briefPlaceholder}
          value={values.brief}
          onChange={(event) => update("brief", event.target.value)}
          {...invalidProps("brief")}
        />
      </Field>

      <div className={styles.pair}>
        <Field htmlFor="enquiry-budget" label="Budget">
          <Select
            id="enquiry-budget"
            name="budget"
            placeholder="Choose a range"
            options={copy.budgets}
            value={values.budget}
            onChange={(event) => update("budget", event.target.value)}
          />
        </Field>
        <Field htmlFor="enquiry-timing" label="Timing">
          <Select
            id="enquiry-timing"
            name="timing"
            placeholder="Choose a timeframe"
            options={copy.timings}
            value={values.timing}
            onChange={(event) => update("timing", event.target.value)}
          />
        </Field>
      </div>

      <div className={styles.footer}>
        <Button type="submit" withArrow disabled={status === "sending"}>
          {status === "sending" ? copy.sending : copy.submit}
        </Button>
        <Text size="xs" tone="muted" measure="narrow">
          {copy.privacy}
        </Text>
      </div>
    </form>
  );
}
