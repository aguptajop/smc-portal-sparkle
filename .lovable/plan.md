# SMC Pulse Client — Implementation Plan (v2)

Authority: `CLIENT-EXPERIENCE-MASTER-SPEC.md` v1.1 governs every decision. Where this plan and the spec disagree, the spec wins. Analyst portal is OUT of scope for this revision.

## Product Laws (Absolute)
Research IS the product. UI serves research. Three questions, every screen:
1. What is new?
2. What needs action?
3. What is the current state of my positions?

Anti-patterns (do not implement): dashboard widgets, greeting banners on Home, marketing copy, CRM layouts, social/gamification, decorative gradients, excessive motion.

## Bottom Nav — exactly 4
`Home` · `Activity` · `Products` · `Profile`. IPO/OFS/Reports are content TYPES, accessible via Activity (filters), Search and deep links — NOT tabs.

## Routes (TanStack Start)
```
/                              Landing → /auth or /client
/auth                          Phone + OTP login
/onboarding/kyc                KYC contextual gate (5 steps)
/onboarding/subscribe          Plan selection + checkout simulation

/client                        Home (Research Workspace, per Product Switcher)
/client/activity               Activity Center (cross-product, filter chips)
/client/products               Products: Subscribed → Available → Tools
/client/profile                Account + Subscriptions + Settings + Sign Out

/client/notifications          Notification Center (Today / Yesterday / This Week / Earlier)
/client/search                 Global search overlay
/client/bookmarks              Saved items
/client/settings               Notification prefs + Devices
/client/subscription           Billing & invoices
/client/help                   Support

/client/product/$id            Product Detail (3-col desktop, 8-section mobile)
/client/recommendation/$id     Recommendation Detail + Timeline + Corrections
/client/commentary/$id         Commentary Detail
/client/poll/$id               Poll Detail
/client/report/$id             Report Detail
/client/ipo/$id                IPO Review Detail
/client/ofs/$id                OFS Review Detail
```

## Information Hierarchy by screen

### Home (per Product Switcher; "All Products" allowed)
1. Action Required (amber left border; impossible to scroll past)
2. New Since Last Visit (capped 24h–7d window)
3. Active Positions (ACTIVE + PARTIAL — excluding any in Action Required)
4. Pinned Commentary (max 1, two-line preview)
5. Recently Closed (max 3, last 7 days)

No greeting. No banners. No metrics widgets.

### Activity Center
- Filter chip bar: Product · Type (All/Calls/Commentary/Reports/Polls) · Status · Time (More ▾ sheet on mobile)
- Cross-product chronological stream with Product Badge on every card
- 20 initial, infinite scroll
- Empty filtered state with "Clear filters" CTA

### Products
- Subscribed (with active/action counts + validity)
- Available (locked overlay)
- Tools (Autotrender, external launch)

### Recommendation Detail
Direction + Instrument + Status header → Key Values grid (Entry / SL / Targets) → Action Required banner (if applicable) → Rationale (collapsed) → Timeline (chronological, append-only) → Corrections (strike-through previous → new) → 5-emoji Engagement bar + Bookmark → Published-by footer.

### Notifications
Grouped by Today / Yesterday / This Week / Earlier. Unread = 8px blue dot. "Mark all read" in header. 90-day retention.

### Search
Full-screen overlay (mobile), inline input (desktop). 300ms debounce, min 2 chars. Results grouped by type. Recent searches before typing. "No results for X" guidance.

### Profile
Account card (name/phone/email; edit sheet) → Subscriptions list → Quick access tiles → Settings (Notification Prefs, Devices, Help, Legal) → Sign out.

## Design System
- Brand: SMC Blue `#003A70`, Teal `#0097A7`, Teal-soft `#E0F7FA`
- Status: ACTIVE = teal-soft / teal text; ACTION_REQUIRED = amber-soft / amber; PARTIAL = purple-soft / purple; CLOSED_WIN = green-soft / green; CLOSED_LOSS = red-soft / red
- Direction: BUY green / SELL red (with soft background)
- Product badge accents: Techno Funda = teal, Index Trading = blue, Commodity Mantra = amber, Bullion = gold, Equity = green
- Tabular numerals on every financial value (`.tabular`)
- Card: 1px border, 8px radius, no shadow at rest, soft shadow on hover, 16px padding; Action-Required cards = 3px amber left border
- Spacing scale: 4/8/12/16/20/24/32
- Motion respects `prefers-reduced-motion`

## Reusable Components (target catalogue)
`StatusChip`, `DirectionTag`, `ProductBadge`, `ProductSwitcher`, `RecommendationCard` (with `showProductBadge`, `compact`), `CommentaryCard`, `PollCard`, `ReportCard`, `IPOCard`, `OFSCard`, `ProductCard`, `ReactionBar` (5 fixed emojis), `BookmarkToggle`, `FilterChipBar`, `EmptyView`, `ErrorView`, `OfflineBanner`, `Skeleton` + `CardSkeleton`, `TimelineEvent`, `CorrectionEvent`, `KeyValueGrid`, `RelativeTime`, `PortalShell`, `PageHeader`, `SectionLabel`.

## Data
Mock data lives in `src/lib/mock-data.ts` + `src/lib/pulse-data.ts`. Real instruments (RELIANCE, HDFCBANK, NIFTY 25500 CE, BANKNIFTY 56000 PE, CRUDEOIL, INFY, TATAMOTORS), realistic price levels, all status states, ≥1 correction, ≥1 multi-target, ≥1 option, ≥1 commodity, polls added.

## Mandatory state coverage per screen
Loading skeleton matching content shape · Empty (with guidance) · Error (with retry) · Offline (cached + banner) · Permission/Locked (renewal CTA). Never blank. Never spinner-only.

## Desktop Adaptation (≥1024px)
- Bottom nav hidden; header nav links visible (Home/Activity/Products/Profile)
- Content max-width 960px centered
- Activity filters become left sidebar
- Product Detail uses 3-col: 20% sticky nav · 55% content · 25% sticky commentary/activity
- Hover states on cards; focus rings; keyboard nav (`/` focuses search, `Esc` closes overlays)

## Backlog (this revision implements all)

| # | Area | Action |
|---|------|--------|
| 1 | Nav | Collapse 5-tab nav to 4 (remove Reports/IPO tabs) |
| 2 | Home | Remove greeting + ResearchContinuity + NeedAttention; rebuild per spec hierarchy |
| 3 | Home | Add Product Switcher (header dropdown on mobile, sticky pill bar on desktop) |
| 4 | Activity | Filter chip bar + cross-product feed with ProductBadge |
| 5 | Products | New `/client/products` route per spec |
| 6 | Notifications | Regroup by Today/Yesterday/This Week/Earlier |
| 7 | Recommendation Detail | Engagement bar with 5 fixed emojis; published-by footer; key values prominent |
| 8 | New routes | commentary/$id, poll/$id, report/$id, ipo/$id, ofs/$id |
| 9 | Data | Add polls; expand recommendations across more products |
| 10 | Profile | Trim per spec; remove duplicate "Quick access" tiles inconsistent with spec |
| 11 | States | OfflineBanner global; ErrorView retry CTAs; skeleton variants per screen |
| 12 | Product Detail | 3-col desktop layout; mobile remains 8-section ordering |
| 13 | Cards | Recommendation card: latest action prominent; compact variant + showProductBadge |
| 14 | A11y | 44px tap targets, focus rings, aria-labels on icon buttons |

## Out of Scope (this revision)
- Real auth/Firestore/push pipelines (mock only)
- Analytics emitters (spec lists events; we stub at boundaries only)
- Watermark overlay
- Analyst portal changes
