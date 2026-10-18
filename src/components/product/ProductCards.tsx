import { Heading, Photo, Tag, Text } from "@/components/ui";
import { allProducts } from "@/content/products";
import { productImages } from "./ProductPage";
import type { ProductSlug } from "@/content/products";
import styles from "./Product.module.css";

/** The four products as a grid of linked cards. Used on /products and on the home page. */
export function ProductCards() {
  return (
    <div className={styles.grid}>
      {allProducts.map((product) => (
        <a key={product.slug} className={styles.card} href={`/products/${product.slug}`}>
          <div className={styles.picture}>
            <Photo
              src={productImages[product.slug as ProductSlug]}
              alt=""
              aspect="3 / 2"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className={styles.meta}>
            <Heading as="h3" size="xl">
              {product.name}
            </Heading>
            <Tag>{product.plan}</Tag>
          </div>
          <Text tone="muted">{product.summary}</Text>
        </a>
      ))}
    </div>
  );
}
