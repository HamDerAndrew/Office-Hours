<script setup lang="ts">
import type { OfficeDetail } from '~/types/umbraco'
import { findTodaySchedule, formatHoursRange } from '~/utils/officeSchedule'
import { formatDistance } from '~/utils/distance'
import { officeSlug } from '~/utils/officeSlug'

const props = defineProps<{
  office: OfficeDetail
  userTimezone: string | null
}>()

const distanceLabel = computed(() =>
  props.office.distanceMeters !== null
    ? formatDistance(props.office.distanceMeters)
    : null,
)

const today = computed(() =>
  findTodaySchedule(props.office, props.userTimezone),
)

const todayHours = computed(() =>
  today.value && !today.value.isClosed
    ? formatHoursRange(today.value.open, today.value.close)
    : null,
)

const statusLine = computed(() => {
  const { status } = props.office
  if (status.isOpen) {
    if (status.timeUntilChange) {
      return `Closes in ${status.timeUntilChange}`
    }
    return status.statusText
  }
  if (status.nextChangeDay) {
    const day = status.nextChangeDay.toLowerCase() === 'today'
      ? 'today'
      : status.nextChangeDay
    return `Opens ${day}`
  }
  return status.statusText
})

const localityLabel = computed(() => {
  const label = props.office.label?.trim()
  return label && label.length > 0 ? label : props.office.city
})

const detailHref = computed(() => `/${officeSlug(props.office.name)}`)
</script>

<template>
  <NuxtLink
    :to="detailHref"
    class="office-card surface"
    :aria-labelledby="`office-${office.id}`"
  >
    <header class="card-head">
      <div>
        <p class="country">{{ office.country }}</p>
        <h3 :id="`office-${office.id}`" class="city">{{ localityLabel }}</h3>
      </div>
      <OfficeStatusBadge :status="office.status" />
    </header>

    <dl class="meta">
      <div class="meta-row">
        <dt>Today</dt>
        <dd>
          <span v-if="today?.isOverride && today.overrideLabel" class="override">
            {{ today.overrideLabel }}
          </span>
          <span v-else-if="todayHours">{{ todayHours }}</span>
          <span v-else class="muted">Closed today</span>
        </dd>
      </div>
      <div class="meta-row">
        <dt>Status</dt>
        <dd>{{ statusLine }}</dd>
      </div>
      <div v-if="distanceLabel" class="meta-row">
        <dt>Distance</dt>
        <dd>
          <span>{{ distanceLabel }}</span>
          <span class="distance-hint">from your location</span>
        </dd>
      </div>
    </dl>

    <p class="view-details" aria-hidden="true">
      <span>View office details</span>
      <span class="arrow">→</span>
    </p>
  </NuxtLink>
</template>

<style scoped>
.office-card {
  padding: var(--space-5) var(--space-5) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  container-type: inline-size;
  color: inherit;
  text-decoration: none;
  transition:
    box-shadow var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out),
    border-color var(--duration-base) var(--ease-out);
}

.office-card:hover,
.office-card:focus-visible {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}

.office-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .office-card,
  .office-card:hover,
  .office-card:focus-visible {
    transition: none;
    transform: none;
  }
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.country {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-block-end: var(--space-1);
}

.city {
  font-size: var(--text-xl);
  font-weight: 650;
  margin: 0;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-4) 0 0;
  border-block-start: 1px dashed var(--color-border);
}

.meta-row {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: var(--space-3);
  font-size: var(--text-sm);
  align-items: baseline;
}

.meta-row dt {
  color: var(--color-text-subtle);
  font-weight: 500;
}

.meta-row dd {
  margin: 0;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.muted {
  color: var(--color-text-subtle);
}

.distance-hint {
  margin-inline-start: var(--space-2);
  color: var(--color-text-subtle);
  font-size: var(--text-xs);
}

.override {
  display: inline-flex;
  padding: 2px var(--space-2);
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
}

.view-details {
  margin-block-start: auto;
  padding-block-start: var(--space-3);
  border-block-start: 1px dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-accent-strong);
}

.view-details .arrow {
  transition: transform var(--duration-base) var(--ease-out);
}

.office-card:hover .view-details .arrow,
.office-card:focus-visible .view-details .arrow {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .view-details .arrow,
  .office-card:hover .view-details .arrow,
  .office-card:focus-visible .view-details .arrow {
    transition: none;
    transform: none;
  }
}

@container (min-width: 22rem) {
  .city {
    font-size: var(--text-2xl);
  }
}
</style>
