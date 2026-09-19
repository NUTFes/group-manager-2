<template>
  <div class="sub-sub-header-container" :style="SubSubHeader">
    <div class="drop-down-container">
      <slot name="refinement"></slot>
    </div>
    <div class="search-bar-container">
      <slot name="search"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "SubSubHeader",
  props: {
    height: {
      type: String,
      required: false,
      default: "100px",
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
    pageSubSubTitle: {
      type: String,
      required: false,
    },
   parentPageLink: {
      type: String,
      required: false,
    },
  },
  computed: {
    SubSubHeaderOption() {
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

.sub-sub-header-container {
  width: 100%;
  display: flex;
  align-items: var(--sub-header-align);
  justify-content: var(--sub-header-justify);
  flex-wrap: wrap;
}
.drop-down-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-grow: 1;
  gap: 20px;
}
.search-bar-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
