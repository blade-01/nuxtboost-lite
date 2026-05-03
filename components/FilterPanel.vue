<script lang="ts">
import dayjs from "dayjs";
import UiInputField from "~/components/Ui/Input/Field.vue";
import UiInputDropdown from "~/components/Ui/Input/Dropdown.vue";
import UiInputSwitch from "~/components/Ui/Input/Switch.vue";
import UiInputDatePicker from "~/components/Ui/Input/DatePicker.vue";

export type FilterField = {
  key: string;
  type:
    | "text"
    | "select"
    | "date"
    | "date-range"
    | "switch"
    | "number"
    | "custom";
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: any }> | string[];
  component?: any;
  props?: Record<string, any>;
};
</script>

<script setup lang="ts">
const props = defineProps<{
  modelValue: Record<string, any>;
  fields: FilterField[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, any>];
}>();

const resolveComponent = (field: FilterField) => {
  switch (field.type) {
    case "select":
      return UiInputDropdown;
    case "date":
    case "date-range":
      return UiInputDatePicker;
    case "switch":
      return UiInputSwitch;
    case "number":
    case "text":
    default:
      return UiInputField;
  }
};

const buildFieldProps = (field: FilterField) => {
  const sharedProps = {
    name: field.key,
    label: field.label,
    placeholder: field.placeholder,
    ...(field.props ?? {}),
  };

  switch (field.type) {
    case "select":
      return {
        ...sharedProps,
        options: field.options ?? [],
      };
    case "date-range":
      return {
        ...sharedProps,
        selectionMode: "range" as const,
      };
    case "number":
      return {
        ...sharedProps,
        type: "number",
      };
    default:
      return sharedProps;
  }
};

const update = (key: string, value: unknown) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
};

const resolveFieldValue = (field: FilterField) => {
  const value = props.modelValue[field.key];

  if (field.type === "date-range") {
    if (!value?.from && !value?.to) {
      return null;
    }

    return [
      value?.from ? dayjs(value.from).toDate() : null,
      value?.to ? dayjs(value.to).toDate() : null,
    ];
  }

  return value;
};

const handleFieldUpdate = (field: FilterField, value: unknown) => {
  if (field.type === "date-range") {
    const range = Array.isArray(value) ? value : [];

    update(field.key, {
      from: range[0] ? dayjs(range[0]).format("YYYY-MM-DD") : "",
      to: range[1] ? dayjs(range[1]).format("YYYY-MM-DD") : "",
    });
    return;
  }

  if (field.type === "number") {
    update(field.key, value === "" ? undefined : Number(value));
    return;
  }

  update(field.key, value);
};
</script>

<template>
  <section
    class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
  >
    <div class="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
      <template v-for="field in fields" :key="field.key">
        <div v-if="field.type === 'switch'" class="mt-5 flex items-end pb-2">
          <div
            class="rounded-[14px] border border-border-primary bg-slate-50 px-4 py-3"
          >
            <component
              :is="resolveComponent(field)"
              v-bind="buildFieldProps(field)"
              :model-value="resolveFieldValue(field)"
              outer-classes="mb-0"
              @update:modelValue="handleFieldUpdate(field, $event)"
            />
          </div>
        </div>

        <component
          :is="field.component"
          v-else-if="field.type === 'custom' && field.component"
          v-bind="field.props"
          :model-value="resolveFieldValue(field)"
          @update:modelValue="handleFieldUpdate(field, $event)"
        />

        <component
          :is="resolveComponent(field)"
          v-else
          v-bind="buildFieldProps(field)"
          :model-value="resolveFieldValue(field)"
          outer-classes="mb-0"
          @update:modelValue="handleFieldUpdate(field, $event)"
        />
      </template>
    </div>
  </section>
</template>
