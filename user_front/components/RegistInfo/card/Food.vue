<script lang="ts" setup>

interface Props {
  id: number | null
  groupId: number
  name: string
  isCooking: boolean
  firstNum: number
  secondNum: number
  setting: boolean | null
}

interface Emits {
  (e: 'reloadFood', v: null): void
}

const food = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: 0,
  name: '',
  isCooking: false,
  firstNum: 0,
  secondNum: 0,
  setting: null,
})

const emits = defineEmits<Emits>()

const isEditFood = ref<boolean>(false)
const isDeleteFood = ref<boolean>(false)

const openEditFood = () => {
  isEditFood.value = true
}
const openDeleteFood = () => {
  isDeleteFood.value = true
}

const reloadFood = () => {
  emits('reloadFood', null)
}

</script>
<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="w-[40%] text-center text-5xl">
        {{ food.name }}
      </div>
      <RegistInfoDivideBar />
      <div class="w-[10%] text-center">
        <p class="text-xl">調理の有無</p>
        <p class="text-4xl">{{ food.isCooking ? '有' : '無' }}</p>
      </div>
      <RegistInfoDivideBar />
      <div class="mx-4 text-center text-xl">
        <span>販売<br>予定数</span>
      </div>
        ▶
      <div class="w-[15%] mx-4 text-2xl">
        <div class="mr-1">
          1日目
          <span class="w-[10%] text-center text-3xl">
            {{ food.firstNum }}
          </span>
          個
        </div>
        <div class="mr-1">
          2日目
          <span class="w-[10%] text-center text-3xl">
            {{ food.secondNum }}
          </span>
          個
        </div>
      </div>
    </template>
    <template #method>
      <div class="mx-4">
        <div class="my-2">
          <EditButton @click="openEditFood()" />
        </div>
        <DeleteButton @click="openDeleteFood()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <RegistInfoEditFood
    v-if="isEditFood"
    v-model:edit-food="isEditFood"
    :group-id="groupId"
    :id="id"
    :dish-name="name"
    :is-cooking="isCooking"
    :first-day-num="firstNum"
    :second-day-num="secondNum"
    @reload-food="reloadFood()"
  />
  <RegistInfoDeleteFood
    v-if="isDeleteFood"
    v-model:delete-food="isDeleteFood"
    :id="id"
    @reload-food="reloadFood()"
  />
</template>
<!--
purchase_lists": [
  { "purchase_list":
    { "items": "tomato", "is_fresh": true, "food_product": "baked tomato", "shop": "アピタ長岡店", "days_num": 0, "date": "9/18", "day": "fri", "year": 2020 }
  }
]

{
  "group": {
    "id": 1,
    "name": "nutfes",
    "project_name": "nutfes",
    "activity": "nutfes",
    "user_id": 1,
    "group_category_id": 1,
    "fes_year_id": 1,
    "created_at": "2023-03-31T05:11:13.307Z",
    "updated_at": "2023-03-31T05:11:13.307Z",
    "committee": null
  },
  "group_category": "模擬店(食品販売)",
  "sub_rep": {
    "id": 1,
    "name": "技大花子",
    "department": "機械創造工学分野 ",
    "department_id": 1,
    "grade": "B1[学部1年]",
    "grade_id": 1,
    "tel": "111-2222-3333",
    "email": "nutfes-hanako@email.com",
    "student_id": 11222333
  },
  "place_order": {
    "place_order": {
      "id": 1,
      "group_id": 1,
      "first": 1,
      "second": 2,
      "third": 3,
      "remark": "sample",
      "created_at": "2023-03-31T05:11:15.086Z",
      "updated_at": "2023-03-31T05:11:15.086Z"
    },
    "first": "事務棟エリア",
    "second": "図書館エリア",
    "third": "電気棟エリア",
    "remark": "sample"
  },
  "stage_orders": [
    {
      "stage_order": {
        "stage_order": {
          "id": 1,
          "group_id": 1,
          "is_sunny": true,
          "fes_date_id": 1,
          "stage_first": 1,
          "stage_second": 2,
          "use_time_interval": "5分",
          "prepare_time_interval": "5分",
          "cleanup_time_interval": "5分",
          "prepare_start_time": "12:30",
          "performance_start_time": "13:00",
          "performance_end_time": "13:30",
          "cleanup_end_time": "14:00",
          "created_at": "2023-03-31T05:11:16.659Z",
          "updated_at": "2023-03-31T05:11:16.659Z"
        },
        "is_sunny": false,
        "year": 2020,
        "date": "9/18",
        "day": "fri",
        "day_num": 0,
        "stage_first": "メインステージ",
        "stage_second": "サブステージ",
        "use_time_interval": "5分",
        "prepare_time_interval": "5分",
        "cleanup_time_interval": "5分",
        "prepare_start_time": "12:30",
        "performance_start_time": "13:00",
        "performance_end_time": "13:30",
        "cleanup_end_time": "14:00"
      }
    }
  ],
  "stage_common_option": {
    "id": 1,
    "own_equipment": true,
    "bgm": true,
    "camera_permission": true,
    "loud_sound": true,
    "stage_content": "nutfes"
  },
  "power_orders": [
    {
      "power_order": {
        "id": 1,
        "item": "nutfes-sample",
        "power": 0,
        "manufacturer": "nutfes",
        "model": "nutfes",
        "item_url": "https://nutfes.net"
      }
    }
  ],
  "rental_orders": [
    {
      "rental_item": {
        "rental_item": {
          "id": 1,
          "group_id": 1,
          "rental_item_id": 1,
          "num": 10,
          "created_at": "2023-03-31T05:11:15.821Z",
          "updated_at": "2023-03-31T05:11:15.821Z"
        },
        "name": "机",
        "is_shop_rentable": true,
        "is_stage_rentable": true,
        "num": 10
      }
    }
  ],
  "employees": [
    {
      "employee": {
        "name": "技大梅子",
        "student_id": 44555666,
        "stool_test": "検便準備中"
      }
    }
  ],
  "food_products": [
    {
      "food_product": {
        "id": 1,
        "name": "baked tomato",
        "is_cooking": true,
        "first_day_num": 10,
        "second_day_num": 10
      },
      "purchase_lists": [
        {
          "purchase_list": {
            "items": "tomato",
            "is_fresh": true,
            "food_product": "baked tomato",
            "shop": "アピタ長岡店",
            "days_num": 0,
            "date": "9/18",
            "day": "fri",
            "year": 2020
          }
        }
      ]
    }
  ]
} -->
