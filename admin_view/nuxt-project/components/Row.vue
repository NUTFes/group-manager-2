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
      default: "",
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
  },
  computed: {
    RowOption() {
      return {
        "--row-width": this.width,
        "--row-align": this.align,
        "--row-justify": this.justify,
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
  flex-wrap: wrap;
  gap: 20px;
}
</style>
