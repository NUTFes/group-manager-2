<script lang="ts" setup>
const props = defineProps<{
  text: string;
}>();

</script>
<template>
  <div>
    <button class="btn">
      {{ props.text }}
    </button>
  </div>
</template>

<style scoped>
.btn{
	border-radius: 5px;
  background: radial-gradient(297.44% 674.56% at 61.67% 161.54%, #032030 0%, #216185 100%);
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
