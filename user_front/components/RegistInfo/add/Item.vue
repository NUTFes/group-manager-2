<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item";
import { useField, useForm } from "vee-validate";
import { editItemSchema } from "~/utils/validate";
const config = useRuntimeConfig();

const { meta, isSubmitting } = useForm({
  validationSchema: editItemSchema,
});
const { handleChange: handleName, errorMessage: nameError } =
  useField("itemNameId");
const { handleChange: handleNum, errorMessage: numError } = useField("itemNum");

interface Props {
  groupId: number | null;
}

interface Emits {
  (e: "update:addItem", isAddItem: boolean): void;
  (e: "reloadItem", v: null): void;
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
});

const emits = defineEmits<Emits>();

const groupCategoryId = Number(localStorage.getItem("group_category_id"));
const insideRentableItemList = ref<ItemList[]>([]);
const outsideRentableItemList = ref<ItemList[]>([]);
// 場所と物品を制限するための変数
const selectedLocation = ref<string>("屋内団体");
const selectableItemList = ref<ItemList[]>([]);

onMounted(async () => {
  if (Number(localStorage.getItem("group_category_id")) === 3) {
    const itemData = await $fetch<Item>(
      config.APIURL + "/api/v1/get_stage_rentable_items"
    );
    itemData.data.forEach((item) => {
      selectableItemList.value.push(item);
    });
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
});

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

const newItem = ref<number | null>();
const newNum = ref<number | null>();

const addItemClose = () => {
  emits("update:addItem", false);
};

const reloadItem = () => {
  emits("reloadItem", null);
};

const addItem = async () => {
  // 貸し出し可能物品個数のチェック
  const itemId = newItem.value as number;
  const itemNum = newNum.value as number;
  if (getMaxValueByItemId(itemId) < itemNum) {
    alert(
      "貸し出し可能個数を超過している物品があるので修正してください。\nPlease correct the number of items that have exceeded the number of items available for loan."
    );
    return;
  }

  await useFetch(config.APIURL + "/rental_orders", {
    method: "POST",
    params: {
      group_id: props.groupId,
      rental_item_id: newItem.value,
      num: newNum.value,
    },
  });
  reloadItem();
  addItemClose();
};

const reset = () => {
  newItem.value = null;
  newNum.value = null;
};
</script>

<template>
  <Modal :title="$t('Item.addItem')">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="addItemClose()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="flex mt-4 gap-3 justify-end">
        <div v-if="Number(groupCategoryId) !== 3">
          <label class="mr-2">
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
        <div v-if="Number(groupCategoryId) === 3">
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
      <div class="text">{{ $t("Item.item") }}</div>
      <select
        class="entry"
        v-model="newItem"
        @change="handleName"
        :class="{ error_border: nameError }"
      >
        <option
          v-for="list in selectableItemList"
          :key="list.id"
          :value="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ nameError }}</div>
      <div class="text">{{ $t("Item.number") }}</div>
      <input
        class="entry"
        v-model="newNum"
        @change="handleNum"
        :class="{ error_border: numError }"
      />
      <div class="error_msg">{{ numError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()" />
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.add')"
          @click="addItem()"
        />
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.error_msg {
  @apply mx-[10%] text-rose-600;
}
.error_border {
  @apply border-2 border-rose-600;
}
.text {
  margin: 3% 10% 0%;
}
.entry {
  margin: 0% 10%;
  border: 1px solid silver;
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
