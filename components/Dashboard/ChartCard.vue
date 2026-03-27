<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section
    class="chart-card rounded-[26px] border border-border-primary bg-white/95 p-5 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
  >
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.26em] text-text-icon">
          {{ title }}
        </p>
        <p class="mt-2 text-sm leading-6 text-text-secondary">
          {{ subtitle }}
        </p>
      </div>
      <span
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
      >
        <Icon name="mdi:chart-box-outline" size="20" />
      </span>
    </div>
    <div class="chart-slot min-h-[280px]">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.chart-card {
  animation: chart-card-in 0.45s ease both;
}

@keyframes chart-card-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
