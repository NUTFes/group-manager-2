<script lang="ts" setup>

</script>

<template>
  <div class="card">
    <slot name="mypageCard"></slot>

  </div>
</template>

<style>
  .card{
    width: 1000px;
    @apply
      flex
      items-center
      relative
      mt-0.5
      h-80
      bg-slate-200
  }
</style>
