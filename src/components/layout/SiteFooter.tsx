import { CookieSettings } from "@/components/analytics";
import { Container } from "@/components/ui";
import { brand, footer } from "@/content/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container>
        <p className={styles.wordmark} aria-hidden="true" data-scrub="lift">
          {brand.name.toLowerCase()}
          <em>.</em>
        </p>
        <div className={styles.meta}>
          <p>{footer.disclaimer}</p>
          <p>
            &copy; {brand.year} {brand.legalName}, {brand.location}
            {" · "}
            <CookieSettings className={styles.cookieLink} />
          </p>
        </div>
      </Container>
    </footer>
  );
}
