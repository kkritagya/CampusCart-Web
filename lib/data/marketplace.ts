export const marketplaceCategories = [
  "Electronics",
  "Books",
  "Furniture",
  "Clothing",
  "Sports",
  "Other",
] as const;

export const marketplaceConditions = ["New", "Like New", "Good", "Fair"] as const;

export const marketplaceCampuses = [
  "Main Campus",
  "Library",
  "Engineering",
  "Student Union",
  "North Campus",
  "South Campus",
] as const;

export type MarketplaceCategory = (typeof marketplaceCategories)[number];
export type MarketplaceCondition = (typeof marketplaceConditions)[number];
export type MarketplaceCampus = (typeof marketplaceCampuses)[number];

export type MarketplaceVisualTone = "book" | "tech" | "home" | "accessory";

export type MarketplaceProductImage = {
  label: string;
  tone: MarketplaceVisualTone;
  variant: "primary" | "detail" | "included";
  src?: string;
};

export type MarketplaceSeller = {
  id: string;
  name: string;
  initials: string;
  verified: boolean;
  memberSince: string;
  affiliation: string;
  responseTime: string;
};

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  condition: MarketplaceCondition;
  campus: MarketplaceCampus;
  price: number;
  verified: boolean;
  postedLabel: string;
  postedAt: string;
  visualTone: MarketplaceVisualTone;
  images: MarketplaceProductImage[];
  sellerId: string;
  sellerName?: string;
  ownerId?: string;
  status?: "Active" | "Sold" | "Draft";
  verificationStatus?: "Pending" | "Verified" | "Rejected";
  moderationReason?: string;
  views?: number;
  enquiries?: number;
  tags?: string[];
};

export const CURRENT_FIXTURE_USER_ID = "current-user";

export const marketplaceSellers: Record<string, MarketplaceSeller> = {
  [CURRENT_FIXTURE_USER_ID]: {
    id: CURRENT_FIXTURE_USER_ID,
    name: "CampusCart Student",
    initials: "CS",
    verified: true,
    memberSince: "2026",
    affiliation: "Main Campus",
    responseTime: "Usually responds within two hours",
  },
  "maya-shrestha": {
    id: "maya-shrestha",
    name: "Maya Shrestha",
    initials: "MS",
    verified: true,
    memberSince: "2024",
    affiliation: "Main Campus",
    responseTime: "Usually responds within an hour",
  },
  "aarav-karki": {
    id: "aarav-karki",
    name: "Aarav Karki",
    initials: "AK",
    verified: true,
    memberSince: "2023",
    affiliation: "Engineering",
    responseTime: "Usually responds within two hours",
  },
  "nisha-thapa": {
    id: "nisha-thapa",
    name: "Nisha Thapa",
    initials: "NT",
    verified: true,
    memberSince: "2025",
    affiliation: "North Campus",
    responseTime: "Usually responds the same day",
  },
  "rohan-gurung": {
    id: "rohan-gurung",
    name: "Rohan Gurung",
    initials: "RG",
    verified: false,
    memberSince: "2025",
    affiliation: "Student Union",
    responseTime: "Usually responds the same day",
  },
  "sara-rai": {
    id: "sara-rai",
    name: "Sara Rai",
    initials: "SR",
    verified: true,
    memberSince: "2024",
    affiliation: "Library",
    responseTime: "Usually responds within three hours",
  },
};

function fixtureGallery(
  title: string,
  tone: MarketplaceVisualTone
): MarketplaceProductImage[] {
  return [
    { label: `${title}, primary view`, tone, variant: "primary" },
    { label: `${title}, condition detail`, tone, variant: "detail" },
    { label: `${title}, included items`, tone, variant: "included" },
  ];
}

// Frontend-only marketplace fixtures. No values in this file come from the backend.
export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "macbook-air-m2",
    title: "MacBook Air M2, 13-inch",
    description: "Lightly used laptop with charger, ideal for classes and project work. The battery comfortably lasts through a day of lectures, and the body has no dents or visible scratches.",
    category: "Electronics",
    condition: "Like New",
    campus: "Library",
    price: 98000,
    verified: true,
    postedLabel: "2h ago",
    postedAt: "2026-07-25T11:00:00+05:45",
    visualTone: "tech",
    images: fixtureGallery("MacBook Air M2, 13-inch", "tech"),
    sellerId: "maya-shrestha",
    ownerId: CURRENT_FIXTURE_USER_ID,
    status: "Active",
    views: 84,
    enquiries: 5,
    tags: ["laptop", "apple"],
  },
  {
    id: "dell-ultrasharp-monitor",
    title: "Dell UltraSharp 24-inch Monitor",
    description: "Full HD IPS display with an adjustable stand and HDMI cable. Colours remain accurate and the panel has no dead pixels, making it a dependable second screen for study.",
    category: "Electronics",
    condition: "Good",
    campus: "Engineering",
    price: 16500,
    verified: true,
    postedLabel: "4h ago",
    postedAt: "2026-07-25T09:00:00+05:45",
    visualTone: "tech",
    images: fixtureGallery("Dell UltraSharp 24-inch Monitor", "tech"),
    sellerId: "aarav-karki",
  },
  {
    id: "calculus-textbook",
    title: "Calculus: Early Transcendentals",
    description: "Course textbook with clean pages and a few useful margin notes. All chapters are intact, the binding is firm, and the worked examples are especially useful for first-year revision.",
    category: "Books",
    condition: "Good",
    campus: "Library",
    price: 2800,
    verified: true,
    postedLabel: "Today",
    postedAt: "2026-07-25T07:30:00+05:45",
    visualTone: "book",
    images: fixtureGallery("Calculus: Early Transcendentals", "book"),
    sellerId: "sara-rai",
    ownerId: CURRENT_FIXTURE_USER_ID,
    status: "Active",
    views: 41,
    enquiries: 2,
    tags: ["textbook", "maths"],
  },
  {
    id: "gaming-keyboard",
    title: "Keychron Mechanical Keyboard",
    description: "Compact wireless keyboard with tactile switches and USB-C cable. It pairs with three devices, holds charge well, and includes the original keycap puller.",
    category: "Electronics",
    condition: "Like New",
    campus: "Engineering",
    price: 7200,
    verified: false,
    postedLabel: "1d ago",
    postedAt: "2026-07-24T18:00:00+05:45",
    visualTone: "accessory",
    images: fixtureGallery("Keychron Mechanical Keyboard", "accessory"),
    sellerId: "rohan-gurung",
  },
  {
    id: "desk-lamp",
    title: "Adjustable LED Desk Lamp",
    description: "Dimmable study lamp with warm and cool light settings. The flexible neck holds its position, and the compact base fits comfortably on a dorm desk.",
    category: "Furniture",
    condition: "Like New",
    campus: "North Campus",
    price: 1450,
    verified: true,
    postedLabel: "1d ago",
    postedAt: "2026-07-24T14:30:00+05:45",
    visualTone: "home",
    images: fixtureGallery("Adjustable LED Desk Lamp", "home"),
    sellerId: "nisha-thapa",
    ownerId: CURRENT_FIXTURE_USER_ID,
    status: "Draft",
    views: 12,
    enquiries: 0,
    tags: ["study", "lighting"],
  },
  {
    id: "office-chair",
    title: "Ergonomic Office Chair",
    description: "Adjustable height and lumbar support make this chair comfortable for long study sessions. The wheels roll smoothly and the fabric has been recently cleaned.",
    category: "Furniture",
    condition: "Good",
    campus: "Main Campus",
    price: 8500,
    verified: true,
    postedLabel: "2d ago",
    postedAt: "2026-07-23T16:00:00+05:45",
    visualTone: "home",
    images: fixtureGallery("Ergonomic Office Chair", "home"),
    sellerId: "nisha-thapa",
  },
  {
    id: "graphing-calculator",
    title: "Casio Graphing Calculator",
    description: "Approved scientific calculator with a protective case and fresh batteries. Every key works correctly and the screen is clear without scratches or faded segments.",
    category: "Electronics",
    condition: "Good",
    campus: "Student Union",
    price: 4200,
    verified: true,
    postedLabel: "2d ago",
    postedAt: "2026-07-23T11:00:00+05:45",
    visualTone: "accessory",
    images: fixtureGallery("Casio Graphing Calculator", "accessory"),
    sellerId: "aarav-karki",
  },
  {
    id: "mini-fridge",
    title: "Compact Mini Fridge",
    description: "Quiet dorm-size fridge with freezer tray, cleaned and ready for pickup. It cools consistently, seals properly, and fits neatly beneath a standard dorm counter.",
    category: "Furniture",
    condition: "Good",
    campus: "North Campus",
    price: 9500,
    verified: false,
    postedLabel: "3d ago",
    postedAt: "2026-07-22T13:15:00+05:45",
    visualTone: "home",
    images: fixtureGallery("Compact Mini Fridge", "home"),
    sellerId: "rohan-gurung",
  },
  {
    id: "campus-bike",
    title: "Hybrid Campus Bike",
    description: "Reliable seven-speed bike recently serviced with a new rear tyre. Brakes and gears work smoothly, and the frame suits everyday rides between campus buildings.",
    category: "Sports",
    condition: "Good",
    campus: "Student Union",
    price: 18500,
    verified: true,
    postedLabel: "3d ago",
    postedAt: "2026-07-22T09:45:00+05:45",
    visualTone: "accessory",
    images: fixtureGallery("Hybrid Campus Bike", "accessory"),
    sellerId: "maya-shrestha",
  },
  {
    id: "sony-headphones",
    title: "Sony Noise-Cancelling Headphones",
    description: "Comfortable over-ear headphones with case and charging cable. Noise cancellation, microphones, and touch controls all work properly, with excellent remaining battery life.",
    category: "Electronics",
    condition: "Like New",
    campus: "Main Campus",
    price: 22000,
    verified: true,
    postedLabel: "4d ago",
    postedAt: "2026-07-21T17:20:00+05:45",
    visualTone: "tech",
    images: fixtureGallery("Sony Noise-Cancelling Headphones", "tech"),
    sellerId: "maya-shrestha",
  },
  {
    id: "university-hoodie",
    title: "Campus Society Hoodie",
    description: "Navy unisex hoodie in medium, washed once and in excellent condition. The print is crisp, the cuffs retain their shape, and there are no marks or loose seams.",
    category: "Clothing",
    condition: "Like New",
    campus: "Main Campus",
    price: 1800,
    verified: false,
    postedLabel: "4d ago",
    postedAt: "2026-07-21T12:00:00+05:45",
    visualTone: "accessory",
    images: fixtureGallery("Campus Society Hoodie", "accessory"),
    sellerId: "sara-rai",
  },
  {
    id: "organic-chemistry",
    title: "Organic Chemistry Study Bundle",
    description: "Textbook, revision cards, and organised lecture notes for first-year study. The bundle covers the full module and includes concise summaries for the most difficult reaction mechanisms.",
    category: "Books",
    condition: "Good",
    campus: "Library",
    price: 3600,
    verified: true,
    postedLabel: "5d ago",
    postedAt: "2026-07-20T10:30:00+05:45",
    visualTone: "book",
    images: fixtureGallery("Organic Chemistry Study Bundle", "book"),
    sellerId: "sara-rai",
  },
  {
    id: "football-boots",
    title: "Nike Football Boots",
    description: "Size 42 firm-ground boots used for one season and recently cleaned. The studs have plenty of life remaining and the upper has only light cosmetic wear.",
    category: "Sports",
    condition: "Fair",
    campus: "North Campus",
    price: 3200,
    verified: true,
    postedLabel: "6d ago",
    postedAt: "2026-07-19T15:00:00+05:45",
    visualTone: "accessory",
    images: fixtureGallery("Nike Football Boots", "accessory"),
    sellerId: "aarav-karki",
  },
  {
    id: "storage-crates",
    title: "Stackable Dorm Storage Crates",
    description: "Set of four sturdy crates for books, clothes, or pantry supplies. They stack securely, wipe clean easily, and are useful for moving between dorm rooms.",
    category: "Other",
    condition: "Good",
    campus: "North Campus",
    price: 1200,
    verified: false,
    postedLabel: "1w ago",
    postedAt: "2026-07-18T10:00:00+05:45",
    visualTone: "home",
    images: fixtureGallery("Stackable Dorm Storage Crates", "home"),
    sellerId: "nisha-thapa",
  },
  {
    id: "water-bottle",
    title: "Insulated Steel Water Bottle",
    description: "One-litre bottle, unused, with a leak-proof lid and carry loop. The double-wall body keeps drinks cool through long lecture days and fits standard backpack pockets.",
    category: "Other",
    condition: "New",
    campus: "Engineering",
    price: 1100,
    verified: true,
    postedLabel: "1w ago",
    postedAt: "2026-07-17T14:00:00+05:45",
    visualTone: "accessory",
    images: fixtureGallery("Insulated Steel Water Bottle", "accessory"),
    sellerId: "rohan-gurung",
  },
];
