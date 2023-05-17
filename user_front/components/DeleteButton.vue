<script lang="ts" setup>

</script>
<template>
  <div>
    <button class="btn">
      {{ $t('Button.delete') }}
    </button>
  </div>
</template>

<style scoped>
.btn{
  background: #FF6262;
  border-radius: 5px;
  @apply
    tracking-widest
    font-sans
    not-italic
    font-normal
    text-2xl
    text-white
    w-28
    h-9;
}
</style>
