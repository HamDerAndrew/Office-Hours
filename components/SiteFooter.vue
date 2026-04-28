<script setup lang="ts">
const year = new Date().getFullYear()

const columns = [
  {
    heading: 'Services',
    links: [
      { label: 'Frontend engineering', to: '/' },
      { label: 'Backend & APIs', to: '/' },
      { label: 'Cloud & DevOps', to: '/' },
      { label: 'Mobile platforms', to: '/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/about' },
    ],
  },
] as const
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="brand-col">
        <SiteLogo tone="light" />
        <p class="lead-sm">
          A digital technology contractor building durable web products
          across every stack.
        </p>
      </div>

      <nav
        v-for="col in columns"
        :key="col.heading"
        class="link-col"
        :aria-label="col.heading"
      >
        <h3 class="col-heading">{{ col.heading }}</h3>
        <ul role="list">
          <li v-for="link in col.links" :key="link.label">
            <NuxtLink :to="link.to" class="footer-link">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="link-col">
        <h3 class="col-heading">Get in touch</h3>
        <ul role="list" class="contact-list">
          <li><a href="mailto:hello@northwall.dev" class="footer-link">hello@northwall.dev</a></li>
          <li><a href="tel:+4500000000" class="footer-link">+45 00 00 00 00</a></li>
          <li class="text-mute">Copenhagen · Reykjavik · Saint-Denis</li>
        </ul>
      </div>
    </div>

    <div class="container legal-row">
      <p class="text-mute">© {{ year }} Northwall Digital. All rights reserved.</p>
      <p class="text-mute">Built with Nuxt · Hosted on Netlify</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-brand);
  color: color-mix(in oklab, var(--color-text-inverse), transparent 25%);
  padding-block: var(--space-9) var(--space-6);
  margin-block-start: var(--space-9);
}

.footer-grid {
  display: grid;
  gap: var(--space-7) var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}

.brand-col {
  max-inline-size: 22rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.lead-sm {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-text-inverse), transparent 35%);
}

.col-heading {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-inverse);
  margin-block-end: var(--space-4);
}

.link-col ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-list {
  font-size: var(--text-sm);
}

.footer-link {
  font-size: var(--text-sm);
  color: color-mix(in oklab, var(--color-text-inverse), transparent 25%);
  transition: color var(--duration-fast) var(--ease-out);
}

.footer-link:hover {
  color: var(--color-text-inverse);
}

.text-mute {
  color: color-mix(in oklab, var(--color-text-inverse), transparent 50%);
  font-size: var(--text-sm);
}

.legal-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  border-block-start: 1px solid color-mix(in oklab, var(--color-text-inverse), transparent 80%);
  margin-block-start: var(--space-7);
  padding-block-start: var(--space-5);
}
</style>
