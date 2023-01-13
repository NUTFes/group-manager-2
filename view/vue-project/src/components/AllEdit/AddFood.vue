<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeAddFood')">✖</button>
        </div>
        <h1>販売食品追加</h1>
        <div class="Blank">
          <div>食品名</div>
          <input type="text" v-model="food">
        </div>
        <div class="Blank">
          <div>調理の有無</div>
          <!-- <input type="text" v-model="is_cooking"> -->
          <select v-model="is_cooking" id="is_cooking">
            <option value="有">有</option>
            <option value="無">無</option>
          </select>
        </div>
        <div class="Blank">
          <div>１日目の販売個数</div>
          <input type="text" v-model="first_num">
        </div>
        <div class="Blank">
          <div>２日目の販売個数</div>
          <input type="text" v-model="second_num">
        </div>
        <span style="display:flex;">
          <button id="btn" type="button" @click="reset">リセット</button>
          <button id="btn" type="button" @click="register">✓追加</button>
        </span>
      </div>
    </div>
  </transition>
</template>

<!-- <template>
  <div id="card">
    <h1 class="tytle">販売食品追加</h1>
    <div id="btnContainer">
      <button v-on:click="$emit('closeAddItem')">✖</button>
    </div>
    <div class="Blank">
      <div>食品名</div>
      <input type="text" v-model="food">
    </div>
    <div class="Blank">
      <div>調理の有無</div>
      <input type="text" v-model="is_cooking">
      <select v-model="is_cooking" id="is_cooking">
        <option value="有">有</option>
        <option value="無">無</option>
      </select>
    </div>
    <div class="Blank">
      <div>１日目の販売個数</div>
      <input type="text" v-model="first_num">
    </div>
    <div class="Blank">
      <div>２日目の販売個数</div>
      <input type="text" v-model="second_num">
    </div>
    <span style="display:flex;">
      <button id="btn" type="button" @click="reset">リセット</button>
      <button id="btn" type="button" @click="register">✓追加</button>
    </span>
  </div>
</template> -->

<script>
import axios from "axios";
export default {
  props: {
    groupId: Number,
  },
  data() {
    return {
      new_info: [],
      food: [],
      is_cooking: [],
      first_num: [],
      second_num: [],
      resultFood: false,
    };
  },
  // computed: {
  //   validationFood(){
  //     const pattern = /[0-9０-９]/;
  //     if (pattern.test(this.food)==true && this.food <= 1500) {
  //       this.onFoodValidation();
  //     } else {
  //       this.offFoodValidation();
  //     }
  //     return this.resultFood
  //   },
  // },
  methods: {
    reset: function() {
      this.food = [],
      this.is_cooking = [],
      this.first_num = [],
      this.second_num = []
    },
    // onPowerValidation: function() {
    //   this.resultPower = true;
    // },
    // offPowerValidation: function() {
    //   this.resultPower = false;
    // },
    register: function () {
      if (this.item.length > 0 && this.model.length > 0 && this.manufacturer.length > 0 && this.url.length > 0){
        const post_url = process.env.VUE_APP_URL + "/food_orders";
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.groupId);
        params.append("food", this.food);
        params.append("is_cooking", this.is_cooking);
        params.append("first_num", this.first_num);
        params.append("second_num", this.second_num);
        axios.post(post_url, params).then(
          (response) => {
            console.log(response);
            this.$emit("closeAddFood");
            this.$emit("reload");
          },
          (error) => {
            console.log(post_url)
            return error;
          }
        );
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
    margin-top: 15%;
    margin-bottom: 5%;
    border-radius: 5px;
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
    width: 80%;
    margin: 0% auto;
    border: 1px solid silver;
    border-top : solid 1px #717171;
    border-bottom : solid 1px #e0e0e0;
    border-radius: 5px;
    background-color: white;  
  }
  select{
    width: 80%;
    margin: 0% auto;
    border: 1px solid silver;
    border-top : solid 1px #717171;
    border-bottom : solid 1px #e0e0e0;
    border-radius: 5px;
    background-color: white;  
  }
  h1 {
    margin: 5%;
  }
  .item {
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
  }
  .num {    
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
  }
  .quantity {
    width: 25%;
    margin-left: 10%;
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

<!-- <style scoped>
  #card{
    margin-right: 15%;
    margin-left: 15%;
  }
  input {
    border: 2px solid black;
  }
  select {
    border: 2px solid black;
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
    margin: 3% auto 3% auto;
  }
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style> -->