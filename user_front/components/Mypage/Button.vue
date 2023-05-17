<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <button
    @click="$router.push(link)"
    class="flex items-center text-lg justify-center bg-[#ef4df3] text-white p-4 rounded-md w-4/5 md:w-1/2"
  >
    {{ text }}
  </button>
</template>

