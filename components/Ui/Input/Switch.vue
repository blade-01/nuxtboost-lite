<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  label?: string;
  error?: string;
  requiredMark?: boolean;
  outerClasses?: string;
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <Field
    :name="name"
    as="div"
    class="w-full"
    :class="{
      error: error,
      [outerClasses || '']: outerClasses,
    }"
    v-slot="{ handleChange, value }"
  >
    <button
      type="button"
      class="inline-flex items-center gap-3"
      role="switch"
      :aria-checked="Boolean(props.modelValue ?? value)"
      @click="
        () => {
          const nextValue = !Boolean(props.modelValue ?? value);
          handleChange(nextValue);
          emit('update:modelValue', nextValue);
        }
      "
    >
      <span
        class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200"
        :class="
          Boolean(props.modelValue ?? value) ? 'bg-slate-900' : 'bg-slate-300'
        "
      >
        <span
          class="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
          :class="
            Boolean(props.modelValue ?? value)
              ? 'translate-x-5'
              : 'translate-x-0'
          "
        />
      </span>
      <span
        v-if="label"
        class="select-none text-sm text-slate-900"
        :class="{ 'text-red-500': error }"
      >
        {{ label }}
        <span v-if="requiredMark" class="required-mark">*</span>
      </span>
    </button>
    <span v-if="error" class="error-message text-xs text-red-500">{{
      error
    }}</span>
  </Field>
</template>
