<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal__container">
        <div class="add-modal__box">
          <div class="add-modal_content">
            <div id="card">
              <h1>電力追加</h1>
              <div class="Blank">
              <div>使用物品名</div>
                <input type="text" v-model="item" id="item">
              </div>
              <div class="Blank">
                <div>最大定格電力[W]</div>
                <input type="text" v-model="power" id="power" @change="validationPower">
              </div>
              <div class="Blank">
                <div>メーカー</div>
                <input type="text" v-model="model" id="model">
              </div>
              <div class="Blank">
                <div>型番</div>
                <input type="text" v-model="manufacturer" id="manufacturer">
              </div>
              <div class="Blank">
                <div>URL</div>
                <input type="text" v-model="url" id="url">
              </div>
            </div>
          </div>
          <div style="display:flex;">
            <button id="btn" type="button" v-on:click="$emit('closeAddPower')">リセット</button>
            <button id="btn" type="button" @click="register">✓登録</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  props: {
    groupId: Number,
  },
  data() {
    return {
      new_info: [],
      item: [],
      power: [],
      model: [],
      manufacturer: [],
      url: [],
      resultPower: false,
    };
  },
  computed: {
    validationPower(){
      const pattern = /[0-9０-９]/;
      if (pattern.test(this.power)==true) {
        this.onPowerValidation();
      } else {
        this.offPowerValidation();
      }
      return this.resultPower
    },
  },
  methods: {
    onPowerValidation: function() {
      this.resultPower = true;
    },
    offPowerValidation: function() {
      this.resultPower = false;
    },
    register: function () {
      if (this.item.length > 0 && this.resultPower > 0 && this.model.length > 0 && this.manufacturer.length > 0 && this.url.length > 0){
        const post_url = process.env.VUE_APP_URL + "/power_orders";
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.groupId);
        params.append("item", this.item);
        params.append("power", this.power);
        params.append("manufacturer", this.manufacturer);
        params.append("model", this.model);
        params.append("item_url", this.url);
        axios.post(post_url, params).then(
          (response) => {
            console.log(response);
            this.$emit("closeAddPower");
          },
          (error) => {
            console.log(post_url)
            return error;
          });
      } else {
        if (this.item.length == 0) {
          const itemError = document.getElementById("item");
          itemError.style.border="2px solid red";
        } else {
          const itemError = document.getElementById("item");
          itemError.style.border="2px solid black";
        }
        if (this.resultPower==false) {
          const powerError = document.getElementById("power");
          powerError.style.border="2px solid red";
        } else {
          const powerError = document.getElementById("power");
          powerError.style.border="2px solid black";
        }
        if (this.model.length == 0) {
          const modelError = document.getElementById("model");
          modelError.style.border="2px solid red";
        } else {
          const modelError = document.getElementById("model");
          modelError.style.border="2px solid black";
        }
        if (this.manufacturer.length == 0) {
          const manufacturerError = document.getElementById("manufacturer");
          manufacturerError.style.border="2px solid red";
        } else {
          const manufacturerError = document.getElementById("manufacturer");
          manufacturerError.style.border="2px solid black";
        }
        if (this.url.length == 0) {
          const urlError = document.getElementById("url");
          urlError.style.border="2px solid red";
        } else {
          const urlError = document.getElementById("url");
          urlError.style.border="2px solid black";
        }
      }
    },
  },
};
</script>

<style scoped>
  #card{
    margin-right: 15%;
    margin-left: 15%;
  }
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 80px;
    height: 30px;
    display: block;
    margin: 3%;
  }
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
  input{
    border: 1px solid silver;
    width: 100%;
  }
  .add-modal_content div {
    display: flex;
    align-items: start;
    justify-content: center;
    flex-flow: column;
    gap: 10px;
    width: 100%;
  }
  .add-modal {
    top: 0;
    left: 0;
    position: fixed;
    padding: 100px;
    height: 100%;
    width: 100%;
    z-index: 11;
    background-color: rgba(51, 51, 51, 0.3);
    overflow: auto;
  }
  .add-modal__container {
    width: 100%;
    min-height: 100%;
    margin: 3% 0 ;
    justify-content: center;
    align-items: center;
  }
  .add-modal__box {
    z-index: 15;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    padding: 10px 10px;
    margin: 0 25%;
    color: black;
    background: radial-gradient(
      ellipse at top left,
      rgba(251, 251, 251, 0.9),
      rgba(251, 251, 251, 0.8)
    );
    backdrop-filter: blur(4px);
    gap: 30px;
    border-radius: 10px;
  }
</style>