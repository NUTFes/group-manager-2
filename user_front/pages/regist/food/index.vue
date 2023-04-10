<script lang="ts" setup>
import { loginCheck } from "@/utils/methods";
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate";
import { foodSchema } from "~~/utils/validate";

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);

const state = reactive({
  groupId: 0,
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

const { meta, isSubmitting } = useForm({
  validationSchema: foodSchema,
  initialValues: initialData,
});

const { fields: foodValidate, push: addValidate, remove: removeValidate } = useFieldArray('foods')

onMounted(async () =>{
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));
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
  router.push("/regist/purchase");
  }
};

const skip = () =>{
  router.push("/regist/purchase");
}

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
      <h1 class="text-3xl">Registration of foodstuffs</h1>
      <Card border="none" align="end">
        <div v-for="(field, idx) in foodValidate" :key="field.key">
          <div class="flex">
            <p class="label">name</p>
            <Field
              :id="`name${idx}`"
              :name="`foods[${idx}].dishName`"
              class="form"
              v-model="registerParams[idx].dishName"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`foods[${idx}].dishName`"/>

          <div class="flex">
            <p class="label">Do you cook?</p>
            <select style="width:180px;" v-model="registerParams[idx].isCooking">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">number of products on the first day</p>
            <Field
              :id="`numFirstDay${idx}`"
              :name="`foods[${idx}].numFirstDay`"
              class="form"
              v-model="registerParams[idx].numFirstDay"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`foods[${idx}].numFirstDay`"/>

          <div class="flex">
            <p class="label">number of products on the second day</p>
            <Field
              :id="`numSecondDay${idx}`"
              :name="`foods[${idx}].numSecondDay`"
              class="form"
              v-model="registerParams[idx].numSecondDay"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`foods[${idx}].numSecondDay`"/>

          <div v-if="idx != 0">
            <RegistPageButton @click="decrement(idx)" text="削除"></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton text="reset"></RegistPageButton>
        <RegistPageButton text="Add" @click="increment"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" @click="registerFood" text="登録"></RegistPageButton>
        <RegistPageButton text="skip" @click="skip"></RegistPageButton>
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
