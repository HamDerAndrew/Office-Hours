<script setup lang="ts">
const stats = [
  { value: '120+', label: 'Production launches' },
  { value: '14', label: 'Years compounding' },
  { value: '5', label: 'Cities, one practice' },
] as const
</script>

<template>
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">Digital technology contractor</span>
        <h1 class="hero-title">
          Engineering teams that ship the web,
          <span class="hl">across every stack.</span>
        </h1>
        <p class="lead">
          From frontend systems to cloud infrastructure, Northwall Digital
          partners with product teams who care about craft. We assemble small,
          senior squads to design, build, and operate the platforms your
          business depends on.
        </p>

        <div class="cta-row">
          <NuxtLink to="/contact" class="btn btn-primary">
            Start a project
            <span aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink to="/about" class="btn btn-ghost">
            How we work
          </NuxtLink>
        </div>

        <dl class="stats">
          <div v-for="stat in stats" :key="stat.label" class="stat">
            <dt>{{ stat.label }}</dt>
            <dd>{{ stat.value }}</dd>
          </div>
        </dl>
      </div>

      <aside class="hero-visual" aria-hidden="true">
        <div class="grid-bg" />
        <div class="card card-1">
          <div class="card-dot" data-tone="green" />
          <span>main • deploy preview</span>
        </div>
        <div class="card card-2">
          <code>const ship = always(true)</code>
        </div>
        <div class="card card-3">
          <span class="card-label">P95 latency</span>
          <span class="card-value">82ms</span>
        </div>
        <div class="orb" />
      </aside>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-block: clamp(3.5rem, 6vw, 6rem) clamp(2.5rem, 5vw, 5rem);
  overflow: hidden;
  isolation: isolate;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 80% 60% at 100% 0%,
      color-mix(in oklab, var(--color-accent-soft), transparent 30%),
      transparent 60%
    ),
    radial-gradient(
      ellipse 50% 40% at 0% 100%,
      color-mix(in oklab, var(--color-accent-soft), transparent 70%),
      transparent 60%
    );
  z-index: -1;
}

.hero-grid {
  display: grid;
  gap: var(--space-7);
  grid-template-columns: 1fr;
  align-items: center;
}

@media (min-width: 960px) {
  .hero-grid {
    grid-template-columns: 1.1fr 1fr;
    gap: var(--space-8);
  }
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.hero-title .hl {
  background: linear-gradient(
    100deg,
    var(--color-accent-strong),
    var(--color-accent)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-block-start: var(--space-2);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--space-5);
  padding-block-start: var(--space-5);
  margin-block-start: var(--space-3);
  border-block-start: 1px solid var(--color-border);
}

.stat dt {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-block-end: var(--space-2);
}

.stat dd {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0;
}

/* Visual cluster */
.hero-visual {
  position: relative;
  aspect-ratio: 1.05;
  min-block-size: 320px;
  display: none;
}

@media (min-width: 960px) {
  .hero-visual {
    display: block;
  }
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 20%, transparent 75%);
  opacity: 0.6;
}

.orb {
  position: absolute;
  inset-block-end: 8%;
  inset-inline-end: 14%;
  inline-size: 8rem;
  block-size: 8rem;
  background: radial-gradient(
    circle at 30% 30%,
    var(--color-accent),
    var(--color-accent-strong)
  );
  border-radius: 50%;
  filter: blur(0.5px);
  box-shadow: 0 30px 60px -20px color-mix(in oklab, var(--color-accent), transparent 40%);
  animation: float 8s ease-in-out infinite;
}

.card {
  position: absolute;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
  animation: float 7s ease-in-out infinite;
}

.card code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-accent-strong);
}

.card-1 {
  inset-block-start: 10%;
  inset-inline-start: 6%;
  animation-delay: -1s;
}

.card-2 {
  inset-block-start: 46%;
  inset-inline-end: 4%;
  animation-delay: -3s;
}

.card-3 {
  inset-block-end: 14%;
  inset-inline-start: 12%;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  animation-delay: -5s;
}

.card-label {
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.card-value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: -0.02em;
}

.card-dot {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-success);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .orb {
    animation: none;
  }
}
</style>
