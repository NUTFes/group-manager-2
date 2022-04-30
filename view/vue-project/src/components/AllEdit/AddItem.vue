<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <h1>物品申請<button id="btn2" v-on:click="$emit('closeAddItem')">✖</button></h1>
        <div>貸出物品</div>
        <select v-model="item" id="item">
          <option
            v-for="list in item_list.data"
            :key="list.id"
            :value="list.id"
            >{{list.name}}
          </option>
        </select>
        <div>個数</div>
        <input type="text" v-model="num" id="num" @change="validationPower">
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
  },
  data() {
    return {
      new_info: [],
      item: [],
      num: [],
      item_list: [],
      resultNum: false,
    };
  },
  computed: {
    validationPower(){
      const pattern = /[0-9０-９]/;
      if (pattern.test(this.num)==true) {
        this.onNumValidation();
      } else {
        this.offNumValidation();
      }
      return this.resultNum
    },
  },
  mounted() {
    const itemurl = process.env.VUE_APP_URL + "/rental_items";
    axios
      .get(itemurl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.item_list = response.data;
      });
  },
  methods: {
    reset: function() {
      this.item = [],
      this.num = []
    },
    onNumValidation: function() {
      this.resultNum = true;
    },
    offNumValidation: function() {
      this.resultNum = false;
    },
    register: function () {
      if (this.item > 0 && this.resultNum > 0){
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.groupId);
        params.append("rental_item_id", this.item);
        params.append("num", this.num);
        axios
          .post(process.env.VUE_APP_URL + "/rental_orders", params)
          .then((response) => {
            console.log(response);
            this.$emit("closeAddItem");
            this.item = "";
            this.num = "";
          });
      } else {
        if (this.item.length == 0) {
          const itemError = document.getElementById("item");
          itemError.style.border="2px solid red";
        } else {
          const itemError = document.getElementById("item");
          itemError.style.border="2px solid black";
        }
        if (this.resultNum==false) {
          const powerError = document.getElementById("num");
          powerError.style.border="2px solid red";
        } else {
          const powerError = document.getElementById("num");
          powerError.style.border="2px solid black";
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
  #btn2{
    position: relative;
    right: -30%;
  }
  input{
    border: 1px solid silver;
    width: 100%;
  }
  select{
    border: 1px solid silver;
    width: 100%;
  }
  .add-modal_box div {
    justify-content: center;
    flex-flow: column;
    width: 80%;
    margin-top: 3%;
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