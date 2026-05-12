<script setup lang="ts">
const userContext = useUserContextStore()

onMounted(() => {
  userContext.detectTimezone()
  void userContext.restoreLocationIfGranted()
})
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;
}

main {
  flex: 1;
}

.skip-link {
  position: absolute;
  inset-block-start: var(--space-3);
  inset-inline-start: var(--space-3);
  padding: var(--space-2) var(--space-4);
  background: var(--color-brand);
  color: var(--color-text-inverse);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: var(--text-sm);
  transform: translateY(-200%);
  transition: transform var(--duration-base) var(--ease-out);
  z-index: 100;
}

.skip-link:focus-visible {
  transform: translateY(0);
}
</style>
