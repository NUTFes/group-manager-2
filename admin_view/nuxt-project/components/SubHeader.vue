<template>
  <div class="sub-header-container" :style="SubHeader">
    <div class="sub-header-title">
      <h2>{{ pageTitle }}</h2>
      <p>{{ pageSubTitle }}</p>
    </div>
    <div class="sub-header-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "SubHeader",
  props: {
    height: {
      type: String,
      required: false,
      default: "300px",
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
    pageTitle: {
      type: String,
      required: false,
      default: "pageTitle",
    },
    pageSubTitle: {
      type: String,
      required: false,
    },
  },
  computed: {
    SubHeaderOption() {
      return {
        "--sub-header-height": this.height,
        "--sub-header-align": this.align,
        "--sub-header-justify": this.justify,
      };
    },
  },
};
</script>
<style scoped>
h2 {
  font-size: 20px;
}

p {
  color: var(--accent-3);
}

.sub-header-container {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: var(--sub-header-align);
  justify-content: var(--sub-header-justify);
  flex-wrap: wrap;
}
.sub-header-title {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-wrap: wrap;
  flex-flow: column;
  gap: 0px;
}
.sub-header-content {
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  flex-grow: 1;
  gap: 20px;
}
</style>
