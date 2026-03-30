<script setup lang="ts">
const props = defineProps<{
  error: any;
}>();

useHead({
  title: `Error ${props.error.statusCode} - ${props.error.message}`,
});

const handleClearError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="mx-auto flex h-screen max-w-lg flex-col items-center justify-center overflow-hidden bg-bg-primary p-6 text-center"
  >
    <div class="text-style mt-7 flex flex-col items-center gap-5">
      <p class="text-3xl font-bold lg:text-5xl">Oops!</p>
      <p class="text-base md:text-lg">
        We can't seem to find the page you are looking for.
      </p>
      <p class="break-all text-xs italic md:text-sm">({{ error.message }})</p>
    </div>
    <div class="mt-8 flex justify-center">
      <UiBtn append-icon="bx:home-alt" @click="handleClearError">
        Go Home
      </UiBtn>
    </div>
  </div>
</template>
