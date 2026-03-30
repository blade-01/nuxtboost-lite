<script setup lang="ts">
interface Props {
  modelValue: boolean;
  position?: string;
  size?: string;
  persistent?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  position: "right",
  size: "md",
  persistent: false,
});

const emits = defineEmits(["update:modelValue", "close"]);

function handleClose() {
  emits("update:modelValue", false);
  emits("close", true);
}

function handleOuterClick() {
  if (!props.persistent) {
    handleClose();
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    handleOuterClick();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document?.body?.classList?.remove("overflow-hidden");
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      document?.body?.classList?.add("overflow-hidden");
    } else {
      document?.body?.classList?.remove("overflow-hidden");
    }
  },
);
</script>
<template>
  <Teleport to="body">
    <Transition :name="`fade-${position}`">
      <div
        v-if="modelValue"
        class="sheet-wrapper fixed left-0 top-0 z-[1250] h-screen w-full bg-slate-950/45 backdrop-blur-[2px]"
        :class="{
          'flex justify-end': position === 'right',
          'flex justify-start': position === 'left',
          'flex items-end': position === 'bottom',
        }"
        @click.self="handleOuterClick"
      >
        <div
          class="sheet flex h-full bg-bg-primary shadow-[0_30px_90px_rgba(15,23,42,0.18)]"
          :class="{
            'w-full sm:w-1/4': size === 'sm',
            'w-full md:w-1/2': size === 'md',
            'w-full lg:w-3/4': size === 'lg',
            'w-full': size === 'full',
            '!h-1/2 !w-full': position === 'top' || position === 'bottom',
          }"
        >
          <div class="inner relative w-full">
            <slot name="header">
              <div
                class="flex w-full items-center border-b p-5"
                :class="
                  position === 'left'
                    ? 'justify-between'
                    : 'flex-row-reverse justify-end gap-3'
                "
              >
                <slot name="title">
                  <h4 v-if="title" class="font-semibold text-text-primary">
                    {{ title }}
                  </h4>
                </slot>
                <slot name="close">
                  <button
                    class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-primary bg-bg-secondary text-text-secondary transition hover:border-slate-300 hover:text-text-primary"
                    @click="handleClose"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m16.192 6.344l-4.243 4.242l-4.242-4.242l-1.414 1.414L10.535 12l-4.242 4.242l1.414 1.414l4.242-4.242l4.243 4.242l1.414-1.414L13.364 12l4.242-4.242z"
                      />
                    </svg>
                  </button>
                </slot>
              </div>
            </slot>

            <div
              class="sheet-body h-full overflow-y-scroll bg-bg-primary p-5 pb-32"
              :class="{ '!h-auto': position === 'top' }"
            >
              <slot />
            </div>
            <div
              v-if="$slots.footer"
              class="footer fixed bottom-0 left-0 right-0 z-50 flex justify-end gap-3 border-t bg-bg-primary px-4 py-3 sm:absolute sm:bottom-8 xl:bottom-0"
            >
              <slot name="footer"> </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* LEFT MODAL TRANSITIONS */
.fade-left-enter-active,
.fade-left-enter-active .sheet,
.fade-left-leave-active,
.fade-left-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-left-enter-from .sheet,
.fade-left-leave-to .sheet {
  transform: translateX(-100%);
  opacity: 0;
}

/* RIGHT MODAL TRANSITIONS */
.fade-right-enter-active,
.fade-right-enter-active .sheet,
.fade-right-leave-active,
.fade-right-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-right-enter-from .sheet,
.fade-right-leave-to .sheet {
  transform: translateX(100%);
  opacity: 0;
}

/* TOP MODAL TRANSITIONS */
.fade-top-enter-active,
.fade-top-enter-active .sheet,
.fade-top-leave-active,
.fade-top-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-top-enter-from .sheet,
.fade-top-leave-to .sheet {
  transform: translateY(-100%);
  opacity: 0;
}

/* BOTTOM MODAL TRANSITIONS */
.fade-bottom-enter-active,
.fade-bottom-enter-active .sheet,
.fade-bottom-leave-active,
.fade-bottom-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-bottom-enter-from .sheet,
.fade-bottom-leave-to .sheet {
  transform: translateY(100%);
  opacity: 0;
}

/* .sheet-body::-webkit-scrollbar {
  @apply w-4 h-4;
}

.sheet-body::-webkit-scrollbar-thumb {
  @apply bg-[#e8e8e8] rounded-[100vh] border-solid border-4 border-[#bebebe] shadow-md;
}

.sheet-body::-webkit-scrollbar-track {
  @apply bg-[#e3e2e2];
} */
.footer {
  box-shadow: 0px -1px 5px 0px rgb(0 0 0 / 10%);
}
</style>
