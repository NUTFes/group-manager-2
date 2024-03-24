<template>
    <button class="combine-button" @click="on_click" :style="CombineButtonOption" :disabled='disabled'>
      <nuxt-link v-if="to !== ''" :to="to">
        <!-- <span class="material-icons">{{ iconName }}</span> -->
        <!-- <slot></slot> -->
      </nuxt-link>
      <!-- <span class="material-icons" v-else>{{ iconName }}</span> -->
      <slot></slot>
    </button>
</template>
<script>
export default {
  name: "CombineButton",
  props: {
    // iconName: {
    //   type: String,
    //   required: true,
    //   //default: "search",
    // },
    on_click: {
      type: Function,
      required: false,
    },
    to: {
      type: String,
      required: false,
      default: "",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
<style scoped>
.combine-button {
  border-radius: 0px;
  width: 180px;
  height: 35px;
  padding: 5px 5px 5px 5px;
  backdrop-filter: blur(4px);
  text-align: center;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--accent-0);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transition: all 0.2s 0s ease;
  z-index: 0;
  gap: 5px;
}
.combine-button:before {
  border-radius: 0px;
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  left: 0;
  transition: 0.5s;
  opacity: 1;
  background: rgba(40, 40, 40, 1);
  backdrop-filter: blur(4px);
}
.combine-button:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;
  left: 0;
  transition: 0.5s;
  background: linear-gradient(
    45deg,
    var(--primary) 0%,
    var(--button-secondary) 100%
  );
}
.combine-button:hover:before {
  opacity: 0;
}
.combine-button:active {
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
} 
</style>
