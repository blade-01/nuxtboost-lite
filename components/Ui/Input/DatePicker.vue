<script lang="ts" setup>
import { VueDatePicker } from "@vuepic/vue-datepicker";

defineOptions({
  inheritAttrs: false,
});

const instance = getCurrentInstance();

const props = defineProps<{
  name: string;
  label?: string;
  error?: string;
  outerClasses?: string;
  required?: boolean;
  disabled?: boolean;
  prependIcon?: string;
  appendIcon?: string;
  selectionMode?: "single" | "multiple" | "range";
  view?: "date" | "month" | "year";
  dateFormat?: string;
  showTime?: boolean;
  timeOnly?: boolean;
  hourFormat?: "12" | "24";
  modelValue?: unknown;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
}>();

const hasExternalModel = computed(() => {
  if (!instance?.vnode.props) {
    return false;
  }

  return (
    "modelValue" in instance.vnode.props ||
    "onUpdate:modelValue" in instance.vnode.props
  );
});

const forwardedProps = computed(() => ({
  multiDates: props.selectionMode === "multiple",
  range: props.selectionMode === "range",
  monthPicker: props.view === "month",
  yearPicker: props.view === "year",
  enableTimePicker: props.showTime || props.timeOnly,
  timePicker: props.timeOnly,
  is24: props.hourFormat === "24",
  format:
    props.dateFormat === "dd-mm-yy"
      ? "dd-MM-yyyy"
      : props.dateFormat === "mm/yy"
        ? "MM/yyyy"
        : props.dateFormat === "yy"
          ? "yyyy"
          : props.dateFormat,
}));

const datePickerProps = computed(() => ({
  ...forwardedProps.value,
  ...useAttrs(),
}));
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
      <ClientOnly>
        <VueDatePicker
          :model-value="hasExternalModel ? props.modelValue : value"
          @update:modelValue="
            (nextValue: any) => {
              handleChange(nextValue);
              emit('update:modelValue', nextValue);
            }
          "
          v-bind="datePickerProps"
          auto-apply
          :clearable="true"
          :disabled="disabled"
          class="datepicker-field w-full"
          :input-class-name="[
            'datepicker-input',
            error ? 'datepicker-input-error' : '',
            prependIcon ? '!pl-10' : '',
          ]"
          menu-class-name="datepicker-menu"
          calendar-class-name="datepicker-calendar"
          month-year-row-class-name="datepicker-month-row"
          day-class-name="datepicker-day"
        />
        <template #fallback>
          <input
            type="text"
            class="datepicker-input w-full"
            :class="[
              error ? 'datepicker-input-error' : '',
              prependIcon ? '!pl-10' : '',
            ]"
            :disabled="disabled"
            :placeholder="label"
          />
        </template>
      </ClientOnly>
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

<style scoped>
:deep(.dp__theme_light) {
  --dp-background-color: #ffffff;
  --dp-text-color: #0f172a;
  --dp-hover-color: #f1f5f9;
  --dp-hover-text-color: #0f172a;
  --dp-hover-icon-color: #475569;
  --dp-primary-color: #0f172a;
  --dp-primary-disabled-color: #cbd5e1;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #64748b;
  --dp-border-color: #d7dee7;
  --dp-menu-border-color: #d7dee7;
  --dp-border-color-hover: #94a3b8;
  --dp-border-color-focus: #94a3b8;
  --dp-disabled-color: #f8fafc;
  --dp-scroll-bar-background: #eef2f7;
  --dp-scroll-bar-color: #cbd5e1;
  --dp-success-color: #16a34a;
  --dp-danger-color: #dc2626;
}

:deep(.datepicker-input) {
  @apply !min-h-[44px] !rounded-[10px] border border-border-primary bg-white/90 text-text-primary shadow-sm shadow-slate-200/40 transition-all duration-200 ease-in-out  px-4 py-3 text-sm outline-none ring-0 placeholder:text-placeholder-primary relative flex items-center focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70;
}

:deep(.datepicker-input-error) {
  @apply !border-red-500;
}

:deep(.datepicker-menu) {
  @apply overflow-hidden rounded-2xl border border-border-primary shadow-2xl shadow-slate-200/70;
}

:deep(.dp__menu) {
  z-index: 1300 !important;
}

:deep(
  .dp__pointer.dp__input_readonly.dp__input.dp__input_icon_pad.dp__input_reg
) {
  @apply !min-h-[44px] !rounded-[10px];
}
</style>
