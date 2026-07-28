import {
  marketplaceProducts,
  marketplaceSellers,
  type MarketplaceProduct,
  type MarketplaceSeller,
} from "@/lib/data/marketplace";

export function getProductById(id: string) {
  return marketplaceProducts.find((product) => product.id === id);
}

export function getSellerById(id: string): MarketplaceSeller | undefined {
  return marketplaceSellers[id];
}

export function getSellerActiveListingCount(sellerId: string) {
  return marketplaceProducts.filter((product) => product.sellerId === sellerId)
    .length;
}

export function getRelatedProducts(
  product: MarketplaceProduct,
  limit = 4
): MarketplaceProduct[] {
  const candidates = marketplaceProducts.filter(
    (candidate) => candidate.id !== product.id
  );
  const sameCategory = candidates.filter(
    (candidate) => candidate.category === product.category
  );
  const otherCategories = candidates.filter(
    (candidate) => candidate.category !== product.category
  );

  return [...sameCategory, ...otherCategories].slice(0, limit);
}

export function formatMarketplacePrice(price: number) {
  return `Rs. ${new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 0,
  }).format(price)}`;
}
