<template>
  <div style="border-radius:2px; background-color: #ffd1d0;">
      <h2>未登録</h2>
      <ul class="horizontal-list">
      <li v-if="new_info.group == null">
        <router-link to="/regist_rep">
          <button  class="card">代表者の詳細情報</button>
        </router-link>
        <span style="margin-left:1%;">代表者が登録されていません</span>
      </li>
      <li v-if="new_info.sub_rep == null">
        <router-link to="/regist_subrep">
          <button class="card">副代表者の詳細情報</button>
        </router-link>
        <span style="margin-left:1%;">副代表者が登録されていません</span>
      </li>
      <li v-if="new_info.place_order == null">
        <router-link to="/regist_place">
          <button class="card">会場申請</button>
        </router-link>
        <span style="margin-left:1%;">会場申請が登録されていません</span>
      </li>
      <li v-if="new_info.power_orders == null">
        <router-link to="/regist_power">
          <button class="card">電力申請</button>
        </router-link>
        <span style="margin-left:1%;">電力申請が登録されていません</span>
      </li>
      <li v-if="new_info.stage_orders == null">
        <router-link to="/regist_stage">
          <button class="card">ステージ申請</button>
        </router-link>
        <span style="margin-left:1%;">ステージ申請が登録されていません</span>
      </li>
      <li v-if="new_info.stage_common_option == null">
        <router-link to="/regist_stageOption">
          <button class="card">ステージオプション申請</button>
        </router-link>
        <span style="margin-left:1%;">ステージオプション申請が登録されていません</span>
      </li>
      <li v-if="new_info.employees == null">
        <router-link to="/regist_employees">
          <button class="card">従業員情報</button>
        </router-link>
        <span style="margin-left:1%;">従業員申請が登録されていません</span>
      </li>
      <li v-if="new_info.food_products == null">
        <router-link to="/regist_foodProduct">
          <button class="card">食品申請</button>
        </router-link>
        <span style="margin-left:1%;">食品申請が登録されていません</span>
      </li>
      <li v-if="new_info.food_products == null">
      </li>
      <li v-else-if="checkPurchase.purchase_lists.length === 0">
        <router-link to="/regist_purchaseList">
          <button class="card">購入品申請</button>
        </router-link>
        <span style="margin-left:1%;">購入品申請が登録されていません</span>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      new_info: [],
      checkPurchase: [],
    };
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
        this.checkPurchase = response.data.data[0].food_products[0];
      });
  }
};
</script>

<style scoped>
  .horizontal-list {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding: 0;
  }
  li {
    margin: 1%;
    list-style-type: none
  }
  h2 {
     background-color: #f08080;
     color:black;
     padding: 1% 0 1% 3%;
  }
  span{
    color: red;
    font-weight: bold;
  }
  /* .horizontal-list li {
    display: inline-block;
  } */
  p{
    margin: 0;
    padding: 5%;
  }
  .card{
  width: 180px;
  height: auto;
  display: inline-block;
  padding: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,.2);
  background-color: white;
  text-align: center;
  }
  button {
  color: black;
  font-weight: bold;
  position: relative;
  border-radius: 4px;
  line-height: 52px;
  -webkit-transition: none;
  transition: none;
  box-shadow: 0 3px 0 #ebf5fc;
  text-shadow: 0 1px 1px rgba(0, 0, 0, .3);
}
button:hover {
  background: -moz-linear-gradient(#ffb03c, #ff708d);
  background: -webkit-linear-gradient(#ffb03c, #ff708d);
  background: linear-gradient(to right, #ffb03c, #ff708d);
}
button:active {
  top: 3px;
  box-shadow: none;
}
</style>