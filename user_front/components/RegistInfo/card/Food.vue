<script lang="ts" setup>
import { Setting } from '~~/types';

interface Props {
  id: number | null;
  groupId: number;
  name: string;
  isCooking: boolean;
  firstNum: number;
  secondNum: number;
  setting: boolean | null;
  groupCategoryId: number;
}

interface Emits {
  (e: "reloadFood", v: null): void;
}
const emits = defineEmits<Emits>();
  const reloadFood = () => {
  emits("reloadFood", null);
};

const food = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: 0,
  name: "",
  isCooking: false,
  firstNum: 0,
  secondNum: 0,
  setting: null,
});

const config = useRuntimeConfig();
const isEditFood = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditFood.value = setting.data[0].is_edit_food_product
});

const isEditModal = ref<boolean>(false);
const openEditModal = () => {
  isEditModal.value = true
}
const isDeleteModal = ref<boolean>(false);
const openDeleteModal = () => {
  isDeleteModal.value = true
}
</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="w-[40%] ml-8 text-center text-4xl truncate hover:text-clip">
        {{ food.name }}
      </div>
      <RegistInfoDivideBar />
      <div v-if="groupCategoryId === 1" class="w-[10%] text-center">
        <p class="text-base">{{ $t("Product.cook") }}</p>
        <p class="text-2xl">
          {{ food.isCooking ? $t("Product.yes") : $t("Product.no") }}
        </p>
      </div>
      <RegistInfoDivideBar v-if="groupCategoryId === 1" />
      <div class="mx-4 text-center text-xl w-[9%]">
        <span>{{ $t("Product.sold") }}<br />{{ $t("Product.toBe") }}</span>
      </div>
      ▶
      <div class="w-[15%] mx-4 text-xl">
        <div class="mr-1">
          {{ $t("Product.firstDay") }}
          <span class="w-[10%] text-center text-xl">
            {{ food.firstNum }}
          </span>
          {{ $t("Product.count") }}
        </div>
        <div class="mr-1 text-xl">
          {{ $t("Product.secondDay") }}
          <span class="w-[10%] text-center text-xl">
            {{ food.secondNum }}
          </span>
          {{ $t("Product.count") }}
        </div>
      </div>
    </template>
    <template v-if="isEditFood" #method>
      <div class="mx-4">
        <div class="my-2">
          <EditButton @click="openEditModal()" />
        </div>
        <DeleteButton @click="openDeleteModal()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <RegistInfoEditFood
    v-if="isEditModal"
    v-model:edit-food="isEditModal"
    :group-id="groupId"
    :id="id"
    :dish-name="name"
    :is-cooking="isCooking"
    :first-day-num="firstNum"
    :second-day-num="secondNum"
    :group-category-id="groupCategoryId"
    @reload-food="reloadFood()"
  />
  <RegistInfoDeleteFood
    v-if="isDeleteModal"
    v-model:delete-food="isDeleteModal"
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
    "loud_sound": true
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
        "is_inside_shop_rentable": true,
        "is_outside_shop_rentable": true,
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
