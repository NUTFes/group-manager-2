<template>
  <div class="row-container" :style="RowOption">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Row",
  props: {
    width: {
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
    wrap: {
      type: String,
      required: false,
      default: "wrap",
    },
  },
  computed: {
    RowOption() {
      return {
        "--row-width": this.width,
        "--row-align": this.align,
        "--row-justify": this.justify,
        "--row-gap": this.gap,
        "--row-wrap": this.wrap,
      };
    },
  },
};
</script>
<style scoped>
.row-container {
  width: var(--row-width);
  display: flex;
  align-items: var(--row-align);
  justify-content: var(--row-justify);
  flex-wrap: var(--row-wrap);
  gap: var(--row-gap);
}
</style>
