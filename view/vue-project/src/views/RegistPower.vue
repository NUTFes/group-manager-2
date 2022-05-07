<template>
  <div>
    <div class="regist-title">使用する電力物品の登録</div>
    <div v-for="(n, i) in inputData" :key="i">
      <div class="regist-card">
        <div class="regist-card-content">
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">使用電力物品名</div>
            <input type="text" v-model="inputData[i].item" :id="inputData[i].item_id">
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">最大定格電力</div>
            <input type="number" v-model="inputData[i].power" :id="inputData[i].power_id">
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">メーカー</div>
            <input type="text" v-model="inputData[i].manufacturer" :id="inputData[i].manufacturer_id">
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">型番・モデル</div>
            <input type="text" v-model="inputData[i].model" :id="inputData[i].model_id">
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">商品URL</div>
            <input type="text" placeholder="URL" v-model="inputData[i].url" :id="inputData[i].url_id">
          </div>
        </div>
      </div>
    </div>

    <button class="regist-submit-button" @click="plusAddComponent">追加</button>
    <button class="regist-submit-button" @click="removeAddComponent">削除</button>
    <button class="regist-submit-button" @click="register">登録</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      inputData: [
        {
          item_id: "item_id_0",
          power_id: "power_id_0",
          manufacturer_id: "manufacturer_id_0",
          model_id: "model_id_0",
          url_id: "url_id_0",
          item: "",
          power: 0,
          manufacturer: "",
          model: "",
          url: ""
        },
      ],
      inputDataNum: 1,
      maxPower: 1000,
      minPower: 0,
      new_info: [],
      submitFlag: true,
      count: 1
    };
  },
  methods: {
    plusAddComponent: function() {
      let newInputData = 
        {
          item_id: "item_id_" + this.count,
          power_id: "power_id_" + this.count,
          manufacturer_id: "manufacturer_id_" + this.count,
          model_id: "model_id_" + this.count,
          url_id: "url_id_" + this.count,
          item: "",
          power: 0,
          manufacturer: "",
          model: "",
          url: ""
        };
      this.inputData.push(newInputData)
      this.count += 1; // 要素のid番号になる
    },
    removeAddComponent: function() {
      this.inputData.pop()
    },
    confirmValidation: function() {
      this.submitFlag = true;
      for (let data of this.inputData) {

        // itemが未入力か確認
        if (data.item.length == 0) {
          this.submitFlag = false;
          const itemError = document.getElementById(data.item_id);
          itemError.style.border="2px solid red";
        } else {
          const itemError = document.getElementById(data.item_id);
          itemError.style.border="2px solid black";
        }
        // 電力が正しく入力されているか確認
        if (this.minPower >= Number(data.power) || Number(data.power) > this.maxPower) {
          this.submitFlag = false;
          const powerError = document.getElementById(data.power_id);
          powerError.style.border="2px solid red";
        } else {
          const powerError = document.getElementById(data.power_id);
          powerError.style.border="2px solid black";
        }
        // モデル・型番が未入力か確認
        if (data.model.length == 0) {
          this.submitFlag = false;
          const modelError = document.getElementById(data.model_id);
          modelError.style.border="2px solid red";
        } else {
          const modelError = document.getElementById(data.model_id);
          modelError.style.border="2px solid black";
        }
        // メーカーが未入力か確認
        if (data.manufacturer.length == 0) {
          this.submitFlag = false;
          const manufacturerError = document.getElementById(data.manufacturer_id);
          manufacturerError.style.border="2px solid red";
        } else {
          const manufacturerError = document.getElementById(data.manufacturer_id);
          manufacturerError.style.border="2px solid black";
        }
        // urlが未入力か確認
        if (data.url.length == 0) {
          this.submitFlag = false;
          const urlError = document.getElementById(data.url_id);
          urlError.style.border="2px solid red";
        } else {
          const urlError = document.getElementById(data.url_id);
          urlError.style.border="2px solid black";
        }
      }
    },
    register: function () {
      this.confirmValidation()
      if (this.submitFlag) {
        for (let data of this.inputData) {
          const post_url = process.env.VUE_APP_URL + "/power_orders";
          axios.defaults.headers.common["Content-Type"] = "application/json";
          let params = new URLSearchParams();
          params.append("group_id", this.new_info.group.id);
          params.append("item", data.item);
          params.append("power", data.power);
          params.append("manufacturer", data.manufacturer);
          params.append("model", data.model);
          params.append("item_url", data.url);
          axios.post(post_url, params).then(
            () => {
              this.$router.push("mypage");
            },
            (error) => {
              return error;
            });
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
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid"),
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
  select, input{
    text-align: left;
    padding: 1%;
    height: 50px;
    width: 800px;
    border-radius: 7px;
    font-size: 18px;
    vertical-align: top;
  }
  select,input:required{
    border: 1px solid red;
  }
  select,input:invalid{
    border: 1px solid red;
  }
  select,input:valid{
    border: 1px solid #333333;
  }
</style>