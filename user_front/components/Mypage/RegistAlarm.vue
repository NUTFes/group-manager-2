<script lang="ts" setup>
import {RegistInfo, Setting} from '@/types'
import{ Employee, FoodProducts, Group, PlaceOrders, PowerOrders, PurchaseLists, RentalOrders, StageOrders, StateRegistAlarm ,StageCommonOption, SubRep} from '@/types/Mypage/registAlarm'
const config = useRuntimeConfig();

const state = reactive(
  {
    employees: [] as Employee[],
    foodProducts: [] as FoodProducts[],
    group: {} as Group,
    groupCategory: "",
    groupId: 0,
    groupCategoryId: 0,
    groupName: "",
    placeOrders: [] as PlaceOrders[],
    powerOrders: [] as PowerOrders[],
    purchaseLists: [] as PurchaseLists[],
    rentalOrders: [] as RentalOrders[],
    stageCommonOption: {} as StageCommonOption,
    stageOrders: [] as StageOrders,
    subRep: {} as SubRep,
    isRegistGroup: false,
    isEditGroup: false,
    addEmployee: false,
    addFoodProduct: false,
    addPurchaseList: false,
    addPowerOrder: false,
    addRentalOrder: false,
  }
);

onMounted(async()=>{
  const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  state.isRegistGroup = setting.data[0].is_regist_group
  state.isEditGroup = setting.data[0].is_edit_group
  state.addEmployee = setting.data[0].add_employee
  state.addFoodProduct = setting.data[0].add_food_product
  state.addPurchaseList = setting.data[0].add_purchase_list
  state.addPowerOrder = setting.data[0].add_power_order
  state.addRentalOrder = setting.data[0].add_rental_order

  const regist_info = await $fetch<RegistInfo>(config.APIURL + "/api/v1/current_user/current_regist_info",
  {
    headers:{
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token") || "",
      "client": localStorage.getItem("client") || "",
      "uid": localStorage.getItem("uid") || ""
    }
  })
  state.employees = regist_info.data[0].employees
  state.foodProducts = regist_info.data[0].food_products
  state.group = regist_info.data[0].group
  state.placeOrders = regist_info.data[0].place_order
  if (regist_info.data[0].food_products === null) {
    state.purchaseLists[0] = null as any
  }else{
    state.purchaseLists = regist_info.data[0].food_products[0].purchase_lists
  }
  state.powerOrders = regist_info.data[0].power_orders
  state.rentalOrders = regist_info.data[0].rental_orders
  state.stageCommonOption = regist_info.data[0].stage_common_option
  state.stageOrders = regist_info.data[0].stage_orders[0]
  state.subRep = regist_info.data[0].sub_rep
  state.groupCategoryId = regist_info.data[0].group.group_category_id
  state.groupId = regist_info.data[0].group.id
  state.groupName = regist_info.data[0].group.name

  console.log(state.stageOrders)
  localStorage.setItem("group_id", state.groupId.toString())
  localStorage.setItem("group_category_id", state.groupCategoryId.toString())
})
</script>

<template>
  <div style="border-radius:2px; background-color: #ffd1d0;">
    <div v-if="state.isRegistGroup">
      <ul class="horizontal-list">
        <!-- 副代表 -->
        <div>
          <li v-if="state.subRep == null">
            <router-link to="/regist_subrep">
              <button class="card" @click="">副代表の登録</button>
            </router-link>
            <span style="margin-left:1%;">「 {{ state.group.name }} 」の副代表者が登録されていません</span>
          </li>
        </div>

        <!-- 会場申請 -->
        <div>
          <li v-if="state.groupId !== 3">
            <li v-if="state.placeOrders == null">
              <router-link to="/regist_place">
                <button class="card" @click="">会場の申請</button>
              </router-link>
              <span style="margin-left:1%;">「 {{ state.group.name }} 」の会場の申請が登録されていません</span>
            </li>
          </li>
        </div>

        <!-- 電力申請 -->
        <div v-if="state.addPowerOrder == true">
          <li v-if="state.powerOrders == null">
            <router-link to="/regist_power">
              <button class="card" @click="">電力物品申請</button>
            </router-link>
              <span style="margin-left:1%;">「 {{ state.group.name }} 」の電力の申請が登録されていません</span>
          </li>
        </div>

        <!-- ステージ申請両方ない場合 -->
        <div v-if="state.groupCategoryId == 3">
          <li v-if="state.stageOrders == null">
            <router-link to="/regist_stage_sunny">
              <button class="card" @click="">ステージの申請(晴れ)</button>
            </router-link>
            <span style="margin-left:1%;">「 {{ state.group.name }} 」の晴れの場合のステージの申請が登録されていません</span>
          </li>
          <li v-if="state.stageOrders == null">
            <router-link to="/regist_stage_rainy">
              <button class="card" @click="">ステージの申請(雨)</button>
            </router-link>
            <span style="margin-left:1%;">「 {{ state.group.name }} 」の雨の場合のステージの申請が登録されていません</span>
          </li>
        </div>

        <!-- ステージ申請片方ない場合 -->
        <div v-if="state.groupCategoryId==3">
          <div v-if="state.stageOrders != null">
            <div v-if="state.stageOrders.length == 1">
              <li v-if="state.stageOrders.length==1 && state.stageOrders[0].stage_order.is_sunny == true">
                <router-link to="/regist_stage_rainy">
                  <button class="card" @click="">ステージの申請(雨)</button>
                </router-link>
                <span style="margin-left:1%;">「 {{ state.group.name }} 」の雨の場合のステージの申請が登録されていません</span>
              </li>
              <li v-if="state.stageOrders[0].stage_order.is_sunny ==false">
                <router-link to="/regist_stage_sunny">
                  <button class="card" @click="">ステージの申請(晴れ)</button>
                </router-link>
                <span style="margin-left:1%;">「 {{ state.group.name }} 」の晴れの場合のステージの申請が登録されていません</span>
              </li>
            </div>
          </div>
        </div>

        <!-- ステージオプション申請 -->
        <div v-if="state.groupCategoryId==3">
          <li v-if="state.stageCommonOption == null">
            <router-link to="/regist_stage_option">
              <button class="card" @click="">ステージオプションの申請</button>
            </router-link>
            <span style="margin-left:1%;">「 {{ state.group.name }} 」のステージオプションの申請が登録されていません</span>
          </li>
        </div>

        <!-- 物品申請 -->
        <div v-if="state.addRentalOrder == true">
          <li v-if="state.rentalOrders == null">
            <router-link to="/regist_rental_order">
              <button class="card" @click="">物品の申請</button>
            </router-link>
            <span style="margin-left:1%;">「 {{ state.group.name }} 」の物品の申請が登録されていません</span>
          </li>
        </div>

        <!-- 食品購入 -->
        <div v-if="state.groupCategoryId !== 3 && state.addFoodProduct == true">
          <li v-if="state.foodProducts == null">
            <router-link to="/regist_food_product">
              <button class="card" @click="">食品の申請</button>
            </router-link>
            <span style="margin-left:1%;">「 {{ state.group.name }} 」の食品の申請が登録されていません</span>
          </li>
        </div>

        <!-- 購入品申請 -->
        <div v-if="state.groupCategoryId !== 3 && state.addPurchaseList == true">
          <li v-if="state.purchaseLists == null">
            <router-link to="/regist_product">
              <button class="card" @click="">購入品の申請</button>
            </router-link>
            <span style="margin-left:1%;">「 {{ state.group.name }} 」の購入品の申請が登録されていません</span>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.horizontal-list {
  overflow-x: auto;
  white-space: nowrap;
  width: 1000px;
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
