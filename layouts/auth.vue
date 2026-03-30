<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#eef2f7_100%)] px-4 py-10 md:px-6"
  >
    <div
      class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-stretch overflow-hidden rounded-[32px] border border-border-primary bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    >
      <section
        class="hidden w-[42%] border-r border-border-primary bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_34%),linear-gradient(180deg,#0f172a_0%,#1e293b_55%,#334155_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between"
      >
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200"
          >
            <Icon name="mdi:rocket-launch-outline" size="18" />
            NuxtBoost
          </div>
          <h1 class="mt-8 text-4xl font-semibold leading-tight">
            Ship admin and SaaS interfaces without rebuilding the foundation.
          </h1>
          <p class="mt-4 text-sm leading-7 text-slate-300">
            Auth screens, dashboard modules, reusable inputs, charts, tables,
            and feedback flows are already in place so teams can move straight
            to product work.
          </p>
        </div>
        <div class="grid gap-4">
          <div class="rounded-3xl border border-white/10 bg-white/10 p-5">
            <p class="text-xs uppercase tracking-[0.24em] text-slate-300">
              Included
            </p>
            <p class="mt-2 text-lg font-medium">
              Auth, analytics, billing, team, settings
            </p>
          </div>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition hover:text-white"
          >
            <Icon name="mdi:arrow-left" size="18" />
            Back to starter overview
          </NuxtLink>
        </div>
      </section>
      <section
        class="flex flex-1 items-center justify-center px-5 py-10 md:px-10"
      >
        <div class="w-full max-w-xl">
          <slot />
        </div>
      </section>
    </div>
  </div>
</template>
