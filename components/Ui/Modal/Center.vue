<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  header?: string
  outerClass?: string
  headerClass?: string
  persistent?: boolean
}>()

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void
  (event: "hide"): void
}>()

const close = () => {
  emit("update:modelValue", false)
  emit("hide")
}

const handleOuterClick = () => {
  if (!props.persistent) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    handleOuterClick()
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (!import.meta.client) {
      return
    }

    document.body.classList.toggle("overflow-hidden", value)
  }
)

onMounted(() => {
  window.addEventListener("keydown", handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown)
  document.body.classList.remove("overflow-hidden")
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
        @click.self="handleOuterClick"
      >
        <Transition name="modal-scale" appear>
          <div
            class="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-border-primary bg-white shadow-[0_30px_90px_rgba(15,23,42,0.2)]"
            :class="outerClass"
          >
            <slot name="header">
              <div
                class="flex items-center justify-between border-b border-border-primary px-6 py-5"
                :class="headerClass"
              >
                <h3 v-if="header" class="text-lg font-semibold text-text-primary">
                  {{ header }}
                </h3>
                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-primary bg-bg-secondary text-text-secondary transition hover:border-slate-300 hover:text-text-primary"
                  aria-label="Close modal"
                  @click="close"
                >
                  <Icon name="mdi:close" size="20" />
                </button>
              </div>
            </slot>

            <div class="max-h-[calc(85vh-150px)] overflow-y-auto px-6 py-5">
              <slot />
            </div>

            <div
              v-if="$slots.footer"
              class="flex justify-end gap-3 border-t border-border-primary bg-bg-secondary/80 px-6 py-4"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>
