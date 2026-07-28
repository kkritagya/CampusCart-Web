import type { ProductCardProps } from "@/components/marketplace/product-card";
import type { MarketplacePreviewCardProps } from "@/components/marketplace/marketplace-preview-card";

// Demo-only landing content. These values are not fetched from the CampusCart backend.

export type LandingCategory = {
  name: string;
  description: string;
  shortLabel: string;
};

export type LandingFeature = {
  index: string;
  title: string;
  description: string;
};

export const landingStats = [
  { value: "2k+", label: "Active listings" },
  { value: "24h", label: "Average pickup time" },
  { value: "40%", label: "Average student savings" },
] as const;

export const heroPreviewFilters = ["All", "Books", "Tech", "Dorm"] as const;

export const heroPreviewProducts: MarketplacePreviewCardProps[] = [
  {
    title: "Organic Chemistry, 12th ed.",
    price: "Rs. 2,400",
    category: "Books",
    condition: "Good",
    location: "Central Library",
    verified: true,
    visualTone: "book",
  },
  {
    title: "65W USB-C laptop charger",
    price: "Rs. 1,150",
    category: "Tech",
    condition: "Like new",
    location: "Engineering Block",
    verified: true,
    visualTone: "tech",
  },
  {
    title: "Adjustable study lamp",
    price: "Rs. 850",
    category: "Dorm",
    condition: "Excellent",
    location: "North Campus",
    visualTone: "home",
  },
];

export const landingFeatures: LandingFeature[] = [
  {
    index: "01",
    title: "Student-first community",
    description: "Connect locally with students buying and selling around campus.",
  },
  {
    index: "02",
    title: "Convenient pickup",
    description: "Arrange handoffs in familiar, public campus spaces.",
  },
  {
    index: "03",
    title: "Prices that make sense",
    description: "Find useful course, dorm, and tech essentials on a student budget.",
  },
  {
    index: "04",
    title: "Safer local exchange",
    description: "Use account details and public meeting points to trade with confidence.",
  },
];

export const landingProducts: ProductCardProps[] = [
  {
    href: "/marketplace/psychology-textbook",
    title: "Psychology textbook",
    price: "Rs. 2,800",
    condition: "Good",
    location: "Main library",
    timestamp: "2h ago",
    verified: true,
    visualTone: "book",
  },
  {
    href: "/marketplace/mini-fridge",
    title: "Compact dorm fridge",
    price: "Rs. 1,200",
    condition: "Good",
    location: "Dorm area",
    timestamp: "4h ago",
    verified: true,
    visualTone: "home",
  },
  {
    href: "/marketplace/usb-c-charger",
    title: "65W USB-C charger",
    price: "Rs. 800",
    condition: "Like new",
    location: "Engineering block",
    timestamp: "Today",
    verified: false,
    visualTone: "tech",
  },
  {
    href: "/marketplace/office-chair",
    title: "Adjustable study chair",
    price: "Rs. 3,500",
    condition: "Excellent",
    location: "North campus",
    timestamp: "1d ago",
    verified: true,
    visualTone: "accessory",
  },
];

export const landingCategories: LandingCategory[] = [
  { name: "Textbooks", description: "Course books, notes, and study guides", shortLabel: "TB" },
  { name: "Electronics", description: "Laptops, chargers, audio, and accessories", shortLabel: "EL" },
  { name: "Dorm & furniture", description: "Storage, seating, lamps, and essentials", shortLabel: "DF" },
  { name: "Clothing", description: "Everyday wear, formal pieces, and campus merch", shortLabel: "CL" },
];
