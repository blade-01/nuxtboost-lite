<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
defineProps<{
  name: string
  prependIcon?: string
  appendIcon?: string
  label?: string
  error?: string
  outerClasses?: string
  required?: boolean
}>()
</script>

<template>
  <div
    class="input-group"
    :class="{
      error: error,
      [outerClasses || '']: outerClasses
    }"
  >
    <label v-if="label" :for="name">
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
      <Field
        :name="name"
        v-bind="$attrs"
        class="input-style"
        :class="{
          '!pl-10': prependIcon
        }"
      />
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
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>
