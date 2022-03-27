<template>
  <div id="app">
    <h1 class="tytle">購入品申請フォーム</h1>
    <div class="Blank">
      <span>対象食品</span>
      <select v-model="product" id="product">
        <option v-for="(list, i) in new_info.food_products" :key="i">
          {{ list.food_product.name }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>購入場所</span>
      <select v-model="shop" @change="validationShop" id="shop">
        <option
          v-for="list in shopList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>購入品</span>
      <input type="text" v-model="purchase" id="purchase">
    </div>
    <div class="Blank">
      <span>生ものの扱い</span>
      <select v-model="fresh" @change="validationFresh" id="fresh">
        <option
          v-for="list in isFreshList"
          :value="list.value"
          :key="list.value"
        >
          {{ list.label }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>開催日</span>
      <select v-model="fesDate" @change="validationFesDate" id="fesDate">
        <option
          v-for="list in fesDateList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.date }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <a href="/mypage"><button style="margin-left:8%;">←戻る</button></a>
      <button @click="register" style="margin-left:15%;">登録する→</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      resultShop: false,
      resultFresh: false,
      resultFesDate: false,
      new_info: [],
      product: [],
      shop: [],
      purchase: [],
      fresh: [],
      fesDate: [],
      shopList: [],
      fesDateList: [],
      isFreshList: [
        { label: "はい", value: true },
        { label: "いいえ", value: false },
      ],
    };
  },
  methods: {
    validationShop: function() {
      if (this.shop > 0) {
        this.resultShop = true;
      } else {
        this.resultShop = false;
      }
      return this.resultShop
    },
    validationFresh: function() {
      if (this.fresh == true || this.fresh == false) {
        this.resultFresh = true;
      } else {
        this.resultFresh = false;
      }
      return this.resultFresh
    },
    validationFesDate: function() {
      if (this.fesDate > 0) {
        this.resultFesDate = true;
      } else {
        this.resultFesDate = false;
      }
      return this.resultFesDate
    },
    register: function () {
      if (this.product.length > 0 && this.resultShop && this.purchase.length > 0 && this.resultShop && this.resultFesDate) {
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.new_info.group.id);
        params.append("food_product_id", this.product);
        params.append("fes_date_id", this.fesDateId);
        params.append("shop_id", this.shop);
        params.append("items", this.purchase);
        params.append("is_fresh", this.fresh);
        axios
          .post(process.env.VUE_APP_URL + "/purchase_lists", params)
          .then((response) => {
            console.log(response);
            this.$router.push("mypage");
          });
      } else {
        if (this.product.length==0) {
          const productError = document.getElementById("product");
          productError.style.border="2px solid red";
        } else {
          const productError = document.getElementById("product");
          productError.style.border="2px solid black";
        }
        if (this.resultShop==false) {
          const shopError = document.getElementById("shop");
          shopError.style.border="2px solid red";
        } else {
          const shopError = document.getElementById("shop");
          shopError.style.border="2px solid black";
        }
        if (this.purchase.length==0) {
          const purchaseError = document.getElementById("purchase");
          purchaseError.style.border="2px solid red";
        } else {
          const purchaseError = document.getElementById("purchase");
          purchaseError.style.border="2px solid black";
        }
        if (this.resultFresh==false) {
          const freshError = document.getElementById("fresh");
          freshError.style.border="2px solid red";
        } else {
          const freshError = document.getElementById("fresh");
          freshError.style.border="2px solid black";
        }
        if (this.resultFesDate==false) {
          const fesDateError = document.getElementById("fesDate");
          fesDateError.style.border="2px solid red";
        } else {
          const fesDateError = document.getElementById("fesDate");
          fesDateError.style.border="2px solid black";
        }
      }
    },
  },
  mounted() {
    axios
      .get(process.env.VUE_APP_URL + "/api/v1/get_current_fes_dates", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fesDateList = response.data.data;
      });
    axios
      .get(process.env.VUE_APP_URL + "/shops", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.shopList = response.data.data;
      });

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
};
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
