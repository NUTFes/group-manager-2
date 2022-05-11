<template>
  <div style="border-radius:2px; background-color: #ffd1d0;">
    <h2>「{{ registInfo.group.name }}」 の未登録情報</h2>
    <div v-if="setting.is_regist_group">
      <ul class="horizontal-list">

        <!-- 副代表 -->
        <div>
          <li v-if="registInfo.sub_rep == null">
            <router-link to="/regist_subrep">
              <button class="card" @click="goRegistSubRep">副代表者の詳細情報</button>
            </router-link>
            <span style="margin-left:1%;">副代表者が登録されていません</span>
          </li>
        </div>

        <!-- 会場申請 -->
        <div>
          <li v-if="registInfo.place_order == null">
            <router-link to="/regist_place">
              <button class="card" @click="goRegistPlace">会場申請</button>
            </router-link>
            <span style="margin-left:1%;">会場申請が登録されていません</span>
          </li>
        </div>

        <!-- 電力申請-->
        <div v-if="setting.add_power_order == true">
          <li v-if="registInfo.power_orders == null">
            <router-link to="/regist_power">
              <button class="card" @click="goRegistPower">電力申請</button>
            </router-link>
            <span style="margin-left:1%;">電力申請が登録されていません</span>
          </li>
        </div>

        <!-- ステージ申請両方ない場合 -->
        <div v-if="registInfo.group.group_category_id == 3">
          <li v-if="registInfo.stage_orders == null">
            <router-link to="/regist_stage_sunny">
              <button class="card" @click="goBothRegistStageSunny">ステージ申請 (晴れ)</button>
            </router-link>
            <span style="margin-left:1%;">ステージ申請(晴れ)が登録されていません</span>
          </li>
          <li v-if="registInfo.stage_orders == null">
            <router-link to="/regist_stage_rainy">
              <button class="card" @click="goBothRegistStageRainy">ステージ申請 (雨)</button>
            </router-link>
            <span style="margin-left:1%;">ステージ申請(雨)が登録されていません</span>
          </li>
        </div>

        <!-- ステージ申請片方ない場合 -->
        <div v-if="registInfo.group.group_category_id == 3">
          <div v-if="registInfo.stage_orders != null">
            <div v-if="registInfo.stage_orders.length == 1">
              <li v-if="registInfo.stage_orders.length == 1 && registInfo.stage_orders[0].stage_order.is_sunny == true">
                <router-link to="/regist_stage_rainy">
                  <button class="card" @click="goOneRegistStageRainy">ステージ申請 (雨)</button>
                </router-link>
                <span style="margin-left:1%;">ステージ申請(雨)が登録されていません</span>
              </li>
              <li v-if="registInfo.stage_orders[0].stage_order.is_sunny == false">
                <router-link to="/regist_stage_sunny">
                  <button class="card" @click="goOneRegistStageSunny">ステージ申請 (晴れ)</button>
                </router-link>
                <span style="margin-left:1%;">ステージ申請(晴れ)が登録されていません</span>
              </li>
            </div>
          </div>
        </div>

        <!-- ステージオプション申請-->
        <div v-if="registInfo.group.group_category_id == 3">
          <li v-if="registInfo.stage_common_option == null">
            <router-link to="/regist_stage_option">
              <button class="card" @click="goRegistStageOption">ステージオプション申請</button>
            </router-link>
            <span style="margin-left:1%;">ステージオプション申請が登録されていません</span>
          </li>
        </div>

        <!-- 物品申請-->
        <div v-if="setting.add_rental_order == true">
          <li v-if="registInfo.rental_orders == null">
            <router-link to="/regist_rental_order">
              <button class="card" @click="goRegistRentalOrder">物品申請</button>
            </router-link>
            <span style="margin-left:1%;">物品申請が登録されていません</span>
          </li>
        </div>

        <div v-if="setting.is_regist_food_product == true">
          <!-- 従業員申請-->
          <div v-if="registInfo.group.group_category_id !== 3 && setting.add_employee == true">
            <li v-if="registInfo.employees == null">
              <router-link to="/regist_employees">
                <button class="card" @click="goRegistEmployee">従業員情報</button>
              </router-link>
              <span style="margin-left:1%;">従業員申請が登録されていません</span>
            </li>
          </div>

          <!-- 食品申請-->
          <div v-if="registInfo.group.group_category_id !== 3 && setting.add_food_product == true">
            <li v-if="registInfo.food_products == null">
              <router-link to="/regist_food_product">
                <button class="card" @click="goRegistFoodProduct">食品申請</button>
              </router-link>
              <span style="margin-left:1%;">食品申請が登録されていません</span>
            </li>
          </div>

          <!-- 購入品申請-->
          <div v-if="registInfo.group.group_category_id !== 3 && setting.add_purchase_list == true">
            <li v-if="registInfo.purchase_lists == null">
              <router-link to="/regist_purchaseList">
                <button class="card" @click="goRegistPurchaseList">購入品申請</button>
              </router-link>
              <span style="margin-left:1%;">購入品申請が登録されていません</span>
            </li>
          </div>
        </div>

      </ul>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    registInfo: Object,
    setting: Object
  },
  methods: {
    goRegistSubRep() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("acceptRegistSubRepPermission");
    },
    goRegistPlace() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("acceptRegistPlaceOrderPermission");
    },
    goRegistPower() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("acceptRegistPowerOrderPermission");
    },
    goBothRegistStageSunny() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("typeStage1");
      this.$store.commit("acceptRegistStageOrderSunnyPermission");
    },
    goBothRegistStageRainy() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("typeStage2");
      this.$store.commit("acceptRegistStageOrderRainyPermission");
    },
    goOneRegistStageSunny() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("typeStage3");
      this.$store.commit("acceptRegistStageOrderSunnyPermission");
    },
    goOneRegistStageRainy() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("typeStage4");
      this.$store.commit("acceptRegistStageOrderRainyPermission");
    },
    goRegistStageOption() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("acceptRegistStageCommonOptionPermission");
    },
    goRegistRentalOrder() {
      localStorage.setItem("group_id", this.registInfo.group.id)
      this.$store.commit("acceptRegistRentalOrderPermission");
    }

    // 食品関係は後で作る
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