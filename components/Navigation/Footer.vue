<template>
  <footer class="mx-auto w-full max-w-5xl border-t border-border-primary pt-8">
    <div class="flex items-center justify-center gap-3.5">
      <NuxtLink to="/"><Icon name="mdi:home" size="23" class="link" /></NuxtLink>
      <NuxtLink to="/about"
        ><Icon name="mdi:book-open-page-variant-outline" size="23" class="link"
      /></NuxtLink>
      <NuxtLink to="/dashboard"
        ><Icon name="mdi:view-dashboard-outline" size="23" class="link"
      /></NuxtLink>
      <a href="https://github.com/blade-01/nuxtboost-lite" target="_blank"
        ><Icon name="mdi:github" size="23" class="link"
      /></a>
    </div>
    <aside class="mt-5 text-center">
      <p class="text-sm font-light text-text-secondary">
        Built as a reusable Nuxt SaaS and admin starter for teams that want structure, not
        boilerplate.
      </p>
    </aside>
  </footer>
</template>

<style scoped>
.link {
  @apply cursor-pointer transition-colors hover:text-[#344675];
}
</style>
