<script lang="ts" setup>
import { Place, PlaceList } from "~~/types/regist/place";
import { useField, useForm } from "vee-validate";
import { placeSchema } from "~~/utils/validate";
import axios from "axios";

const config = useRuntimeConfig();

interface Props {
  id: number | null;
  first: number | null;
  second: number | null;
  third: number | null;
  remark: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: null,
  first: null,
  second: null,
  third: null,
  remark: "",
});
interface Emits {
  (e: "update:editPlace", isEditePlace: boolean): void;
  (e: "reloadPlace", v: null): void;
}
const emits = defineEmits<Emits>();

const { meta, isSubmitting } = useForm({
  validationSchema: placeSchema,
  initialValues: {
    first: props.first,
    second: props.second,
    third: props.third,
    remark: props.remark,
  },
});
const { handleChange: handleFirstPlace, errorMessage: firstPlaceError } =
  useField("first");
const { handleChange: handleSecondPlace, errorMessage: secondPlaceError } =
  useField("second");
const { handleChange: handleThirdPlace, errorMessage: thirdPlaceError } =
  useField("third");
const { handleChange: handleRemark, errorMessage: remarkError } =
  useField("remark");

const EATING_AREA = [
  "希望なし",
  "事務棟エリア（講義室は含まない。)",
  "図書館エリア",
  "電気棟エリア",
  "メインステージエリア（情報処理センター前）",
  "機械・建設棟エリア",
  "生物棟エリア(電力使用不可)",
  "環境棟エリア",
];
const isEatingArea = (place: string) => {
  return EATING_AREA.includes(place);
};

const placeList = ref<PlaceList[]>([]);
const newFirst = ref<Props["first"]>(props.first);
const newSecond = ref<Props["second"]>(props.second);
const newThird = ref<Props["third"]>(props.third);
const newRemark = ref<Props["remark"]>(props.remark);
const groupCategoryId = ref<number>();
const group_id = ref();
const isOverlapPlace = computed(() => {
  if (
    (newFirst.value === 1 && newSecond.value === 1) ||
    (newFirst.value === 1 && newThird.value === 1) ||
    (newSecond.value === 1 && newThird.value === 1)
  )
    return false;
  else if (
    newFirst.value === newSecond.value ||
    newFirst.value === newThird.value ||
    newSecond.value === newThird.value
  ) {
    return true;
  } else {
    return false;
  }
});

const reloadPlace = () => {
  emits("reloadPlace", null);
};

const closeEditPlace = () => {
  emits("update:editPlace", false);
};

onMounted(async () => {
  const placeData = await $fetch<Place>(config.APIURL + "/places");
  // !!placeData.data &&
  //   placeData.data.forEach((place) => {
  //     placeList.value.push(place);
  //   });
  const groupUrl =
    config.APIURL + "/groups/" + Number(localStorage.getItem("group_id"));
  axios.get(groupUrl).then(async (response) => {
    groupCategoryId.value = response.data.data.group_category_id;

    placeData.data.forEach((place) => {
      if (groupCategoryId.value === 1) {
        if (isEatingArea(place.name)) {
          placeList.value.push(place);
        }
      } else {
        placeList.value.push(place);
      }
    });
  });
  group_id.value = Number(localStorage.getItem("group_id"));
});

const editPlace = async () => {
  if (props.id === null) {
    await useFetch(config.APIURL + "/place_orders", {
      method: "POST",
      params: {
        group_id: group_id.value,
        first: newFirst.value,
        second: newSecond.value,
        third: newThird.value,
        remark: newRemark.value,
      },
    });
  } else {
    await useFetch(config.APIURL + "/place_orders/" + props.id, {
      method: "PUT",
      params: {
        group_id: group_id.value,
        first: newFirst.value,
        second: newSecond.value,
        third: newThird.value,
        remark: newRemark.value,
      },
    });
  }
  reloadPlace();
  closeEditPlace();
};

const reset = () => {
  newFirst.value = null;
  newSecond.value = null;
  newThird.value = null;
  newRemark.value = "";
  handleFirstPlace(newFirst.value);
  handleSecondPlace(newSecond.value);
  handleThirdPlace(newThird.value);
  handleRemark(newRemark.value);
};
</script>

<template>
  <Modal :title="$t('Place.editPlace')">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="closeEditPlace()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t("Place.first") }}</div>
      <select
        class="entry"
        v-model="newFirst"
        @change="handleFirstPlace"
        :class="{ error_border: firstPlaceError }"
      >
        <option v-for="place in placeList" :value="place.id" :key="place.id">
          {{ place.name }}
        </option>
      </select>
      <div class="error_msg">{{ firstPlaceError }}</div>
      <div class="text">{{ $t("Place.second") }}</div>
      <select
        class="entry"
        v-model="newSecond"
        @change="handleSecondPlace"
        :class="{ error_border: secondPlaceError }"
      >
        <option v-for="place in placeList" :value="place.id" :key="place.id">
          {{ place.name }}
        </option>
      </select>
      <div class="error_msg">{{ secondPlaceError }}</div>
      <div class="text">{{ $t("Place.third") }}</div>
      <select
        class="entry"
        v-model="newThird"
        @change="handleThirdPlace"
        :class="{ error_border: thirdPlaceError }"
      >
        <option v-for="place in placeList" :value="place.id" :key="place.id">
          {{ place.name }}
        </option>
      </select>
      <div class="error_msg">{{ thirdPlaceError }}</div>
      <div class="text">{{ $t("Place.free") }}</div>
      <textarea
        class="entry"
        v-model="newRemark"
        @change="handleRemark"
        :class="{ error_border: remark }"
      />
      <div class="error_msg">{{ remarkError }}</div>
      <p v-if="isOverlapPlace" class="error_msg">
        {{ $t("Place.overlapPlace") }}
      </p>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton
          :text="$t('Button.reset')"
          @click="reset()"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting || isOverlapPlace"
          :text="$t('Button.edit')"
          @click="editPlace()"
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
