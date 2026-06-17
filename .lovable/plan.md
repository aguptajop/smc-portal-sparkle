
# SMC Pulse MVP — Build Plan

A mobile-first research advisory platform with two distinct portals, styled as a natural extension of the SMC subscription portal (deep SMC Blue `#003A70`, teal accent `#0097A7`, white cards on `#F8FAFC`, Inter typography, restrained institutional feel).

## Design System (src/styles.css)
- Brand tokens: `--smc-blue #003A70`, `--smc-teal #0097A7`, success/warning/error/neutrals per spec
- Typography: Inter, sizes per spec (32/24/18/14-16/12)
- Spacing: 8px base grid
- Card treatment: white surface, subtle border `#E5E7EB`, soft shadow, 8–12px radius — matching the calm SMC portal feel (no gradients, no glass)
- Status chip system: ACTION REQUIRED / ACTIVE / PARTIAL / CLOSED / CORRECTED
- Relative-time helper

## Routes (TanStack Start)
```
/              Landing (portal switcher — Client / Analyst)
/client                       Client Home (Research Continuity, Need Attention, Subscribed Products)
/client/activity              Activity Center (chronological updates feed)
/client/product/$id           Product Detail (Action Required → Active → Commentary → History)
/client/recommendation/$id    Recommendation Detail (Summary/Status/Timeline/Updates/Corrections)
/client/profile               Profile + Support + Logout

/analyst                      Analyst Home (Research Attention Queue + Drafts + Recent Publishes)
/analyst/create               Create Recommendation (Equity / Index Option / Stock Option / Commodity forms)
/analyst/recommendation/$id   Update Recommendation (Book %, Trail SL, Exit, Correct)
/analyst/commentary           Publish Commentary (Morning Note / Market Outlook / Critical Update)
/analyst/preview              Preview Client Experience (renders client view in a framed mock)
```

## Shared Components
- `StatusChip`, `RelativeTime`, `RecommendationCard` (Equity / Option / Commodity variants), `ProductCard`, `CommentaryCard`, `ActionRequiredBanner`, `ResearchContinuityBanner`, `EmptyState`, `PortalShell` (bottom nav on mobile, side nav on desktop)

## Client Portal — content per spec
- **Home**: Research Continuity Banner (Last Call / Last Commentary / Research Status); Need Attention widget ("2 Recommendations Require Action · 3 Updates Since Last Visit · 1 New Commentary"); Subscribed Product cards (Techno Funda, Index Trading, Commodity Mantra, etc.) ordered: Action Required → Active → No-update → Subscription required
- **Activity Center**: chronological feed of all updates with relative timestamps
- **Product Detail**: Product header + Research Summary + Pinned Commentary + Action Required → Active Recs → Commentary → 90-day Closed → Historical archive
- **Recommendation Detail**: full timeline, corrections shown transparently (previous → new value + timestamp)

## Analyst Portal — content per spec
- **Home**: Research Attention Queue (recs needing analyst action), Drafts, Recently Published
- **Create Recommendation**: Product selector → form variant per asset class (Equity/Index Option/Stock Option/Commodity) with mandatory fields, conviction, rationale, draft autosave indicator, "Visible To" + "Visible On" summary
- **Update Recommendation**: Book 50%, Trail SL, Exit Position, Correct Field (with transparency note)
- **Commentary Composer**: type selector, pinned toggle (max 1 active pinned/product), preview
- **Preview Client Experience**: live rendering of the recommendation/commentary as the client will see it, inside a phone frame

## Mobile-First
- Bottom nav (3 items max per spec: Home / Activity / Profile for client; Queue / Create / Profile for analyst)
- Sticky action bar on detail pages
- Desktop: same components reflow into a max-w-5xl single column + optional left rail

## Technical
- Pure frontend with realistic mock data in `src/lib/mock-data.ts` (real instruments: RELIANCE, HDFCBANK, NIFTY 25500 CE, CRUDEOIL — never "Stock XYZ")
- All shadcn components themed via tokens; no hardcoded colors in JSX
- No Lovable Cloud needed for MVP visual build
- SEO: per-route titles and descriptions; sitemap.xml + robots.txt

## Out of Scope (MVP visual prototype)
- Real auth, real publishing pipeline, charts/widgets, portfolio tracking
