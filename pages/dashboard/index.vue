<script setup lang="ts">
useHead({
  title: "Dashboard",
});

definePageMeta({ layout: "dashboard" });

const metrics: { value: string; title: string; description: string }[] = [
  {
    value: "NGN 48.2M",
    title: "gross payment volume",
    description: "Processed across card, transfer, and POS channels today.",
  },
  {
    value: "1,842",
    title: "successful transactions",
    description: "Approved payments captured and ready for reconciliation.",
  },
  {
    value: "128",
    title: "pending settlements",
    description: "Merchant payouts queued before the next settlement run.",
  },
  {
    value: "14",
    title: "open disputes",
    description: "Chargebacks and reversals still awaiting operations review.",
  },
];
</script>

<template>
  <DashboardWrapper
    title="Dashboard"
    message="Starter Overview"
    description="This dashboard is positioned as the control center of the starter pack, with reusable admin modules that developers can extend instead of rebuilding."
  >
    <div class="space-y-6">
      <section
        class="rounded-[28px] border border-border-primary bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.2),_transparent_42%),linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)] px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
      >
        <p class="text-sm uppercase tracking-[0.32em] text-slate-300">
          Overview
        </p>
        <div
          class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
        >
          <div class="max-w-2xl">
            <h2 class="text-3xl font-semibold tracking-tight md:text-4xl">
              Payment operations, settlements, disputes, and merchant activity
              in one place.
            </h2>
            <p
              class="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base"
            >
              This home view is now framed like a real payment admin surface,
              with metrics tied to transaction volume, settlement flow, and
              support risk.
            </p>
          </div>
          <NuxtLink
            to="/dashboard/charts"
            class="hover:bg-white/16 inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition"
          >
            Open charts
          </NuxtLink>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="metric in metrics"
          :key="metric.title"
          class="rounded-2xl border border-border-primary bg-white/90 p-5 shadow-sm shadow-slate-200/70"
        >
          <p
            class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
          >
            {{ metric.title }}
          </p>
          <p class="mt-3 text-3xl font-semibold text-text-primary">
            {{ metric.value }}
          </p>
          <p class="mt-2 text-sm leading-6 text-text-secondary">
            {{ metric.description }}
          </p>
        </article>
      </section>
    </div>
  </DashboardWrapper>
</template>

<style scoped></style>
