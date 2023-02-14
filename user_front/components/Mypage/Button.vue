<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
},
}
</script>

<template>
  <button class="button">
    {{ text }}
  </button>
</template>

<style>
.button {
  text-align: center;
  width: calc(100% / 2.0);
  margin-right: 2%;
  border: solid 1px #ef4df3;
  border-radius: 5px;
  padding: 1.5%;
  color: #ffffff;
  background-color: #ef4df3;
}
</style>
