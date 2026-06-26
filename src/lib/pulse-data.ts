// Extended mock data for production-completion features: notifications, IPO/OFS,
// reports, subscriptions, KYC, sessions, bookmarks, reactions, support.
// Kept separate from mock-data.ts so existing screens remain untouched.
import { commentaries, products, recommendations, relativeTime } from "./mock-data";

export { relativeTime };

const now = Date.now();
const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hrsAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86400_000).toISOString();

// ---------------- User / Account ----------------
export const currentUser = {
  id: "u-001",
  name: "Aditya Mehra",
  email: "aditya.mehra@example.in",
  phone: "+91 98••• ••432",
  clientCode: "SMC-IN-48201",
  kycStatus: "VERIFIED" as "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED",
  panMasked: "ABCDE••••F",
  city: "Mumbai",
  joinedAt: daysAgo(412),
  riskProfile: "Moderate" as "Conservative" | "Moderate" | "Aggressive",
};

// ---------------- Subscription / Purchase ----------------
export type PlanInterval = "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly";
export interface Plan {
  id: string;
  productId: string;
  interval: PlanInterval;
  price: number;
  gst: number;
  popular?: boolean;
}
export const plans: Plan[] = [
  { id: "tf-m", productId: "techno-funda", interval: "Monthly", price: 2999, gst: 540 },
  { id: "tf-q", productId: "techno-funda", interval: "Quarterly", price: 7999, gst: 1440, popular: true },
  { id: "tf-y", productId: "techno-funda", interval: "Yearly", price: 24999, gst: 4500 },
  { id: "ix-m", productId: "index-trading", interval: "Monthly", price: 3999, gst: 720 },
  { id: "ix-q", productId: "index-trading", interval: "Quarterly", price: 9999, gst: 1800, popular: true },
  { id: "cm-m", productId: "commodity-mantra", interval: "Monthly", price: 2499, gst: 450 },
  { id: "cm-q", productId: "commodity-mantra", interval: "Quarterly", price: 6499, gst: 1170 },
  { id: "ekf-m", productId: "equity-ka-funda", interval: "Monthly", price: 1999, gst: 360 },
  { id: "ekf-y", productId: "equity-ka-funda", interval: "Yearly", price: 17999, gst: 3240, popular: true },
];

export interface Subscription {
  id: string;
  productId: string;
  planId: string;
  startedAt: string;
  renewsAt: string;
  status: "ACTIVE" | "EXPIRING" | "EXPIRED" | "CANCELLED";
  autoRenew: boolean;
  channel: "Pulse" | "Pulse + Telegram";
}
export const subscriptions: Subscription[] = [
  {
    id: "sub-001",
    productId: "techno-funda",
    planId: "tf-q",
    startedAt: daysAgo(48),
    renewsAt: daysAgo(-42),
    status: "ACTIVE",
    autoRenew: true,
    channel: "Pulse + Telegram",
  },
  {
    id: "sub-002",
    productId: "index-trading",
    planId: "ix-m",
    startedAt: daysAgo(20),
    renewsAt: daysAgo(-10),
    status: "ACTIVE",
    autoRenew: true,
    channel: "Pulse",
  },
  {
    id: "sub-003",
    productId: "commodity-mantra",
    planId: "cm-m",
    startedAt: daysAgo(28),
    renewsAt: daysAgo(-2),
    status: "EXPIRING",
    autoRenew: false,
    channel: "Pulse",
  },
];

export function subscriptionFor(productId: string) {
  return subscriptions.find((s) => s.productId === productId);
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  productName: string;
  amount: number;
  status: "PAID" | "REFUNDED" | "FAILED";
}
export const invoices: Invoice[] = [
  { id: "inv-009", number: "SMC/2026/IN/00912", date: daysAgo(48), productName: "Techno Funda — Quarterly", amount: 9439, status: "PAID" },
  { id: "inv-008", number: "SMC/2026/IN/00867", date: daysAgo(20), productName: "Index Trading — Monthly", amount: 4719, status: "PAID" },
  { id: "inv-007", number: "SMC/2026/IN/00802", date: daysAgo(28), productName: "Commodity Mantra — Monthly", amount: 2949, status: "PAID" },
  { id: "inv-006", number: "SMC/2025/IN/00641", date: daysAgo(140), productName: "Techno Funda — Quarterly", amount: 9439, status: "PAID" },
];

// ---------------- Notifications ----------------
export type NotifPriority = "HIGH" | "MEDIUM" | "LOW";
export interface Notification {
  id: string;
  priority: NotifPriority;
  title: string;
  body: string;
  at: string;
  read: boolean;
  group: "Action Required" | "Research Update" | "New Recommendation" | "Commentary" | "Account";
  href: string;
}
export const notifications: Notification[] = [
  {
    id: "n-001",
    priority: "HIGH",
    title: "Action: Book 50% on RELIANCE at 2,910",
    body: "Techno Funda · Target 1 approached. Partial booking advised.",
    at: minsAgo(15),
    read: false,
    group: "Action Required",
    href: "/client/recommendation/rec-001",
  },
  {
    id: "n-002",
    priority: "HIGH",
    title: "Action: Trail SL to 195 on NIFTY 25500 CE",
    body: "Index Trading · Risk reduction recommended.",
    at: minsAgo(42),
    read: false,
    group: "Action Required",
    href: "/client/recommendation/rec-003",
  },
  {
    id: "n-003",
    priority: "MEDIUM",
    title: "Correction: NIFTY 25500 CE Target 2 updated",
    body: "Target 2 revised from 230 → 235. Version 2 published.",
    at: hrsAgo(2),
    read: false,
    group: "Research Update",
    href: "/client/recommendation/rec-003",
  },
  {
    id: "n-004",
    priority: "MEDIUM",
    title: "Critical Research Update — Banking pack",
    body: "Tighten stops on long swing trades in the banking pack.",
    at: hrsAgo(3),
    read: false,
    group: "Commentary",
    href: "/client/product/techno-funda",
  },
  {
    id: "n-005",
    priority: "LOW",
    title: "Morning Note — Markets open mixed",
    body: "IT & Auto in focus today.",
    at: hrsAgo(8),
    read: true,
    group: "Commentary",
    href: "/client/product/techno-funda",
  },
  {
    id: "n-006",
    priority: "MEDIUM",
    title: "Commodity Mantra renews in 2 days",
    body: "Auto-renew is OFF. Renew to avoid losing access.",
    at: hrsAgo(10),
    read: true,
    group: "Account",
    href: "/client/subscription",
  },
  {
    id: "n-007",
    priority: "LOW",
    title: "New recommendation — HDFCBANK Buy",
    body: "Techno Funda · Entry 1,672 · SL 1,648",
    at: hrsAgo(4),
    read: true,
    group: "New Recommendation",
    href: "/client/recommendation/rec-002",
  },
];

export function unreadNotifications() {
  return notifications.filter((n) => !n.read).length;
}

// ---------------- IPO / OFS ----------------
export interface IPO {
  id: string;
  name: string;
  symbol: string;
  priceBand: string;
  lotSize: number;
  open: string;
  close: string;
  listingAt: string;
  gmp?: number;
  status: "UPCOMING" | "OPEN" | "CLOSED" | "LISTED";
  category: "Mainboard" | "SME";
  smcView: "Subscribe" | "Avoid" | "Neutral";
  rationale: string;
}
export const ipos: IPO[] = [
  {
    id: "ipo-001",
    name: "Sunlite Industries Ltd",
    symbol: "SUNLITE",
    priceBand: "₹284 – ₹298",
    lotSize: 50,
    open: daysAgo(-1),
    close: daysAgo(-4),
    listingAt: daysAgo(-9),
    gmp: 42,
    status: "UPCOMING",
    category: "Mainboard",
    smcView: "Subscribe",
    rationale: "Niche industrial play, healthy RoCE, reasonable valuation versus listed peers.",
  },
  {
    id: "ipo-002",
    name: "Aether Mobility Ltd",
    symbol: "AETHER",
    priceBand: "₹540 – ₹568",
    lotSize: 26,
    open: daysAgo(0),
    close: daysAgo(-3),
    listingAt: daysAgo(-8),
    gmp: 18,
    status: "OPEN",
    category: "Mainboard",
    smcView: "Neutral",
    rationale: "Strong brand but valuations price in execution. Subscribe for listing gains only.",
  },
  {
    id: "ipo-003",
    name: "Prabhu Specialty Chemicals",
    symbol: "PRABHU",
    priceBand: "₹128 – ₹136",
    lotSize: 110,
    open: daysAgo(2),
    close: daysAgo(-1),
    listingAt: daysAgo(-6),
    gmp: 8,
    status: "OPEN",
    category: "SME",
    smcView: "Neutral",
    rationale: "Concentration risk in customer base; await stabilisation post-listing.",
  },
  {
    id: "ipo-004",
    name: "GreenLeaf Foods Ltd",
    symbol: "GREENLEAF",
    priceBand: "₹212 – ₹224",
    lotSize: 66,
    open: daysAgo(8),
    close: daysAgo(5),
    listingAt: daysAgo(1),
    status: "LISTED",
    category: "Mainboard",
    smcView: "Subscribe",
    rationale: "Listed at ₹258 (+15%). Hold partial; trail stops below ₹240.",
  },
];

export interface OFS {
  id: string;
  name: string;
  symbol: string;
  floorPrice: number;
  cmp: number;
  date: string;
  segment: "Retail" | "Non-Retail";
  status: "UPCOMING" | "OPEN" | "CLOSED";
  smcView: "Subscribe" | "Avoid" | "Neutral";
}
export const ofsList: OFS[] = [
  {
    id: "ofs-001",
    name: "BharatGrid Power Ltd",
    symbol: "BGP",
    floorPrice: 218,
    cmp: 224.4,
    date: daysAgo(-1),
    segment: "Retail",
    status: "UPCOMING",
    smcView: "Subscribe",
  },
  {
    id: "ofs-002",
    name: "Coastal Refineries",
    symbol: "COSTREF",
    floorPrice: 1056,
    cmp: 1078.2,
    date: daysAgo(0),
    segment: "Non-Retail",
    status: "OPEN",
    smcView: "Neutral",
  },
];

// ---------------- Reports ----------------
export interface ResearchReport {
  id: string;
  productId?: string;
  title: string;
  type: "Sector" | "Thematic" | "Model Portfolio" | "Earnings Review" | "Macro";
  publishedAt: string;
  pages: number;
  preview: string;
  analyst: string;
}
export const reports: ResearchReport[] = [
  {
    id: "rep-001",
    productId: "techno-funda",
    title: "Indian Private Banks — Q4 review and FY27 outlook",
    type: "Sector",
    publishedAt: hrsAgo(20),
    pages: 14,
    preview: "NIMs stabilising; credit costs benign. Top picks within the SMC universe.",
    analyst: "Priya Iyer, CFA",
  },
  {
    id: "rep-002",
    productId: "commodity-mantra",
    title: "Crude Oil — Inventory cycle & MCX setups",
    type: "Thematic",
    publishedAt: daysAgo(1),
    pages: 9,
    preview: "Inventory builds suggest a sell-on-rise bias into ₹6,420 – ₹6,440.",
    analyst: "Vikram Saxena",
  },
  {
    id: "rep-003",
    title: "Model Portfolio — December rebalance",
    type: "Model Portfolio",
    publishedAt: daysAgo(3),
    pages: 18,
    preview: "Trimming staples; adding to capital-goods leaders.",
    analyst: "Research Desk",
  },
  {
    id: "rep-004",
    title: "India Macro — RBI policy preview",
    type: "Macro",
    publishedAt: daysAgo(5),
    pages: 7,
    preview: "Status quo on rates; tone likely dovish on growth.",
    analyst: "Dr. Sameer Joshi",
  },
];

// ---------------- Bookmarks ----------------
export interface Bookmark {
  id: string;
  kind: "recommendation" | "commentary" | "report";
  refId: string;
  at: string;
}
export const bookmarks: Bookmark[] = [
  { id: "bm-1", kind: "recommendation", refId: "rec-001", at: hrsAgo(2) },
  { id: "bm-2", kind: "commentary", refId: "com-001", at: hrsAgo(3) },
  { id: "bm-3", kind: "report", refId: "rep-001", at: hrsAgo(20) },
];

// ---------------- Sessions ----------------
export interface Session {
  id: string;
  device: string;
  app: string;
  ip: string;
  city: string;
  lastActive: string;
  current?: boolean;
}
export const sessions: Session[] = [
  { id: "s-1", device: "iPhone 15 Pro", app: "Pulse iOS 1.4.0", ip: "152.58.•••.42", city: "Mumbai, IN", lastActive: minsAgo(2), current: true },
  { id: "s-2", device: "MacBook Pro · Safari", app: "Pulse Web", ip: "152.58.•••.42", city: "Mumbai, IN", lastActive: hrsAgo(3) },
  { id: "s-3", device: "Windows · Chrome", app: "Pulse Web", ip: "203.122.•••.18", city: "Pune, IN", lastActive: daysAgo(4) },
];

// ---------------- Helpers for activity / search ----------------
export function notificationsByGroup() {
  const order: Notification["group"][] = [
    "Action Required",
    "Research Update",
    "New Recommendation",
    "Commentary",
    "Account",
  ];
  return order
    .map((g) => ({ group: g, items: notifications.filter((n) => n.group === g) }))
    .filter((g) => g.items.length > 0);
}

export function globalSearch(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return { recs: [], commentaries: [], products: [], reports: [], ipos: [] };
  const match = (s?: string) => !!s && s.toLowerCase().includes(query);
  return {
    recs: recommendations.filter((r) => match(r.instrument) || match(r.latestAction) || match(r.rationale)),
    commentaries: commentaries.filter((c) => match(c.title) || match(c.preview) || match(c.body)),
    products: products.filter((p) => match(p.name) || match(p.tagline)),
    reports: reports.filter((r) => match(r.title) || match(r.preview)),
    ipos: ipos.filter((i) => match(i.name) || match(i.symbol)),
  };
}

export const recentSearches = ["RELIANCE", "Banking outlook", "Crude oil", "Nifty range"];

// ---------------- Support ----------------
export const supportTopics = [
  { id: "kyc", title: "KYC & Verification", count: 12 },
  { id: "subs", title: "Subscription & Billing", count: 18 },
  { id: "research", title: "Research & Recommendations", count: 24 },
  { id: "telegram", title: "Telegram & Notifications", count: 9 },
  { id: "account", title: "Account & Security", count: 11 },
];

export const supportTickets = [
  { id: "tkt-2041", subject: "Telegram channel access pending", status: "OPEN", at: hrsAgo(6) },
  { id: "tkt-2019", subject: "Invoice GST correction", status: "RESOLVED", at: daysAgo(4) },
];