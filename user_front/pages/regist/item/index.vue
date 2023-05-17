<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item";
import { loginCheck } from "@/utils/methods";
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate";
import { itemSchema } from "~~/utils/validate";

const initialData = {
  items: [
    {
      itemNameId: 0,
      itemNum: 0,
    },
  ],
};

const reset = (idx: number) => {
  (registerParams[idx].rentalItemId = 0), (registerParams[idx].num = 0);
};

const { meta, isSubmitting } = useForm({
  validationSchema: itemSchema,
  initialValues: initialData,
});

const {
  fields: itemValidate,
  push: addValidate,
  remove: removeValidate,
} = useFieldArray("items");

const config = useRuntimeConfig();
const router = useRouter();
const insideRentableItemList = ref<ItemList[]>([]);
const outsideRentableItemList = ref<ItemList[]>([]);
const formCount = ref(1);
const itemList = ref<ItemList[]>([]);
const isOverlapItem = ref(false);

const state = reactive({
  groupId: 0,
  groupCategoryId: 0,
});

// 場所と物品を制限するための変数
const selectedLocation = ref<string>("屋内団体");
const selectableItemList = ref<ItemList[]>([]);

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  if (Number(localStorage.getItem("group_category_id")) === 3) {
    const itemData = await $fetch<Item>(
      config.APIURL + "/api/v1/get_stage_rentable_items"
    );
    itemData.data.forEach((item) => {
      selectableItemList.value.push(item);
    });
    selectedLocation.value = "ステージ団体";
  } else {
    const insideRentableItemData = await $fetch<Item>(
      config.APIURL + "/api/v1/get_inside_shop_rentable_items"
    );
    insideRentableItemData.data.forEach((item) => {
      insideRentableItemList.value.push(item);
    });
    const outsideRentableItemData = await $fetch<Item>(
      config.APIURL + "/api/v1/get_outside_shop_rentable_items"
    );
    outsideRentableItemData.data.forEach((item) => {
      outsideRentableItemList.value.push(item);
    });
    insideRentableItemList.value.forEach((item) => {
      selectableItemList.value.push(item);
    });
  }
  state.groupId = Number(localStorage.getItem("group_id"));
  state.groupCategoryId = Number(localStorage.getItem("group_category_id"));
});

const registerParams = [
  reactive({
    num: 0,
    rentalItemId: 0,
  }),
];

const increment = () => {
  formCount.value++;
  registerParams.push(
    reactive({
      num: 0,
      rentalItemId: 0,
    })
  );
  addValidate({ itemNameId: 0, itemNum: 0 });
};

const decrement = (idx: number) => {
  formCount.value--;
  removeValidate(idx);
};

const registerItem = async () => {
  // 貸し出し可能物品個数のチェック
  for (let i = 0; i < formCount.value; i++) {
    if (
      getMaxValueByItemId(registerParams[i].rentalItemId) <
      registerParams[i].num
    ) {
      alert("貸し出し可能個数を超過している物品があるので修正してください。");
      return;
    }
    const uniqueRentalItems = new Set();
    const rentalItemId = registerParams[i].rentalItemId;
    if (uniqueRentalItems.has(rentalItemId)) {
      isOverlapItem.value = true;
      return;
    }
    uniqueRentalItems.add(rentalItemId);
  }

  for (let i = 0; i < formCount.value; i++) {
    await $fetch(config.APIURL + "/rental_orders", {
      method: "POST",
      params: {
        group_id: state.groupId,
        num: registerParams[i].num,
        rental_item_id: registerParams[i].rentalItemId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  router.push("/regist/power");
};

const skip = () => {
  router.push("/regist/power");
};

// 物品のidから物品の情報を取得し、物品の貸し出し可能数を返す
const getMaxValueByItemId = (id: number) => {
  const items = selectableItemList.value.find((item) => item.id === id);

  let maxValue = 0;
  if (selectedLocation.value === "屋外団体" && items?.name === "テント") {
    maxValue = 1;
  } else if (
    selectedLocation.value === "屋外団体" &&
    (items?.name === "机" || items?.name === "椅子")
  ) {
    maxValue = 20;
  } else {
    maxValue = 99;
  }
  return maxValue;
};

const updateSelectedLocation = (event: Event) => {
  const target = event.target as HTMLInputElement;
  switch (target.value) {
    case "屋内団体":
      selectableItemList.value = [];
      insideRentableItemList.value.forEach((item) => {
        selectableItemList.value.push(item);
      });
      break;
    case "屋外団体":
      selectableItemList.value = [];
      outsideRentableItemList.value.forEach((item) => {
        selectableItemList.value.push(item);
      });
      break;
  }
};
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">{{ $t("Item.registItem") }}</h1>
      <Card border="none" align="end" gap="20px">
        <div class="flex gap-3">
          <div v-if="Number(state.groupCategoryId) !== 3">
            <label>
              <input
                type="radio"
                value="屋内団体"
                v-model="selectedLocation"
                :checked="selectedLocation === '屋内団体'"
                @click="updateSelectedLocation"
              />
              屋内団体
            </label>
            <label>
              <input
                type="radio"
                value="屋外団体"
                v-model="selectedLocation"
                :checked="selectedLocation === '屋外団体'"
                @click="updateSelectedLocation"
              />
              屋外団体
            </label>
          </div>
          <div v-if="Number(state.groupCategoryId) === 3">
            <label>
              <input
                type="radio"
                value="ステージ団体"
                v-model="selectedLocation"
                :checked="selectedLocation === 'ステージ団体'"
                @click="updateSelectedLocation"
              />
              ステージ団体
            </label>
          </div>
        </div>
        <div v-for="(field, idx) in itemValidate" :key="field.key">
          <div class="flex">
            <p class="label">{{ $t("Item.item") }}</p>
            <Field
              :id="`itemNameId${idx}`"
              :name="`items[${idx}].itemNameId`"
              as="select"
              style="width: 180px"
              class="form"
              v-model="registerParams[idx].rentalItemId"
            >
              <option value="" selected disabled></option>
              <option
                v-for="item in selectableItemList"
                :key="item.id"
                :value="item.id"
                :name="item.name"
              >
                {{ item.name }}
              </option>
            </Field>
          </div>
          <ErrorMessage
            class="text-rose-600"
            :name="`items[${idx}].itemNameId`"
          />

          <div class="flex">
            <p class="label">{{ $t("Item.number") }}</p>
            <Field
              :id="`itemNum${idx}`"
              :name="`items[${idx}].itemNum`"
              class="form"
              v-model="registerParams[idx].num"
              v-validate="
                'max_value:getMaxValueByItemId(registerParams[idx].rentalItemId)'
              "
            />
          </div>
          <p>
            {{ getMaxValueByItemId(registerParams[idx].rentalItemId) }}
            個まで貸し出し可能です
          </p>
          <ErrorMessage class="text-rose-600" :name="`items[${idx}].itemNum`" />

          <div v-if="idx == 0">
            <RegistPageButton
              :text="$t('Button.reset')"
              @click="reset(idx)"
            ></RegistPageButton>
          </div>

          <div v-if="idx != 0" class="flex gap-3">
            <RegistPageButton
              :text="$t('Button.reset')"
              @click="reset(idx)"
            ></RegistPageButton>
            <RegistPageButton
              :text="$t('Button.delete')"
              @click="decrement(idx)"
            ></RegistPageButton>
          </div>
        </div>
      </Card>
      <p v-if="isOverlapItem" class="text-rose-600">
        {{ $t("Item.overlapItem") }}
      </p>
      <Row>
        <RegistPageButton
          @click="increment"
          :text="$t('Button.add')"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          @click="registerItem"
          :text="$t('Button.register')"
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.skip')"
          @click="skip"
        ></RegistPageButton>
      </Row>
    </Card>
  </div>
</template>

<style scoped>
.label {
  @apply flex-none
      text-xl
      pr-5;
}
.form {
  @apply flex-none
    border-solid
    border-2;
}
</style>
