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
  width: 394px;
  height: 239px;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
  @apply
  relative
  m-1
  bg-white
}

.red {
  width: 18px;
  height: 239px;
  @apply
  absolute
  left-0
  bg-[#f71e35]
}

</style>
