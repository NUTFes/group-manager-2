<template>
  <div id="app">
    <h1 class="tytle">物品申請フォーム</h1>
    <div class="Blank">
    <span>使用物品名</span>
      <select v-model="item" id="item">
        <option
          v-for="list in item_list"
          :value="list.id"
          :key="list.id">
          {{list.name}}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>個数</span>
      <input type="text" v-model="num" @change="validationNum" id="num">
    </div>
    <div class="Blank">
      <router-link to="/mypage"><button style="margin-left:8%;">←戻る</button></router-link>
      <button @click="register" style="margin-left:15%;">登録する→</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      item_list: [],
      resultNum: false,
      new_info: [],
      item: [],
      num: [],
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
  methods: {
    onNumValidation: function() {
      this.resultNum = true;
    },
    offNumValidation: function() {
      this.resultNum = false;
    },
    register: function () {
      if (this.item > 0 && this.resultNum) {
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.groupId);
        params.append("rental_item_id", this.item_id);
        params.append("num", this.item_num);
        axios
          .post(process.env.VUE_APP_URL + "/rental_orders", params)
          .then((response) => {
            console.log(response);
            this.$router.push("mypage");
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
  mounted() {
    const new_info =
    process.env.VUE_APP_URL + "/api/v1/current_user/current_regist_info";
    axios
      .get(new_info, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response);
        this.new_info = response.data.data;
      });

    const itemurl = process.env.VUE_APP_URL + "/rental_items";
    axios
      .get(itemurl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.item_list = response.data.data;
      });
  },
}
</script>

<style scoped>
  #app{
    margin: 1%;
  }
  span {
    display: inline-block;
    width: 110px;
    padding-right: 10px;
  }
  .tytle{
    text-align:center;
    padding:1%;
  }
  .Blank{
    text-align: center;
    margin:1%;
  }
  select,input{
    text-align: center;
    width: 30%;
    height:40px;
    border-radius: 7px;
    box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF;
    font-size: 25px;
  }
  select,input:required{
    border: 2px solid red;
  }
  select,input:invalid{
    border: 2px solid red;
  }
  select,input:valid{
    border: 2px solid black;
  }
  button{
  color: black;
  font-weight: bold;
  border: solid 2px;
  border-radius: 10px;
  cursor: pointer;
  margin: 1%;
  padding:1%;
  }
  button:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  button:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>