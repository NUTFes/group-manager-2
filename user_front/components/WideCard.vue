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
    width: 1026px;
    box-shadow: 0px 4px 10px 1px rgb(0 0 0 / 25%);
    @apply
      flex
      items-center
      relative
      mt-0.5
      h-36
      bg-white;
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
