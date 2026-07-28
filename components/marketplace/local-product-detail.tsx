"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductActions } from "@/components/marketplace/product-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFrontendData } from "@/lib/context/FrontendDataContext";
import { formatMarketplacePrice } from "@/lib/marketplace/products";
import styles from "@/app/marketplace/[id]/product-detail.module.css";

export function LocalProductDetail({ id }: { id: string }) {
  const { listings } = useFrontendData();
  const product = listings.find((item) => item.id === id);
  if (!product) return <div className={styles.page}><SiteHeader/><main><PageContainer><section className={styles.descriptionSection}><h1>Listing not found</h1><p>This listing may have been removed or is unavailable on this device.</p><Button href="/marketplace">Back to marketplace</Button></section></PageContainer></main><SiteFooter/></div>;
  return <div className={styles.page}><SiteHeader/><main><section className={styles.productSection}><PageContainer className={styles.productLayout}><div className={styles.info}><div className={styles.productIntro}><div className={styles.badges}><Badge variant="condition">{product.condition}</Badge><Badge>{product.category}</Badge></div><h1 className={styles.title}>{product.title}</h1><p className={styles.price}>{formatMarketplacePrice(product.price)}</p><p className={styles.summary}>{product.description}</p><dl className={styles.detailsList}><div><dt>Pickup location</dt><dd>{product.campus}</dd></div><div><dt>Status</dt><dd>{product.status??"Active"}</dd></div><div><dt>Listing ID</dt><dd>{product.id}</dd></div></dl></div><div className={styles.actionPanel}><ProductActions productId={product.id}/>{product.ownerId?<Button href={`/dashboard/listings/${product.id}/edit`} variant="outline" fullWidth>Edit your listing</Button>:null}</div></div></PageContainer></section></main><SiteFooter/></div>;
}
