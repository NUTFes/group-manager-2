<template>
  <button class="common-button" @click="on_click" :style="CommonButtonOption">
    <nuxt-link v-if="to !== ''" :to="to">
      <span class="material-icons">{{ iconName }}</span>
      <slot></slot>
    </nuxt-link>
    <span class="material-icons" v-else>{{ iconName }}</span>
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: "CommonButton",
  props: {
    iconName: {
      type: String,
      required: true,
      default: "search",
    },
    on_click: {
      type: Function,
      required: false,
    },
    to: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>
<style scoped>
.common-button {
  border-radius: var(--button-radius);
  padding: 10px 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  text-align: center;
  font-size: 14px;
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
.common-button:before {
  border-radius: var(--button-radius);
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  left: 0;
  transition: 0.5s;
  background: linear-gradient(135deg, #ff7070 0%, #e38ad5 100%);
}
.common-button:after {
  content: "";
  border-radius: var(--button-radius);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;
  left: 0;
  transition: 0.5s;
  background: linear-gradient(
    45deg,
    var(--primary) 0%,
    var(--button-secondary) 100%
  );
}
.common-button:hover:before {
  opacity: 0;
}
.common-button:active {
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.25);
}
</style>
