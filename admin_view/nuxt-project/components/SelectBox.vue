<template>
  <div ref="elRoot" class="select-box-content">
    <button
      class="select-box-button"
      @click="$data.showContent = !$data.showContent"
      :style="SearchDropDownOption"
    >
      <slot></slot>
      <span class="material-icons">{{initialValue}}</span>
    </button>
    <transition name="fade">
      <div class="select-box" v-show="$data.showContent">
        <div class="select-box__container" @click.self="closeModal">
          <div class="select-box__box">
            <button
              class="select-box-button"
              v-for="item in nameList"
              :key="item.id"
              @click="on_click(item.id, nameList)"
            >
              {{ item[value] }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SearchDropDown",
  data() {
    return {
      showContent: false,
      dashboard_data: [],
      nameList: [],
      list: [2015, 2016, 2017, 2018, 2019],
    };
  },
  props: {
    on_click: {
      type: Function,
      required: false,
    },
    nameList: {
      type: Array,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    initialValue: {
      type: String,
      required: false,
      default: "",
    },
  },
  mounted() {
    window.addEventListener(
      "click",
      (this._onBlurHandler = (event) => {
        // targetがコンポーネントの中に含まれているものなら何もしない
        if (this.$refs.elRoot.contains(event.target)) {
          return;
        }
        this.$data.showContent = false;
      })
    );
  },
  beforeDestroy() {
    window.removeEventListener("click", this._onBlurHandler);
  },
};
</script>
<style scoped>
.select-box-content {
  width: 160px;
}

.select-box__box {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.select-box-button {
  border-radius: 0px;
  width: 160px;
  height: 35px;
  padding: 5px 5px 5px 15px;
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

.select-box-button:before {
  border-radius: 0px;
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  left: 0;
  transition: 0.5s;
  opacity: 0.8;
  background: rgba(40, 40, 40, 0.9);
  backdrop-filter: blur(4px);
}
.select-box-button:after {
  border-radius: 0px;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;
  opacity: 0;
  left: 0;
  transition: 0.5s;
  background: linear-gradient(
    45deg,
    var(--primary) 0%,
    var(--button-secondary) 100%
  );
}
.select-box-button:hover:after {
  opacity: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
.select-box-button:hover:before {
  opacity: 0;
}
.select-box-button:active:after {
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
}

.select-box {
  width: 160px;
  position: absolute;
  z-index: 11;
}
.select-box__container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
}

.select-box__box {
  z-index: 12;
  margin-top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
