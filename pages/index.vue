<script setup lang="ts">
useHead({
  title: "Nuxt Boost",
});
</script>

<template>
  <main
    class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#eef2f7_100%)] px-4 py-12 md:px-6 md:py-16"
  >
    <section class="mx-auto flex max-w-4xl flex-col items-center text-center">
      <div
        class="inline-flex items-center gap-2 rounded-full border border-border-primary bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-text-icon shadow-sm shadow-slate-200/60"
      >
        <Icon name="mdi:rocket-launch-outline" size="18" />
        Nuxt SaaS Starter
      </div>
      <h1
        class="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-text-primary md:text-6xl"
      >
        A clean Nuxt foundation for admin dashboards and SaaS products.
      </h1>
      <p
        class="mt-5 max-w-2xl text-base leading-7 text-text-secondary md:text-lg"
      >
        Start with layout, auth flows, forms, tables, charts, and baseline
        workspace modules already structured so teams can move into product work
        faster.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <NuxtLink to="/dashboard" class="btn btn-sm btn-primary"
          >Open Dashboard</NuxtLink
        >
        <NuxtLink to="/auth/signin" class="btn btn-sm btn-default"
          >Open Auth</NuxtLink
        >
      </div>
      <div class="mt-10 grid gap-3 text-left md:grid-cols-3">
        <div
          class="rounded-2xl border border-border-primary bg-white/80 px-5 py-4 text-sm text-text-secondary shadow-sm shadow-slate-200/50"
        >
          Dashboard shell, navigation, and reusable page structure.
        </div>
        <div
          class="rounded-2xl border border-border-primary bg-white/80 px-5 py-4 text-sm text-text-secondary shadow-sm shadow-slate-200/50"
        >
          Validated auth screens, form controls, feedback, and modal flows.
        </div>
        <div
          class="rounded-2xl border border-border-primary bg-white/80 px-5 py-4 text-sm text-text-secondary shadow-sm shadow-slate-200/50"
        >
          Billing, team, notifications, settings, tables, and charts.
        </div>
      </div>
    </section>

    <div class="mt-12">
      <NavigationFooter />
    </div>
  </main>
</template>

<style scoped></style>
