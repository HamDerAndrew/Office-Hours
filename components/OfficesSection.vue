<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { data, pending, error, refresh } = await useOfficesWithHours()
const userContext = useUserContextStore()
const { timezone, coords, geolocationStatus } = storeToRefs(userContext)

const offices = computed(() => data.value?.offices ?? [])
const hasOffices = computed(() => offices.value.length > 0)

const isLocating = computed(() => geolocationStatus.value === 'pending')
const hasLocation = computed(() => coords.value !== null)

const locationButtonLabel = computed(() => {
  if (isLocating.value) return 'Locating…'
  if (hasLocation.value) return 'Hide distances'
  return 'Show distance from me'
})

const locationMessage = computed(() => {
  switch (geolocationStatus.value) {
    case 'denied':
      return 'Location blocked. Enable it in your browser settings to see distances.'
    case 'unavailable':
      return "Your browser doesn't support geolocation."
    case 'error':
      return "We couldn't read your location. Try again in a moment."
    default:
      return null
  }
})

function onLocationToggle(): void {
  if (hasLocation.value) {
    userContext.clearLocation()
    return
  }
  void userContext.requestLocation()
}
</script>

<template>
  <section id="offices" class="section offices-section">
    <div class="container">
      <header class="header">
        <div class="header-text">
          <span class="eyebrow">Where we work</span>
          <h2>Offices around the world</h2>
          <p class="lead">
            We're a distributed practice with hubs across Europe and beyond.
            Each card shows when an office opens or closes next, counted from
            where you are — so you always know who's online when you need them.
          </p>
        </div>
        <div class="location-control">
          <button
            type="button"
            class="btn btn-ghost"
            :disabled="isLocating"
            :aria-pressed="hasLocation"
            @click="onLocationToggle"
          >
            {{ locationButtonLabel }}
          </button>
          <p
            v-if="locationMessage"
            class="location-message"
            role="status"
            aria-live="polite"
          >
            {{ locationMessage }}
          </p>
        </div>
      </header>

      <div v-if="pending && !hasOffices" class="state-grid" aria-live="polite">
        <div v-for="n in 3" :key="n" class="skeleton-card" aria-hidden="true">
          <div class="skeleton skeleton-line short" />
          <div class="skeleton skeleton-line long" />
          <div class="skeleton skeleton-line med" />
          <div class="skeleton skeleton-line med" />
        </div>
      </div>

      <div v-else-if="error" class="state-empty" role="alert">
        <h3>We couldn't load office hours</h3>
        <p class="text-muted">
          The offices API didn't respond. This is temporary — please try again.
        </p>
        <button type="button" class="btn btn-ghost" @click="refresh()">
          Retry
        </button>
      </div>

      <div v-else-if="!hasOffices" class="state-empty">
        <h3>No offices to show yet</h3>
        <p class="text-muted">
          We're still in setup mode. New locations will appear here as they
          come online.
        </p>
      </div>

      <ul v-else role="list" class="office-grid">
        <li v-for="office in offices" :key="office.id">
          <OfficeCard :office="office" :user-timezone="timezone" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.offices-section {
  background:
    radial-gradient(
      circle at 100% 0%,
      var(--color-accent-soft),
      transparent 40%
    ),
    var(--color-bg);
}

.header {
  margin-block-end: var(--space-7);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-5);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-inline-size: 56rem;
  flex: 1 1 28rem;
}

.location-control {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
}

.location-message {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  max-inline-size: 22rem;
}

.office-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
}

.office-grid > li {
  display: flex;
}

.office-grid > li > * {
  flex: 1;
}

.state-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
}

.skeleton-card {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
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
  block-size: 0.75rem;
}

.skeleton-line.short {
  inline-size: 30%;
}
.skeleton-line.med {
  inline-size: 60%;
}
.skeleton-line.long {
  inline-size: 85%;
  block-size: 1.4rem;
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

.state-empty {
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
</style>
