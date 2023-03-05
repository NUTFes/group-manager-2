<script lang="ts" setup>
import axios from 'axios';
import { Group } from '~~/types';

const config = useRuntimeConfig()

const url = config.APIURL + "/api/v1/current_user/current_regist_info";

const tab = useState("tab", () => 1)

interface RegistInfo {
  sub_rep: SubRep
  place_orders: PlaceOrder
  power_orders: PowerOrder[]
  rental_orders: RentalOrder[]
  group: Group
}

interface Stage {
  stage_first: string
  stage_second: string
  date: string
  is_sunny: boolean
}

interface StageOrder {
  stage_order: {
    stage_order:  Stage
  }
}

interface StageOption {
  own_equipment: boolean
  bgm: boolean
  camera_permission: boolean
  loud_sound: boolean
  stage_content: string
}

interface PlaceOrder {
  placeOrderId: number
  n: number
  first: string
  second: string
  third: string
  remark: string
}

interface RentalItem {
  name: string
  num: number
}

interface RentalOrder {
  rental_item: {
    rental_item: RentalItem
  }
}

interface PowerItem {
  item: string
  power: number
  manufacturer: string
  model: string
  item_url: string
}

interface PowerOrder {
  // id: number
  power_order: {
    power_order: PowerItem;
  }
}

interface SubRep {
  name: string
  department: string
  grade: string
  student_id: number
  email: string
  tel: string
}
const registInfo = ref<RegistInfo>()

const subRep = ref<SubRep>()
const rentalOrder = ref<RentalOrder>()
const placeOrder = ref<PlaceOrder>()
const powerOrder = ref<PowerOrder>()
const stageOrder = ref<StageOrder>()
const stageOption = ref<StageOption>()

// const setting = ref("")

const groupCategoryId = ref(null)

onMounted(() => {
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
      subRep.value = response.data.data[0].sub_rep;
      rentalOrder.value = response.data.data[0].rental_orders;
      placeOrder.value = response.data.data[0].place_order;
      powerOrder.value = response.data.data[0].power_orders;
      stageOrder.value = response.data.data[0].stage_orders;
      stageOption.value = response.data.data[0].stage_common_option;
      // rentalOrder.value = registInfo
      groupCategoryId.value = response.data.data[0].group.group_category_id
    });
  // const settingurl = config.APIURL + "/user_page_settings";
  // axios.get(settingurl).then((response) => {
  //   setting.value = response.data.data[0];
  // });
})

</script>

<template>
<Container :name="registInfo?.group.name">
  <template #tabs>
    <ul class="flex">
      <li @click="tab = 1">
        <div :class="{ select: tab === 1 }" class="title">副代表申請</div>
      </li>
      <li v-if="groupCategoryId !== 3" @click="tab = 2">
        <div :class="{ select: tab === 2 }" class="title">会場申請</div>
      </li>
      <li v-if="groupCategoryId === 3" @click="tab = 3">
        <div :class="{ select: tab === 3 }" class="title">ステージ申請</div>
      </li>
      <li v-if="groupCategoryId === 3" @click="tab = 4">
        <div :class="{ select: tab === 4 }" class="title">ステージオプション申請</div>
      </li>
      <li @click="tab = 5">
        <div :class="{ select: tab === 5 }" class="title">電力申請</div>
      </li>
      <li @click="tab = 6">
        <div :class="{ select: tab === 6 }" class="title">物品申請</div>
      </li>
      <li @click="tab = 7">
        <div :class="{ select: tab === 7 }" class="title">従業員申請</div>
      </li>
      <li @click="tab = 8">
        <div :class="{ select: tab === 8 }" class="title">食品申請</div>
      </li>
      <li @click="tab = 9">
        <div :class="{ select: tab === 9 }" class="title">購入品申請</div>
      </li>
    </ul>
  </template>
  <template #body>
    <div class="ml-12 pt-4">

      <!-- 副代表申請  -->
      <RegistInfoCardSubRep v-show="tab === 1"
        :name="subRep?.name"
        :department="subRep?.department"
        :grade="subRep?.grade"
        :student_id="subRep?.student_id"
        :email="subRep?.email"
        :tel="subRep?.tel"
      />

      <!-- 会場申請 group_category_id !== ３ -->
      <div v-show="tab === 2">
        <RegistInfoCardPlace class="my-4" :n="1" :place="placeOrder?.first" :remark="placeOrder?.remark" />
        <RegistInfoCardPlace class="my-4" :n="2" :place="placeOrder?.second" :remark="placeOrder?.remark" />
        <RegistInfoCardPlace class="my-4" :n="3" :place="placeOrder?.third" :remark="placeOrder?.remark" />
      </div>

      <!-- ステージ申請 group_category_id === ３ -->
      <div class="mb-8" v-show="tab === 3" v-for="s in stageOrder" :key="s.toString()">
        <RegistInfoCardStage
          :date="s.stage_order.date"
          :first-stage="s.stage_order.stage_first"
          :second-stage="s.stage_order.stage_second"
          :is-sunny="s.stage_order.is_sunny"
        />
      </div>

      <!-- ステージオプション申請 group_category_id === ３ -->
      <RegistInfoCardStageOption v-if="groupCategoryId === 3" v-show="tab === 4"
        :own-equipment="stageOption?.own_equipment"
        :bgm="stageOption?.bgm"
        :camera-permission="stageOption?.camera_permission"
        :loud-sound="stageOption?.loud_sound"
        :stage-content="stageOption?.stage_content"
      />

      <!-- 電力申請 -->
      <div v-show="tab === 5" v-for="p in powerOrder" :key="p.toString()">
        <RegistInfoCardPower
          :item="p.power_order.item"
          :power="p.power_order.power"
          :manufacturer="p.power_order.manufacturer"
          :model="p.power_order.model"
          :url="p.power_order.item_url"
        />
      </div>

      <!-- 物品申請 -->
      <div v-show="tab === 6" class="flex flex-wrap">
        <div v-for="item in rentalOrder" :key="item.toString()">
          <RegistInfoCardItem
            :name=item.rental_item.name
            :num=item.rental_item.num
          />
        </div>
      </div>
    </div>
  </template>
</Container>
</template>

<style scoped>
.title {
  @apply
    bg-gray-100
    inline-block
    py-2
    px-4
    rounded-t-xl
    font-semibold
    hover:bg-gray-200
    hover:shadow-lg
    cursor-pointer
}
.select {
  @apply
    bg-gray-300
}
</style>