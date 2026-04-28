<script setup lang="ts">
useHead({
  title: 'Contact — Northwall Digital',
  meta: [
    {
      name: 'description',
      content:
        'Get in touch with Northwall Digital. Email, phone, or send us a project brief — we respond in your timezone, within one business day.',
    },
  ],
})

const form = reactive({
  name: '',
  email: '',
  company: '',
  budget: '',
  message: '',
})

const submitted = ref(false)
const submitting = ref(false)

async function onSubmit(): Promise<void> {
  submitting.value = true
  // No backend wired up yet — this page is informational. We pretend to send
  // and show a success state after a short delay so the form feels real.
  await new Promise((resolve) => setTimeout(resolve, 600))
  submitted.value = true
  submitting.value = false
}

const channels = [
  {
    label: 'General enquiries',
    value: 'hello@northwall.dev',
    href: 'mailto:hello@northwall.dev',
  },
  {
    label: 'New business',
    value: 'projects@northwall.dev',
    href: 'mailto:projects@northwall.dev',
  },
  {
    label: 'Press',
    value: 'press@northwall.dev',
    href: 'mailto:press@northwall.dev',
  },
  {
    label: 'Phone',
    value: '+45 00 00 00 00',
    href: 'tel:+4500000000',
  },
] as const

const officeAddresses = [
  {
    city: 'Copenhagen',
    country: 'Denmark',
    lines: ['Bredgade 24, 4. sal', '1260 København K'],
  },
  {
    city: 'Reykjavik',
    country: 'Iceland',
    lines: ['Hafnarstræti 15', '101 Reykjavik'],
  },
  {
    city: 'Saint-Denis',
    country: 'France',
    lines: ['12 Rue Roland-Garros', '97400 Saint-Denis'],
  },
] as const
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">Contact</span>
          <h1>Tell us about the work.</h1>
          <p class="lead">
            We respond within one business day, in your timezone. If it's
            urgent, ring us — someone is always on call.
          </p>
        </div>
        <ul role="list" class="channels">
          <li v-for="channel in channels" :key="channel.label">
            <span class="channel-label">{{ channel.label }}</span>
            <a :href="channel.href" class="channel-value">{{ channel.value }}</a>
          </li>
        </ul>
      </div>
    </section>

    <section class="section form-section">
      <div class="container form-grid">
        <div class="form-intro">
          <span class="eyebrow">Project brief</span>
          <h2>Send us a few details.</h2>
          <p class="text-muted">
            The more you can tell us — current stack, timeline, constraints —
            the more useful our first reply will be. No NDA needed at this stage.
          </p>
        </div>

        <form
          v-if="!submitted"
          class="form"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div class="row">
            <label class="field">
              <span class="label-text">Your name</span>
              <input
                v-model="form.name"
                type="text"
                required
                autocomplete="name"
                placeholder="Jane Engineer"
              />
            </label>
            <label class="field">
              <span class="label-text">Email</span>
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="jane@company.com"
              />
            </label>
          </div>

          <div class="row">
            <label class="field">
              <span class="label-text">Company</span>
              <input
                v-model="form.company"
                type="text"
                autocomplete="organization"
                placeholder="Acme Inc."
              />
            </label>
            <label class="field">
              <span class="label-text">Budget range</span>
              <select v-model="form.budget">
                <option value="">Select…</option>
                <option value="under-50">Under €50k</option>
                <option value="50-150">€50k – €150k</option>
                <option value="150-500">€150k – €500k</option>
                <option value="500-plus">€500k+</option>
                <option value="undecided">Not sure yet</option>
              </select>
            </label>
          </div>

          <label class="field">
            <span class="label-text">What are you building?</span>
            <textarea
              v-model="form.message"
              rows="6"
              required
              placeholder="A new platform, a replatform, a rescue…"
            />
          </label>

          <button
            type="submit"
            class="btn btn-primary submit"
            :disabled="submitting"
          >
            <span v-if="!submitting">Send brief</span>
            <span v-else>Sending…</span>
            <span v-if="!submitting" aria-hidden="true">→</span>
          </button>
          <p class="form-fineprint text-muted">
            We use your details to reply to your enquiry, and only that.
            Nothing else.
          </p>
        </form>

        <div v-else class="form-success" role="status">
          <div class="success-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h3>Thank you — brief received.</h3>
          <p class="text-muted">
            We'll be in touch within one business day. Meanwhile, feel free
            to read about
            <NuxtLink to="/about">how we work</NuxtLink>.
          </p>
        </div>
      </div>
    </section>

    <section class="section addresses-section">
      <div class="container">
        <header class="section-header">
          <span class="eyebrow">Where to find us</span>
          <h2>Offices.</h2>
        </header>
        <ul role="list" class="addresses">
          <li v-for="addr in officeAddresses" :key="addr.city" class="address">
            <span class="addr-country">{{ addr.country }}</span>
            <h3>{{ addr.city }}</h3>
            <p v-for="line in addr.lines" :key="line">{{ line }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero {
  padding-block: clamp(3rem, 6vw, 6rem) clamp(2rem, 4vw, 4rem);
}

.hero-grid {
  display: grid;
  gap: var(--space-7);
  align-items: start;
}

@media (min-width: 880px) {
  .hero-grid {
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-8);
  }
}

.page-hero h1 {
  margin-block: var(--space-3) var(--space-4);
}

.channels {
  display: grid;
  gap: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.channels li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
  padding-block: var(--space-2);
  border-block-end: 1px dashed var(--color-border);
}

.channels li:last-child {
  border-block-end: none;
}

.channel-label {
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
}

.channel-value {
  font-weight: 600;
  font-size: var(--text-sm);
  text-align: end;
}

.channel-value:hover {
  color: var(--color-accent-strong);
}

.form-section {
  background: var(--color-surface);
}

.form-grid {
  display: grid;
  gap: var(--space-7);
  align-items: start;
}

@media (min-width: 880px) {
  .form-grid {
    grid-template-columns: 1fr 1.4fr;
    gap: var(--space-8);
  }
}

.form-intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  position: sticky;
  inset-block-start: 6rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.row {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

@media (min-width: 540px) {
  .row {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.label-text {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
}

.field input,
.field select,
.field textarea {
  inline-size: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  font-size: var(--text-base);
  font-family: inherit;
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.field textarea {
  resize: vertical;
  min-block-size: 8rem;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.submit {
  align-self: flex-start;
  margin-block-start: var(--space-2);
}

.submit:disabled {
  opacity: 0.6;
  cursor: progress;
}

.form-fineprint {
  font-size: var(--text-xs);
}

.form-success {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.form-success a {
  color: var(--color-accent-strong);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.success-mark {
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 50%;
  background: var(--color-success-bg);
  color: var(--color-success);
  display: grid;
  place-items: center;
}

.success-mark svg {
  inline-size: 1.5rem;
  block-size: 1.5rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-block-end: var(--space-7);
}

.addresses {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}

.address {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.addr-country {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-block-end: var(--space-2);
}

.address h3 {
  font-size: var(--text-xl);
  margin-block-end: var(--space-3);
}

.address p {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
</style>
