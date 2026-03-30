<script setup lang="ts">
const nav = ref<boolean>(false);

const toggleSidebar = () => {
  nav.value = !nav.value;
};

const closeSidebar = () => {
  nav.value = false;
};

provide("collapsible", {
  nav,
  toggleSidebar,
  closeSidebar,
});
</script>

<template>
  <!-- This should be the auth if there's auth -->
  <div class="relative overflow-x-clip">
    <NavigationSidebar :nav="nav" />
    <main class="sidebar-wrapper" :class="{ 'mainbar-opened': nav }">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  @apply /* MARGIN */ /* WIDTH */ h-screen w-full overflow-y-auto bg-bg-primary transition-[margin-left,width] duration-500 ease-out md:ml-[var(--sidebar-width-md)] md:w-[calc(100%-var(--sidebar-width-md))] lg:ml-[var(--sidebar-width-lg)] lg:w-[calc(100%-var(--sidebar-width-lg))] 2xl:ml-[var(--sidebar-width-2xl)] 2xl:w-[calc(100%-var(--sidebar-width-2xl))];
}
.mainbar-opened {
  @apply ml-0 w-full;
}
</style>
