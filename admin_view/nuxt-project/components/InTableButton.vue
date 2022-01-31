<template>
  <button
    class="in-table-button"
    @click="on_click"
    :style="InTableButtonOption"
  >
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
  name: "InTableButton",
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
.in-table-button {
  border-radius: var(--button-radius);
  padding: 10px 30px;
  backdrop-filter: blur(4px);
  text-align: center;
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--accent-0);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transition: all 0.4s 0s ease;
  z-index: 0;
  gap: 10px;
  background: linear-gradient(
    135deg,
    var(--button-primary) 0%,
    var(--button-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.in-table-button:hover {
  font-weight: 500;
  background: linear-gradient(
    45deg,
    var(--button-secondary) 0%,
    var(--primary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  box-shadow: 5px 5px 6px #f0f0f0, -5px -5px 3px #fafafa;
}

.in-table-button:active {
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.25);
}
</style>
