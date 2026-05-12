<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { formatDistance } from '~/utils/distance'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const { timezone } = storeToRefs(useUserContextStore())

const { data: office, pending, error, refresh } = await useOfficeBySlug(slug)

// Propagate the upstream status to the SSR response so a bad slug is a real
// 404 for crawlers and link checkers, while the page still renders its own
// in-place error UI for humans.
if (import.meta.server && error.value) {
  const status = (error.value as { statusCode?: number }).statusCode ?? 500
  setResponseStatus(status)
}

useHead(() => ({
  title: office.value
    ? `${office.value.name} — Northwall Digital`
    : 'Office — Northwall Digital',
}))

const distanceLabel = computed(() => {
  const meters = office.value?.distanceMeters
  if (meters === null || meters === undefined) return null
  return formatDistance(meters)
})

const errorMessage = computed(() => {
  const status = (error.value as { statusCode?: number } | null)?.statusCode
  if (status === 404) {
    return 'No office matched this address. It may have been renamed or removed.'
  }
  return "The offices API didn't respond. Please try again in a moment."
})

const statusLine = computed(() => {
  const o = office.value
  if (!o) return ''
  const { status } = o
  if (status.isOpen) {
    return status.timeUntilChange
      ? `Closes in ${status.timeUntilChange}`
      : status.statusText
  }
  if (status.timeUntilChange && status.nextChangeDay) {
    const day =
      status.nextChangeDay.toLowerCase() === 'today'
        ? 'today'
        : status.nextChangeDay
    return `Opens ${day} (in ${status.timeUntilChange})`
  }
  if (status.nextChangeDay) {
    const day =
      status.nextChangeDay.toLowerCase() === 'today'
        ? 'today'
        : status.nextChangeDay
    return `Opens ${day}`
  }
  return status.statusText
})
</script>

<template>
  <article class="office-detail">
    <div class="container">
      <nav class="back-row" aria-label="Breadcrumb">
        <NuxtLink to="/" class="back-link">
          <span aria-hidden="true">←</span>
          <span>Back to offices</span>
        </NuxtLink>
      </nav>

      <div v-if="pending && !office" class="loading" aria-live="polite">
        <div class="skeleton skeleton-line short" aria-hidden="true" />
        <div class="skeleton skeleton-line long" aria-hidden="true" />
        <div class="skeleton skeleton-card" aria-hidden="true" />
      </div>

      <div v-else-if="error" class="error-state" role="alert">
        <h1>We couldn't load this office</h1>
        <p class="text-muted">{{ errorMessage }}</p>
        <div class="error-actions">
          <button type="button" class="btn btn-ghost" @click="refresh()">
            Retry
          </button>
          <NuxtLink to="/" class="btn btn-primary">
            See all offices
          </NuxtLink>
        </div>
      </div>

      <template v-else-if="office">
        <header class="hero">
          <div class="hero-text">
            <p class="eyebrow">{{ office.country }}{{ office.city ? ` · ${office.city}` : '' }}</p>
            <h1 class="title">{{ office.name }}</h1>
            <div class="status-row">
              <OfficeStatusBadge :status="office.status" />
              <p class="status-text">{{ statusLine }}</p>
            </div>
            <p v-if="distanceLabel" class="distance">
              <span>{{ distanceLabel }}</span>
              <span class="distance-hint">from your location</span>
            </p>
          </div>

          <ClientOnly>
            <OfficeLocalClock :timezone="office.timezone" />
            <template #fallback>
              <div class="local-clock-fallback">
                <span class="eyebrow">Local time</span>
                <span class="zone">{{ office.timezone }}</span>
              </div>
            </template>
          </ClientOnly>
        </header>

        <div class="grid">
          <OfficeWeeklySchedule :office="office" :user-timezone="timezone" />
          <OfficeHolidays :office="office" :user-timezone="timezone" />
        </div>
      </template>
    </div>
  </article>
</template>

<style scoped>
.office-detail {
  padding-block: var(--space-7) var(--space-8);
  background:
    radial-gradient(
      circle at 0% 0%,
      var(--color-accent-soft),
      transparent 38%
    ),
    var(--color-bg);
}

.back-row {
  margin-block-end: var(--space-5);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-pill);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.back-link:hover,
.back-link:focus-visible {
  background: var(--color-surface);
  color: var(--color-text);
}

.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  margin-block-end: var(--space-7);
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1 1 24rem;
  min-inline-size: 0;
}

.title {
  font-size: var(--text-4xl);
  font-weight: 650;
  margin: 0;
  line-height: 1.05;
}

.status-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.status-text {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--text-base);
}

.distance {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text);
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
}

.distance-hint {
  color: var(--color-text-subtle);
}

.local-clock-fallback {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-inline-size: 14rem;
}

.local-clock-fallback .eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.local-clock-fallback .zone {
  font-size: var(--text-lg);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 1fr);
  align-items: start;
}

@container (max-width: 50rem) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 60rem) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-muted),
    var(--color-border),
    var(--color-surface-muted)
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
  border-radius: var(--radius-sm);
}

.skeleton-line {
  block-size: 1.25rem;
}

.skeleton-line.short {
  inline-size: 30%;
}

.skeleton-line.long {
  inline-size: 60%;
  block-size: 2.25rem;
}

.skeleton-card {
  block-size: 22rem;
  border-radius: var(--radius-lg);
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}

.error-state {
  background: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  padding: var(--space-7) var(--space-6);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
}
</style>
