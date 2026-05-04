<script lang="ts">
import type { FilterField } from "~/composables/useUrlFilters";
import UiInputDatePicker from "~/components/Ui/Input/DatePicker.vue";
import UiInputDropdown from "~/components/Ui/Input/Dropdown.vue";
import UiInputField from "~/components/Ui/Input/Field.vue";
import UiInputSwitch from "~/components/Ui/Input/Switch.vue";
</script>

<script setup lang="ts">
defineProps<{
  modelValue: Record<string, unknown>;
  fields: FilterField[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, unknown>];
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
    case "custom":
      return field.component;
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
    case "number":
      return {
        ...sharedProps,
        type: "number",
      };
    case "date-range":
      return {
        ...sharedProps,
        selectionMode: "range" as const,
      };
    default:
      return sharedProps;
  }
};

const update = (
  key: string,
  value: unknown,
  modelValue: Record<string, unknown>,
) => {
  emit("update:modelValue", {
    ...modelValue,
    [key]: value,
  });
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
              :model-value="modelValue[field.key]"
              outer-classes="mb-0"
              @update:modelValue="update(field.key, $event, modelValue)"
            />
          </div>
        </div>

        <component
          :is="resolveComponent(field)"
          v-else
          v-bind="buildFieldProps(field)"
          :model-value="modelValue[field.key]"
          outer-classes="mb-0"
          @update:modelValue="update(field.key, $event, modelValue)"
        />
      </template>
    </div>
  </section>
</template>
