<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    tone?:
      | "success"
      | "accepted"
      | "active"
      | "confirmed"
      | "danger"
      | "warning"
      | "neutral"
      | "cancelled"
      | "declined"
      | "pending"
      | "draft"
      | "submitted"
      | "in review"
      | "investigating"
      | "resolved"
      | "rejected"
      | string;
    outerClass?: string;
    hideDot?: boolean;
  }>(),
  {
    tone: "neutral",
    outerClass: "",
    hideDot: false,
  },
);

const toneClasses = computed(() => {
  if (
    props.tone === "success" ||
    props.tone === "accepted" ||
    props.tone === "active" ||
    props.tone === "confirmed" ||
    props.tone === "resolved"
  ) {
    return {
      wrapper: "bg-[#EAF8EF] text-[#1EB96B]",
      dot: "bg-[#1EB96B]",
    };
  }

  if (
    props.tone === "danger" ||
    props.tone === "cancelled" ||
    props.tone === "declined" ||
    props.tone === "rejected"
  ) {
    return {
      wrapper: "bg-[#FCEDEC] text-[#EF4444]",
      dot: "bg-[#EF4444]",
    };
  }

  if (
    props.tone === "warning" ||
    props.tone === "pending" ||
    props.tone === "draft" ||
    props.tone === "in review" ||
    props.tone === "investigating"
  ) {
    return {
      wrapper: "bg-[#FFF5E8] text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    };
  }

  return {
    wrapper: "bg-[#F5F5F5] text-text-secondary",
    dot: "bg-text-secondary",
  };
});
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium capitalize"
    :class="[toneClasses.wrapper, outerClass]"
  >
    <span
      class="h-2.5 w-2.5 rounded-full"
      :class="toneClasses.dot"
      v-if="!hideDot"
    />
    {{ label }}
  </span>
</template>
