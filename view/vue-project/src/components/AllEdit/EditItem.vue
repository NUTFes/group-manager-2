<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeEditItem')">✖</button>
        </div>
        <h1>物品申請</h1>
        <select v-model="item" id="item">
          <option
            v-for="list in item_list.data"
            :key="list.id"
            :value="list.id"
            >{{list.name}}
          </option>
        </select>
        <div class="num">個数</div>
        <input class="quantity" type="number" v-model="num" id="num" @change="validationItem">
        <span style="display:flex;">
          <button id="btn" type="button" @click="reset">リセット</button>
          <button id="btn" type="button" @click="register">✓編集</button>
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
    item: Number,
    num: Number
  },
  data() {
    return {
      item_list: [],
      resultNum: true,
    };
  },
  computed: {
    validationItem(){
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
        const url = process.env.VUE_APP_URL + "/rental_orders" + "/" +
        this.id + "?group_id=" + this.groupId +
        "&rental_item_id=" + this.item +
        "&num=" + this.num;
        axios.put(url).then(
          (response) => {
            console.log(response.status);
            this.$emit("closeEditItem");
            this.$emit("reload");
          },
          (error) => {
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
