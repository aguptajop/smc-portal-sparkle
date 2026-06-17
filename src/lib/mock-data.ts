export type RecStatus = "ACTION_REQUIRED" | "ACTIVE" | "PARTIAL" | "CLOSED" | "CORRECTED";
export type AssetClass = "EQUITY" | "INDEX_OPTION" | "STOCK_OPTION" | "COMMODITY";
export type Direction = "BUY" | "SELL";

export interface Update {
  at: string; // ISO
  label: string;
  detail?: string;
  type?: "ENTRY" | "BOOK" | "TRAIL_SL" | "EXIT" | "TARGET_HIT" | "SL_HIT" | "CORRECTION" | "NOTE";
}

export interface Recommendation {
  id: string;
  productId: string;
  assetClass: AssetClass;
  instrument: string;
  direction: Direction;
  status: RecStatus;
  entry: string;
  sl: string;
  targets: string[];
  latestAction: string;
  updatedAt: string; // ISO
  rationale?: string;
  // Options/commodity
  strike?: string;
  optionType?: "CE" | "PE";
  expiry?: string;
  // Performance for closed
  pnlPct?: number;
  conviction?: "High" | "Medium" | "Tactical";
  updates: Update[];
  corrections?: { field: string; previous: string; next: string; at: string }[];
}

export interface Commentary {
  id: string;
  productId: string;
  type: "Morning Note" | "Market Outlook" | "Critical Research Update";
  title: string;
  preview: string;
  body: string;
  publishedAt: string;
  pinned?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  riskProfile: "Low" | "Moderate" | "High";
  holdingHorizon: string;
  researchStatus: "Active Today" | "No New Updates" | "Market Closed";
  subscribed: boolean;
  lastCallAt?: string;
  lastCommentaryAt?: string;
}

const now = Date.now();
const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hrsAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86400_000).toISOString();

export const products: Product[] = [
  {
    id: "techno-funda",
    name: "Techno Funda",
    tagline: "Swing trades from technical + fundamental confluence",
    summary:
      "Short-to-medium term equity ideas combining technical breakouts with fundamental conviction. Curated by the equity research desk.",
    riskProfile: "Moderate",
    holdingHorizon: "1–5 Trading Days",
    researchStatus: "Active Today",
    subscribed: true,
    lastCallAt: minsAgo(15),
    lastCommentaryAt: hrsAgo(3),
  },
  {
    id: "index-trading",
    name: "Index Trading",
    tagline: "Intraday & positional index options",
    summary:
      "High-conviction directional ideas on Nifty and Bank Nifty using index options. Tight risk, defined targets.",
    riskProfile: "High",
    holdingHorizon: "Intraday to 5 Trading Days",
    researchStatus: "Active Today",
    subscribed: true,
    lastCallAt: minsAgo(42),
    lastCommentaryAt: hrsAgo(5),
  },
  {
    id: "commodity-mantra",
    name: "Commodity Mantra",
    tagline: "MCX commodities — daily research",
    summary:
      "Crude, gold, silver and base metals research with positional setups and intraday triggers.",
    riskProfile: "High",
    holdingHorizon: "Intraday to 3 Trading Days",
    researchStatus: "No New Updates",
    subscribed: true,
    lastCallAt: hrsAgo(20),
    lastCommentaryAt: hrsAgo(8),
  },
  {
    id: "equity-ka-funda",
    name: "Equity Ka Funda",
    tagline: "Long-only positional equity",
    summary:
      "Fundamental positional ideas with a 2–8 week horizon. Built for SIP-style accumulation.",
    riskProfile: "Moderate",
    holdingHorizon: "2–8 Weeks",
    researchStatus: "No New Updates",
    subscribed: false,
    lastCallAt: daysAgo(2),
    lastCommentaryAt: daysAgo(1),
  },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-001",
    productId: "techno-funda",
    assetClass: "EQUITY",
    instrument: "RELIANCE",
    direction: "BUY",
    status: "ACTION_REQUIRED",
    entry: "2,845 – 2,855",
    sl: "2,798",
    targets: ["2,910", "2,955"],
    latestAction: "Book 50% at first target",
    updatedAt: minsAgo(15),
    conviction: "High",
    rationale:
      "Breakout from a 6-week base on rising volume; sectoral tailwind from O2C margins improving QoQ.",
    updates: [
      { at: daysAgo(2), label: "Entry initiated", type: "ENTRY", detail: "Buy 2,845 – 2,855" },
      { at: hrsAgo(20), label: "Target 1 approached", type: "NOTE" },
      { at: minsAgo(15), label: "Action: Book 50% at 2,910", type: "BOOK" },
    ],
  },
  {
    id: "rec-002",
    productId: "techno-funda",
    assetClass: "EQUITY",
    instrument: "HDFCBANK",
    direction: "BUY",
    status: "ACTIVE",
    entry: "1,672",
    sl: "1,648",
    targets: ["1,705", "1,725"],
    latestAction: "Hold — running with original SL",
    updatedAt: hrsAgo(4),
    conviction: "Medium",
    updates: [
      { at: daysAgo(1), label: "Entry initiated", type: "ENTRY" },
      { at: hrsAgo(4), label: "Holding — no change", type: "NOTE" },
    ],
  },
  {
    id: "rec-003",
    productId: "index-trading",
    assetClass: "INDEX_OPTION",
    instrument: "NIFTY 25500 CE",
    direction: "BUY",
    status: "ACTION_REQUIRED",
    entry: "182 – 188",
    sl: "162",
    targets: ["215", "235"],
    latestAction: "Trail SL to 195",
    updatedAt: minsAgo(42),
    strike: "25500",
    optionType: "CE",
    expiry: "26 Jun 2026",
    conviction: "High",
    updates: [
      { at: hrsAgo(6), label: "Entry initiated", type: "ENTRY" },
      { at: minsAgo(42), label: "Action: Trail SL to 195", type: "TRAIL_SL" },
    ],
    corrections: [
      { field: "Target 2", previous: "230", next: "235", at: hrsAgo(2) },
    ],
  },
  {
    id: "rec-004",
    productId: "index-trading",
    assetClass: "INDEX_OPTION",
    instrument: "BANKNIFTY 56000 PE",
    direction: "BUY",
    status: "PARTIAL",
    entry: "240",
    sl: "210",
    targets: ["285", "315"],
    latestAction: "50% booked at 285",
    updatedAt: hrsAgo(2),
    strike: "56000",
    optionType: "PE",
    expiry: "26 Jun 2026",
    conviction: "Medium",
    updates: [
      { at: hrsAgo(8), label: "Entry initiated", type: "ENTRY" },
      { at: hrsAgo(2), label: "Booked 50% at 285", type: "BOOK" },
    ],
  },
  {
    id: "rec-005",
    productId: "commodity-mantra",
    assetClass: "COMMODITY",
    instrument: "CRUDEOIL JUN FUT",
    direction: "SELL",
    status: "ACTIVE",
    entry: "6,420",
    sl: "6,480",
    targets: ["6,355", "6,300"],
    latestAction: "Hold — watching 6,420 retest",
    updatedAt: hrsAgo(6),
    expiry: "19 Jun 2026",
    conviction: "Medium",
    updates: [
      { at: hrsAgo(20), label: "Entry initiated", type: "ENTRY" },
      { at: hrsAgo(6), label: "Holding — no change", type: "NOTE" },
    ],
  },
  {
    id: "rec-006",
    productId: "techno-funda",
    assetClass: "EQUITY",
    instrument: "INFY",
    direction: "BUY",
    status: "CLOSED",
    entry: "1,520",
    sl: "1,492",
    targets: ["1,560", "1,585"],
    latestAction: "Exit at 1,562 — Target 1 achieved",
    updatedAt: daysAgo(3),
    pnlPct: 2.8,
    updates: [
      { at: daysAgo(6), label: "Entry initiated", type: "ENTRY" },
      { at: daysAgo(3), label: "Target 1 hit — exit 1,562", type: "TARGET_HIT" },
    ],
  },
  {
    id: "rec-007",
    productId: "techno-funda",
    assetClass: "EQUITY",
    instrument: "TATAMOTORS",
    direction: "BUY",
    status: "CLOSED",
    entry: "985",
    sl: "962",
    targets: ["1,015", "1,040"],
    latestAction: "Stop loss triggered at 962",
    updatedAt: daysAgo(5),
    pnlPct: -2.3,
    updates: [
      { at: daysAgo(8), label: "Entry initiated", type: "ENTRY" },
      { at: daysAgo(5), label: "SL hit — exit 962", type: "SL_HIT" },
    ],
  },
];

export const commentaries: Commentary[] = [
  {
    id: "com-001",
    productId: "techno-funda",
    type: "Critical Research Update",
    title: "Banking pack shows distribution — tighten stops",
    preview:
      "Private bank leaders printed an outside bar on rising volume. Recommending tighter risk on long swing trades in the pack.",
    body:
      "Private bank leaders printed an outside bar on rising volume. Recommending tighter risk on long swing trades in the pack until 56,200 reclaims with follow-through.",
    publishedAt: hrsAgo(3),
    pinned: true,
  },
  {
    id: "com-002",
    productId: "techno-funda",
    type: "Morning Note",
    title: "Markets open mixed; IT & Auto in focus",
    preview:
      "SGX Nifty flat. Watch IT for follow-through after yesterday's reversal; auto majors near key resistance.",
    body:
      "SGX Nifty flat. Watch IT for follow-through after yesterday's reversal. Auto majors near key resistance — wait for confirmed breakouts rather than chasing.",
    publishedAt: hrsAgo(8),
  },
  {
    id: "com-003",
    productId: "index-trading",
    type: "Market Outlook",
    title: "Nifty: range 25,280 – 25,640 holds for the week",
    preview:
      "Options data suggests strong support at 25,300 and resistance at 25,600. Prefer to trade the range with defined risk.",
    body:
      "Options data suggests strong support at 25,300 and resistance at 25,600. Prefer to trade the range with defined risk; breakouts are low-probability without VIX expansion.",
    publishedAt: hrsAgo(5),
    pinned: true,
  },
  {
    id: "com-004",
    productId: "commodity-mantra",
    type: "Morning Note",
    title: "Crude softens on inventory build",
    preview:
      "API inventory print surprised higher. Bias remains sell-on-rise into 6,420 – 6,440.",
    body:
      "API inventory print surprised higher. Bias remains sell-on-rise into 6,420 – 6,440 with stops above 6,480.",
    publishedAt: hrsAgo(8),
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function recsByProduct(id: string) {
  return recommendations.filter((r) => r.productId === id);
}

export function commentariesByProduct(id: string) {
  return commentaries.filter((c) => c.productId === id);
}

export function pinnedCommentary(productId: string) {
  return commentaries.find((c) => c.productId === productId && c.pinned);
}

export function actionRequiredCount(productId?: string) {
  return recommendations.filter(
    (r) => r.status === "ACTION_REQUIRED" && (!productId || r.productId === productId),
  ).length;
}

export function activeCount(productId?: string) {
  return recommendations.filter(
    (r) =>
      (r.status === "ACTIVE" || r.status === "PARTIAL" || r.status === "ACTION_REQUIRED") &&
      (!productId || r.productId === productId),
  ).length;
}

// Activity feed: all updates sorted desc
export function activityFeed() {
  const items: { at: string; rec: Recommendation; update: Update }[] = [];
  for (const rec of recommendations) {
    for (const u of rec.updates) {
      items.push({ at: u.at, rec, update: u });
    }
  }
  return items.sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

export function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} hour${h > 1 ? "s" : ""} ago`;
  }
  const d = Math.floor(diff / 86400);
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}