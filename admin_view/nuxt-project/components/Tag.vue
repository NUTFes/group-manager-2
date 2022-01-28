<template>
  <div class="tag" :style="TagOption">
    <span class="material-icons">{{ iconName }}</span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Tag",
  props: {
    iconName: {
      type: String,
      required: false,
    },
    width: {
      type: String,
      required: false,
      default: "140px",
    },
    primaryColor: {
      type: String,
      required: false,
    },
    secondaryColor: {
      type: String,
      required: false,
    },
  },
  computed: {
    TagOption() {
      return {
        "--tag-width": this.width,
        "--tag-primary": this.primaryColor,
        "--tag-secondary": this.secondaryColor,
      };
    },
  },
};
</script>
<style scoped>
.tag {
  font-size: 12px;
  width: var(--tag-width);
  height: var(--tag-height);
  border-radius: var(--button-radius);
  padding: 10px 10px;
  backdrop-filter: blur(4px);
  text-align: center;
  letter-spacing: 2px;
  color: var(--accent-0);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transition: all 0.2s 0s ease;
  z-index: 0;
  gap: 10px;
}
.tag:before {
  font-size: 10px;
  border-radius: var(--button-radius);
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  left: 0;
  transition: 0.5s;
  background: linear-gradient(
    135deg,
    var(--tag-primary) 0%,
    var(--tag-secondary) 100%
  );
}
</style>
