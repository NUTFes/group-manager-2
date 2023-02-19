<script setup lang="ts">

</script>

<template>
  <div class="card">
    <span class="red" />
    <slot name="body"></slot>
    <slot name="method"></slot>
  </div>
</template>

<style scoped>

  .card{
    @apply
      flex
      items-center
      relative
      mt-0.5
      w-[1026px]
      h-36
      bg-white
      shadow-[0_4px_10px_1px_rgba(0,0,0,0.25)];
  }

  .red{
    @apply
      absolute
      left-0
      inline-block
      w-4
      h-full
      bg-red-600;
  }
</style>
