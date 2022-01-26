<template>
  <form method="get" action="#" class="search-container">
    <input type="text" size="25" placeholder="search" />
  </form>
</template>
<script>
export default {
  name: "SearchBar",
};
</script>
<style scoped>
.search-container {
}

.search-container input {
  padding: 5px 20px;
  box-shadow: 2px 2px 3px 2px var(--accent-3) inset;
  border-radius: 50px;
}

input::-webkit-input-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}

input::-moz-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}

input:-ms-input-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}

input:-moz-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}
</style>
