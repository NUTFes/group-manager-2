<script lang="ts" setup>
import axios from 'axios';

const config = useRuntimeConfig()

const url = config.APIURL + "/api/v1/current_user/current_regist_info";
const group = useState("groupNameArray")
console.log(group.value)

interface RegistInfo {
  subRep: SubRep
  placeOrder: PlaceOrder
  powerOrder: PowerOrder
}

interface PlaceOrder {
  regist: []
  placeOrderId: number
  n: number
  palce: string
  remark: string
}

// interface RentalOrder {
//   name
// }

interface PowerOrder {
  id: number
  item: string
  power: number
  manufacturer: string
  model: string
  url: string
}

interface SubRep {
  name: string
  department: string
  grade: string
  student_id: number
  email: string
  tel: string
}

const rentalOrder = {
  name: ref(''),
  num: ref(0),
  is_shop_rentable: ref<boolean>(),
  is_stage_rentable: ref<boolean>(),
}
const itemArray = ref([""])

const registInfo = useState<RegistInfo>()
  // data: rentalOrder,
// const registInfo = reactive([])
// const groupCategoryId = useState('group_category_id', () => null)
const setting = ref("")

// const num = ref('')
// const resultNum = ref(0)
// const groupId = ("")


// console.log(subRep.value)
// const {data} = await useFetch(url, {
//   onRequest({ response, options}) {
//     options.headers = {
//       "Content-Type": "application/json",
//       "access-token": localStorage.getItem("access-token"),
//       client: localStorage.getItem("client"),
//       uid: localStorage.getItem("uid"),
//     }
//   }
// })
 // , { onResponse({response}){return response._data}  }


// const {data:d} = await useFetch(url)
// !!d.value && d.value.forEach((i:) => {
//   d.value.push(registInfo)
// })
// !!data.value && data.value.forEach<Item[]>((d:Item) =>{
//   data.value.push(registInfo)
// } )

onMounted(() => {
  // const {data: regist} = await useFetch(url)
  // !!regist.value && regist.value.forEach((info:string) => {
  //   info.value.push(registInfo)
  // });
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
      // const save = registInfo.value[0]
      // rentalOrder.value = registInfo
      // groupCategoryId.value = response.data.data[0].group.group_category_id
    });
  // console.log(registInfo)
  const settingurl = config.APIURL + "/user_page_settings";
  axios.get(settingurl).then((response) => {
    setting.value = response.data.data[0];
  });
})

</script>

<template>
<Container>
  <template #body>
    <div class="ml-12 pt-4">
      <!-- {{ registInfo }} -->
      <!-- <div v-for="s in registInfo.sub_rep" :key="s"> -->
        {{ registInfo }}
        <!-- <RegistInfoCardSubRep
          :name="registInfo.sub_rep.name"
          :department="registInfo.sub_rep.department"
        /> -->
      </div>
      <!-- 会場申請 -->
        <!-- <RegistInfoCardPlace :n="1" :place="registInfo.place_order" :remark="place.remark" /> -->
      <!-- 電力申請 -->
      <div v-for="p in registInfo.powerOrder" :key="p">
        {{ p }}
        <RegistInfoCardPower
          :id="p.id"
          :item="p.item"
          :power="p.power"
          :manufacturer="p.manufacturer"
          :model="p.model"
          :url="p.item_url"
        />
      </div>
      <!-- 物品申請 -->
      <div class="flex">
        <div v-for="item in registInfo.rental_orders" :key="item">
          <!-- {{ item }} -->
          <RegistInfoCardItem
            :name=item.rental_item.name :num=item.rental_item.num
          />
        </div>
      </div>
  </template>
</Container>
</template>
