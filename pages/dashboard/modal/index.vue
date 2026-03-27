<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "role-access",
  roles: ["admin", "member", "staff"]
})
useHead({
  title: "Modals"
})

const modal = ref<boolean>(false)
const leftModal = ref<boolean>(false)
const rightModal = ref<boolean>(false)
const topModal = ref<boolean>(false)
const bottomModal = ref<boolean>(false)
const persistentModal = ref<boolean>(false)

const { tooltipStyle } = usePvStyle()
</script>

<template>
  <DashboardWrapper title="Modals">
    <div class="space-y-6">
      <section
        class="overflow-hidden rounded-[30px] border border-border-primary bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eef2f7_100%)] px-6 py-7 shadow-sm shadow-slate-200/70"
      >
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">
              Overlay Patterns
            </p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
              Modal behaviors framed as a proper interaction lab.
            </h2>
            <p class="mt-3 text-sm leading-6 text-text-secondary">
              Compare center, directional, and persistent modal flows from a single control surface
              without losing the polished dashboard tone.
            </p>
          </div>
          <div
            class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3 text-sm text-text-secondary"
          >
            <p class="text-xs uppercase tracking-[0.22em] text-text-icon">Focus</p>
            <p class="mt-2 font-medium text-text-primary">
              Centered dialogs, directional sheets, and persistent states
            </p>
          </div>
        </div>
      </section>

      <section
        class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
      >
        <div class="mb-5">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon">
            Modal Triggers
          </p>
          <h3 class="mt-2 text-2xl font-semibold text-text-primary">Launch patterns</h3>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <UiBtn label="Open Center Modal" size="sm" @click="modal = !modal" />
          <UiBtn
            label="Open Left Modal"
            size="sm"
            append-icon="mdi:arrow-left"
            @click="leftModal = !leftModal"
          />
          <UiBtn
            label="Open Right Modal"
            size="sm"
            append-icon="mdi:arrow-right"
            @click="rightModal = !rightModal"
          />
          <UiBtn
            label="Open Top Modal"
            size="sm"
            append-icon="mdi:arrow-up"
            @click="topModal = !topModal"
          />
          <UiBtn
            label="Open Bottom Modal"
            size="sm"
            append-icon="mdi:arrow-down"
            @click="bottomModal = !bottomModal"
          />
          <UiBtn
            label="Open Persistent Modal"
            size="sm"
            @click="persistentModal = !persistentModal"
            v-tooltip.bottom="{
              value: 'Modal will not close without clicking close button',
              pt: tooltipStyle
            }"
          />
        </div>
      </section>

      <UiModalCenter v-model="modal" header="Modal" outer-class="max-w-2xl">
        <div class="p-4">Hello there</div>
        <template #footer>
          <div class="flex gap-2.5">
            <UiBtn class="btn-default" size="sm" label="Cancel" @click="modal = !modal" />
            <UiBtn label="Submit" class="btn-primary" size="sm" @click="modal = !modal" />
          </div>
        </template>
      </UiModalCenter>
      <UiModalSide v-model="leftModal" title="Left Modal" position="left">
        <template #footer>
          <UiBtn class="btn-default" size="sm" label="Cancel" @click="leftModal = !leftModal" />
          <UiBtn label="Submit" class="btn-primary" size="sm" @click="leftModal = !leftModal" />
        </template>
      </UiModalSide>
      <UiModalSide v-model="rightModal" title="Right Modal">
        <template #footer>
          <UiBtn class="btn-default" size="sm" label="Cancel" @click="rightModal = !rightModal" />
          <UiBtn label="Submit" class="btn-primary" size="sm" @click="rightModal = !rightModal" />
        </template>
      </UiModalSide>
      <UiModalSide v-model="topModal" title="Top Modal" position="top">
        <template #footer>
          <UiBtn class="btn-default" size="sm" label="Cancel" @click="topModal = !topModal" />
          <UiBtn label="Submit" class="btn-primary" size="sm" @click="topModal = !topModal" />
        </template>
      </UiModalSide>
      <UiModalSide v-model="bottomModal" title="Bottom Modal" position="bottom">
        <template #footer>
          <UiBtn class="btn-default" size="sm" label="Cancel" @click="bottomModal = !bottomModal" />
          <UiBtn label="Submit" class="btn-primary" size="sm" @click="bottomModal = !bottomModal" />
        </template>
      </UiModalSide>
      <UiModalSide v-model="persistentModal" title="Persistent Modal" persistent>
        <template #footer>
          <UiBtn
            class="btn-default"
            size="sm"
            label="Cancel"
            @click="persistentModal = !persistentModal"
          />
          <UiBtn
            label="Submit"
            class="btn-primary"
            size="sm"
            @click="persistentModal = !persistentModal"
          />
        </template>
      </UiModalSide>
    </div>
  </DashboardWrapper>
</template>

<style scoped></style>
