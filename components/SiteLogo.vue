<script setup lang="ts">
defineProps<{ tone?: 'dark' | 'light' }>()
</script>

<template>
  <span class="logo" :data-tone="tone ?? 'dark'">
    <svg
      class="mark"
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" />
      <path
        d="M9 22V10h2.6l5.2 7.4V10H19.4v12h-2.6L11.6 14.6V22z"
        fill="var(--color-bg)"
      />
    </svg>
    <span class="wordmark">Northwall</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  font-size: var(--text-lg);
  letter-spacing: -0.02em;
  color: inherit;
}

.mark {
  inline-size: 1.6rem;
  block-size: 1.6rem;
  color: var(--color-brand);
}

.logo[data-tone='light'] .mark {
  color: var(--color-text-inverse);
}

.logo[data-tone='light'] .wordmark {
  color: var(--color-text-inverse);
}
</style>
