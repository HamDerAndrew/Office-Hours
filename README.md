# Northwall Digital — Office Project SPA

A small marketing site for a fictional distributed web agency, built to showcase a single nice thing: **live, timezone-aware office opening hours** sourced from a custom Umbraco JSON API.

The homepage greets a visitor in **their** timezone, then renders a card for each office showing whether it's open right now, when it next closes (or opens), today's hours, and the next few days at a glance. Hours follow the visitor as they cross timezones — no manual region picker.

---

## The good part: opening hours

This is the feature the project is designed around, so it's worth a closer look.

### What the API gives us

The backend exposes a custom JSON surface (not the standard Umbraco Delivery API). For each office it returns:

- A live **status** object: `isOpen`, a humanised `statusText`, a `timeUntilChange` like `"2h 30m"`, and the `nextChangeDay`.
- A weekly **regularHours** map keyed by day of week.
- A 21-day **schedule** window — 7 days back, today, 13 days forward — with overrides applied (holidays, special closures, etc.).

The visitor's IANA timezone is resolved client-side via `Intl.DateTimeFormat().resolvedOptions().timeZone`, stored in a Pinia [userContext store](stores/userContext.ts), and passed to the API so every time string is already in the visitor's local clock.

### What the UI does with it

[OfficeStatusBadge.vue](components/OfficeStatusBadge.vue) — a pill that renders three distinct states:

- **Open now** — soft green background, with a pulsing dot (gated by `prefers-reduced-motion`).
- **Opens in 2h 30m** — stacked eyebrow + value, tabular numerals so the digits don't jitter as time ticks down.
- **Closed** — muted surface.

[OfficeCard.vue](components/OfficeCard.vue) — per-office card with:

- City, country, and the live status badge.
- **Today's hours**, with first-class support for override labels (e.g. *"Public holiday"*) instead of raw times.
- A status line that flips between `Closes in 2h 30m` (open) and `Opens Monday` (closed).
- A collapsible **Upcoming days** section showing the next three scheduled days, including overrides.
- Container queries to scale typography based on the card's width, not the viewport.

[OfficesSection.vue](components/OfficesSection.vue) — the section that ties it together: skeleton loaders during fetch, a retry path on error, an empty state when no offices are returned, and a header that names the visitor's timezone (`Hours below are shown in Europe/Copenhagen`).

### How it gets there

1. SSR pass renders with no resolved timezone — offices fall back to their own zone, page is paintable immediately.
2. On hydration, [userContext](stores/userContext.ts) detects the browser timezone.
3. [useOfficesWithHours](composables/useOfficesWithHours.ts) re-runs (it watches the timezone ref), fetches the list, and fans out to load each detail in parallel.
4. All client requests go through a same-origin Nitro proxy at [server/api/offices/](server/api/) because the upstream API doesn't ship CORS headers.
5. Every response is validated with Zod at the composable boundary before it reaches a component.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Nuxt 3** (compat v4, Vue 3, `<script setup>`) | File-based routing, hybrid rendering, Nitro server. |
| Language | **TypeScript** (`strict: true`) | No `any`. DTOs are inferred from Zod schemas — single source of truth. |
| State | **Pinia** (setup stores) | One store per cross-route concern. Page content stays out of Pinia. |
| Validation | **Zod** | Every external response is parsed at the boundary. |
| Data source | **Custom Umbraco JSON API** | Keyless during the proof-of-concept phase; base URL on `runtimeConfig.public.officesApiBase`. |
| Styling | **Modern CSS** | Container queries, `:has()`, logical properties, `clamp()`, custom properties. No CSS framework. |
| Images | **@nuxt/image** | Explicit dimensions, no CLS. |
| Hosting | **Netlify** (Nitro auto-detects the preset) | Per-route `routeRules` are the source of truth for caching/rendering. |
| Runtime | **Node 22** (`.nvmrc` pins `22.17.1`) | Required by Nuxt 3.15+. |

---

## Project layout

```
~/
├── components/        # OfficeCard, OfficeStatusBadge, OfficesSection, …
├── composables/       # useOfficesList, useOfficeDetail, useOfficesWithHours
├── pages/             # index (SSR), about (prerender), contact (prerender)
├── server/api/        # Same-origin proxy for the offices API
├── stores/            # userContext (timezone)
├── types/umbraco/     # Zod schemas + inferred TS types
├── utils/             # Pure helpers (officeSchedule)
├── assets/css/        # Design tokens + global CSS
├── nuxt.config.ts     # routeRules + runtimeConfig live here
└── CLAUDE.md          # Architectural standards (worth reading)
```

Naming: components are `PascalCase.vue`, composables are `useThing.ts`, stores are `useThingStore` from `stores/thing.ts`, Zod schemas are `ThingSchema` with their inferred type re-exported as `Thing`.

---

## Getting started

```sh
# Use the Node version pinned in .nvmrc
nvm use

# Install
npm install

# Dev server (http://localhost:3000)
npm run dev
```

Other scripts:

```sh
npm run typecheck   # vue-tsc, must pass before shipping
npm run build       # production build
npm run preview     # preview the production build locally
npm run generate    # static prerender (used for /about and /contact)
```

---

## Configuration

The offices API base URL lives in [nuxt.config.ts](nuxt.config.ts) under `runtimeConfig.public.officesApiBase`. Override per environment with the standard Nuxt env var:

```sh
NUXT_PUBLIC_OFFICES_API_BASE=https://your-umbraco-host.example.com npm run dev
```

No API key is required today. If/when one is introduced, it must be a server-only secret read inside `server/api/*` — never on `runtimeConfig.public`, never in the client bundle.

---

## Rendering strategy

Set per-route in [nuxt.config.ts](nuxt.config.ts) via `routeRules`:

| Route | Strategy | Reason |
|---|---|---|
| `/` | `ssr: true` | Personalised by visitor timezone — render fresh per request. |
| `/about` | `prerender: true` | Static marketing content. |
| `/contact` | `prerender: true` | Static marketing content. |

When adding a route, name the strategy and justify it.

---

## Conventions worth knowing

- **Components don't fetch.** They consume composables and stores. The HTTP layer lives in [composables/](composables/).
- **Stores aren't HTTP clients.** They consume composables and hold cross-route state.
- **Pages use `useAsyncData` for one-shot content** — that content does not go into Pinia.
- **Zod first.** Every new data surface starts with a schema in [types/umbraco/](types/umbraco/), then the composable, then the component.
- **All states covered.** Loading, error, empty, 404, "permission declined." Skeletons and retry paths are not optional.
- **Accessibility is a baseline.** WCAG 2.2 AA, visible focus, `prefers-reduced-motion`, tabular numerals where times tick.

The full standards are in [CLAUDE.md](CLAUDE.md) — read it before opening a non-trivial PR.

---

## Commits

Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `a11y:`, `perf:`, `test:`). Subjects under 72 characters.
