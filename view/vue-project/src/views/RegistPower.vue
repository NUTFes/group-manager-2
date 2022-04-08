<template>
  <div id="app">
    <h1 class="tytle">電力申請フォーム</h1>
    <div class="Blank">
    <span>使用物品名</span>
      <input type="text" v-model="item" id="item">
    </div>
    <div class="Blank">
      <span>最大定格電力</span>
      <input type="text" v-model="power" @change="validationPower" id="power">
    </div>
    <div class="Blank">
      <span>メーカー</span>
      <input type="text" v-model="model"  id="model">
    </div>
    <div class="Blank">
      <span>型番</span>
      <input type="text" v-model="manufacturer" id="manufacturer">
    </div>
    <div class="Blank">
      <span>URL</span>
      <input type="text" placeholder="URL" v-model="url" id="url">
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
      resultPower: false,
      new_info: [],
      item: [],
      power: [],
      model: [],
      manufacturer: [],
      url: [],
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
      if (this.item.length > 0 && this.resultPower > 0 && this.model.length > 0 && this.manufacturer.length > 0 && this.url.length > 0) {
        const post_url = process.env.VUE_APP_URL + "/power_orders";
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.new_info.group.id);
        params.append("item", this.item);
        params.append("power", this.power);
        params.append("manufacturer", this.manufacturer);
        params.append("model", this.model);
        params.append("item_url", this.url);
        axios.post(post_url, params).then(
          (response) => {
            this.$router.push("mypage");
            console.log(response.status);
            this.item = [];
            this.power = [];
            this.manufacturer = [];
            this.model = [];
            this.url = [];
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
        this.new_info = response.data.data[0];
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