<script setup lang="ts">
const services = [
  {
    title: 'Frontend engineering',
    description:
      'Vue, React, Next, Nuxt, and Svelte. Design-systems-first, accessible, and tuned for Core Web Vitals.',
    bullets: ['Design systems', 'Performance tuning', 'A11y baseline'],
  },
  {
    title: 'Backend & APIs',
    description:
      'Node, .NET, Go, and Python. REST and GraphQL surfaces, event pipelines, and clean domain modelling.',
    bullets: ['Domain-driven design', 'Event-driven systems', 'Type-safe schemas'],
  },
  {
    title: 'Cloud & DevOps',
    description:
      'AWS, Azure, GCP, and Cloudflare. Infrastructure-as-code, observable platforms, and zero-drama releases.',
    bullets: ['IaC with Terraform', 'CI/CD pipelines', 'Cost & SLO ownership'],
  },
  {
    title: 'Headless CMS',
    description:
      'Umbraco, Sanity, Contentful, and Storyblok. Editorial UX teams enjoy and a content model that scales.',
    bullets: ['Editor experience', 'Composable content', 'Multi-region delivery'],
  },
  {
    title: 'Mobile platforms',
    description:
      'React Native and native Swift/Kotlin. From greenfield apps to bringing existing fleets onto modern stacks.',
    bullets: ['Cross-platform', 'Native modules', 'App store ops'],
  },
  {
    title: 'AI & ML integration',
    description:
      'Claude, OpenAI, and self-hosted models. Practical assistants, RAG pipelines, and evaluation harnesses.',
    bullets: ['LLM tooling', 'Retrieval pipelines', 'Evaluation & guardrails'],
  },
] as const
</script>

<template>
  <section id="services" class="section services">
    <div class="container">
      <header class="section-header">
        <span class="eyebrow">What we do</span>
        <h2>One contractor, every layer of the stack.</h2>
        <p class="lead">
          We don't sub-contract. Every engagement is staffed by senior
          engineers who can move between layers — because real software is
          rarely just one thing.
        </p>
      </header>

      <ul role="list" class="cards">
        <li v-for="service in services" :key="service.title" class="card">
          <span class="card-corner" aria-hidden="true" />
          <h3>{{ service.title }}</h3>
          <p class="card-desc">{{ service.description }}</p>
          <ul role="list" class="card-bullets">
            <li v-for="b in service.bullets" :key="b">{{ b }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.services {
  background: var(--color-surface);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-inline-size: 56rem;
  margin-block-end: var(--space-7);
}

.cards {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
}

.card {
  position: relative;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  overflow: hidden;
  transition:
    border-color var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

.card:hover {
  border-color: var(--color-text);
  transform: translateY(-2px);
}

.card-corner {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  inline-size: 4rem;
  block-size: 4rem;
  background: linear-gradient(
    135deg,
    transparent 50%,
    var(--color-accent-soft) 50%
  );
}

.card h3 {
  font-size: var(--text-lg);
  font-weight: 650;
}

.card-desc {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.card-bullets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block-start: auto;
  padding-block-start: var(--space-3);
}

.card-bullets li {
  padding: 2px var(--space-2);
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .card:hover {
    transition: none;
    transform: none;
  }
}
</style>
