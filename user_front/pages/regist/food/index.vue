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
      dishName: "",
      isCooking: false,
      numFirstDay: 0,
      numSecondDay: 0,
    },
  ],
};

const reset = (idx: number) => {
  (registerParams[idx].dishName = ""),
    (registerParams[idx].isCooking = false),
    (registerParams[idx].numFirstDay = 0),
    (registerParams[idx].numSecondDay = 0);
};

const { meta, isSubmitting } = useForm({
  validationSchema: foodSchema,
  initialValues: initialData,
});

const {
  fields: foodValidate,
  push: addValidate,
  remove: removeValidate,
} = useFieldArray("foods");

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));
  state.groupCategoryId = Number(localStorage.getItem("group_category_id"));
});

const registerParams = [
  reactive({
    dishName: "",
    isCooking: false,
    numFirstDay: 0,
    numSecondDay: 0,
  }),
];

const registerFood = async () => {
  for (let i = 0; i < formCount.value; i++) {
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
  if (state.groupCategoryId === 1) {
    router.push("/regist/purchase");
  } else {
    router.push("/mypage");
  }
};
const skip = () => {
  if (state.groupCategoryId === 1) {
    router.push("/regist/purchase");
  } else {
    router.push("/mypage");
  }
};

const back = () => {
  router.push("/regist/employees");
};

const increment = () => {
  formCount.value++;
  registerParams.push(
    reactive({
      dishName: "",
      isCooking: false,
      numFirstDay: 0,
      numSecondDay: 0,
    })
  );
  addValidate({
    dishName: "",
    isCooking: false,
    numFirstDay: 0,
    numSecondDay: 0,
  });
};

const decrement = (idx: number) => {
  formCount.value--;
  removeValidate(idx);
};
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">
        {{ $t("Product.registProduct") }}
      </h1>
      <Card border="none" align="center">
        <div
          v-for="(field, idx) in foodValidate"
          :key="field.key"
          class="border rounded-md p-2 flex flex-col gap-4 items-center"
        >
          <div class="grid grid-cols-2 gap-y-2">
            <p class="label">
              {{ $t("Product.name") }}
            </p>
            <div class="flex flex-col">
              <Field
                :id="`name${idx}`"
                :name="`foods[${idx}].dishName`"
                class="form"
                v-model="registerParams[idx].dishName"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`foods[${idx}].dishName`"
              />
            </div>
            <p v-if="state.groupCategoryId === 1" class="label">
              {{ $t("Product.cook") }}
            </p>
            <div v-if="state.groupCategoryId === 1" class="flex flex-col">
              <select
                style="width: 180px"
                v-model="registerParams[idx].isCooking"
              >
                <option value="" selected disabled></option>
                <option value="true">{{ $t("Product.yes") }}</option>
                <option value="false">{{ $t("Product.no") }}</option>
              </select>
            </div>
            <p class="label">{{ $t("Product.numberFirstDay") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`numFirstDay${idx}`"
                :name="`foods[${idx}].numFirstDay`"
                class="form"
                v-model="registerParams[idx].numFirstDay"
                type="number"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`foods[${idx}].numFirstDay`"
              />
            </div>
            <p class="label">{{ $t("Product.numberSecondDay") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`numSecondDay${idx}`"
                :name="`foods[${idx}].numSecondDay`"
                class="form"
                v-model="registerParams[idx].numSecondDay"
                type="number"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`foods[${idx}].numSecondDay`"
              />
            </div>
          </div>
          <div v-if="idx == 0">
            <RegistPageButton
              @click="reset(idx)"
              :text="$t('Button.reset')"
              variant="danger"
            ></RegistPageButton>
          </div>
          <div v-if="idx != 0" class="flex gap-3">
            <RegistPageButton
              @click="reset(idx)"
              :text="$t('Button.reset')"
              variant="danger"
            ></RegistPageButton>
            <RegistPageButton
              @click="decrement(idx)"
              :text="$t('Button.delete')"
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
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.add')"
          @click="increment"
          variant="success"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          @click="registerFood"
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
