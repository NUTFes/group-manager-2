<template>
    <button class="icon-button" @click="on_click"><span class="material-icons">{{icon_name}}</span></button>
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
  },
};
</script>
<style>
  .icon-button {
    border-radius: 50%;
    padding: 2px;
  }
  .icon-button:hover {
    background-color: rgba(255,255,255,0.1)
  }
</style>
