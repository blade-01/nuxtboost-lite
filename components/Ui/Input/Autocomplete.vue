<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    name: string
    suggestions: any[]
    label?: string
    error?: string
    outerClasses?: string
    required?: boolean
    optionLabel?: string
    optionValue?: string
    placeholder?: string
    disabled?: boolean
    dropdown?: boolean
    forceSelection?: boolean
    prependIcon?: string
    appendIcon?: string
  }>(),
  {
    suggestions: () => [],
    placeholder: "Start typing...",
    dropdown: false,
    forceSelection: false
  }
)

const emit = defineEmits<{
  (event: "complete", value: any): void
}>()

const { autocompleteStyle } = usePvStyle()

const handleComplete = (event: any) => {
  emit("complete", event)
}
</script>

<template>
  <Field
    :name="name"
    as="div"
    class="input-group w-full"
    :class="{
      error: error,
      [outerClasses || '']: outerClasses
    }"
    v-slot="{ handleChange, value }"
  >
    <label v-if="label" :for="name">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div class="relative">
      <button
        v-if="prependIcon"
        type="button"
        class="absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-text-icon"
      >
        <slot name="prependIcon">
          <Icon :name="prependIcon" class="h-5 w-5" />
        </slot>
      </button>
      <PvAutoComplete
        :model-value="value"
        class="app-field-control app-field-control--autocomplete w-full"
        :class="{
          'app-field-control--with-prepend': prependIcon,
          'app-field-control--with-append': appendIcon
        }"
        :suggestions="suggestions"
        :option-label="optionLabel"
        :option-value="optionValue"
        :dropdown="dropdown"
        :force-selection="forceSelection"
        :disabled="disabled"
        :placeholder="placeholder"
        :pt="autocompleteStyle"
        v-bind="$attrs"
        @complete="handleComplete"
        @update:modelValue="handleChange"
      />
      <button
        v-if="appendIcon"
        type="button"
        class="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-text-icon"
      >
        <slot name="appendIcon">
          <Icon :name="appendIcon" class="h-5 w-5" />
        </slot>
      </button>
    </div>
    <small v-if="error" class="error-message">{{ error }}</small>
  </Field>
</template>
