# Axesntra — Product Brief
**For: Co-Founder / Lead Software Engineer**
**Date: March 2026**

---

## What We're Building

Axesntra is a **Carrier Risk Intelligence Platform** for insurance underwriters, freight brokers, and transportation risk teams. We take raw, public FMCSA (Federal Motor Carrier Safety Administration) data and transform it into structured, AI-powered risk profiles that help professionals screen, evaluate, and monitor motor carriers — fast.

The core insight: public carrier safety data exists but is scattered, hard to interpret, and provides no actionable guidance. We turn it into clear risk scores, executive-ready summaries, and AI-assisted remediation plans.

---

## Problem

Carrier screening today is manual, slow, and inconsistent:

- FMCSA data is public but requires expertise to interpret
- Risk analysts spend hours pulling data, building spreadsheets, writing memos
- No consistent scoring methodology across teams or carriers
- Zero actionable guidance — data shows *what* is wrong, not *what to do*
- Ongoing monitoring is essentially nonexistent for most teams

This creates real financial exposure. A single high-risk carrier that slips through screening can result in massive claims, liability, or regulatory action.

---

## Solution

Axesntra provides a single platform that:

1. **Looks up any carrier** by USDOT number or name, pulling live FMCSA data
2. **Scores risk across 5 dimensions** — Maintenance, Crash History, Driver Safety, Hazmat, and Administrative compliance
3. **Generates an executive summary** so stakeholders get the story, not just the numbers
4. **Provides AI-powered fix plans** — specific, prioritized remediation steps for carriers looking to improve
5. **Tracks trends** — 12-month historical data showing whether a carrier is improving or declining
6. **Enables ongoing monitoring** via a watchlist system

---

## Target Users

| Segment | Pain Point | How We Help |
|---|---|---|
| Insurance underwriters | Manual carrier review; no consistent methodology | Instant risk profiles + scoring rubric |
| Freight brokers | Carrier vetting is slow; hard to compare | Fast lookup + side-by-side comparison |
| 3PLs / Transportation ops | No ongoing monitoring capability | Watchlist + trend tracking |
| Risk & compliance leaders | Reporting takes too long; no audit trail | Executive memos + structured outputs |

---

## Core Features (Current State)

### Carrier Lookup & Profile
- Search by USDOT number or carrier name
- Live data pull from public FMCSA sources
- Fallback to curated mock data for demos

### Risk Scoring Engine
- **5 risk dimensions:** Maintenance, Crash, Driver, Hazmat, Admin
- **4 risk levels:** Low, Moderate, Elevated, Severe
- Confidence metric based on data completeness and freshness
- Score contributions visible for transparency

### AI Advisory System (Claude-powered)
- Executive memo generated per carrier
- Issue-level guidance with 6-part structure: Summary → Meaning → Root Cause → Why It Matters → Prevention → Controls
- AI-assisted fix plans with impact/effort classification
- Compliance program recommendations
- Guided Q&A panel for analyst queries

### Trend Analysis
- 12-month rolling data: vehicle OOS rates, driver OOS rates, inspection counts
- Trend direction: Improving / Stable / Worsening
- Recharts-based visualizations

### Watchlist & Monitoring
- LocalStorage-based carrier watchlist (MVP)
- Quick access dashboard for monitored carriers

### Supporting Pages
- Methodology page (how we score)
- Playbooks (workflow guides for analysts)
- Resources (educational content)
- Pricing & Early Access

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + Radix UI + shadcn/ui |
| Charts | Recharts |
| AI | Anthropic Claude API (claude-sonnet) |
| Auth | Supabase |
| Data | Public FMCSA scraping + SMS data feed |
| Video | Remotion (promo rendering) |

### Architecture Notes
- **Next.js App Router** — file-based routing, server components, API routes co-located
- **Hybrid data assembly** — combines live FMCSA data with mock fallback via `hybrid-assembly-service.ts`
- **AI advisory** is modular — `ai-advisory.ts` handles prompt construction, `app/api/ai/prompt/route.ts` handles the Claude call
- **Component-driven** — strong separation between data display (carrier-*, metric-card, risk-badge) and AI layer (ai-*)
- **Dark mode supported** via CSS class strategy

---

## Current State vs. Roadmap

### Live / In Progress
- [x] Carrier lookup (USDOT + name search)
- [x] Risk scoring across 5 dimensions
- [x] AI-generated executive memos and fix plans
- [x] Trend charts (12-month)
- [x] Watchlist (localStorage)
- [x] Auth (Supabase)
- [x] Early access / pricing pages
- [x] Sample report for demos

### Near-Term Priorities
- [ ] **Persistent watchlist** — migrate from localStorage to Supabase-backed storage, tied to user account
- [ ] **Carrier comparison** — `/compare` page exists, needs data wiring
- [ ] **PDF/export** — executive memo and risk profile as downloadable report
- [ ] **FMCSA data reliability** — improve scraping robustness, handle source failures gracefully
- [ ] **Email alerts** — notify users when a watchlisted carrier's risk level changes

### Medium-Term
- [ ] **Team/org accounts** — shared watchlists, notes, and carrier history across a team
- [ ] **Batch upload** — screen multiple carriers via CSV
- [ ] **Audit trail** — log when a carrier was reviewed and by whom
- [ ] **API access tier** — for customers who want to embed risk data in their own tools
- [ ] **Historical snapshots** — point-in-time carrier profiles, not just current state

---

## Key Technical Decisions to Discuss

### 1. Data Layer
Right now we rely on scraping public FMCSA pages. This is fragile. We should evaluate:
- Direct FMCSA API access (limited, but exists)
- Partnering with a data provider that normalizes FMCSA data
- Building our own ETL pipeline with scheduled refresh

### 2. Watchlist Persistence
Currently `useWatchlist.ts` uses localStorage. Moving to Supabase is already set up for auth — this is a quick win that enables multi-device and team features.

### 3. AI Cost Management
Claude API calls are made per carrier profile load. At scale we should:
- Cache AI outputs (store generated memos in Supabase alongside carrier data)
- Only regenerate when underlying data changes
- Rate-limit / queue heavy AI calls

### 4. Carrier Data Freshness
`dataFreshness` is tracked per carrier. We need a clear refresh strategy — on-demand (user triggers) vs. scheduled background refresh (cron/queue).

### 5. Deployment
Not yet discussed. Recommend Vercel for Next.js (easiest path), with Supabase for backend. Should define environment variable strategy and staging vs. production separation early.

---

## Business Model (Current Thinking)

- **Free tier** — limited lookups per month, basic risk score only
- **Pro** — full AI advisory, trend data, watchlist, PDF export
- **Team** — shared org account, batch screening, audit log
- **API** — usage-based pricing for embedded risk data

Pricing page is live at `/pricing`. Early access signup at `/early-access`.

---

## What Makes This Defensible

1. **Proprietary scoring methodology** — our 5-factor model + weighting is ours
2. **AI layer** — turning raw data into guided, actionable intelligence is the product; the data is just the input
3. **Workflow integration** — playbooks, checklists, and compliance programs make us sticky
4. **Data accumulation** — over time, our aggregated carrier history and trend data becomes a moat

---

## Immediate Engineering Focus Areas

For the next 2-4 weeks, the highest-leverage engineering tasks are:

1. **Stabilize FMCSA data pipeline** — carrier lookups need to be reliable before we show this to real users
2. **Persist watchlist to Supabase** — prerequisite for team features and retention
3. **Cache AI outputs** — required before we can handle any real user volume without runaway API costs
4. **Carrier comparison page** — high-value feature for brokers, page shell exists, needs data
5. **PDF export** — first paid feature gate candidate; underwriters need a deliverable

---

## Questions to Align On

- What's our data acquisition strategy long-term? (Scraping vs. API vs. partner)
- When do we deploy to production and what's our infra stack?
- What's the MVP feature set for the first paid user?
- How do we want to handle multi-tenancy / team accounts in the DB schema?
- Do we want to open an API tier from day one, or later?

---

*This brief is a living document. Update as decisions are made.*
