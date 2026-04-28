<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <section class="cta">
    <div class="container">
      <div class="cta-card">
        <div class="cta-content">
          <span v-if="eyebrow" class="eyebrow eyebrow-light">{{ eyebrow }}</span>
          <h2>{{ title }}</h2>
          <p v-if="description" class="lead-light">{{ description }}</p>
        </div>
        <div class="cta-actions">
          <NuxtLink to="/contact" class="btn btn-accent">
            Start a project
            <span aria-hidden="true">→</span>
          </NuxtLink>
          <a href="mailto:hello@northwall.dev" class="btn btn-outline">
            hello@northwall.dev
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding-block: clamp(3rem, 5vw, 5rem);
}

.cta-card {
  position: relative;
  background:
    radial-gradient(
      ellipse 60% 80% at 100% 0%,
      color-mix(in oklab, var(--color-accent), transparent 60%),
      transparent 60%
    ),
    var(--color-brand);
  color: var(--color-text-inverse);
  border-radius: var(--radius-xl);
  padding: clamp(2rem, 4vw, 3.5rem);
  display: grid;
  gap: var(--space-6);
  align-items: center;
  overflow: hidden;
}

@media (min-width: 800px) {
  .cta-card {
    grid-template-columns: 1.4fr auto;
  }
}

.cta-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.cta-card h2 {
  color: var(--color-text-inverse);
  font-size: var(--text-3xl);
  letter-spacing: -0.02em;
  max-inline-size: 22ch;
}

.eyebrow-light {
  color: var(--color-accent);
}

.lead-light {
  color: color-mix(in oklab, var(--color-text-inverse), transparent 30%);
  font-size: var(--text-lg);
  max-inline-size: 50ch;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.btn-accent {
  background: var(--color-accent);
  color: var(--color-brand);
}

.btn-accent:hover {
  background: var(--color-accent-strong);
  color: var(--color-text-inverse);
}

.btn-outline {
  background: transparent;
  color: var(--color-text-inverse);
  border-color: color-mix(in oklab, var(--color-text-inverse), transparent 60%);
}

.btn-outline:hover {
  border-color: var(--color-text-inverse);
}
</style>
