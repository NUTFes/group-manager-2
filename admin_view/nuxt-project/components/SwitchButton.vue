<template>
  <button class="switch-button" @click="on_click" :style="SwitchButtonOption">
    <div></div>
  </button>
</template>
<script>
export default {
  data() {
    return {
      background: "#DEDEDE",
      paddingLeft: "2px",
    }
  },
  name: "SwitchButton",
  props: {
    on_click: {
      type: Function,
      required: false,
    },
    to: {
      type: String,
      required: false,
      default: "",
    },
    isOn: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    SwitchButtonOption() {
      if (this.isOn) {
        this.background = "linear-gradient(135deg, var(--button-primary) 0%, var(--button-secondary) 100%)"
        this.paddingLeft = "28px"
      }else{
        this.background = "#DEDEDE"
        this.paddingLeft = "2px"
      }
      return {
        "--switch-background": this.background,
        "--switch-padding": this.paddingLeft,
      };
    },
  }
};
</script>
<style scoped>
.switch-button {
  border-radius: var(--button-radius);
  width: 50px;
  padding: 2px 2px;
  padding-left: var(--switch-padding);
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  text-align: center;
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--accent-0);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: none;
  transition: all 0.2s 0s ease;
  z-index: 0;
  gap: 10px;
}
.switch-button:before {
  border-radius: var(--button-radius);
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3);
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  left: 0;
  transition: 0.5s;
  background: var(--switch-background);
}
.switch-button:after {
  content: "";
  border-radius: var(--button-radius);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;
  left: 0;
  transition: 0.5s;
  background: var(--switch-background);
}
.switch-button:hover:before {
  opacity: 0;
}
.switch-button:active {
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.25);
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.switch-button div {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #fff;
  z-index: 2;
}
</style>
