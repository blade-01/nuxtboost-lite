<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
// vueTelInput
defineProps<{
  name: string
  label?: string
  error?: string
  outerClasses?: string
  required?: boolean
  modelValue?: string
  prependIcon?: string
  appendIcon?: string
}>()
const emits = defineEmits<{
  (event: "update:modelValue", value: string | undefined): void
  (event: "update:error", value: boolean): void
}>()

const localError = ref<string | undefined>()

interface CountryCodeResponse {
  countryCallingCode?: string
  nationalNumber?: string
  number?: string
  country: {
    name: string
    iso2: string
    dialCode: string
  }
  countryCode?: string
  valid?: boolean
  formatted: string
}

const handleValidation = (value: string, phoneObject: CountryCodeResponse) => {
  // if (!phoneObject.valid && phoneObject.number) {
  //   emits("update:error", true);
  // } else {
  //   localError.value = undefined;
  //   emits("update:error", false);
  // }
  emits("update:modelValue", phoneObject.number ? phoneObject.number : phoneObject.formatted)
}

const options = ref({
  inputOptions: {
    autocomplete: "off",
    showDialCode: true,
    placeholder: ""
  },
  dropdownOptions: {
    showDialCodeInList: true,
    showFlags: true,
    showSearchBox: true
  }
})
</script>

<template>
  <Field
    v-slot="{ handleChange, value }"
    :name="name"
    as="div"
    class="input-group w-full"
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
      <vue-tel-input
        :id="name"
        :model-value="value"
        v-bind="options"
        :class="{
          error: error || localError
        }"
        @on-input="handleValidation"
        @update:model-value="
          (val: any) => {
            if (val) {
              handleChange(val, val.length > 4)
            }
          }
        "
      ></vue-tel-input>
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
    <span v-if="error || localError" class="error-message">
      {{ error || localError }}
    </span>
  </Field>
</template>

<style scoped>
:deep(.vue-tel-input) {
  @apply app-control-shell !bg-input-primary !px-0 focus-within:!border focus-within:!border-border-primary focus-within:!shadow-none focus-within:!outline-none focus-within:!ring-0 focus:!border-border-primary;
}

:deep(.vti__dropdown-list) {
  @apply z-20 w-[250px] rounded-[4px] border-none !bg-input-primary text-text-primary lg:w-[370px];
}

:deep(.vti__dropdown-item) {
  @apply px-3 py-4;
}

:deep(.vti__dropdown-list) {
  box-shadow:
    0 0 #0000,
    0 0 #0000,
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

:deep(.vti__input) {
  @apply app-control-input app-control-shape m-0 !bg-input-primary focus-within:ring-0 focus:!border-none focus:!outline-none;
}

:deep(.vue-tel-input.error) {
  @apply app-control-shape !border !border-solid !border-red-500;
}

:deep(ul.vti__dropdown-list > .vti__input.vti__search_box) {
  @apply app-control-shape sticky top-1.5 z-10 m-1 mx-auto block !border !border-solid !border-border-primary !bg-input-primary;
}

:deep(.vti__dropdown-item.highlighted) {
  @apply !bg-selected-primary;
}

:deep(.vti__dropdown.open) {
  @apply !bg-transparent hover:!bg-transparent;
}

:deep(.vti__dropdown) {
  @apply !bg-transparent hover:!bg-transparent;
}
</style>
