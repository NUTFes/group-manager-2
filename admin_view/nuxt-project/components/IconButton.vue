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
}
.icon-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
