<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
defineProps<{
  name: string;
  options: any[];
  label?: string;
  error?: string;
  outerClasses?: string;
  required?: boolean;
  optionLabel?: string;
  optionValue?: string;
  filter?: boolean;
  disabled?: boolean;
  showClear?: boolean;
  maxSelectedLabels?: number;
  selectionLimit?: number;
  prependIcon?: string;
  appendIcon?: string;
}>();

const { multiSelectStyle } = usePvStyle();
</script>

<template>
  <Field
    :name="name"
    as="div"
    class="input-group w-full"
    :class="{
      error: error,
      [outerClasses || '']: outerClasses,
    }"
    v-slot="{ handleChange, value }"
  >
    <label v-if="label" :for="label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div class="relative">
      <button
        v-if="prependIcon"
        type="button"
        class="icon-button prepend absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <slot name="prependIcon">
          <Icon :name="prependIcon" class="h-5 w-5" />
        </slot>
      </button>
      <PvMultiSelect
        :model-value="value ?? []"
        class="app-field-control app-field-control--multiselect w-full"
        :class="{
          'p-invalid !border !border-red-500': error,
          'app-field-control--with-prepend': prependIcon,
          'app-field-control--with-append': appendIcon,
        }"
        :pt="multiSelectStyle"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :filter="filter"
        :disabled="disabled"
        :show-clear="showClear"
        :max-selected-labels="maxSelectedLabels"
        :selection-limit="selectionLimit"
        v-bind="$attrs"
        @update:modelValue="handleChange"
      ></PvMultiSelect>
      <button
        v-if="appendIcon"
        type="button"
        class="icon-button append absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <slot name="appendIcon">
          <Icon :name="appendIcon" class="h-5 w-5" />
        </slot>
      </button>
    </div>
    <small v-if="error" class="error-message">{{ error }}</small>
  </Field>
</template>

<style scoped></style>
