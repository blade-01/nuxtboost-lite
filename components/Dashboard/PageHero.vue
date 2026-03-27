<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description: string
  align?: "left" | "between"
}>()
</script>

<template>
  <section
    class="overflow-hidden rounded-[30px] border border-border-primary bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8fafc_48%,#eef2f7_100%)] px-6 py-7 shadow-sm shadow-slate-200/70"
  >
    <div
      class="flex flex-col gap-6"
      :class="align === 'between' ? 'lg:flex-row lg:items-end lg:justify-between' : ''"
    >
      <div class="max-w-3xl">
        <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">
          {{ eyebrow }}
        </p>
        <h2 class="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
          {{ title }}
        </h2>
        <p class="mt-3 text-sm leading-6 text-text-secondary md:text-base">
          {{ description }}
        </p>
      </div>
      <slot />
    </div>
  </section>
</template>
