<script setup lang="ts">
type ActionItem = {
  label: string;
  icon?: string;
  command?: () => void;
};

const props = withDefaults(
  defineProps<{
    items: ActionItem[];
    buttonClass?: string;
    appendTo?: string;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    buttonClass:
      "inline-flex h-10 w-10 items-center justify-center rounded-full text-[#5F5C57] transition hover:bg-[#F5F3F0]",
    appendTo: "body",
    loading: false,
    disabled: false,
  },
);

const { menuStyle } = usePvStyle();
const menuRef = ref();

const menuItems = computed(() =>
  props.items.map((item) => ({
    label: item.label,
    icon: item.icon,
    command: item.command,
  })),
);

const toggle = (event: Event) => {
  if (props.loading || props.disabled) {
    return;
  }

  menuRef.value?.toggle(event);
};
</script>

<template>
  <div class="relative">
    <button
      type="button"
      :class="buttonClass"
      :disabled="loading || disabled"
      @click="toggle"
    >
      <slot name="trigger">
        <Icon
          v-if="loading"
          name="svg-spinners:3-dots-fade"
          size="20"
          class="text-[#5F5C57]"
        />
        <Icon v-else name="solar:menu-dots-outline" size="22" />
      </slot>
    </button>

    <PvMenu
      ref="menuRef"
      :model="menuItems"
      :popup="true"
      :append-to="appendTo"
      :pt="menuStyle"
    />
  </div>
</template>
