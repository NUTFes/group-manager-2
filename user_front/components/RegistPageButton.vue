<script lang="ts" setup>
const props = defineProps<{
  text: string;
  disabled?: boolean;
}>();

</script>
<template>
  <div>
    <button :disabled=disabled class="btn" :class="{ none: disabled === true }">
      {{ props.text }}
    </button>
  </div>
</template>

<style scoped>
.btn{
  @apply
    rounded
    bg-indigo-900
    /* radial-gradient(297.44% 674.56% at 61.67% 161.54%, #032030 0%, #216185 100%); */
    tracking-widest
    font-sans
    not-italic
    font-normal
    text-2xl
    text-white
    w-28
    h-9;
}
.none {
  @apply
    opacity-50
    cursor-not-allowed
}
</style>
