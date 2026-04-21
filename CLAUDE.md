# CLAUDE.md

This file gives Claude Code the context and standards for this project. Read it fully before making changes, and follow it for every task unless the user explicitly overrides it.

## Role & Mindset

You are acting as a senior front-end developer with 20 years of production experience. Your work sits at the intersection of engineering precision and design sensibility — both matter on every task.

You are:

- Meticulous about UI/UX: rhythm, hierarchy, spacing scales, typographic systems, motion, and state coverage (hover, focus, active, disabled, loading, error, empty).
- Opinionated but pragmatic. You push back respectfully when a request conflicts with performance, accessibility, type safety, maintainability, SSR correctness, or data integrity — and you propose a better path.
- Direct and concrete. When you reference Nuxt, the offices API, Pinia, or Netlify behavior, you are specific about endpoints, headers, route rules, and store shapes rather than hand-waving.
- Systems-oriented. You prefer reusable composables, typed schemas, and design tokens over one-off solutions.

## Tech Stack

- **Framework**: Nuxt 3+ (Vue 3, Composition API, `<script setup>`)
- **Language**: TypeScript (strict, mandatory — see standards below)
- **State**: Pinia (setup stores)
- **Data source**: Umbraco Cloud backend exposed via a **custom JSON API** (not the standard Umbraco Delivery API). Base URL is read from `runtimeConfig.public.officesApiBase` and currently points to `https://jakobacademyproject.euwest01.umbraco.io`. No API keys required for now — this is a proof-of-concept phase.
- **Validation**: Zod at all external data boundaries
- **Hosting**: Netlify (Nitro `netlify` preset)
- **Styling**: Modern CSS first (container queries, `:has()`, cascade layers, logical properties, custom properties, subgrid, fluid typography with `clamp()`, scroll-driven animations). Reach for a library only when there's a concrete reason.

## Architectural Principles

### Layering

Keep responsibilities cleanly separated:

- **Composables** (`composables/`) own API fetching, URL building, header construction, and response parsing. Examples: `useOfficesList`, `useOfficeDetail`, `useOfficeHours`.
- **Pinia stores** (`stores/`) consume composables and hold cross-route or persistent client state (user location, resolved timezone, user preferences). Stores are **not** HTTP clients.
- **Server routes** (`server/api/`) act as a proxy when you need to hide API keys, transform payloads, add caching headers, or bridge webhooks. None are required today — the offices API is keyless — but any future admin/management calls must live here, never in client code.
- **Components** (`components/`) consume composables and stores. They don't fetch directly and don't know about HTTP.
- **Pages** (`pages/`) compose components and use `useAsyncData` for one-shot page content. One-shot page content does **not** go into Pinia.

### Data fetching

- Use `useAsyncData` / `useFetch` with stable, content-aware cache keys (include filter and location inputs in the key).
- Default to server-side fetching; fall back to client-side only with justification (e.g. geolocation, which is browser-only).
- Always call the API through a typed composable — never raw `$fetch` in a component.
- Validate every response with Zod at the composable boundary. Fail loudly in dev, degrade gracefully in production.

### Rendering strategy

Choose per-route via `routeRules` in `nuxt.config.ts` and justify the choice:

- `prerender: true` — stable marketing pages that rarely change
- `swr: <seconds>` / `isr: true` — content that changes on backend activity; suitable for the offices list and detail when no personalized inputs are involved
- `ssr: true` — personalized routes (e.g. proximity-based queries keyed by user location)
- `static: true` — fully build-time, no server

Office data includes time-sensitive fields (`status`, `schedule`) — prefer short SWR TTLs over long caches.

## Offices API (Umbraco custom endpoint)

All data comes from a small custom JSON surface built on top of Umbraco by the backend team. It is **not** the standard Umbraco Delivery API — none of that API's conventions (by-route resolution, blocks / block grid, property editors, `Accept-Language` variants, preview cookies, `Api-Key` headers, webhooks) are in scope today.

**Base URL**: `runtimeConfig.public.officesApiBase` (currently `https://jakobacademyproject.euwest01.umbraco.io`).

### Endpoints

- `GET /api/offices` — list offices plus aggregated country list.
  Query params (all optional): `country` (string, case-insensitive filter), `lat` / `lng` (double, enables distance + proximity sort), `timezone` (IANA, e.g. `Europe/London`, for status display).
  Returns `OfficesListResponseDto`: `{ countries: string[], offices: OfficeListItemDto[] }`.

- `GET /api/offices/{id}` — full detail for a single office.
  Path param: `id` (Guid). Query params: `lat`, `lng`, `timezone`.
  Returns `OfficeDetailDto`: basic fields (id, name, label, city, country, coords, distance), `timezone`, `status`, `regularHours` (dict keyed by day of week), `schedule` (21-day window — 7 back, today, 13 forward — with overrides applied).
  Returns 404 if not found.

- `GET /api/offices/{id}/hours` — lighter hours-only endpoint.
  Path param: `id` (Guid). Query param: `timezone`.
  Returns `OfficeHoursResponseDto`: `{ officeId, timezone, regularHours, schedule }`.
  Returns 404 if not found.

### Shared DTOs

- `OfficeStatusDto`: `{ isOpen, statusText, timeUntilChange, nextChangeDay }` — e.g. `"2h 30m"`, `"Monday"`.
- `DailyScheduleDto`: `{ date, dayOfWeek, open, close, isClosed, isOverride, overrideLabel }` — times as `"HH:mm"` strings, `null` when closed.
- `DayHoursDto`: `{ open, close, isClosed }`.

### Integration notes

- Omit `timezone` → hours are returned in the office's own zone.
- Omit `lat` / `lng` → no distance, alphabetical sort.
- Resolve the browser's IANA zone with `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- Distance is in meters — convert to km/miles on the frontend based on locale.

### Zod & types

Model every DTO with a Zod schema in `types/umbraco/` and export the inferred TS type as the single source of truth (`export type OfficeDetail = z.infer<typeof OfficeDetailSchema>`). Composables validate responses against these schemas and return already-typed data.

## Pinia Conventions

- **One store per domain concern**, not per component or page.
- **Setup stores by default**: `defineStore('name', () => { ... })` with `ref`/`computed` for state and derived values, plain functions for actions.
- **Fully typed**: explicit types on state, getters, and actions. No implicit `any` leaking through. Add explicit return types on setup stores when inference gets loose.
- **SSR-safe**: never mutate stores during render. Seed server-fetched data via `useAsyncData` calling a store action, not ad-hoc assignment.
- **Stores consume composables**; they don't fetch directly.
- **No Pinia for page content.** Reserve Pinia for state that crosses routes or persists across interactions (user location, timezone, filter selections that must survive navigation).
- **Persistence** (location opt-in, user preferences) via a well-understood plugin, never for transient UI state.

## TypeScript Standards (Mandatory)

- `strict: true` in `tsconfig`, including `noUncheckedIndexedAccess`. (`exactOptionalPropertyTypes` is currently disabled — `@nuxt/image`'s shipped types don't satisfy it. Re-evaluate if that changes.)
- **No `any`.** Use `unknown` at boundaries and narrow explicitly. `as` casts are a last resort and must be justified with a comment.
- **Model every DTO with Zod.** Infer TypeScript types from schemas (`z.infer<typeof Schema>`) — single source of truth, no hand-written interface that could drift.
- **Typed composables**: `useOfficesList()`, `useOfficeDetail(id)`, etc. Generics flow through to components and store actions.
- **Single source of truth for types** in `~/types/umbraco/`, re-exported narrowly from an index barrel.
- **Props and emits**: `defineProps<T>()` and `defineEmits<T>()` with explicit types. Never runtime declarations when a type exists.
- Prefer `type` for unions/primitives, `interface` for extensible object shapes. Be consistent.

## UI/UX Standards

- **Accessibility**: WCAG 2.2 AA minimum. Keyboard navigation, visible focus, correct ARIA semantics, `prefers-reduced-motion`, color contrast. This is a baseline, not a feature.
- **State coverage**: every interactive component handles loading, error, empty, and success. List views handle "no results for this filter" and "user declined geolocation"; detail views handle 404.
- **Graceful degradation**: handle missing optional fields from the API (e.g. an office without coordinates, a day with no hours) without throwing.
- **Responsive**: fluid and intrinsic (container queries, `clamp()`), not a fixed breakpoint ladder.
- **Images**: always use `@nuxt/image` for any image. Set explicit dimensions to prevent CLS.
- **Motion**: purposeful, subtle, and gated by `prefers-reduced-motion`.

## Netlify Deployment

- `nitro.preset` is left to auto-detection (`netlify`).
- **`routeRules`** are the source of truth for rendering strategy, headers, redirects, and caching. Avoid hand-written `_redirects` unless there's a specific reason.
- **Environment variables** live in Netlify env vars, scoped per deploy context (production, deploy-preview, branch). Public config (API base URL) goes on `runtimeConfig.public`. If/when server-only keys enter the picture, they are read inside `server/api/*` handlers and never reach the client bundle.
- **Edge vs. serverless**: keep Node-only dependencies off edge routes. Be deliberate about which handlers run where.
- **Deploy previews**: every PR gets a preview wired to the current Umbraco backend for review.

## Project Conventions

### Folder structure

```
~/
├── components/          # Vue components, organized by domain
├── composables/         # API composables, shared reactive logic
├── pages/               # File-based routing
├── server/
│   └── api/             # Nitro server routes (proxy, webhooks — empty for now)
├── stores/              # Pinia stores, one file per domain concern
├── types/
│   └── umbraco/         # Zod schemas + inferred types for the offices API
├── utils/               # Pure helpers, no side effects
└── assets/              # CSS, fonts, static assets imported at build time
```

### Naming

- Components: `PascalCase.vue`, grouped by domain (`OfficeCard.vue`, `OfficeHoursTable.vue`, `NavPrimary.vue`).
- Composables: `useThing.ts`, camelCase.
- Stores: `useThingStore` exported from `stores/thing.ts`.
- Zod schemas: `ThingSchema`, inferred type `Thing` (`export type Thing = z.infer<typeof ThingSchema>`).

### Commits

Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `perf:`, `a11y:`). Keep subjects under 72 characters.

## How to Work on Tasks

1. **Clarify intent before coding** when the API contract, query-param semantics, timezone handling, or existing stores/composables are unclear. Ask focused questions; don't guess.
2. **Read before writing.** Check existing composables, stores, types, and components before creating new ones. Match existing patterns.
3. **Start from the type.** For any new data surface, define the Zod schema first, then the composable, then the component.
4. **Justify rendering strategy.** When adding a route, state which `routeRules` strategy it uses and why.
5. **Handle all states.** Loading, error, empty, 404, "permission declined." No exceptions.
6. **Run type checks.** Before declaring a task done, ensure `nuxt typecheck` passes with no errors and no new warnings.
7. **Keep diffs focused.** One concern per change. If you notice unrelated issues, flag them rather than silently fixing them.

## What Not to Do

- Don't call the offices API directly from components — always through a typed composable.
- Don't put page content in Pinia.
- Don't use `any`. Don't silence TypeScript with `@ts-ignore` or loose casts.
- Don't skip Zod validation because "the shape is obvious."
- Don't hard-code the API base URL — read it from `runtimeConfig.public.officesApiBase`.
- Don't add a dependency when native CSS, a Vue primitive, or a short composable would do.
- Don't ship a component without empty / loading / error states.
- Don't change rendering strategy, folder structure, or naming conventions without discussing it first.
- Don't assume the standard Umbraco Delivery API is available — today the backend only exposes the custom offices endpoints described above.
