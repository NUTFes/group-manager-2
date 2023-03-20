<script lang="ts" setup>

</script>

<template>
  <div class="card">
    <span class="red" />
    <slot name="body"></slot>
    <slot name="method"></slot>
  </div>
</template>

<style scoped>
.card {
  @apply
    relative
    m-1
    w-[394px]
    h-[239px]
    shadow-[0_4px_10px_1px_rgba(0,0,0,0.25)]
    bg-white
}

.red {
  @apply
    absolute
    left-0
    w-[18px]
    h-[239px]
    bg-[#f71e35]
}

</style>
