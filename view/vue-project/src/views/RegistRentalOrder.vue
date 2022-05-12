<template>
  <div>
    <div class="regist-title">使用する貸出物品の登録</div>
    <div v-for="(n, i) in inputData" :key="i">
      <div class="regist-card">
        <div class="regist-card-content">
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">貸出物品名</div>
            <select v-model="inputData[i].item" :id="inputData[i].item_id">
              <option
                v-for="list in shopList"
                :key="list.id"
                :value="list.id"
                >
                {{list.name}}
              </option>
            </select>
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">個数</div>
            <input type="number" v-model="inputData[i].num" :id="inputData[i].num_id">
          </div>
          <div style="text-align:right">
            <button v-if="inputData.length >= 2" class="regist-submit-button" @click="removeAddComponent(i)">このフォーム削除</button>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center">
      <button class="regist-submit-button" @click="plusAddComponent">フォームの追加</button>
    </div>
    <div class="regist-button">
      <button class="regist-submit-button" @click="register">登録</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      shopList: [],
      stageList: [],
      rentableList: [],
      inputData: [
        {
          item_id: "item_id_0",
          num_id: "power_id_0",
          item: "",
          num: 0,
        },
      ],
      inputDataNum: 1,
      maxNum: 100,
      minNum: 0,
      submitFlag: true,
      count: 1
    };
  },
  methods: {
    plusAddComponent: function() {
      let newInputData =
        {
          item_id: "item_id_" + this.count,
          num_id: "power_id_" + this.count,
          item: "",
          num: 0
        };
      this.inputData.push(newInputData)
      this.count += 1; // 要素のid番号になる
    },
    removeAddComponent: function(index) {
      this.inputData.splice(index, 1)
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
        if (this.minNum >= Number(data.num) || Number(data.num) > this.maxNum) {
          this.submitFlag = false;
          const powerError = document.getElementById(data.num_id);
          powerError.style.border="2px solid red";
        } else {
          const powerError = document.getElementById(data.num_id);
          powerError.style.border="2px solid black";
        }
      }
    },
    register: function () {
      this.confirmValidation()
      if (this.submitFlag) {
        for (let data of this.inputData) {
          axios.defaults.headers.common["Content-Type"] = "application/json";
          let params = new URLSearchParams();
          params.append("group_id", localStorage.getItem("group_id"));
          params.append("rental_item_id", data.item);
          params.append("num", data.num);
          axios
            .post(process.env.VUE_APP_URL + "/rental_orders", params)
            .then(() => {
              if (this.$store.state.fromMypage == true) {
                this.$router.push("/mypage")
              } else {
                this.$store.commit("acceptRegistPowerOrderPermission");
                this.$store.commit("rejectRegistRentalOrderPermission");
                this.$router.push("/regist_power");
              }
            },
            (error) => {
              return error;
            });
        }
      }
    },
  },
  mounted() {
    // 直リンク対策
    if (this.$store.state.registRentalOrderPermission == false) {
      this.$router.push("/mypage");
    }
    const shopUrl = process.env.VUE_APP_URL + "/api/v1/shop/rental_items";
    axios
      .get(shopUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.shopList = response.data.data;
      });

    const stageUrl = process.env.VUE_APP_URL + "/api/v1/stage/rental_items";
    axios
      .get(stageUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stageList = response.data.data;
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