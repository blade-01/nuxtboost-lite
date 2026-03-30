<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    name: string;
    prependIcon?: string;
    appendIcon?: string;
    label?: string;
    error?: string;
    outerClasses?: string;
    required?: boolean;
    multiple?: boolean;
    placeholder?: string;
  }>(),
  {
    placeholder: "Upload file...",
  },
);
</script>

<template>
  <Field
    :name="name"
    as="div"
    class="input-group"
    :class="{
      error: error,
      [outerClasses || '']: outerClasses,
    }"
    v-slot="{ value, handleChange }"
  >
    <label v-if="label" :for="name">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div class="relative">
      <button
        v-if="prependIcon"
        type="button"
        class="icon-button prepend absolute inset-y-0 left-0 z-10 flex items-center pl-3"
      >
        <slot name="prependIcon">
          <Icon :name="prependIcon" class="h-5 w-5" />
        </slot>
      </button>
      <input
        type="file"
        class="hidden"
        v-bind="$attrs"
        :id="name"
        :model-value="value"
        @update:modelValue="handleChange"
        :multiple="multiple"
      />
      <label :for="name">
        <span
          class="input-style flex gap-2.5 font-light !text-text-primary"
          :class="{
            '!pl-10': prependIcon,
          }"
        >
          <span v-if="value">{{
            !multiple
              ? fileName(value)
              : value.length === 1
                ? fileName(value[0])
                : value.length > 1
                  ? `${value.length} file${value?.length > 1 ? "s" : ""}`
                  : placeholder
          }}</span>
          <span v-else>{{ placeholder }}</span>
        </span>
      </label>
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

    <!-- Upload display -->
    <div class="mt-5" v-if="value">
      <div
        class="relative h-16 w-16 rounded-md"
        :class="{
          'h-fit !w-fit': !isImage(value),
        }"
        v-if="!multiple"
      >
        <img
          v-if="isImage(value)"
          :src="fileToURL(value)"
          :alt="fileName(value)"
          class="h-full w-full object-cover"
        />
        <span class="input-style !text-secondary font-light" v-else>
          {{ fileName(value) }}
        </span>
        <Icon
          name="mdi:close-circle-outline"
          size="24"
          class="text-secondary absolute -right-2.5 -top-2.5 cursor-pointer"
          @click="handleChange(null)"
        />
      </div>
      <div class="mt-5 flex flex-wrap items-center gap-5" v-else>
        <div v-for="file in value" :key="file.name">
          <div
            class="relative h-16 w-16 rounded-md"
            :class="{
              'h-fit !w-fit': !isImage(file),
            }"
          >
            <img
              v-if="isImage(file)"
              :src="fileToURL(file)"
              :alt="fileName(file)"
              class="h-full w-full object-cover"
            />
            <span class="input-style !text-secondary font-light" v-else>
              {{ fileName(file) }}
            </span>
            <Icon
              name="mdi:close-circle-outline"
              size="24"
              class="text-secondary absolute -right-2.5 -top-2.5 cursor-pointer"
              @click="
                handleChange(value.filter((f: any) => f.name !== file.name))
              "
            />
          </div>
        </div>
      </div>
    </div>
    <!-- ./ Upload display -->
  </Field>
</template>
