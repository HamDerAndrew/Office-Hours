<script setup lang="ts">
const isMenuOpen = ref(false)

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

const route = useRoute()
watch(
  () => route.path,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <header class="site-header">
    <div class="container header-row">
      <NuxtLink to="/" class="brand" aria-label="Northwall — home">
        <SiteLogo />
      </NuxtLink>

      <nav class="nav-desktop" aria-label="Primary">
        <ul role="list">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink :to="item.to" class="nav-link">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <NuxtLink to="/contact" class="btn btn-primary cta-desktop">
        Start a project
      </NuxtLink>

      <button
        type="button"
        class="menu-toggle"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-nav"
        aria-label="Toggle menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="bar" :data-open="isMenuOpen" />
        <span class="bar" :data-open="isMenuOpen" />
      </button>
    </div>

    <Transition name="drawer">
      <nav
        v-if="isMenuOpen"
        id="mobile-nav"
        class="nav-mobile"
        aria-label="Primary mobile"
      >
        <ul role="list">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink :to="item.to" class="nav-link-mobile">
              {{ item.label }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="btn btn-primary nav-mobile-cta">
              Start a project
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 50;
  background: color-mix(in oklab, var(--color-bg), transparent 8%);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-block-end: 1px solid var(--color-border);
}

.header-row {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding-block: var(--space-4);
}

.brand {
  display: inline-flex;
  align-items: center;
  margin-inline-end: auto;
}

.nav-desktop ul {
  display: flex;
  gap: var(--space-6);
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  position: relative;
  padding-block: var(--space-2);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-text);
}

.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  inset-block-end: 0;
  inset-inline-start: 0;
  inline-size: 100%;
  block-size: 2px;
  background: var(--color-accent);
  border-radius: 2px;
}

.cta-desktop {
  margin-inline-start: var(--space-4);
}

.menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  inline-size: 2.5rem;
  block-size: 2.5rem;
  cursor: pointer;
  padding: 0;
  position: relative;
}

.menu-toggle .bar {
  position: absolute;
  inset-inline-start: 50%;
  inline-size: 1rem;
  block-size: 1.5px;
  background: var(--color-text);
  border-radius: 2px;
  transform: translateX(-50%);
  transition: transform var(--duration-base) var(--ease-out);
}

.menu-toggle .bar:nth-child(1) {
  inset-block-start: calc(50% - 4px);
}

.menu-toggle .bar:nth-child(2) {
  inset-block-start: calc(50% + 4px);
}

.menu-toggle .bar[data-open='true']:nth-child(1) {
  inset-block-start: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.menu-toggle .bar[data-open='true']:nth-child(2) {
  inset-block-start: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}

@media (prefers-reduced-motion: reduce) {
  .menu-toggle .bar {
    transition: none;
  }
}

@media (max-width: 720px) {
  .nav-desktop,
  .cta-desktop {
    display: none;
  }
  .menu-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.nav-mobile {
  border-block-start: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: var(--space-5) var(--container-pad-inline);
}

.nav-mobile ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.nav-link-mobile {
  display: block;
  font-size: var(--text-lg);
  font-weight: 600;
  padding-block: var(--space-3);
  border-block-end: 1px solid var(--color-border);
}

.nav-link-mobile.router-link-exact-active {
  color: var(--color-accent-strong);
}

.nav-mobile-cta {
  margin-block-start: var(--space-3);
  inline-size: 100%;
  justify-content: center;
}

.drawer-enter-active,
.drawer-leave-active {
  transition:
    opacity var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active {
    transition: none;
  }
}
</style>
