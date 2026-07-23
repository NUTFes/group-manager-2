<template>
  <span class="placeholder-line">
    {{ text }}
    <CommonButton iconName="edit" :on_click="onEdit">編集</CommonButton>
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    onEdit: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.placeholder-line {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
