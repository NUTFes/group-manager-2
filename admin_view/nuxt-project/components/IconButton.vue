<template>
  <button class="icon-button" @click="on_click">
    <nuxt-link v-if="to !== ''" :to="to">
      <span class="material-icons">{{ icon_name }}</span>
    </nuxt-link>
    <span class="material-icons" v-else>{{ icon_name }}</span>
  </button>
</template>
<script>
export default {
  name: "IconButton",
  props: {
    icon_name: {
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
<style>
.icon-button {
  display: flex;
  align-items: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transition: 0.4s;
}
.icon-button:hover {
  background: linear-gradient(
    45deg,
    var(--button-secondary) 0%,
    var(--button-primary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  box-shadow: 1px 1px 8px #292828, -1px -1px 8px #878484;
}

.icon-button:active {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: inset 5px 5px 4px #3d3b3b, inset -5px -5px 4px #737171;
}
</style>
