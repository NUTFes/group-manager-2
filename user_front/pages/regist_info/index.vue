<script lang="ts" setup>
import { is } from "@vee-validate/rules";
import axios from "axios";
import { Group } from "~~/types";

interface RegistInfo {
  sub_rep: SubRep[];
  place_orders: RegistPlace[];
  power_orders: PowerOrder[];
  rental_orders: RentalOrder[];
  group: Group;
}

interface Stage {
  stage_first: string;
  stage_second: string;
  date: string;
  use_time_interval: string;
  prepare_time_interval: string;
  cleanup_time_interval: string;
  stage_order: {
    id: number;
    is_sunny: boolean;
    fes_date_id: number;
    stage_first: number;
    stage_second: number;
  };
}

interface StageOrder {
  stage_order: Stage;
}

interface StageOption {
  id: number;
  own_equipment: boolean;
  bgm: boolean;
  camera_permission: boolean;
  loud_sound: boolean;
}

interface Place {
  id: number;
  first: number;
  second: number;
  third: number;
}

interface PlaceOrderList {
  first: string;
  second: string;
  third: string;
}

interface RegistPlace {
  place_order: Place;
  n: number;
  regist: PlaceOrderList;
  first: string;
  second: string;
  third: string;
  remark: string;
}

interface RentalItem {
  name: string;
  num: number;
  rental_item: RegistItem;
}

interface RegistItem {
  id: number;
  group_id: number;
  rental_item_id: number;
  num: number;
}

interface RentalOrder {
  rental_item: RentalItem;
}

interface PowerItem {
  id: number;
  item: string;
  power: number;
  manufacturer: string;
  model: string;
  item_url: string;
}

interface PowerOrder {
  power_order: PowerItem;
}

interface Employee {
  employee: {
    employee: {
      id: number;
      name: string;
      student_id: number;
    };
  };
}

interface Purchase {
  purchase_list: {
    purchase_list: PurchaseList;
  };
}

interface PurchaseList {
  id: number;
  date_id: number;
  day: string;
  days_num: number;
  food_product_id: number;
  food_product: string;
  is_fresh: boolean;
  items: string;
  purchase_date: string;
  url: string;
  shop_id: number;
  shop: string;
  year: number;
}

interface Food {
  food_product: {
    food_product: {
      id: number;
      name: string;
      is_cooking: boolean;
      first_day_num: number;
      second_day_num: number;
      setting: boolean;
    };
    purchase_lists: Purchase;
  };
}

interface SubRep {
  id: number;
  name: string;
  department: string;
  department_id: number;
  grade: string;
  grade_id: number;
  student_id: number;
  email: string;
  tel: string;
}

const registInfo = ref<RegistInfo | []>([]);
const group = ref<Group>();
const subRep = ref<SubRep>();
const rentalOrders = ref<RentalOrder[]>();
const placeOrder = ref<RegistPlace>();
const powerOrders = ref<PowerOrder[]>();
const stageOrders = ref<StageOrder[]>();
const stageOption = ref<StageOption>();
const employee = ref<Employee>();
const food = ref<Food>();
// const regist = ref<RegistItem>()
// const setting = ref("")

const groupCategoryId = ref<Group["group_category_id"]>();

const selectTab = ref<number>(1);
const tab = ref<number>(selectTab.value);

const isEditSubRep = ref<boolean>();
const isEditPlace = ref<boolean>();
const isEditPower = ref<boolean>();
const isEditItem = ref<boolean>();
const isEditStage = ref<boolean>();
const isEditStageOption = ref<boolean>();
const isEditEmployee = ref<boolean>();
const isEditFood = ref<boolean>();
const isEditPurchase = ref<boolean>();
const isAddPower = ref<boolean>();
const isAddItem = ref<boolean>();
const isAddStage = ref<boolean>();
const isAddEmployee = ref<boolean>();
const isAddFood = ref<boolean>();
const isAddPurchase = ref<boolean>();

const config = useRuntimeConfig();
const url = config.APIURL + "/api/v1/current_user/current_regist_info";
onMounted(() => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then((response) => {
      registInfo.value = response.data.data[0];
      group.value = response.data.data[0].group;
      subRep.value = response.data.data[0].sub_rep;
      rentalOrders.value = response.data.data[0].rental_orders;
      placeOrder.value = response.data.data[0].place_order;
      powerOrders.value = response.data.data[0].power_orders;
      stageOrders.value = response.data.data[0].stage_orders;
      stageOption.value = response.data.data[0].stage_common_option;
      employee.value = response.data.data[0].employees;
      food.value = response.data.data[0].food_products;
      groupCategoryId.value = response.data.data[0].group.group_category_id;
    });
  // const settingurl = config.APIURL + "/user_page_settings";
  // axios.get(settingurl).then((response) => {
  //   setting.value = response.data.data[0];
  // });
  axios
    .get(config.APIURL + "/user_page_settings", {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then((response) => {
      isEditSubRep.value = response.data.data[0].is_edit_sub_rep;
      isEditPlace.value = response.data.data[0].is_edit_place;
      isEditPower.value = response.data.data[0].is_edit_power_order;
      isEditItem.value = response.data.data[0].is_edit_rental_order;
      isEditStage.value = response.data.data[0].is_edit_stage_order;
      isEditStageOption.value =
        response.data.data[0].is_edit_stage_common_option;
      isEditEmployee.value = response.data.data[0].is_edit_employee;
      isEditFood.value = response.data.data[0].is_edit_food_product;
      isEditPurchase.value = response.data.data[0].is_edit_purchase_list;
      isAddPower.value = response.data.data[0].add_power_order;
      isAddItem.value = response.data.data[0].add_rental_order;
      isAddStage.value = response.data.data[0].add_stage_order;
      isAddEmployee.value = response.data.data[0].add_employee;
      isAddFood.value = response.data.data[0].add_food_product;
      isAddPurchase.value = response.data.data[0].add_purchase_list;
    });
});

const reload = () => {
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then((response) => {
      registInfo.value = response.data.data[0];
      employee.value = response.data.data[0].employees;
      subRep.value = response.data.data[0].sub_rep;
      rentalOrders.value = response.data.data[0].rental_orders;
      placeOrder.value = response.data.data[0].place_order;
      powerOrders.value = response.data.data[0].power_orders;
      stageOrders.value = response.data.data[0].stage_orders;
      stageOption.value = response.data.data[0].stage_common_option;
      food.value = response.data.data[0].food_products;
    });
};

const isAddItemModal = ref<boolean>(false);
const openAddItemModal = () => {
  isAddItemModal.value = true;
};

const isAddPowerModal = ref<boolean>(false);
const openAddPowerModal = () => {
  isAddPowerModal.value = true;
};

const isAddEmployeeModal = ref<boolean>(false);
const openAddEmployeeModal = () => {
  isAddEmployeeModal.value = true;
};

const isAddFoodModal = ref<boolean>(false);
const openAddFoodModal = () => {
  isAddFoodModal.value = true;
};

const isAddPurchaseModal = ref<boolean>(false);
const openAddPurchaseModal = () => {
  isAddPurchaseModal.value = true;
};

const isAddStageModal = ref<boolean>(false);
const openAddStageModal = () => {
  isAddStageModal.value = true;
};

const totalPower = computed(() => {
  if (!powerOrders.value) return 0;
  return powerOrders.value.reduce(
    (sum, powerOrder) => sum + powerOrder.power_order.power,
    0
  );
});

const isOverPower = computed(() => {
  if (!powerOrders.value) return false;
  return totalPower.value > 1500;
});

const isSamePower = computed(() => {
  if (!powerOrders.value) return false;
  return totalPower.value == 1500;
});

// 物品申請が重複しているかどうか
const isRentalItemOverlap = computed(() => {
  if (!rentalOrders.value) return false;
  const rentalOrder = rentalOrders.value.map((rentalOrder) => {
    return rentalOrder.rental_item.name;
  });
  // テントと小テントが存在してもエラーがでるようにしたい。
  if (rentalOrder.includes("テント") && rentalOrder.includes("小テント")) {
    return true;
  }
  const rentalOrderSet = new Set(rentalOrder);
  return rentalOrder.length !== rentalOrderSet.size;
});

// ステージ申請で日付と天気が重複しているかどうか
const isStageOverlap = computed(() => {
  if (!stageOrders.value) return false;
  const stageOrder = stageOrders.value.map((stageOrder) => {
    return (
      stageOrder.stage_order.date + stageOrder.stage_order.stage_order.is_sunny
    );
  });
  console.log(stageOrder);
  const stageOrderSet = new Set(stageOrder);
  return stageOrder.length !== stageOrderSet.size;
});

</script>

<template>
  <Container :name="group?.name">
    <template #tabs>
      <ul class="flex">
        <li @click="tab = 1">
          <div :class="{ select: tab === 1 }" class="title">
            {{ $t("RegistInfo.subrepresentative") }}
          </div>
        </li>
        <li
          v-if="groupCategoryId !== 3 && !group?.is_international"
          @click="tab = 2"
        >
          <div :class="{ select: tab === 2 }" class="title">
            {{ $t("RegistInfo.place") }}
          </div>
        </li>
        <li v-if="groupCategoryId === 3" @click="tab = 3">
          <div :class="{ select: tab === 3 }" class="title">
            {{ $t("RegistInfo.stage") }}
          </div>
        </li>
        <li v-if="groupCategoryId === 3" @click="tab = 4">
          <div :class="{ select: tab === 4 }" class="title">
            {{ $t("RegistInfo.stageOption") }}
          </div>
        </li>
        <li @click="tab = 5">
          <div :class="{ select: tab === 5 }" class="title">
            {{ $t("RegistInfo.power") }}
          </div>
        </li>
        <li @click="tab = 6">
          <div :class="{ select: tab === 6 }" class="title">
            {{ $t("RegistInfo.item") }}
          </div>
        </li>
        <li v-if="groupCategoryId === 1" @click="tab = 7">
          <div :class="{ select: tab === 7 }" class="title">
            {{ $t("RegistInfo.employees") }}
          </div>
        </li>
        <li
          v-if="
            groupCategoryId != 3 && groupCategoryId != 4 && groupCategoryId != 6
          "
          @click="tab = 8"
        >
          <div :class="{ select: tab === 8 }" class="title">
            {{ $t("RegistInfo.product") }}
          </div>
        </li>
        <li v-if="groupCategoryId === 1" @click="tab = 9">
          <div :class="{ select: tab === 9 }" class="title">
            {{ $t("RegistInfo.purchase") }}
          </div>
        </li>
      </ul>
    </template>
    <template #body>
      <div class="ml-12 pt-4">
        <!-- 副代表申請  -->
        <div v-show="tab === 1">
          <div
            v-if="!isEditSubRep"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集は締め切られました
          </div>
          <RegistInfoCardSubRep
            :group-id="group?.id"
            :id="subRep?.id"
            :name="subRep?.name"
            :department="subRep?.department"
            :department_id="subRep?.department_id"
            :grade="subRep?.grade"
            :grade_id="subRep?.grade_id"
            :studentId="subRep?.student_id"
            :email="subRep?.email"
            :tel="subRep?.tel"
            :rep_user_id="group?.user_id"
            @reload-sub-rep="reload"
          />
        </div>

        <!-- 会場申請 group_category_id !== ３ -->
        <div v-if="!group?.is_international" v-show="tab === 2">
          <div v-if="!isEditPlace" class="text-3xl text-red-600 font-bold my-5">
            編集は締め切られました
          </div>
          <div class="mb-4">
            <div class="text-xl flex gap-3">
              <p>{{ $t("RegistInfo.placeMessage") }}</p>
            </div>
          </div>
          <div class="mb-4">
            <RegistInfoCardPlace
              :id="placeOrder?.place_order.id"
              :regist="placeOrder?.place_order"
              :n="1"
              :place="placeOrder?.first"
              :remark="placeOrder?.remark"
              @reload-place="reload"
            />
          </div>
          <div class="my-4">
            <RegistInfoCardPlace
              :id="placeOrder?.place_order.id"
              :regist="placeOrder?.place_order"
              :n="2"
              :place="placeOrder?.second"
              :remark="placeOrder?.remark"
              @reload-place="reload"
            />
          </div>
          <div class="my-4">
            <RegistInfoCardPlace
              :id="placeOrder?.place_order.id"
              :regist="placeOrder?.place_order"
              :n="3"
              :place="placeOrder?.third"
              :remark="placeOrder?.remark"
              @reload-place="reload"
            />
          </div>
        </div>

        <!-- ステージ申請 group_category_id === ３ -->
        <div v-show="tab === 3" class="flex flex-col gap-4">
          <Button
            v-if="isAddStage && !isOverStage && !isStageOverlap"
            class="fixed right-0 bottom-0 m-10 mb-14"
            @click="openAddStageModal()"
          />
          <div
            v-if="!isAddStage && !isEditStage"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加・編集・削除は締め切られました
          </div>
          <div
            v-else-if="!isAddStage"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加は締め切られました
          </div>
          <div
            v-else-if="!isEditStage"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集・削除は締め切られました
          </div>
          <div v-if="isStageOverlap" class="text-red-500">
            <p>{{ $t("Place.overlapPlace") }}</p>
          </div>
          <div>
            <div class="mb-8" v-for="s in stageOrders" :key="s.toString()">
              <div>
                <RegistInfoCardStage
                  :group-id="group?.id"
                  :id="s.stage_order.stage_order.id"
                  :date="s.stage_order.date"
                  :fes-date-id="s.stage_order.stage_order.fes_date_id"
                  :first-stage="s.stage_order.stage_first"
                  :first-id="s.stage_order.stage_order.stage_first"
                  :second-stage="s.stage_order.stage_second"
                  :second-id="s.stage_order.stage_order.stage_second"
                  :is-sunny="s.stage_order.stage_order.is_sunny"
                  :cleanup-time-interval="s.stage_order.cleanup_time_interval"
                  :use-time-interval="s.stage_order.use_time_interval"
                  :prepare-time-interval="s.stage_order.prepare_time_interval"
                  @reload-stage="reload"
                />
              </div>
            </div>
          </div>
          <RegistInfoAddStage
            v-if="isAddStageModal"
            v-model:add-stage="isAddStageModal"
            :group-id="group?.id"
            @reload-stage="reload"
          />
        </div>

        <!-- ステージオプション申請 group_category_id === ３ -->
        <div v-if="groupCategoryId === 3" v-show="tab === 4">
          <div
            v-if="!isEditStageOption"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集は締め切られました
          </div>
          <RegistInfoCardStageOption
            :group-id="group?.id"
            :id="stageOption?.id"
            :own-equipment="stageOption?.own_equipment"
            :bgm="stageOption?.bgm"
            :camera-permission="stageOption?.camera_permission"
            :loud-sound="stageOption?.loud_sound"
            @reload-stage-option="reload"
          />
        </div>

        <!-- 電力申請 -->
        <div v-show="tab === 5">
          <Button
            v-if="isAddPower && !isOverPower && !isSamePower"
            class="fixed right-0 bottom-0 m-10 mb-14"
            @click="openAddPowerModal()"
          />
          <!-- 電力の合計を計算して表示する -->
          <div
            v-if="!isAddPower && !isEditPower"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加・編集・削除は締め切られました
          </div>
          <div
            v-else-if="!isAddPower"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加は締め切られました
          </div>
          <div
            v-else-if="!isEditPower"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集・削除は締め切られました
          </div>
          <div class="mb-4">
            <div class="text-xl flex gap-3">
              <p>{{ $t("Power.total") }}</p>
              <p>{{ totalPower }} [W]</p>
            </div>
            <p v-if="isSamePower" class="text-gray-500">
              {{ $t("Power.isSamePower")
              }}<span class="font-bold">1500[W]</span>
            </p>
            <p v-else-if="isOverPower" class="text-red-500">
              {{ $t("Power.isOverPower")
              }}<span class="font-bold">1500[W]</span>
            </p>
            <p v-else class="text-gray-500">
              {{ $t("Power.isElse") }}<span class="font-bold">1500[W]</span>
            </p>
          </div>
          <div class="mb-8" v-for="p in powerOrders" :key="p.toString()">
            <RegistInfoCardPower
              :group-id="group?.id"
              :id="p.power_order.id"
              :item="p.power_order.item"
              :power="p.power_order.power"
              :manufacturer="p.power_order.manufacturer"
              :model="p.power_order.model"
              :url="p.power_order.item_url"
              :total-power="totalPower"
              @reload-power="reload"
            />
          </div>
          <RegistInfoAddPower
            v-if="isAddPowerModal"
            v-model:add-power="isAddPowerModal"
            :group-id="group?.id"
            :total-power="totalPower"
            @reload-power="reload"
          />
        </div>

        <!-- 物品申請 -->
        <div v-show="tab === 6" class="flex flex-wrap flex-col">
          <div class="text-xl flex gap-3">
            <p>{{ $t("RegistInfo.ItemMessage") }}</p>
          </div>
          <Button
            v-if="isAddItem && !isRentalItemOverlap"
            class="fixed right-0 bottom-0 m-10 mb-14"
            @click="openAddItemModal()"
          />
          <div
            v-if="!isAddItem && !isEditItem"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加・編集・削除は締め切られました
          </div>
          <div
            v-else-if="!isAddItem"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加は締め切られました
          </div>
          <div
            v-else-if="!isEditItem"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集・削除は締め切られました
          </div>
          <div v-if="isRentalItemOverlap" class="text-red-500">
            <p>{{ $t("Item.overlapItem") }}</p>
          </div>
          <div class="flex flex-wrap gap-4">
            <div
              class="w-fit"
              v-for="item in rentalOrders"
              :key="item.toString()"
            >
              <RegistInfoCardItem
                :group-id="group?.id"
                :regist="item.rental_item.rental_item"
                :name="item.rental_item.name"
                :num="item.rental_item.num"
                :rental-item-ids="rentalOrders?.map(order => order.rental_item.rental_item.rental_item_id)"
                @reload-item="reload"
              />
            </div>
          </div>
          <RegistInfoAddItem
            v-if="isAddItemModal"
            v-model:add-item="isAddItemModal"
            :group-id="group?.id"
            :rental-item-ids="rentalOrders?.map(order => order.rental_item.rental_item.rental_item_id)"
            @reload-item="reload"
          />
        </div>

        <!-- 従業員申請 -->
        <div v-show="tab === 7" class="flex flex-wrap flex-col">
          <Button
            v-if="isAddEmployee"
            class="fixed right-0 bottom-0 m-10 mb-14"
            @click="openAddEmployeeModal()"
          />
          <div
            v-if="!isAddEmployee && !isEditEmployee"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加・編集・削除は締め切られました
          </div>
          <div
            v-else-if="!isAddEmployee"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加は締め切られました
          </div>
          <div
            v-else-if="!isEditEmployee"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集・削除は締め切られました
          </div>
          <div class="mt--9 flex flex-wrap gap-4">
            <div class="w-fit" v-for="e in employee" :key="e.toString()">
              <RegistInfoCardEmployee
                :group-id="group?.id"
                :id="e.employee.id"
                :name="e.employee.name"
                :student-id="e.employee.student_id"
                @reload-employee="reload"
              />
            </div>
          </div>
          <RegistInfoAddEmployee
            v-if="isAddEmployeeModal"
            v-model:add-employee="isAddEmployeeModal"
            :group-id="group?.id"
            @reload-employee="reload"
          />
        </div>

        <!-- 販売品申請 -->
        <div v-show="tab === 8">
          <Button
            v-if="isAddFood"
            class="fixed right-0 bottom-0 m-10 mb-14"
            @click="openAddFoodModal()"
          />
          <div
            v-if="!isAddFood && !isEditFood"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加・編集・削除は締め切られました
          </div>
          <div
            v-else-if="!isAddFood"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加は締め切られました
          </div>
          <div
            v-else-if="!isEditFood"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集・削除は締め切られました
          </div>
          <div class="mb-8" v-for="f in food" :key="f.toString()">
            <RegistInfoCardFood
              :group-id="group?.id"
              :id="f.food_product.id"
              :name="f.food_product.name"
              :is-cooking="f.food_product.is_cooking"
              :firstNum="f.food_product.first_day_num"
              :secondNum="f.food_product.second_day_num"
              :groupCategoryId="groupCategoryId ? groupCategoryId : 0"
              @reload-food="reload"
            />
          </div>
          <RegistInfoAddFood
            v-if="isAddFoodModal"
            v-model:add-food="isAddFoodModal"
            :group-id="group?.id"
            :groupCategoryId="groupCategoryId ? groupCategoryId : 0"
            @reload-food="reload"
          />
        </div>

        <!-- 購入品申請 -->
        <div v-if="groupCategoryId === 1" v-show="tab === 9">
          <Button
            v-if="isAddPurchase"
            class="fixed right-0 bottom-0 m-10 mb-14"
            @click="openAddPurchaseModal()"
          />
          <div
            v-if="!isAddPurchase && !isEditPurchase"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加・編集・削除は締め切られました
          </div>
          <div
            v-else-if="!isAddPurchase"
            class="text-3xl text-red-600 font-bold my-5"
          >
            追加は締め切られました
          </div>
          <div
            v-else-if="!isEditPurchase"
            class="text-3xl text-red-600 font-bold my-5"
          >
            編集・削除は締め切られました
          </div>
          <div v-for="f in food" :key="f.toString()">
            <div class="mb-8" v-for="p in f.purchase_lists" :key="p.toString()">
              <RegistInfoCardPurchase
                :id="p.purchase_list.id"
                :group-id="group?.id"
                :food-product-id="p.purchase_list.food_product_id"
                :food-product="p.purchase_list.food_product"
                :shop-id="p.purchase_list.shop_id"
                :shop="p.purchase_list.shop"
                :name="p.purchase_list.items"
                :is-fresh="p.purchase_list.is_fresh"
                :fes-date-id="p.purchase_list.date_id"
                :purchase-date="p.purchase_list.purchase_date"
                :url="p.purchase_list.url"
                :group-category-id="groupCategoryId ? groupCategoryId : 0"
                @reload-purchase="reload"
              />
            </div>
          </div>
          <RegistInfoAddPurchase
            v-if="isAddPurchaseModal"
            v-model:add-purchase="isAddPurchaseModal"
            :group-id="group?.id"
            :group-category-id="groupCategoryId ? groupCategoryId : 0"
            @reload-purchase="reload"
          />
        </div>
      </div>
    </template>
  </Container>
</template>

<style scoped>
.title {
  @apply bg-gray-100
    inline-block
    py-2
    px-4
    rounded-t-xl
    font-semibold
    hover:bg-gray-200
    hover:shadow-lg
    cursor-pointer;
}
.select {
  @apply bg-gray-300;
}
</style>
