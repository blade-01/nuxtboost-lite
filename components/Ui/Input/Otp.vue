<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string;
  fields: number;
  focus?: boolean;
  fieldClass?: string;
  error?: string;
}>();

const data = ref<string[]>(Array.from({ length: props.fields }, () => ""));
const firstInputEl = ref<HTMLInputElement[]>();
const hasInteracted = ref(false);
const emit = defineEmits(["update:modelValue"]);

onMounted(() => {
  if (props.focus) {
    firstInputEl.value?.[0]?.focus();
  }
});

const syncFromModelValue = (value?: string | null) => {
  data.value = Array.from(
    { length: props.fields },
    (_, index) => value?.[index] || "",
  );
};

watch(
  data,
  (newValue) => {
    if (!hasInteracted.value) {
      return;
    }

    if (newValue.length === props.fields && !newValue.includes("")) {
      emit("update:modelValue", newValue.join(""));
      return;
    }

    emit("update:modelValue", null);
  },
  { deep: true },
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal == null || newVal === "") {
      if (!hasInteracted.value) {
        syncFromModelValue();
      }
      return;
    }

    syncFromModelValue(newVal);
  },
  { immediate: true },
);

const handleOtpInput = (e: InputEvent) => {
  hasInteracted.value = true;
  const target = e.target as HTMLInputElement | null;

  if (!target) {
    return;
  }

  const sanitizedValue = target.value.replace(/\D/g, "").slice(0, 1);
  const index = Number(target.dataset.index);

  target.value = sanitizedValue;

  if (!Number.isNaN(index)) {
    data.value[index] = sanitizedValue;
  }

  if (sanitizedValue && target.nextElementSibling) {
    const nextInput = target.nextElementSibling as HTMLInputElement;
    nextInput.focus();
  } else if (
    !sanitizedValue &&
    e.data == null &&
    target.previousElementSibling
  ) {
    const previousInput = target.previousElementSibling as HTMLInputElement;
    previousInput.focus();
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement | null;
  const index = Number(target?.dataset.index);

  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }

  const allowedControlKeys = [
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
  ];

  if (allowedControlKeys.includes(e.key)) {
    return;
  }

  if (e.key === "Backspace") {
    if (!target || Number.isNaN(index)) {
      return;
    }

    hasInteracted.value = true;

    if (data.value[index]) {
      data.value[index] = "";
      target.value = "";
      return;
    }

    if (index > 0) {
      const previousInput = firstInputEl.value?.[index - 1];

      data.value[index - 1] = "";
      previousInput?.focus();

      if (previousInput) {
        previousInput.value = "";
      }
    }

    e.preventDefault();
    return;
  }

  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

const handlePaste = (e: ClipboardEvent) => {
  hasInteracted.value = true;
  e.preventDefault();

  const target = e.target as HTMLInputElement | null;
  const startIndex = Number(target?.dataset.index ?? 0);
  const pasteData =
    e.clipboardData
      ?.getData("text")
      .replace(/\D/g, "")
      .slice(0, props.fields) || "";

  if (!pasteData) {
    return;
  }

  for (let i = 0; i < pasteData.length && startIndex + i < props.fields; i++) {
    data.value[startIndex + i] = pasteData[i] || "";
  }

  const lastIndex = Math.min(
    startIndex + pasteData.length - 1,
    props.fields - 1,
  );
  const nextInput = firstInputEl.value?.[lastIndex];

  if (nextInput) {
    nextInput.focus();
  }
};
</script>

<template>
  <div class="otp flex w-full gap-2" @input="handleOtpInput">
    <template v-for="field in fields" :key="field">
      <input
        v-model="data[field - 1]"
        ref="firstInputEl"
        type="text"
        :data-index="field - 1"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="one-time-code"
        maxlength="1"
        class="app-control-shape app-control-surface otp-input h-[44px] w-[44px] border bg-white text-center"
        :class="[error ? 'border-red-500' : '', fieldClass]"
        @keydown="handleKeydown"
        @paste="handlePaste($event)"
      />
    </template>
  </div>
</template>
