<script setup lang="ts">
useHead({
  title: "Starter Guide",
});

const sections = [
  {
    title: "Dashboard shell",
    description:
      "Layouts, sidebar, topbar, page wrappers, and navigation patterns.",
  },
  {
    title: "Form system",
    description:
      "Reusable inputs, yup validations, feedback flows, and upload patterns.",
  },
  {
    title: "Admin UI patterns",
    description:
      "Charts, tables, modal flows, settings, billing, team, and notifications.",
  },
];
</script>

<template>
  <main
    class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#eef2f7_100%)] px-4 py-12 md:px-6 md:py-16"
  >
    <section
      class="mx-auto max-w-5xl rounded-[32px] border border-border-primary bg-white/85 px-6 py-8 shadow-sm shadow-slate-200/70"
    >
      <p
        class="text-xs font-semibold uppercase tracking-[0.3em] text-text-icon"
      >
        Starter Guide
      </p>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight text-text-primary">
        What this starter gives developers out of the box.
      </h1>
      <p class="mt-4 max-w-3xl text-base leading-7 text-text-secondary">
        This repo is structured as a launch-ready Nuxt admin starter, not a
        finished product. It is meant to reduce setup work by shipping reusable
        UI patterns, dashboard structure, auth scaffolding, and common SaaS
        admin modules.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <article
          v-for="section in sections"
          :key="section.title"
          class="rounded-[24px] border border-border-primary bg-slate-50 px-5 py-5"
        >
          <h2 class="text-lg font-semibold text-text-primary">
            {{ section.title }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-text-secondary">
            {{ section.description }}
          </p>
        </article>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink to="/dashboard" class="btn btn-sm btn-primary"
          >Open Dashboard</NuxtLink
        >
        <NuxtLink to="/auth/signin" class="btn btn-sm btn-default"
          >Review Auth Flow</NuxtLink
        >
      </div>
    </section>
  </main>
</template>
