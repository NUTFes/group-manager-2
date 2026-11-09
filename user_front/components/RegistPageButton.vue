<script lang="ts" setup>
const props = defineProps<{
  text: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success";
}>();
</script>
<template>
  <button
    :disabled="disabled"
    :class="{
      none: disabled,
      primary: variant === 'primary' || variant === undefined,
      danger: variant === 'danger',
      secondary: variant === 'secondary',
      success: variant === 'success',
    }"
  >
    {{ props.text }}
  </button>
</template>

<style scoped>
.primary {
  @apply rounded
    bg-indigo-900
    text-lg
    text-white
    w-28
    h-9
    hover:bg-white
    hover:text-indigo-900
    border
    border-indigo-900;

  transition: all 0.1s ease;
}

.secondary {
  @apply rounded
    bg-white
    text-lg
    text-indigo-900
    w-28
    h-9
    hover:bg-indigo-900
    hover:text-white
    border
    border-indigo-900;

  transition: all 0.1s ease;
}

.success {
  @apply text-green-500
    border-green-500
    hover:bg-green-500
    hover:text-white
    rounded
    border
    text-lg
    w-28
    h-9;

  transition: all 0.1s ease;
}

.danger {
  @apply text-red-500
    border-red-500
    hover:bg-red-500
    hover:text-white
    rounded
    border
    text-lg
    w-28
    h-9;

  transition: all 0.1s ease;
}

.none {
  @apply opacity-50
    cursor-not-allowed;
}
</style>
