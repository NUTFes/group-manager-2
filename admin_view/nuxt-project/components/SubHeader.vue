<template>
  <div class="sub-header-container" :style="SubHeader">
    <div class="sub-header-title">
      <h2>{{ pageTitle }}</h2>
      <button
        @click="
          () => {
            this.$router.go(-1);
          }
        "
      >
        {{ pageSubTitle }}
      </button>
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
    pageTitle: {
      type: String,
      required: false,
      default: "pageTitle",
    },
    pageSubTitle: {
      type: String,
      required: false,
    },
    parentPageLink: {
      type: String,
      required: false,
    },
  },
  computed: {
    SubHeaderOption() {
      return {
        "--sub-header-height": this.height,
      };
    },
  },
};
</script>
<style scoped>
h2 {
  font-size: 20px;
  font-weight: 500;
}

button {
  font-size: 14px;
  color: var(--accent-3);
}

.sub-header-container {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
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
