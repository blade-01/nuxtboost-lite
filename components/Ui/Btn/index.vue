<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
interface Props {
  label?: string;
  prependIcon?: boolean | string | "emoticon-sad";
  appendIcon?: boolean | string | "emoticon-sad";
  prependSize?: string;
  appendSize?: string;
  outerClass?: string;
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  prependSize: "20",
  appendSize: "20",
  // size: "sm", // You can set default size if you want
});

const sizes = computed(() => {
  return props.size === "xs"
    ? "btn-xs"
    : props.size === "sm"
      ? "btn-sm"
      : props.size === "md"
        ? "btn-md"
        : props.size === "lg"
          ? "btn-lg"
          : "btn";
});

const button = ref<HTMLElement | null>(null);

function triggerClick() {
  button.value?.click();
}

defineExpose({
  triggerClick,
});
</script>

<template>
  <button
    v-bind="$attrs"
    :class="[
      {
        'inline-flex items-center gap-2 text-current':
          prependIcon || appendIcon,
        '!pointer-events-none !cursor-not-allowed items-center justify-center !bg-opacity-70':
          isLoading || disabled,
      },
      outerClass,
      sizes,
    ]"
    :disabled="isLoading"
    ref="button"
  >
    <div
      v-if="!isLoading"
      :class="[
        {
          'inline-flex items-center gap-2 text-current':
            prependIcon || appendIcon,
        },
      ]"
    >
      <Icon
        :name="`${prependIcon}`"
        :size="prependSize"
        class="shrink-0 text-current"
        v-if="prependIcon"
      />
      <span v-if="label" class="text-current">{{ label }}</span>
      <slot></slot>
      <Icon
        :name="`${appendIcon}`"
        :size="appendSize"
        class="shrink-0 text-current"
        v-if="appendIcon"
      />
    </div>
    <div v-else>
      <Icon name="bx:loader" class="animate-spin" size="16" />
    </div>
  </button>
</template>

<style lang="scss" scoped></style>
