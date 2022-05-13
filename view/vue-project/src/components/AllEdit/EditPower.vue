<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeEditPower')">✖</button>
        </div>
        <h1>電力編集</h1>
        <div>使用物品名</div>
        <input type="text" v-model="item" id="item">
        <div>最大定格電力[W]</div>
        <input type="text" v-model="power" id="power" @change="validationPower">
        <div>メーカー</div>
        <input type="text" v-model="model" id="model">
        <div>型番</div>
        <input type="text" v-model="manufacturer" id="manufacturer">
        <div>URL</div>
        <input type="text" v-model="url" id="url">
        <span style="display:flex;">
          <button id="btn" type="button" @click="reset">リセット</button>
          <button id="btn" type="button" @click="register">✓登録</button>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  props: {
    groupId: Number,
    id: Number,
    item: String,
    power: Number,
    manufacturer: String,
    model: String,
    url: String
  },
  data() {
    return {
      resultPower: false,
    };
  },
  computed: {
    validationPower(){
      const pattern = /[0-9０-９]/;
      if (pattern.test(this.power)==true && this.power < 10000) {
        this.onPowerValidation();
      } else {
        this.offPowerValidation();
      }
      return this.resultPower
    },
  },
  methods: {
    reset: function() {
      this.item = [],
      this.power = [],
      this.manufacturer = [],
      this.model = [],
      this.url = []
    },
    onPowerValidation: function() {
      this.resultPower = true;
    },
    offPowerValidation: function() {
      this.resultPower = false;
    },
    register: function () {
      if (this.item.length > 0 && this.resultPower > 0 && this.model.length > 0 && this.manufacturer.length > 0 && this.url.length > 0){
        const url = process.env.VUE_APP_URL + "/power_orders" + "/" + this.id + "?group_id=" + this.groupId +
        "&item=" + this.item +
        "&power=" + this.power +
        "&manufacturer=" + this.manufacturer +
        "&model=" + this.model +
        "&item_url=" + this.url;
        axios.put(url).then(
          (response) => {
            console.log(response.status);
            this.$emit("closeEditPower");
          },
          (error) => {
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
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 30%;
    height: 30px;
    display: block;
    margin-right: 10%;
    margin-left: 10%;
    margin-top: 5%;
    margin-bottom: 5%;
}
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
    #btnContainer {
    display: flex;
    justify-content: end;
    width: 100%;
    margin-bottom: -1.5rem;
    z-index: 0;
  }
  input{
    border: 1px solid silver;
    width: 100%;
  }
  select{
    border: 1px solid silver;
    width: 100%;
  }
  .add-modal_box {
    display: flex;
    padding: 10px 10px;
    margin: 0 25%;
    justify-content: center;
    flex-flow: column;
    background-color: #DADADA;
    border-radius: 10px;
    margin: 0 30%;
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
</style>