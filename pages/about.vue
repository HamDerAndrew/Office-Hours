<script setup lang="ts">
useHead({
  title: 'About — Northwall Digital',
  meta: [
    {
      name: 'description',
      content:
        'Northwall Digital is a senior, distributed engineering practice. Learn about our approach, our values, and the people behind the work.',
    },
  ],
})

const values = [
  {
    title: 'Senior or nothing',
    body: 'Every engineer who touches your codebase has shipped production systems for a decade or more. No bench warmers, no juniors learning on your dime.',
  },
  {
    title: 'Type safety as a baseline',
    body: 'Strict TypeScript, validated boundaries, and explicit contracts. We catch problems at compile time so they never page someone at 02:00.',
  },
  {
    title: 'Operate what we ship',
    body: "We don't lob code over a fence. We pair on the runbook, watch the dashboards, and stay through the first week of traffic.",
  },
  {
    title: 'Honest estimates',
    body: 'We tell you how long it will actually take, in time we believe in. If a deadline is unrealistic, we say so before the contract is signed.',
  },
] as const

const approach = [
  {
    step: '01',
    title: 'Discovery',
    body: 'A two-week paid discovery: we read the code, talk to your team, and write a memo. You walk away with a plan whether or not you hire us for delivery.',
  },
  {
    step: '02',
    title: 'Squad assembly',
    body: 'Two-to-four senior engineers, plus an embedded technical lead. The same faces from kickoff to handover.',
  },
  {
    step: '03',
    title: 'Iterative delivery',
    body: 'Two-week cycles, demoed live. Every cycle ships something usable; every cycle you can change direction.',
  },
  {
    step: '04',
    title: 'Handover & operate',
    body: 'A 30-day operate-with phase. We keep paying down ops debt while your team takes the wheel. No surprise dependencies.',
  },
] as const

const team = [
  {
    name: 'Astrid Lindqvist',
    role: 'Founder, Principal Engineer',
    bio: '14 years across frontend platforms and design systems. Previously staff engineer at two scale-ups in Copenhagen.',
  },
  {
    name: 'Marc Dubois',
    role: 'Cloud Practice Lead',
    bio: 'AWS solutions architect, ex-Sopra Steria. Led platform migrations for retail and public-sector clients across Europe.',
  },
  {
    name: 'Halldór Sigurðsson',
    role: 'Head of Backend Engineering',
    bio: 'Distributed systems generalist. Speaks fluent Go, Kotlin, and incident-postmortem.',
  },
  {
    name: 'Wei Chen',
    role: 'Design Engineer',
    bio: 'Bridges product design and frontend. Deep love for typographic systems, motion, and the cascade.',
  },
] as const
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">About</span>
        <h1>A small practice, built for serious software.</h1>
        <p class="lead">
          Northwall Digital is a contractor of senior engineers spread across
          Europe. We've spent careers inside product organisations — that's
          why we work the way we do.
        </p>
      </div>
    </section>

    <section class="section story">
      <div class="container story-grid">
        <div>
          <span class="eyebrow">Our story</span>
          <h2>Why we exist</h2>
        </div>
        <div class="story-text">
          <p>
            Northwall started in 2014 with a simple frustration: every consultancy
            promised seniority, and almost none delivered it. The teams who showed
            up were rotating juniors on a learning curve, with one architect doing
            laps to keep things from breaking.
          </p>
          <p>
            We built the company we wanted to hire. Small senior squads. No
            overflowing bench. Long-term relationships with a handful of clients,
            not a churn machine.
          </p>
          <p>
            Today we're a distributed team of fifteen, with hubs in Copenhagen,
            Reykjavik, Saint-Denis, and Jezqazğan. We move between layers of the
            stack and between domains — banking, public infrastructure, climate
            tech, retail.
          </p>
        </div>
      </div>
    </section>

    <section class="section values">
      <div class="container">
        <header class="section-header">
          <span class="eyebrow">What we believe</span>
          <h2>Four principles, tested in production.</h2>
        </header>
        <ul role="list" class="values-grid">
          <li v-for="v in values" :key="v.title" class="value-card">
            <h3>{{ v.title }}</h3>
            <p>{{ v.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="section approach">
      <div class="container">
        <header class="section-header">
          <span class="eyebrow">How we work</span>
          <h2>From first call to operating with your team.</h2>
        </header>
        <ol role="list" class="approach-list">
          <li v-for="step in approach" :key="step.step" class="approach-item">
            <span class="step-num">{{ step.step }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.body }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section team">
      <div class="container">
        <header class="section-header">
          <span class="eyebrow">People</span>
          <h2>Some of the engineers you'll work with.</h2>
        </header>
        <ul role="list" class="team-grid">
          <li v-for="person in team" :key="person.name" class="person">
            <div class="avatar" aria-hidden="true">
              {{ person.name.split(' ').map((p) => p[0]).join('') }}
            </div>
            <h3>{{ person.name }}</h3>
            <p class="role">{{ person.role }}</p>
            <p class="bio">{{ person.bio }}</p>
          </li>
        </ul>
      </div>
    </section>

    <CtaBanner
      title="Want to know if we're a fit?"
      description="A 30-minute call costs nothing. We'll tell you honestly whether we can help."
    />
  </div>
</template>

<style scoped>
.page-hero {
  padding-block: clamp(3rem, 6vw, 6rem) clamp(2rem, 4vw, 4rem);
}

.page-hero h1 {
  margin-block-start: var(--space-3);
  max-inline-size: 18ch;
}

.page-hero .lead {
  margin-block-start: var(--space-4);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-inline-size: 56rem;
  margin-block-end: var(--space-7);
}

.story {
  background: var(--color-surface);
}

.story-grid {
  display: grid;
  gap: var(--space-7);
  align-items: start;
}

@media (min-width: 880px) {
  .story-grid {
    grid-template-columns: 1fr 1.6fr;
    gap: var(--space-9);
  }
}

.story-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  line-height: 1.65;
  max-inline-size: 60ch;
}

.values-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}

.value-card {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  border-block-start: 3px solid var(--color-accent);
}

.value-card h3 {
  margin-block-end: var(--space-2);
}

.value-card p {
  color: var(--color-text-muted);
}

.approach {
  background: var(--color-surface);
}

.approach-list {
  display: grid;
  gap: var(--space-5);
  counter-reset: step;
}

.approach-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-5);
  padding-block: var(--space-5);
  border-block-start: 1px solid var(--color-border);
  align-items: start;
}

.approach-item:first-child {
  border-block-start: none;
  padding-block-start: 0;
}

.step-num {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-accent-strong);
  min-inline-size: 3rem;
}

.approach-item h3 {
  font-size: var(--text-xl);
  margin-block-end: var(--space-2);
}

.approach-item p {
  color: var(--color-text-muted);
  max-inline-size: 60ch;
}

.team-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}

.person {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.avatar {
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-accent-soft),
    color-mix(in oklab, var(--color-accent), white 30%)
  );
  color: var(--color-accent-strong);
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-block-end: var(--space-3);
}

.person h3 {
  font-size: var(--text-base);
  font-weight: 650;
}

.role {
  font-size: var(--text-sm);
  color: var(--color-accent-strong);
  font-weight: 500;
}

.bio {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-block-start: var(--space-2);
}
</style>
