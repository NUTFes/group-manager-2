<template>
  <div class="column-container" :style="ColumnOption">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Column",
  props: {
    width: {
      type: String,
      required: false,
      default: "100%",
    },
    height: {
      type: String,
      required: false,
      default: "100%",
    },
    align: {
      type: String,
      required: false,
      default: "center",
    },
    justify: {
      type: String,
      required: false,
      default: "center",
    },
    gap: {
      type: String,
      required: false,
      default: "20px",
    },
  },
  computed: {
    ColumnOption() {
      return {
        "--column-width": this.width,
        "--column-height": this.height,
        "--column-align": this.align,
        "--column-justify": this.justify,
        "--column-gap": this.gap,
      };
    },
  },
};
</script>
<style scoped>
.column-container {
  width: var(--column-width);
  height: var(--column-height);
  display: flex;
  flex-flow: column;
  align-items: var(--column-align);
  justify-content: var(--column-justify);
  flex-wrap: wrap;
  gap: var(--column-gap);
}
</style>
