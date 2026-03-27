<script lang="ts" setup>
const props = defineProps<{
  delay: number
}>()

const countdown = ref(props.delay)

const canClick = computed(() => countdown.value === 0)

const emit = defineEmits<{
  (e: "click"): void
}>()

onMounted(() => {
  setCoundown()
})

function setCoundown() {
  const interval = setInterval(() => {
    countdown.value -= 1
    if (countdown.value === 0) {
      clearInterval(interval)
    }
  }, 1000)
}

const handleClick = () => {
  if (countdown.value === 0) {
    countdown.value = props.delay
    emit("click")
    setCoundown()
  }
}
</script>

<template>
  <a @click.prevent="handleClick">
    <slot />
    <slot name="countdown" v-bind="{ canClick, countdown }"> {{ countdown }}s </slot>
  </a>
</template>
