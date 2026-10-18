import type { StaticImageData } from "next/image";
import assistant1 from "@/assets/images/products/screens/assistant-1.webp";
import assistant2 from "@/assets/images/products/screens/assistant-2.webp";
import assistant3 from "@/assets/images/products/screens/assistant-3.webp";
import assistant4 from "@/assets/images/products/screens/assistant-4.webp";
import favourites1 from "@/assets/images/products/screens/favourites-1.webp";
import favourites2 from "@/assets/images/products/screens/favourites-2.webp";
import favourites3 from "@/assets/images/products/screens/favourites-3.webp";
import favourites4 from "@/assets/images/products/screens/favourites-4.webp";
import gifts1 from "@/assets/images/products/screens/gifts-1.webp";
import gifts2 from "@/assets/images/products/screens/gifts-2.webp";
import gifts3 from "@/assets/images/products/screens/gifts-3.webp";
import gifts4 from "@/assets/images/products/screens/gifts-4.webp";
import membership1 from "@/assets/images/products/screens/membership-1.webp";
import membership2 from "@/assets/images/products/screens/membership-2.webp";
import membership3 from "@/assets/images/products/screens/membership-3.webp";
import membership4 from "@/assets/images/products/screens/membership-4.webp";
import { Heading, Photo, Text } from "@/components/ui";
import type { Product, ProductSlug } from "@/content/products";
import styles from "./Product.module.css";

const images: Record<ProductSlug, StaticImageData[]> = {
  membership: [membership1, membership2, membership3, membership4],
  gifts: [gifts1, gifts2, gifts3, gifts4],
  favourites: [favourites1, favourites2, favourites3, favourites4],
  assistant: [assistant1, assistant2, assistant3, assistant4],
};

/** Four real-looking screens from the app, each with a short caption. */
export function ProductScreens({ product }: { product: Product }) {
  const pictures = images[product.slug as ProductSlug];
  return (
    <div className={styles.screens}>
      {product.screens.map((screen, index) => (
        <figure key={screen.title} className={styles.screen}>
          <div className={styles.frame}>
            <Photo
              src={pictures[index]}
              alt={screen.alt}
              aspect="3 / 2"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <figcaption className={styles.caption}>
            <Heading as="h3" size="xl">
              {screen.title}
            </Heading>
            <Text tone="muted">{screen.text}</Text>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
