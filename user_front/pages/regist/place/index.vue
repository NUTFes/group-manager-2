<script lang="ts" setup>
import { Place, PlaceList } from "@/types/regist/place";
import { placeSchema } from "@/utils/validate";
import { useField, useForm } from "vee-validate";
import { loginCheck } from "@/utils/methods";
import axios from "axios";

const { meta, isSubmitting } = useForm({
  validationSchema: placeSchema,
});

const { handleChange: handleFirst, errorMessage: firstPlaceError } =
  useField("first");
const { handleChange: handleSecond, errorMessage: secondPlaceError } =
  useField("second");
const { handleChange: handleThird, errorMessage: thirdPlaceError } =
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

const config = useRuntimeConfig();
const router = useRouter();
const placeList = ref<PlaceList[]>([]);
const groupCategoryId = ref<number>();
const registerParams = reactive({
  first: "",
  second: "",
  third: "",
  remark: "",
  groupId: 0,
});

const reset = () => {
  (registerParams.first = ""),
    (registerParams.second = ""),
    (registerParams.third = ""),
    (registerParams.remark = ""),
    (registerParams.groupId = 0);
};

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();

  const groupUrl =
    config.APIURL + "/groups/" + Number(localStorage.getItem("group_id"));

  axios.get(groupUrl).then(async (response) => {
    groupCategoryId.value = response.data.data.group_category_id;

    const placeData = await $fetch<Place>(config.APIURL + "/places");
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

  registerParams.groupId = Number(localStorage.getItem("group_id"));
});

const isOverlapPlace = ref(false);
const registerPlace = async () => {
  if (
    registerParams.first === registerParams.second ||
    registerParams.first === registerParams.third ||
    registerParams.second === registerParams.third
  ) {
    isOverlapPlace.value = true;
    return;
  }
  isOverlapPlace.value = false;

  await $fetch<Place>(config.APIURL + "/place_orders", {
    method: "POST",
    params: {
      group_id: registerParams.groupId,
      first: registerParams.first,
      second: registerParams.second,
      third: registerParams.third,
      remark: registerParams.remark,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  router.push("/regist/item");
};

const skip = () => {
  router.push("/regist/item");
};

const back = () => {
  router.push("/regist/subrep");
};
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">{{ $t("Place.registPlace") }}</h1>
        <p v-if="groupCategoryId === 1" class="text-rose-600">
          {{ $t("Place.eatingArea") }}
        </p>
        <Card border="none" align="end">
          <div class="flex">
            <p class="label">{{ $t("Place.first") }}</p>
            <select
              style="width: 180px"
              v-model="registerParams.first"
              @change="handleFirst"
              :class="{ 'error-border': firstPlaceError }"
            >
              <option value="" selected disabled></option>
              <option
                v-for="place in placeList"
                :key="place.id"
                :value="place.id"
              >
                {{ place.name }}
              </option>
            </select>
          </div>
          <div class="text-rose-600">{{ firstPlaceError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Place.second") }}</p>
            <select
              style="width: 180px"
              v-model="registerParams.second"
              @change="handleSecond"
              :class="{ 'error-border': secondPlaceError }"
            >
              <option value="" selected disabled></option>
              <option
                v-for="place in placeList"
                :key="place.id"
                :value="place.id"
              >
                {{ place.name }}
              </option>
            </select>
          </div>
          <div class="text-rose-600">{{ secondPlaceError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Place.third") }}</p>
            <select
              style="width: 180px"
              v-model="registerParams.third"
              @change="handleThird"
              :class="{ 'error-border': thirdPlaceError }"
            >
              <option value="" selected disabled></option>
              <option
                v-for="place in placeList"
                :key="place.id"
                :value="place.id"
              >
                {{ place.name }}
              </option>
            </select>
          </div>
          <div class="text-rose-600">{{ thirdPlaceError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Place.free") }}</p>
            <input
              class="form"
              v-model="registerParams.remark"
              @change="handleRemark"
              :class="{ 'error-border': remarkError }"
            />
          </div>
        </Card>
        <div class="text-rose-600" v-if="isOverlapPlace">
          {{ $t("Place.overlapPlace") }}
        </div>
        <Row>
          <RegistPageButton
            :text="$t('Button.back')"
            @click="back"
            variant="secondary"
          >
          </RegistPageButton>
          <RegistPageButton
            :text="$t('Button.reset')"
            @click="reset"
            variant="danger"
          ></RegistPageButton>
          <RegistPageButton
            :disabled="!meta.valid || isSubmitting"
            :text="$t('Button.register')"
            @click="registerPlace"
          ></RegistPageButton>
          <RegistPageButton
            :text="$t('Button.skip')"
            @click="skip"
            variant="secondary"
          ></RegistPageButton>
        </Row>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.error-border {
  @apply border-2
      border-rose-600;
}
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
