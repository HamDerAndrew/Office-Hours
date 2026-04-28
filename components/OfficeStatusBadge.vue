<script setup lang="ts">
import type { OfficeStatus } from '~/types/umbraco'

defineProps<{ status: OfficeStatus }>()
</script>

<template>
  <span
    class="badge"
    :data-state="status.isOpen ? 'open' : 'closed'"
    role="status"
  >
    <span class="dot" aria-hidden="true" />
    <span v-if="status.isOpen" class="text">Open now</span>
    <span v-else-if="status.timeUntilChange" class="text text--stack">
      <span class="text__eyebrow">Opens in</span>
      <span class="text__value">{{ status.timeUntilChange }}</span>
    </span>
    <span v-else class="text">Closed</span>
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
}

.dot {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.text--stack {
  display: inline-flex;
  flex-direction: column;
  line-height: 1.1;
  gap: 1px;
}

.text__eyebrow {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}

.text__value {
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}

.badge[data-state='open'] {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.badge[data-state='open'] .dot {
  animation: pulse 2.4s var(--ease-out) infinite;
}

.badge[data-state='closed'] {
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
  border-color: var(--color-border);
}

@keyframes pulse {
  0%,
  60%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  30% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .badge[data-state='open'] .dot {
    animation: none;
  }
}
</style>
