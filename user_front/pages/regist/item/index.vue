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
  const isOverMaxValue = registerParams.some((item) => {
    const maxValue = getMaxValueByItemId(item.rentalItemId);
    return item.num > maxValue;
  });
  if (isOverMaxValue) {
    alert(
      "貸し出し可能数を超えている物品があります。\nPlease correct the number of items that have exceeded the number of items available for loan."
    );
    return;
  }

  // registerParamsのrentalItemIdが重複していないかチェック
  const rentalItemIdList = registerParams.map((item) => item.rentalItemId);
  const isOverlap = rentalItemIdList.some(
    (id, i) => rentalItemIdList.indexOf(id) !== i
  );
  if (isOverlap) {
    alert(
      "同じ物品を複数選択しているので修正してください。\nPlease correct the number of items that have exceeded the number of items available for loan."
    );
    return;
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
const back = () => {
  if (Number(state.groupCategoryId) === 3) {
    router.push("/regist/stageOption");
  } else {
    router.push("/regist/place");
  }
};
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">{{ $t("Item.registItem") }}</h1>
      <div v-if="Number(state.groupCategoryId) !== 1 && Number(state.groupCategoryId) !== 3" class="flex gap-2 mt-2">
        <label>
          <input
            type="radio"
            value="屋内団体"
            v-model="selectedLocation"
            :checked="selectedLocation === '屋内団体'"
            @click="updateSelectedLocation"
          />
          {{ $t("Item.insideGroup") }}
        </label>
        <label>
          <input
            type="radio"
            value="屋外団体"
            v-model="selectedLocation"
            :checked="selectedLocation === '屋外団体'"
            @click="updateSelectedLocation"
          />
          {{ $t("Item.outsideGroup") }}
        </label>
      </div>
      <div class="mt-4">
        <div v-if="Number(state.groupCategoryId) === 1">
          <label>
            <input
              type="radio"
              value="屋外団体"
              v-model="selectedLocation"
              :checked="selectedLocation === '屋外団体'"
              @click="updateSelectedLocation"
            />
            {{ $t("Item.outsideGroup") }}
          </label>
        </div>
      </div>
      <div class="mt-4">
        <div v-if="Number(state.groupCategoryId) === 3">
          <label>
            <input
              type="radio"
              value="ステージ団体"
              v-model="selectedLocation"
              :checked="selectedLocation === 'ステージ団体'"
              @click="updateSelectedLocation"
            />
            {{ $t("Item.stageGroup") }}
          </label>
        </div>
      </div>
      <Card border="none" align="center" gap="20px" padding="10px">
        <div
          v-for="(field, idx) in itemValidate"
          :key="field.key"
          class="border p-4 rounded-md flex flex-col items-center gap-4"
        >
          <div class="grid grid-cols-2 gap-y-2">
            <p class="label">{{ $t("Item.item") }}</p>
            <div class="flex flex-col">
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
              <ErrorMessage
                class="text-rose-600"
                :name="`items[${idx}].itemNameId`"
              />
            </div>
            <p class="label">{{ $t("Item.number") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`itemNum${idx}`"
                :name="`items[${idx}].itemNum`"
                class="form"
                v-model="registerParams[idx].num"
                v-validate="
                  'max_value:getMaxValueByItemId(registerParams[idx].rentalItemId)'
                "
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`items[${idx}].itemNum`"
              />
              <p class="text-sm text-gray-500">
                {{ getMaxValueByItemId(registerParams[idx].rentalItemId) }}
                {{ $t("Item.maxNum") }}
              </p>
            </div>
          </div>
          <div v-if="idx == 0">
            <RegistPageButton
              :text="$t('Button.reset')"
              @click="reset(idx)"
              variant="danger"
            ></RegistPageButton>
          </div>
          <div v-if="idx != 0" class="flex gap-3">
            <RegistPageButton
              :text="$t('Button.reset')"
              @click="reset(idx)"
              variant="danger"
            ></RegistPageButton>
            <RegistPageButton
              :text="$t('Button.delete')"
              @click="decrement(idx)"
              variant="danger"
            ></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton
          :text="$t('Button.back')"
          @click="back"
          variant="secondary"
        >
        </RegistPageButton>
        <RegistPageButton
          @click="increment"
          :text="$t('Button.add')"
          variant="success"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          @click="registerItem"
          :text="$t('Button.register')"
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.skip')"
          @click="skip"
          variant="secondary"
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
