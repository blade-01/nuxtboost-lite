<script setup lang="ts">
defineProps<{
  title: string | undefined;
  message?: string;
  description?: string;
}>();
</script>

<template>
  <div class="relative">
    <NavigationTopbar :title="title" />
    <div class="relative mt-[var(--sidebar-height)] px-4 py-5 md:px-5 md:py-6">
      <div
        v-if="message || description"
        class="mb-6 flex flex-col gap-3 rounded-[26px] border border-border-primary bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.14),_transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_48%,#eef2f7_100%)] px-6 py-6 shadow-sm shadow-slate-200/60"
      >
        <p
          v-if="message"
          class="text-xs font-semibold uppercase tracking-[0.26em] text-text-icon"
        >
          {{ message }}
        </p>
        <p
          v-if="description"
          class="max-w-3xl text-sm leading-6 text-text-secondary md:text-base"
        >
          {{ description }}
        </p>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
