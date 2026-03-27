<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string
  fields: number
  focus?: boolean
  fieldClass?: string
  error?: string
}>()

const data = ref<string[]>(Array.from({ length: props.fields }, () => ""))
const firstInputEl = ref<HTMLInputElement[]>()
const hasInteracted = ref(false)
const emit = defineEmits(["update:modelValue"])

onMounted(() => {
  if (props.focus) {
    firstInputEl.value?.[0]?.focus()
  }
})

const syncFromModelValue = (value?: string | null) => {
  data.value = Array.from({ length: props.fields }, (_, index) => value?.[index] || "")
}

watch(
  data,
  (newValue) => {
    if (!hasInteracted.value) {
      return
    }

    if (newValue.length === props.fields && !newValue.includes("")) {
      emit("update:modelValue", newValue.join(""))
      return
    }

    emit("update:modelValue", null)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal == null || newVal === "") {
      if (!hasInteracted.value) {
        syncFromModelValue()
      }
      return
    }

    syncFromModelValue(newVal)
  },
  { immediate: true }
)

const handleOtpInput = (e: any) => {
  hasInteracted.value = true

  if (e.data && e.target.nextElementSibling) {
    e.target.nextElementSibling.focus()
  } else if (e.data == null && e.target.previousElementSibling) {
    e.target.previousElementSibling.focus()
  }
}

const handlePaste = (e: any) => {
  hasInteracted.value = true
  const pasteData = e.clipboardData.getData("text")

  for (let i = 0; i < pasteData.length; i++) {
    data.value[i] = pasteData[i]
  }
}
</script>

<template>
  <div class="otp flex w-full gap-2" @input="handleOtpInput">
    <template v-for="field in fields" :key="field">
      <input
        v-model="data[field - 1]"
        ref="firstInputEl"
        type="text"
        maxlength="1"
        class="app-control-shape app-control-surface otp-input h-[44px] w-[44px] border bg-white text-center"
        :class="{
          'border-red-500': error,
          fieldClass
        }"
        @paste="field === 1 && handlePaste($event)"
      />
    </template>
  </div>
</template>
