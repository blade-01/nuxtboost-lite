<script setup lang="ts"></script>

<template>
  <!-- This should be the dashboard if there's auth -->
  <div
    class="flex h-screen flex-col items-center justify-center gap-5 px-4 text-center"
  >
    <slot />
  </div>
</template>

<style scoped></style>
