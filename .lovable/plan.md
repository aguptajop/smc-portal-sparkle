
# SMC Pulse MVP — Build Plan

## Primary Goal (Master Instruction Layer)
Clients must instantly understand:
1. What changed?
2. What is active?
3. What action is required?

Research content IS the product. Design for clarity, trust, transparency and actionability.

Avoid: dashboard-heavy UI, CRM layouts, analytics-first layouts, crypto-style aesthetics, excessive animations.

Styled as a natural extension of the SMC subscription portal (deep SMC Blue `#003A70`, teal accent `#0097A7`, white cards on `#F8FAFC`, Inter typography, restrained institutional feel).

## Design System (src/styles.css)
- Brand tokens: `--smc-blue #003A70`, `--smc-teal #0097A7`, success/warning/error/neutrals per spec
- Typography: Inter, sizes per spec (32/24/18/14-16/12)
- Spacing: 8px base grid
- Card treatment: white surface, subtle border `#E5E7EB`, soft shadow, 8–12px radius — matching the calm SMC portal feel (no gradients, no glass)
- Status chip system used consistently across both portals: DRAFT / PUBLISHED / UPDATED / ACTION REQUIRED / ACTIVE / PARTIAL BOOKING / TARGET ACHIEVED / SL HIT / EXPIRED / CLOSED / CORRECTED
- Relative-time helper

## Products (canonical)
Each product carries a Research Summary, Risk Profile, Holding Horizon, and Call ID prefix:
- **Techno Funda** — Risk: Moderate · Holding: 1–5 Trading Days · Prefix: `TF-YYYY-####`
- **Nifty50** — Risk: High · Holding: Intraday to 5 Trading Days · Prefix: `NF-YYYY-####`
- **Commodity Mantra** — Risk: High · Holding: Intraday to 10 Trading Days · Prefix: `CM-YYYY-####`

Call IDs (e.g. `TF-2026-0001`) are visible **only in the Analyst Portal**.

## Routes (TanStack Start)
```
/              Landing (portal switcher — Client / Analyst)
/client                       Client Home (Research Continuity, Need Attention, Subscribed Products)
/client/activity              Activity Center (grouped by product, hierarchy below)
/client/product/$id           Product Detail (strict 8-section ordering, below)
/client/recommendation/$id    Recommendation Detail (Summary/Status/Timeline/Updates/Corrections)
/client/profile               Profile + Support + Logout

/analyst                      Analyst Home (Attention Queue + Drafts + Product Activity Summary)
/analyst/create               Create Recommendation (Equity / Index Option / Stock Option / Commodity forms)
/analyst/recommendation/$id   Update Recommendation (Book %, Trail SL, Exit, Correct)
/analyst/commentary           Publish Commentary (Morning Note / Market Outlook / Critical Update)
/analyst/preview              Preview Client Experience (renders client view in a framed mock)
```

## Shared Components
- `StatusChip`, `RelativeTime`, `RecommendationCard` (Equity / Option / Commodity variants), `ProductCard`, `CommentaryCard`, `ActionRequiredBanner`, `ResearchContinuityBanner`, `EmptyState`, `PortalShell` (bottom nav on mobile, side nav on desktop)

## Client Portal — content per spec
- **Home**: Research Continuity Banner (Last Call / Last Commentary / Research Status); Need Attention widget ("2 Recommendations Require Action · 3 Updates Since Last Visit · 1 New Commentary"); Subscribed Product cards (Techno Funda, Index Trading, Commodity Mantra, etc.) ordered: Action Required → Active → No-update → Subscription required
- **Activity Center**: feed grouped by product, newest first, with visual emphasis on Action Required items. Within each product group, hierarchy is:
  1. Action Required
  2. Recommendation Updates
  3. New Recommendations
  4. Commentary
- **Product Detail (strict ordering)**:
  1. Product Overview (name, Research Summary, Risk Profile, Holding Horizon)
  2. Action Required
  3. Changes Since Last Visit
  4. Active Recommendations
  5. Pinned Commentary
  6. Commentary
  7. Closed Calls (last 90 days)
  8. Historical Archive (read-only, older than 90 days)
- **Recommendation Detail**: full timeline, corrections shown transparently (previous → new value + timestamp)

### Archive Governance
- Closed calls visible inline for 90 days.
- Older closed calls move to the Historical Archive section (read-only).

## Analyst Portal — content per spec
- **Home**: Research Attention Queue (recs needing analyst action), Drafts, Recently Published, and **Product Activity Summary** table with columns: Product Name · Active Calls · Updated Today · Commentary Published Today · Last Activity
- **Create Recommendation**: Product selector → form variant per asset class (Equity/Index Option/Stock Option/Commodity) with mandatory fields, conviction, rationale, draft autosave indicator, "Visible To" + "Visible On" summary
- **Update Recommendation**: Book 50%, Trail SL, Exit Position, Correct Field (with transparency note)
- **Commentary Composer**: type selector, pinned toggle (max 1 active pinned/product), preview
- **Preview Client Experience**: live rendering of the recommendation/commentary as the client will see it, inside a phone frame

### Publish Impact Preview (Create / Update / Commentary)
Before any Publish action, show:
- **Visible To:** [Subscribers of <Product>]
- **Visible On:** Activity Center · Product Detail · Recommendation Detail

## Mobile-First
- Bottom nav (3 items max per spec: Home / Activity / Profile for client; Queue / Create / Profile for analyst)
- Sticky action bar on detail pages

## Desktop Product Detail Layout (frozen)
Three-column reflow:
- **20%** — Sticky Product Navigation (jump to the 8 sections above)
- **55%** — Main Research Content
- **25%** — Sticky Commentary + Activity Panel

## Technical
- Pure frontend with realistic mock data in `src/lib/mock-data.ts` (real instruments: RELIANCE, HDFCBANK, NIFTY 25500 CE, CRUDEOIL — never "Stock XYZ")
- All shadcn components themed via tokens; no hardcoded colors in JSX
- No Lovable Cloud needed for MVP visual build
- SEO: per-route titles and descriptions; sitemap.xml + robots.txt

## Out of Scope (MVP visual prototype)
- Real auth, real publishing pipeline, charts/widgets, portfolio tracking
