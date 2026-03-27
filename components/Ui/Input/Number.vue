<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
defineProps<{
  name: string
  label?: string
  error?: string
  outerClasses?: string
  required?: boolean
  currency?: string
  locale?: string
  fractionDigits?: number
  prependIcon?: string
  appendIcon?: string
}>()

const { inputNumberStyle } = usePvStyle()
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
      <PvInputNumber
        :model-value="value"
        class="app-field-control app-field-control--number w-full"
        :class="{
          'p-invalid !border-red-500': error,
          'app-field-control--with-prepend': prependIcon,
          'app-field-control--with-append': appendIcon
        }"
        :currency="currency"
        :locale="locale"
        :minFractionDigits="fractionDigits"
        :useGrouping="true"
        v-bind="$attrs"
        @update:modelValue="handleChange"
        :pt="inputNumberStyle"
      ></PvInputNumber>
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
