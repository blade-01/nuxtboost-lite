<script setup lang="ts">
import UiBtn from "~/components/Ui/Btn/index.vue"
defineEmits(["toggleSidebar"])
const { tooltipStyle } = usePvStyle()
const { toggleSidebar, nav } = inject("collapsible") as {
  nav: Ref<boolean>
  toggleSidebar: () => void
}
const { primaryRole } = useAccessControl()
const sidebarToggler = ref<InstanceType<typeof UiBtn> | null>(null)
useShortcut({
  toggle() {
    sidebarToggler.value?.triggerClick()
  }
})
defineProps<{
  title: string | undefined
}>()
</script>

<template>
  <div
    class="main fixed top-0 z-50 flex h-[var(--sidebar-height)] w-full items-center border-b border-b-border-primary bg-bg-primary shadow-sm transition-all duration-500 ease-out md:w-[calc(100%-var(--sidebar-width-md))] lg:w-[calc(100%-var(--sidebar-width-lg))] 2xl:w-[calc(100%-var(--sidebar-width-2xl))]"
    :class="{
      'md:!w-full': nav
    }"
  >
    <div class="w-full p-4">
      <div class="absolute -left-3.5 top-4 z-50 hidden md:block">
        <UiBtn
          v-tooltip="{
            value: `${nav ? 'collapse [' : 'expand ['}`,
            pt: tooltipStyle
          }"
          ref="sidebarToggler"
          class="!flex !h-9 !w-9 !items-center !justify-center rounded-full border border-border-primary !bg-white !p-2 !text-text-primary shadow-sm shadow-slate-200/60"
          @click="toggleSidebar"
        >
          <Icon
            :name="nav ? 'mdi:chevron-right' : 'mdi:chevron-left'"
            class="!flex"
            size="26"
          ></Icon>
        </UiBtn>
      </div>
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-2 md:hidden">
          <UiBtn
            v-tooltip="{
              value: `${!nav ? 'collapse [' : 'expand ['}`,
              pt: tooltipStyle
            }"
            ref="sidebarToggler"
            class="!h-10 !w-10 !rounded-full !border !border-border-primary !bg-white !p-0 !text-text-primary shadow-sm shadow-slate-200/60"
            @click="toggleSidebar"
          >
            <Icon
              name="mdi:menu"
              class="cursor-pointer text-2xl font-bold text-text-primary"
            ></Icon>
          </UiBtn>
          <p class="text-style text-2xl font-semibold">
            {{ truncateString(title || "", 20) }}
          </p>
        </div>
        <p class="text-style hidden pl-5 text-2xl font-semibold md:flex">
          {{ truncateString(title || "", 20) }}
        </p>
        <div class="flex items-center gap-4">
          <div class="flex cursor-pointer items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border-primary bg-slate-900 text-sm font-semibold text-white"
            >
              NB
            </div>
            <div class="hidden md:flex md:flex-col">
              <p class="text-sm font-semibold text-text-primary">Workspace Admin</p>
              <p class="text-xs text-text-secondary">
                {{ capitalizeFirstLetter(primaryRole) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
