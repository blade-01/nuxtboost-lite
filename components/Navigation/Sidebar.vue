<script setup lang="ts">
const { visibleLinks, toggleDropdown } = useSidebarUtils()
const props = defineProps<{ nav: boolean }>()
const { nav } = toRefs(props)
const { closeSidebar } = inject("collapsible") as {
  closeSidebar: () => void
}

const handleLinkClick = () => {
  if (import.meta.client && window.innerWidth < 768) {
    closeSidebar()
  }
}
</script>

<template>
  <button
    v-if="nav"
    type="button"
    class="fixed inset-0 z-30 bg-black/30 md:hidden"
    aria-label="Close sidebar"
    @click="closeSidebar"
  />
  <div class="sidebar" :class="{ 'active-sidebar': nav }">
    <div class="flex h-full flex-col">
      <div class="sidebar-header">
        <NuxtLink to="/" class="flex items-center gap-5">
          <nuxt-img
            provider="cloudinary"
            src="/nb-dark.svg"
            alt="logo"
            fit="inside"
            height="50"
            width="50"
          />
          <span class="text-style title">NuxtBoost</span>
        </NuxtLink>
      </div>
      <div class="sidebar-content">
        <ul class="flex flex-col gap-y-2">
          <li v-for="(link, index) in visibleLinks" :key="index">
            <span
              v-if="link.type === 'section'"
              class="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              {{ link.name }}
            </span>
            <span v-else-if="link.type === 'link'">
              <RouterLink
                :to="`${link.route}`"
                active-class="sidebar-active"
                class="sidebar-item"
                @click="handleLinkClick"
              >
                <Icon v-if="link.icon" :name="link.icon" width="22" class="shrink-0 text-current" />
                <span class="font-light">{{ link.name }}</span>
              </RouterLink>
            </span>
            <span v-else>
              <span
                class="sidebar-item mb-2 flex items-center justify-between"
                @click="toggleDropdown(link)"
              >
                <span class="flex items-center gap-3">
                  <Icon
                    v-if="link.icon"
                    :name="link.icon"
                    width="22"
                    class="shrink-0 text-current"
                  />
                  <span class="font-light">{{ link.name }}</span>
                </span>
                <Icon
                  name="mdi:chevron-down"
                  width="18"
                  class="text-current"
                  :class="link?.show ? 'sidebar--active-chevron' : 'sidebar--inactive-chevron'"
                ></Icon>
              </span>
              <span
                class="flex flex-col"
                :class="[link?.show ? 'sidebar--active-collapse' : 'sidebar--inactive-collapse']"
              >
                <span v-for="(sub, index) in link.sub" :key="index">
                  <span class="block pb-2 pl-[37px]">
                    <RouterLink
                      :to="`${sub.route}`"
                      active-class="sidebar-active"
                      class="sidebar-item"
                      @click="handleLinkClick"
                    >
                      <Icon
                        v-if="sub.icon"
                        :name="sub.icon"
                        width="20"
                        class="shrink-0 text-current"
                      />
                      <span class="font-light">{{ sub.name }}</span>
                    </RouterLink>
                  </span>
                </span>
              </span>
            </span>
          </li>
        </ul>
      </div>
      <div class="sidebar-footer">
        <NuxtLink to="/" class="sidebar-item sidebar-footer-link" @click="handleLinkClick">
          <Icon name="mdi:logout" width="22" class="shrink-0 text-current" />
          <span class="font-medium">Logout</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  @apply fixed left-0 top-0 z-40 h-screen w-[var(--sidebar-width)] -translate-x-full border-r border-r-border-primary bg-sidebar-primary shadow-sm transition-transform duration-[350ms] ease-out md:w-[var(--sidebar-width-md)] md:translate-x-0 lg:w-[var(--sidebar-width-lg)] 2xl:w-[var(--sidebar-width-2xl)];
}

.sidebar-header {
  @apply sticky top-0 flex h-[var(--sidebar-height)] w-full items-center justify-between border-b border-b-border-primary bg-sidebar-primary p-4 shadow-sm;
}

.sidebar-content {
  @apply min-h-0 flex-1 overflow-y-auto px-4 py-6;
}

.sidebar-footer {
  @apply border-t border-border-primary bg-sidebar-primary p-4;
}

.sidebar-footer-link {
  @apply justify-center bg-slate-100 text-text-primary hover:bg-slate-900 hover:text-white;
}

.active-sidebar {
  @apply translate-x-0 md:-translate-x-full;
}

.sidebar-item {
  @apply flex cursor-pointer items-center gap-3 rounded-xl p-3 text-sm font-medium text-text-secondary transition-all duration-300 ease-in-out hover:bg-link-primary hover:text-text-primary;
}
.sidebar-active {
  @apply bg-slate-900 text-white shadow-sm shadow-slate-300/40;
}

.sidebar--active-chevron {
  @apply rotate-180 transform transition-all duration-300 ease-in;
}

.sidebar--inactive-chevron {
  @apply rotate-0 transform transition-all duration-300 ease-out;
}

.sidebar--active-collapse {
  @apply max-h-[5000px] transition-[max-height] duration-200 ease-in;
}

.sidebar--inactive-collapse {
  @apply max-h-0 overflow-hidden transition-[max-height] duration-300 ease-out;
}
</style>
