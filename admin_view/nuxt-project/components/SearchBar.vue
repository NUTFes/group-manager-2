<template>
  <form method="get" action="#" class="search-container">
    <slot></slot>
  </form>
</template>
<script>
export default {
  name: "SearchBar",
};
</script>
<style>
.search-container {
}

.search-container input {
  padding: 5px 20px;
  box-shadow: 2px 2px 3px 2px var(--accent-3) inset;
  border-radius: 50px;
}

.serarch-container input::-webkit-input-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}

.serarch-container input::-moz-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}

.serarch-container input:-ms-input-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}

.serarch-container input:-moz-placeholder {
  font-family: "Material Icons";
  color: var(--accent-3);
}
</style>
