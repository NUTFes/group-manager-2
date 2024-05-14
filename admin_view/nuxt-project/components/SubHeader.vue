<template>
  <div class="sub-header-container" :style="SubHeader">
    <div v-if="pageSubTitle !== ''" class="sub-header-link">
      <button
        @click="
          () => {
            this.$router.go(-1);
          }
        "
      >
        <span class="material-icons">arrow_back</span>
        {{ pageSubTitle }}
      </button>
    </div>
    <div v-else class="" />
    <div class="sub-header-main" :style="SubHeader">
      <div class="sub-header-title">
        <h2>{{ pageTitle }}</h2>
      </div>
      <div class="sub-header-content">
        <slot></slot>
      </div>
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
      default: "",
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
.sub-header-container h2 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;
}

.sub-header-link button {
  padding: 5px;
  letter-spacing: 1px;
  font-size: 12px;
  color: var(--accent-4);
  border-bottom: 1px solid var(--accent-2);
  transition: 0.3s;
}

.sub-header-link button:hover {
  border-radius: 50px;
  background: linear-gradient(
    45deg,
    var(--button-secondary) 0%,
    var(--button-primary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: none;
  letter-spacing: 2px;
  box-shadow: 2px 2px 3px var(--accent-2), -2px -2px 3px #fafafa;
}

.sub-header-link button:active {
  box-shadow: none;
}

.sub-header-container span {
  padding-top: 2px;
  padding-right: 2px;
  vertical-align: middle;
  font-size: 14px;
  font-weight: 700;
}

.sub-header-link {
  height: 20px;
}

.sub-header-container {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-flow: column;
}

.sub-header-main {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.sub-header-title {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  flex-flow: column;
  gap: 10px;
}
.sub-header-content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex-grow: 1;
  gap: 20px;
}
</style>
