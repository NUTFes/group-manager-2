<template>
  <div class="card-container" :style="CardWidth">
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
  },
  computed: {
    CardWidth() {
      return {
        "--card-width": this.width,
      };
    },
  },
};
</script>
<style scoped>
.card-container {
  min-width: var(--card-width);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  background-color: #fff;
  color: var(--accent-7);
  padding: 20px 40px;
}
</style>
