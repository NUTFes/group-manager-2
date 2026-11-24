<template>
  <span class="placeholder-line">
    {{ text }}
    <CommonButton v-if="editable" iconName="edit" :on_click="onEdit"
      >編集</CommonButton
    >
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
    // 書き込み権限が無いとき（staff）は編集ボタンを出さない
    editable: {
      type: Boolean,
      default: true,
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
