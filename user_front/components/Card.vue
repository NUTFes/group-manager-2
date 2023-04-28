<template>
  <div class="card-container" :style="CardOption">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Card",
  props: {
    width: {
      type: String,
      required: false,
      default: "200px",
    },
    height: {
      type: String,
      required: false,
      default: "200px",
    },
    align: {
      type: String,
      required: false,
      default: "center",
    },
    padding: {
      type: String,
      required: false,
      default: "40px",
    },
    flexGrow: {
      type: String,
      required: false,
      default: "1",
    },
    flexFlow: {
      type: String,
      required: false,
      default: "column",
    },
    gap: {
      type: String,
      required: false,
      default: "10px",
    },
    border: {
      type: String,
      required: false,
      default: "1px solid #ebebeb",
    },
  },
  computed: {
    CardOption() {
      return {
        "--card-width": this.width,
        "--card-height": this.height,
        "--card-align": this.align,
        "--card-padding": this.padding,
        "--card-flex-grow": this.flexGrow,
        "--card-flex-flow": this.flexFlow,
        "--card-gap": this.gap,
        "--card-border": this.border,
      };
    },
  },
};
</script>
<style scoped>
.card-container {
  min-width: var(--card-width);
  min-height: var(--card-height);
  display: flex;
  align-items: var(--card-align);
  justify-content: flex-start;
  flex-flow: var(--card-flex-flow);
  flex-grow: var(--card-flex-grow);
  background-color: #fff;
  color: var(--accent-7);
  padding: var(--card-padding);
  gap: var(--card-gap);
  border: var(--card-border);
}
</style>
