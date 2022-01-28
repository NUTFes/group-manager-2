<template>
  <div class="main-content">
    <CommingSoon />
  </div>
</template>

<script>
export default {
  data() {
    return {
      stocker_places: [],
    };
  },
  mounted() {
    this.$axios
      .get("/stocker_places", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stocker_places = response.data;
      });
  },
};
</script>
