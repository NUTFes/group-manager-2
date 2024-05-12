<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item";
import { useField, useForm } from "vee-validate";
import { editItemSchema } from "~/utils/validate";
const config = useRuntimeConfig();

interface Regist {
  groupId: number | null;
  id: number | null;
  item: number | null;
  num: number | null;
}

const props = withDefaults(defineProps<Regist>(), {
  groupId: null,
  id: null,
  item: null,
  num: null,
});
const { meta, isSubmitting } = useForm({
  validationSchema: editItemSchema,
  initialValues: {
    itemNameId: props.item,
    itemNum: props.num,
  },
});
const { handleChange: handleName, errorMessage: nameError } =
  useField("itemNameId");
const { handleChange: handleNum, errorMessage: numError } = useField("itemNum");

interface Emits {
  (e: "update:editItem", isEditItem: boolean): void;
  (e: "reloadItem", v: null): void;
}

const emits = defineEmits<Emits>();

const closeEditItem = () => {
  emits("update:editItem", false);
};

const reloadItem = () => {
  emits("reloadItem", null);
};

const groupCategoryId = Number(localStorage.getItem("group_category_id"));
const insideRentableItemList = ref<ItemList[]>([]);
const outsideRentableItemList = ref<ItemList[]>([]);

const newItem = ref<Regist["item"]>(props.item);
const newNum = ref<Regist["num"]>(props.num);

// 場所と物品を制限するための変数
const selectedLocation = ref<string>("屋外団体");
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
  if (items?.name === "テント") {
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

// バリデーションに合わせてリストを作っておく
// groupCategoryId=1の場合(食品販売)
const outsideRentableItemList_Id_1 = computed(() => {
  return outsideRentableItemList.value.filter(item => item.id >= 0 && item.id <= 9);
});

// groupCategoryId=3の場合(ステージ)
const stageRentableItemList = selectableItemList

// groupCategoryId=2,4,5,7の場合(物品販売、展示・体験、研究室、その他)
// かつ、屋外なのか、屋外なのかを分けたリスト
const outsideRentableItemList_Id_in = computed(() => {
  const validIds = [1, 3, 4, 5, 6];  // 表示したいIDのリスト
  return outsideRentableItemList.value.filter(item => validIds.includes(item.id));
});
const outsideRentableItemList_Id_out = computed(() => {
  return outsideRentableItemList.value.filter(item => item.id >= 1 && item.id <= 9);
});

const editItem = async () => {
  // 貸し出し可能物品個数のチェック
  const itemId = newItem.value as number;
  const itemNum = newNum.value as number;
  if (getMaxValueByItemId(itemId) < itemNum) {
    alert(
      "貸し出し可能個数を超過している物品があるので修正してください。\nPlease correct the number of items that have exceeded the number of items available for loan."
    );
    return;
  }
  // 机の入力バリデーション
  if (itemId === 1 && itemNum > 20 && selectedLocation.value  === '屋外団体') {
    alert(
      "机の貸し出し数が上限を超えています。20以下にしてください。\The number of desks available for rent has exceeded the limit; please reduce it to 20 or less."
    );
    return;
  }
    // 椅子の入力バリデーション
    if (itemId === 3 && itemNum > 20 && selectedLocation.value  === '屋外団体') {
    alert(
      "椅子の貸し出し数が上限を超えています。20以下にしてください。\nThe number of chairs available for rent has exceeded the limit; please reduce it to 20 or less."
    );
    return;
  }
  // テント、小テントのバリデーション
  if (itemId === 7 || itemId === 8){
    // 1つ以上の申請があるとき
    if(itemNum > 1){
      alert(
      "テントが複数選択されています。1つにしてください。\Multiple tents have been selected, please select one."
    );
    return;
    }
  }

  if (props.id === null) {
    await useFetch(config.APIURL + "/rental_orders", {
      method: "POST",
      params: {
        group_id: props.groupId,
        rental_item_id: newItem.value,
        num: newNum.value,
      },
    });
  } else {
    await useFetch(config.APIURL + "/rental_orders" + "/" + props.id, {
      method: "PUT",
      params: {
        group_id: props.groupId,
        rental_item_id: newItem.value,
        num: newNum.value,
      },
    });
  }
  reloadItem();
  closeEditItem();
};

const reset = () => {
  newItem.value = null;
  newNum.value = null;
  handleName(newItem.value);
  handleNum(newNum.value);
};


</script>

<template>
  <Modal :title="$t('Item.editItem')">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="closeEditItem()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <!-- 屋内団体、屋外団体、ステージ団体を選ぶinputの部分 -->
      <div class="flex flex-col mt-4 gap-3 justify-end">
        <div class="text-xl flex gap-3">
          <p class="text-red-500">{{ $t("RegistInfo.ItemMessage") }}</p>
        </div>
        <div v-if="Number(groupCategoryId) !== 1 && Number(groupCategoryId) !== 3">
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
        <div v-else-if="Number(groupCategoryId) === 3">
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
      <!-- 食品販売 -->
      <div v-if="Number(groupCategoryId) === 1">
        <select
          class="entry"
          v-model="newItem"
          @change="handleName"
          :checked="selectedLocation === '屋外団体'"
          :class="{ error_border: nameError }"
        >
        <!-- ここで！ユーザーの団体カテゴリでバリデーションをする -->
          <option
            v-for="list in outsideRentableItemList_Id_1"
            :key="list.id"
            :value="list.id"
          >
            {{ list.name }}
          </option>
        </select>
      </div>
      <!-- ステージ団体のバリデーション -->
      <div v-else-if="Number(groupCategoryId) === 3">
        <select
          class="entry"
          v-model="newItem"
          @change="handleName"
          :class="{ error_border: nameError }"
        >
          <option
            v-for="list in stageRentableItemList"
            :key="list.id"
            :value="list.id"
          >
            {{ list.name }}
          </option>
        </select>
      </div>
      <!-- 実行委員 -->
      <div v-else-if="Number(groupCategoryId) === 6">
        <select
          class="entry"
          v-model="newItem"
          @change="handleName"
          :class="{ error_border: nameError }"
        >
          <option
            v-for="list in outsideRentableItemList"
            :key="list.id"
            :value="list.id"
          >
            {{ list.name }}
          </option>
        </select>
      </div>
      <!--　物品販売、展示・体験、研究室、その他  -->
      <!-- 屋外団体 -->
      <div v-else-if="selectedLocation === '屋外団体'">
        <select
          class="entry"
          v-model="newItem"
          @change="handleName"
          :checked="selectedLocation === '屋外団体'"
          :class="{ error_border: nameError }"
        >
          <option
            v-for="list in outsideRentableItemList_Id_out"
            :key="list.id"
            :value="list.id"
          >
            {{ list.name }}
          </option>
        </select>
      </div>
      <!-- 屋内団体 -->
      <div v-else-if="selectedLocation === '屋内団体'">
        <select
          class="entry"
          v-model="newItem"
          @change="handleName"
          :checked="selectedLocation === '屋内団体'"

          :class="{ error_border: nameError }"
        >
          <option
            v-for="list in outsideRentableItemList_Id_in"
            :key="list.id"
            :value="list.id"
          >
            {{ list.name }}
          </option>
        </select>
      </div>
      <div class="error_msg">{{ nameError }}</div>
      <div class="text">{{ $t("Item.number") }}</div>
      <input
        type="number"
        class="entry"
        v-model="newNum"
        @change="handleNum"
        :class="{ error_border: numError }"
      />
      <div class="error_msg">{{ numError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton
          :text="$t('Button.reset')"
          @click="reset()"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.edit')"
          @click="editItem()"
        ></RegistPageButton>
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
