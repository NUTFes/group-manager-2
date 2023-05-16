<script lang="ts" setup>
import { loginCheck } from "@/utils/methods";
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate";
import { foodSchema } from "~~/utils/validate";

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);

const state = reactive({
  groupId: 0,
  groupCategoryId: 0,
});

const initialData = {
  foods: [
    {
      dishName: '',
      isCooking: false,
      numFirstDay: 0,
      numSecondDay: 0,
    },
  ],
};

const reset = (idx: number) => {
  registerParams[idx].dishName = "",
  registerParams[idx].isCooking = false,
  registerParams[idx].numFirstDay = 0,
  registerParams[idx].numSecondDay = 0
}

const { meta, isSubmitting } = useForm({
  validationSchema: foodSchema,
  initialValues: initialData,
});

const { fields: foodValidate, push: addValidate, remove: removeValidate } = useFieldArray('foods')

onMounted(async () =>{
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));
  state.groupCategoryId = Number(localStorage.getItem("group_category_id"));
})

const registerParams = [reactive({
  dishName: "",
  isCooking: false,
  numFirstDay: 0,
  numSecondDay: 0,
})];

const registerFood = async () => {
  for (let i =0; i < formCount.value; i++){
    await $fetch(config.APIURL + "/food_products", {
      method: "POST",
      params: {
        group_id: state.groupId,
        name: registerParams[i].dishName,
        is_cooking: registerParams[i].isCooking,
        first_day_num: registerParams[i].numFirstDay,
        second_day_num: registerParams[i].numSecondDay,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  if (state.groupCategoryId === 1){
    router.push("/regist/purchase");
  } else {
    router.push("/mypage");
  }
};
const skip = () => {
  if (state.groupCategoryId === 1){
    router.push("/regist/purchase");
  } else {
    router.push("/mypage");
  }
};

const increment = () => {
  formCount.value++;
  registerParams.push(reactive({
    dishName: "",
    isCooking: false,
    numFirstDay: 0,
    numSecondDay: 0,
  }));
  addValidate({ dishName: '', isCooking: false, numFirstDay: 0, numSecondDay: 0 })
};

const decrement = (idx: number) => {
  formCount.value--;
  removeValidate(idx)};
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">{{ $t('Food.registFood') }}</h1>
      <Card border="none" align="end">
        <div v-for="(field, idx) in foodValidate" :key="field.key">
          <div class="flex">
            <p class="label">{{ $t('Food.name') }}</p>
            <Field
              :id="`name${idx}`"
              :name="`foods[${idx}].dishName`"
              class="form"
              v-model="registerParams[idx].dishName"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`foods[${idx}].dishName`"/>

          <div class="flex">
            <p class="label">{{ $t('Food.cook') }}</p>
            <select style="width:180px;" v-model="registerParams[idx].isCooking">
              <option value="" selected disabled></option>
              <option value='true'>{{ $t('Food.yes') }}</option>
              <option value='false'>{{ $t('Food.no') }}</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">{{ $t('Food.numberFirstDay') }}</p>
            <Field
              :id="`numFirstDay${idx}`"
              :name="`foods[${idx}].numFirstDay`"
              class="form"
              v-model="registerParams[idx].numFirstDay"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`foods[${idx}].numFirstDay`"/>

          <div class="flex">
            <p class="label">{{ $t('Food.numberSecondDay') }}</p>
            <Field
              :id="`numSecondDay${idx}`"
              :name="`foods[${idx}].numSecondDay`"
              class="form"
              v-model="registerParams[idx].numSecondDay"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`foods[${idx}].numSecondDay`"/>

          <div v-if="idx == 0">
            <RegistPageButton @click="reset(idx)" :text="$t('Button.reset')"></RegistPageButton>
          </div>

          <div v-if="idx != 0" class="flex gap-3">
            <RegistPageButton @click="reset(idx)" :text="$t('Button.reset')"></RegistPageButton>
            <RegistPageButton @click="decrement(idx)" :text="$t('Button.delete')"></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton :text="$t('Button.add')" @click="increment"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" @click="registerFood" :text="$t('Button.register')"></RegistPageButton>
        <RegistPageButton :text="$t('Button.skip')" @click="skip"></RegistPageButton>
      </Row>
    </Card>
  </div>
</template>

<style scoped>
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
