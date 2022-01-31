<template>
  <div class="search-container">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "SearchBar",
};
</script>
<style>
.search-container div {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to right,
    var(--button-primary) 0%,
    var(--primary) 100%
  );
  border-radius: 50px;
}

.search-container input {
  width: 100%;
  height: 40px;
  font-size: 14px;
  padding-left: 20px;
  box-shadow: inset 1px 1px 2px #d9d9d9, inset -5px -5px 10px #ffffff;
  border-radius: 50px;
  border: 1px solid var(--accent-2);
  background: var(--accent-0);
  padding: 0px 10px;
  transition: all 0.2s 0s ease;
}

.search-container input:focus {
  border: 1px solid var(--accent-2);
  box-shadow: inset 2px 2px 5px #d9d9d9, inset -5px -5px 10px #ffffff;
  border: none;
  outline: 0;
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
