<script lang="ts" setup>
import { Place, PlaceList } from "@/types/regist/place";
import { placeSchema } from "@/utils/validate";
import { useField, useForm } from "vee-validate";
import { loginCheck } from "@/utils/methods";

const { meta, isSubmitting } = useForm({
  validationSchema: placeSchema,
});

const { handleChange: handleFirst, errorMessage: firstPlaceError } = useField("first");
const { handleChange: handleSecond, errorMessage: secondPlaceError } = useField("second");
const { handleChange: handleThird, errorMessage: thirdPlaceError } = useField("third");
const { handleChange: handleRemark, errorMessage: remarkError } = useField("remark");

// ログインしていない場合は/welcomeに遷移させる
loginCheck();

const config = useRuntimeConfig();
const router = useRouter();
const placeList = ref<PlaceList[]>([]);
const registerParams = reactive({
  first: "",
  second: "",
  third: "",
  remark: "",
  groupId: 0,
});

onMounted(async () => {

  const placeData = await $fetch<Place>(config.APIURL + "/places");
  placeData.data.forEach((place) => {
    placeList.value.push(place);
  });
  registerParams.groupId = Number(localStorage.getItem("group_id"));
});

const registerPlace = async () => {
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

const skip = () =>{
  router.push("/regist/item");
}

</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of places</h1>
        <Card border="none" align="end">
          <div class="flex">
            <p class="label">first preference</p>
            <select style="width:180px;" v-model="registerParams.first" @change="handleFirst" :class="{'error-border': firstPlaceError}">
              <option value="" selected disabled></option>
              <option v-for = "place in placeList" :key="place.id" :value="place.id">{{place.name}}</option>
            </select>
          </div>
          <div class="text-rose-600">{{ firstPlaceError }}</div>

          <div class="flex">
            <p class="label">second preference</p>
            <select style="width:180px;" v-model="registerParams.second" @change="handleSecond" :class="{'error-border': secondPlaceError}">
              <option value="" selected disabled></option>
              <option v-for = "place in placeList" :key="place.id" :value="place.id">{{place.name}}</option>
            </select>
          </div>
          <div class="text-rose-600">{{ secondPlaceError }}</div>

          <div class="flex">
            <p class="label">third preference</p>
            <select style="width:180px;" v-model="registerParams.third" @change="handleThird" :class="{'error-border': thirdPlaceError}">
              <option value="" selected disabled></option>
              <option v-for = "place in placeList" :key="place.id" :value="place.id">{{place.name}}</option>
            </select>
          </div>
          <div class="text-rose-600">{{ thirdPlaceError }}</div>

          <div class="flex">
            <p class="label">free description</p>
            <input class="form" v-model="registerParams.remark" @change="handleRemark" :class="{'error-border': remarkError}">
          </div>
          <div class="text-rose-600">{{ remarkError }}</div>
        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton :disabled="!meta.valid || isSubmitting" text="register" @click="registerPlace"></RegistPageButton>
          <RegistPageButton text="skip" @click="skip"></RegistPageButton>
        </Row>
      </Card>
    </div>
  </div>
</template>

<style scoped>
  .error-border {
    @apply
      border-2
      border-rose-600
  }
  .label {
    @apply
      flex-none
      text-xl
      pr-5
  }
  .form {
    @apply
    flex-none
    border-solid
    border-2
  }
</style>
