<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "role-access",
  roles: ["admin", "member", "staff"]
})
useHead({
  title: "Buttons"
})
</script>

<template>
  <DashboardWrapper title="Buttons">
    <div class="space-y-6">
      <section
        class="overflow-hidden rounded-[30px] border border-border-primary bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8fafc_48%,#eef2f7_100%)] px-6 py-7 shadow-sm shadow-slate-200/70"
      >
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">
              Action System
            </p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
              Button patterns with clearer hierarchy, icon balance, and size rhythm.
            </h2>
            <p class="mt-3 text-sm leading-6 text-text-secondary">
              This page now reads like a control gallery instead of a raw sample list, so action
              styles are easier to compare at a glance.
            </p>
          </div>
          <div class="grid gap-3 text-sm text-text-secondary sm:grid-cols-2">
            <div class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.22em] text-text-icon">Primary</p>
              <p class="mt-2 font-medium text-text-primary">High-contrast actions</p>
            </div>
            <div class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.22em] text-text-icon">Scale</p>
              <p class="mt-2 font-medium text-text-primary">Consistent sizing across states</p>
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
      >
        <div class="mb-5 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon">
              Icon Actions
            </p>
            <h3 class="mt-2 text-2xl font-semibold text-text-primary">Buttons with icons</h3>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3.5">
          <UiBtn label="Click Me" append-icon="mdi:emoticon" />
          <UiBtn label="Click Me" prepend-icon="mdi:emoticon" />
          <UiBtn
            label="Click Me"
            append-icon="mdi:emoticon"
            prepend-icon="mdi:emoticon-excited-outline"
          />
        </div>
      </section>

      <section
        class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
      >
        <div class="mb-5">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon">Scale</p>
          <h3 class="mt-2 text-2xl font-semibold text-text-primary">Buttons with sizes</h3>
        </div>
        <div class="flex flex-wrap items-center gap-3.5">
          <UiBtn label="Extra Small Button" append-icon="mdi:emoticon" size="xs" />
          <UiBtn label="Small Button" append-icon="mdi:emoticon" size="sm" />
          <UiBtn label="Medium Button" append-icon="mdi:emoticon" size="md" />
          <UiBtn label="Normal Button" append-icon="mdi:emoticon" />
          <UiBtn label="Large Button" append-icon="mdi:emoticon" size="lg" />
        </div>
      </section>
    </div>
  </DashboardWrapper>
</template>

<style scoped></style>
