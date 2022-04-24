<template>
  <div id="card">
    <h1 class="tytle">電力編集</h1>
    <div class="Blank">
    <div>使用物品名</div>
      <input type="text" v-model="item">
    </div>
    <div class="Blank">
      <div>最大定格電力</div>
      <input type="text" v-model="power">
    </div>
    <div class="Blank">
      <div>メーカー</div>
      <input type="text" v-model="model">
    </div>
    <div class="Blank">
      <div>型番</div>
      <input type="text" v-model="manufacturer">
    </div>
    <div class="Blank">
      <div>URL</div>
      <input type="text" v-model="url">
    </div>
    <div style="display:flex;">
      <button id="btn" type="button" onclick="document.getElementById('editPower').close()">登録する</button>
      <button id="btn" type="button" onclick="document.getElementById('editPower').close()">閉じる</button>
    </div></div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    regist: String,
    id: Number,
    groupId: Number,
    item: String,
    power: Number,
    manufacturer: String,
    model: String,
    url: String,
  },

  methods: {
    onPowerValidation: function() {
      this.resultPower = true;
    },
    offPowerValidation: function() {
      this.resultPower = false;
    },
    register: function () {
      const post_url = process.env.VUE_APP_URL + "/power_orders";
      axios.defaults.headers.common["Content-Type"] = "application/json";
      let params = new URLSearchParams();
      params.append("group_id", this.regist.group.id);
      params.append("item", this.item);
      params.append("power", this.power);
      params.append("manufacturer", this.manufacturer);
      params.append("model", this.model);
      params.append("item_url", this.url);
      axios.post(post_url, params).then(
        (response) => {
          document.getElementById("editPower").close()
          console.log(response.status);
        },
        (error) => {
          console.log(post_url)
          return error;
        });

    },

  },
};
</script>

<style scoped>
  #card{
    margin-right: 15%;
    margin-left: 15%;
  }
  input {
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
</style>