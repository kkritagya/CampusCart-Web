"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import {
  marketplaceCampuses,
  marketplaceCategories,
  marketplaceConditions,
  type MarketplaceCampus,
  type MarketplaceCategory,
  type MarketplaceCondition,
  type MarketplaceProduct,
} from "@/lib/data/marketplace";
import { useFrontendData } from "@/lib/context/FrontendDataContext";
import { Suspense, useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./marketplace.module.css";
import { formatMarketplacePrice } from "@/lib/marketplace/products";

const PRODUCTS_PER_PAGE = 6;

type SortOption = "newest" | "price-asc" | "price-desc" | "relevant";

function toggleSelection<T extends string>(items: T[], item: T) {
  return items.includes(item)
    ? items.filter((selected) => selected !== item)
    : [...items, item];
}

function relevanceScore(product: MarketplaceProduct, query: string) {
  if (!query) return 0;

  const title = product.title.toLowerCase();
  const category = product.category.toLowerCase();
  const description = product.description.toLowerCase();

  return (
    (title.includes(query) ? 3 : 0) +
    (category.includes(query) ? 2 : 0) +
    (description.includes(query) ? 1 : 0)
  );
}

function ProductGridSkeleton() {
  return (
    <div className={styles.productGrid} aria-label="Loading marketplace listings">
      {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
        <div key={index} className={styles.skeletonCard} aria-hidden="true">
          <div className={styles.skeletonMedia} />
          <div className={styles.skeletonLineShort} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
        </div>
      ))}
      <span className={styles.srOnly} role="status">
        Updating listings
      </span>
    </div>
  );
}

function MarketplaceContent() {
  const { listings: marketplaceProducts } = useFrontendData();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const deferredSearch = useDeferredValue(search);
  const [category, setCategory] = useState<MarketplaceCategory | "All">("All");
  const [conditions, setConditions] = useState<MarketplaceCondition[]>([]);
  const [campuses, setCampuses] = useState<MarketplaceCampus[]>([]);
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const normalizedQuery = deferredSearch.trim().toLowerCase();
  const isSearching = search !== deferredSearch;

  const filteredProducts = useMemo(() => {
    const minimum = minimumPrice === "" ? null : Number(minimumPrice);
    const maximum = maximumPrice === "" ? null : Number(maximumPrice);

    const matches = marketplaceProducts.filter((product) => {
      const searchableText =
        `${product.title} ${product.category} ${product.description}`.toLowerCase();

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (category === "All" || product.category === category) &&
        (conditions.length === 0 || conditions.includes(product.condition)) &&
        (campuses.length === 0 || campuses.includes(product.campus)) &&
        (minimum === null || Number.isNaN(minimum) || product.price >= minimum) &&
        (maximum === null || Number.isNaN(maximum) || product.price <= maximum)
      );
    });

    return [...matches].sort((first, second) => {
      if (sort === "price-asc") return first.price - second.price;
      if (sort === "price-desc") return second.price - first.price;
      if (sort === "relevant") {
        return (
          relevanceScore(second, normalizedQuery) -
          relevanceScore(first, normalizedQuery)
        );
      }
      return Date.parse(second.postedAt) - Date.parse(first.postedAt);
    });
  }, [
    campuses,
    category,
    conditions,
    maximumPrice,
    minimumPrice,
    marketplaceProducts,
    normalizedQuery,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  const hasActiveFilters =
    search !== "" ||
    category !== "All" ||
    conditions.length > 0 ||
    campuses.length > 0 ||
    minimumPrice !== "" ||
    maximumPrice !== "";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setConditions([]);
    setCampuses([]);
    setMinimumPrice("");
    setMaximumPrice("");
    setSort("newest");
    setPage(1);
  };

  const updateCategory = (value: MarketplaceCategory | "All") => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main>
        <section className={styles.pageHeader}>
          <PageContainer>
            <div className={styles.headerRow}>
              <div>
                <h1>Marketplace</h1>
                <p>Find textbooks, electronics, furniture, and more from students on campus.</p>
              </div>
              <p className={styles.listingCount}>
                {marketplaceProducts.length} Listings
              </p>
            </div>

            <label className={styles.searchField}>
              <span className={styles.srOnly}>Search marketplace listings</span>
              <span className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                value={search}
                placeholder="Search textbooks, dorm gear..."
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </PageContainer>
        </section>

        <PageContainer className={styles.marketplaceLayout}>
          <button
            type="button"
            className={styles.filterToggle}
            aria-expanded={filtersOpen}
            aria-controls="marketplace-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {filtersOpen ? "Hide filters" : "Show filters"}
            <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
          </button>

          <aside
            id="marketplace-filters"
            className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`}
            aria-label="Marketplace filters"
          >
            <div className={styles.filterHeading}>
              <h2>Filters</h2>
              {hasActiveFilters ? (
                <button type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : null}
            </div>

            <fieldset className={styles.filterGroup}>
              <legend>Category</legend>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={category === "All"}
                  onChange={() => updateCategory("All")}
                />
                <span>All</span>
              </label>
              {marketplaceCategories.map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === item}
                    onChange={() => updateCategory(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className={styles.filterGroup}>
              <legend>Condition</legend>
              {marketplaceConditions.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={conditions.includes(item)}
                    onChange={() => {
                      setConditions((selected) => toggleSelection(selected, item));
                      setPage(1);
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className={styles.filterGroup}>
              <legend>Campus</legend>
              {marketplaceCampuses.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={campuses.includes(item)}
                    onChange={() => {
                      setCampuses((selected) => toggleSelection(selected, item));
                      setPage(1);
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className={styles.filterGroup}>
              <legend>Price</legend>
              <div className={styles.priceFields}>
                <label>
                  <span>Minimum</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={minimumPrice}
                    placeholder="0"
                    onChange={(event) => {
                      setMinimumPrice(event.target.value);
                      setPage(1);
                    }}
                  />
                </label>
                <label>
                  <span>Maximum</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={maximumPrice}
                    placeholder="Any"
                    onChange={(event) => {
                      setMaximumPrice(event.target.value);
                      setPage(1);
                    }}
                  />
                </label>
              </div>
            </fieldset>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </Button>
          </aside>

          <section className={styles.results} aria-labelledby="marketplace-results">
            <div className={styles.resultsToolbar}>
              <p id="marketplace-results">
                <strong>{filteredProducts.length}</strong>{" "}
                {filteredProducts.length === 1 ? "listing" : "listings"} found
              </p>
              <label>
                <span>Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as SortOption);
                    setPage(1);
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price Low → High</option>
                  <option value="price-desc">Price High → Low</option>
                  <option value="relevant">Most Relevant</option>
                </select>
              </label>
            </div>

            {isSearching ? (
              <ProductGridSkeleton />
            ) : marketplaceProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <h2>No listings</h2>
                <p>There are no marketplace listings available yet.</p>
              </div>
            ) : pageProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <h2>No search results</h2>
                <p>Try another search or clear some filters.</p>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={styles.productGrid}>
                {pageProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    href={`/marketplace/${product.id}`}
                    title={product.title}
                    price={formatMarketplacePrice(product.price)}
                    condition={product.condition}
                    location={product.campus}
                    timestamp={product.postedLabel}
                    verified={product.verified}
                    image={product.images[0]?.src}
                    imageAlt={product.images[0]?.label}
                    visualTone={product.visualTone}
                    showViewDetails
                  />
                ))}
              </div>
            )}

            {!isSearching && filteredProducts.length > 0 ? (
              <nav className={styles.pagination} aria-label="Marketplace pagination">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        className={
                          currentPage === pageNumber ? styles.currentPage : undefined
                        }
                        aria-label={`Go to page ${pageNumber}`}
                        aria-current={currentPage === pageNumber ? "page" : undefined}
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                >
                  Next
                </Button>
              </nav>
            ) : null}
          </section>
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <MarketplaceContent />
    </Suspense>
  );
}
