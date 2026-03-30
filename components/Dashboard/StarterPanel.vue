<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  description?: string;
}>();
</script>

<template>
  <section
    class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
  >
    <div class="mb-5">
      <p
        v-if="eyebrow"
        class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
      >
        {{ eyebrow }}
      </p>
      <h3 class="mt-2 text-2xl font-semibold text-text-primary">
        {{ title }}
      </h3>
      <p v-if="description" class="mt-2 text-sm leading-6 text-text-secondary">
        {{ description }}
      </p>
    </div>
    <slot />
  </section>
</template>
