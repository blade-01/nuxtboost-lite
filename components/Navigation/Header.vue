<template>
  <header class="mx-auto flex max-w-5xl flex-col items-center text-center">
    <div
      class="inline-flex items-center gap-2 rounded-full border border-border-primary bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-text-icon shadow-sm shadow-slate-200/60"
    >
      <Icon name="mdi:rocket-launch-outline" size="18" />
      SaaS Admin Starter
    </div>
    <h1
      class="mt-6 text-4xl font-semibold tracking-tight text-text-primary md:text-6xl"
    >
      Launch dashboards faster with a clean Nuxt starter that already has the
      hard parts.
    </h1>
    <p
      class="mt-5 max-w-3xl text-base leading-7 text-text-secondary md:text-lg"
    >
      Reusable dashboard primitives, auth wiring, tables, charts, forms,
      feedback, and polished starter pages so teams can skip setup work and
      start shipping.
    </p>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <NuxtLink to="/dashboard" class="btn btn-sm btn-primary"
        >Open Dashboard</NuxtLink
      >
      <NuxtLink to="/about" class="btn btn-sm btn-default"
        >View Starter Guide</NuxtLink
      >
    </div>
  </header>
</template>

<style lang="scss" scoped></style>
