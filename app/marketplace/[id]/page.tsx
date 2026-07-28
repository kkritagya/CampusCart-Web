import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductActions } from "@/components/marketplace/product-actions";
import { ProductBreadcrumbs } from "@/components/marketplace/product-breadcrumbs";
import { ProductGallery } from "@/components/marketplace/product-gallery";
import { ProductSafetyNotice } from "@/components/marketplace/product-safety-notice";
import { RelatedProducts } from "@/components/marketplace/related-products";
import { SellerCard } from "@/components/marketplace/seller-card";
import { Badge } from "@/components/ui/badge";
import {
  formatMarketplacePrice,
  getSellerById,
} from "@/lib/marketplace/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchListing, fetchListings } from "@/lib/api/listing_api";
import { fetchSavedListings } from "@/lib/api/social_api";
import styles from "./product-detail.module.css";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const listedDateFormatter = new Intl.DateTimeFormat("en-NP", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const apiProduct = await fetchListing(id);
  const product = apiProduct.success ? apiProduct.data : undefined;

  if (!product) {
    return {
      title: "Listing not found | CampusCart",
      description: "This CampusCart listing could not be found.",
    };
  }

  return {
    title: `${product.title} | CampusCart`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const apiProduct = await fetchListing(id);
  const product = apiProduct.success ? apiProduct.data : undefined;

  if (!product) notFound();

  const seller = getSellerById(product.sellerId) ?? {
    id: product.sellerId,
    name: product.sellerName ?? "CampusCart student",
    initials: (product.sellerName ?? "CampusCart student").split(" ").map((part)=>part[0]).join("").slice(0,2).toUpperCase(),
    verified: product.verified,
    memberSince: new Date(product.postedAt).getFullYear().toString(),
    affiliation: product.campus,
    responseTime: "Contact the seller for availability",
  };

  const allListings = await fetchListings();
  const relatedProducts = allListings.success
    ? allListings.data.filter((item)=>item.id!==product.id && item.category===product.category).slice(0,4)
    : [];
  const activeListingCount = allListings.success
    ? allListings.data.filter((item)=>item.sellerId===product.sellerId).length
    : 0;
  const listedDate = listedDateFormatter.format(new Date(product.postedAt));
  const savedListings = await fetchSavedListings();
  const initiallySaved =
    savedListings.success &&
    savedListings.data.some((listing) => listing.id === product.id);

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <PageContainer>
          <ProductBreadcrumbs title={product.title} />
        </PageContainer>

        <section className={styles.productSection}>
          <PageContainer className={styles.productLayout}>
            <ProductGallery title={product.title} images={product.images} />

            <div className={styles.info}>
              <div className={styles.productIntro}>
                <div className={styles.badges}>
                  <Badge variant="condition">{product.condition}</Badge>
                  <Badge variant="neutral">{product.category}</Badge>
                </div>
                <h1 className={styles.title}>{product.title}</h1>
                <p className={styles.price}>
                  {formatMarketplacePrice(product.price)}
                </p>
                <p className={styles.summary}>{product.description}</p>

                <dl className={styles.detailsList}>
                  <div>
                    <dt>Condition</dt>
                    <dd>{product.condition}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{product.category}</dd>
                  </div>
                  <div>
                    <dt>Pickup location</dt>
                    <dd>{product.campus}</dd>
                  </div>
                  <div>
                    <dt>Listed</dt>
                    <dd>{listedDate} ({product.postedLabel})</dd>
                  </div>
                  <div>
                    <dt>Listing ID</dt>
                    <dd>{product.id}</dd>
                  </div>
                </dl>
              </div>

              <div className={styles.actionPanel}>
                <ProductActions
                  productId={product.id}
                  initiallySaved={initiallySaved}
                />
                <SellerCard
                  seller={seller}
                  activeListingCount={activeListingCount}
                />
                <ProductSafetyNotice />
              </div>
            </div>
          </PageContainer>
        </section>

        <section className={styles.descriptionSection}>
          <PageContainer className={styles.descriptionContent}>
            <h2>About this item</h2>
            <p>{product.description}</p>
          </PageContainer>
        </section>

        <PageContainer>
          <RelatedProducts products={relatedProducts} />
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
