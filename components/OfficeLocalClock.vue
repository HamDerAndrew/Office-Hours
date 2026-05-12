<script setup lang="ts">
const props = defineProps<{
  timezone: string
}>()

const now = ref<Date | null>(null)
let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  now.value = new Date()
  intervalId = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
})

const timeFormatter = computed(
  () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: props.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
)

const zoneFormatter = computed(
  () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: props.timezone,
      timeZoneName: 'long',
    }),
)

const localTime = computed(() => {
  if (!now.value) return '--:--:--'
  return timeFormatter.value.format(now.value)
})

const timezoneName = computed(() => {
  if (!now.value) return props.timezone
  const parts = zoneFormatter.value.formatToParts(now.value)
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? props.timezone
})
</script>

<template>
  <div class="local-clock" aria-live="off">
    <span class="eyebrow">Local time</span>
    <time class="time" :datetime="now?.toISOString()">{{ localTime }}</time>
    <span class="zone">
      <span class="zone-name">{{ timezoneName }}</span>
      <span class="zone-iana">{{ timezone }}</span>
    </span>
  </div>
</template>

<style scoped>
.local-clock {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-inline-size: 14rem;
}

.eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.time {
  font-size: var(--text-3xl);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  line-height: 1.05;
  color: var(--color-text);
}

.zone {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: var(--text-sm);
}

.zone-name {
  color: var(--color-text);
}

.zone-iana {
  color: var(--color-text-subtle);
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
}
</style>
