<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    name: string;
    suggestions: string[];
    label?: string;
    error?: string;
    outerClasses?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    withSuggestions?: boolean;
  }>(),
  {
    suggestions: () => [],
    placeholder: "Add values...",
    withSuggestions: true,
  },
);

const attrs = useAttrs();
const autoCompleteRef = ref<any>(null);
const draftValue = ref("");

const emit = defineEmits<{
  (event: "complete", value: any): void;
}>();

const { multipleInputStyle } = usePvStyle();
const { value, errorMessage, setValue } = useField<string[]>(
  toRef(props, "name"),
  undefined,
  {
    syncVModel: false,
    initialValue: [],
  },
);

const resolvedError = computed(() => props.error || errorMessage.value);
const items = computed(() =>
  Array.isArray(value.value) ? value.value.map((item) => String(item)) : [],
);

const inputPt = computed(() => ({
  ...multipleInputStyle.value,
  root: {
    class: "min-w-[180px] flex-1 border-0 bg-transparent shadow-none",
  },
  input: {
    class:
      "min-h-[32px] w-full border-0 bg-transparent px-0 py-0 text-sm text-text-primary outline-none ring-0 placeholder:text-placeholder-primary",
  },
}));

const clearInputElement = () => {
  nextTick(() => {
    const input = autoCompleteRef.value?.$el?.querySelector("input");

    if (input instanceof HTMLInputElement) {
      input.value = "";
    }
  });
};

const commitItems = (nextItems: string[]) => {
  setValue(nextItems);
  draftValue.value = "";
  clearInputElement();
};

const appendChip = () => {
  const nextValue = draftValue.value.trim();

  if (!nextValue) {
    return;
  }

  if (items.value.includes(nextValue)) {
    commitItems(items.value);
    return;
  }

  commitItems([...items.value, nextValue]);
};

const removeChip = (itemToRemove: string) => {
  commitItems(items.value.filter((item) => item !== itemToRemove));
};

const handleOptionSelect = (event: { value?: unknown }) => {
  const nextValue = String(event?.value ?? "").trim();

  if (!nextValue || items.value.includes(nextValue)) {
    commitItems(items.value);
    return;
  }

  commitItems([...items.value, nextValue]);
};

const handleComplete = (event: any) => {
  emit("complete", event);
};

const updateDraftValue = (nextValue: unknown) => {
  draftValue.value = typeof nextValue === "string" ? nextValue : "";
};
</script>

<template>
  <div
    class="input-group w-full"
    :class="{
      error: resolvedError,
      [outerClasses || '']: outerClasses,
    }"
  >
    <label v-if="label" :for="name">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div
      class="app-field-control flex min-h-[44px] flex-wrap items-center gap-2 px-3 py-2"
    >
      <span
        v-for="item in items"
        :key="item"
        class="inline-flex items-center gap-2 rounded-full border border-border-primary bg-slate-100 px-2.5 py-1 text-sm text-text-primary"
      >
        <span>{{ item }}</span>
        <button
          type="button"
          class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          @click="removeChip(item)"
        >
          <Icon name="mdi:close" size="14" class="shrink-0" />
        </button>
      </span>
      <PvAutoComplete
        ref="autoCompleteRef"
        :model-value="draftValue"
        class="min-w-[180px] flex-1"
        :typeahead="withSuggestions"
        :suggestions="suggestions"
        :placeholder="placeholder"
        :disabled="disabled"
        :pt="inputPt"
        v-bind="attrs"
        @complete="handleComplete"
        @update:modelValue="updateDraftValue"
        @option-select="handleOptionSelect"
        @keydown.enter.prevent="appendChip"
        @keydown.tab.prevent="appendChip"
      />
    </div>
    <small v-if="resolvedError" class="error-message">{{
      resolvedError
    }}</small>
  </div>
</template>
