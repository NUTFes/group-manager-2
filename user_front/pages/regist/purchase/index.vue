<script lang="ts" setup>
import { Purchase } from "@/types";
import { FoodProduct, FesDate, Date } from "~~/types/mypage/registAlarm";
import { loginCheck } from "@/utils/methods";
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate";
import { purchaseSchema } from "~~/utils/validate";

const initialData = {
  purchaseList: [
    {
      foodProductId: "",
      shopId: "",
      items: "",
      isFresh: "",
      fesDateId: "",
    },
  ],
};

const { meta, isSubmitting } = useForm({
  validationSchema: purchaseSchema,
  initialValues: initialData,
});

const { fields: purchaseValidate, push: addValidate, remove: removeValidate } = useFieldArray(
  "purchaseList"
);

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);
const errorMessage = ref("");

const purchases = ref<Purchase[]>([]);
const foodProducts = ref<FoodProduct[]>([]);
const fesDates = ref<Date[]>([]);
onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck()
  const purchaseData = await $fetch<{ data: Purchase[] }>(
    config.APIURL + "/shops"
  );
  purchases.value = purchaseData.data;

  const foodProductData = await $fetch<{ data: FoodProduct[] }>(
    config.APIURL + "/food_products"
  );
  foodProducts.value = foodProductData.data;

  const fesDateData = await $fetch<{ data: FesDate[] }>(
    config.APIURL + "/fes_dates"
  );
  fesDateData.data.forEach((fesDate) => {
    fesDates.value.push(fesDate.fes_date);
  });
});

const registerParams = [
  reactive({
    food_product_id: "",
    shop_id: "",
    items: "",
    isFresh: "",
    fes_date_id: "",
  }),
];

const increment = () => {
  formCount.value++;
  registerParams.push(
    reactive({
      food_product_id: "",
      shop_id: "",
      items: "",
      isFresh: "",
      fes_date_id: "",
    })
  );
  addValidate({
    foodProductId: "",
    shopId: "",
    items: "",
    isFresh: "",
    fesDateId: "",
  });
};

const decrement = (idx: number) => {
  formCount.value--;
  removeValidate(idx);
};

const resetPurchase = () => {
  formCount.value = 1;
  registerParams.splice(0, registerParams.length);
  registerParams.push(
    reactive({
      food_product_id: "",
      shop_id: "",
      items: "",
      isFresh: "",
      fes_date_id: "",
    })
  );
};

const registerPurchase = async () => {
  for (let i = 0; i < formCount.value; i++) {
    if (
      registerParams[i].food_product_id === "" ||
      registerParams[i].shop_id === "" ||
      registerParams[i].items === "" ||
      registerParams[i].isFresh === "" ||
      registerParams[i].fes_date_id === ""
    ) {
      errorMessage.value = "Please fill in all the blanks";
      return;
    }

    await $fetch(config.APIURL + "/purchase_lists", {
      method: "POST",
      params: {
        food_product_id: registerParams[i].food_product_id,
        shop_id: registerParams[i].shop_id,
        items: registerParams[i].items,
        is_fresh: registerParams[i].isFresh,
        fes_date_id: registerParams[i].fes_date_id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      errorMessage.value = "Failed to register (error: " + error + ")";
    });
  }
  router.push("/mypage");
};

const skip = () =>{
  router.push("/mypage");
}
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">Registration of purchase</h1>
      <Card border="none" align="end">
        <div v-for="(field, idx) in purchaseValidate" :key="field.key" class="flex flex-col gap-2">
          <p class="text-2xl border-b-2">Purchase {{ idx + 1 }}</p>
          <div class="flex">
            <p class="label">Target food</p>
            <Field
              :id="`foodName[${idx}]`"
              :name="`purchaseList[${idx}].foodProductId`"
              as="select"
              style="width: 180px"
              class="form"
              v-model="registerParams[idx].food_product_id"
            >
              <option value="" disabled selected>please select</option>
              <option
                v-for="(list, i) in foodProducts"
                :key="i"
                :value="list.id"
              >
                {{ list.name }}
              </option>
            </Field>
          </div>
          <ErrorMessage class="text-rose-600" :name="`purchaseList[${idx}].foodProductId`" />

          <div class="flex">
            <p class="label">Place of purchase</p>
            <Field
              :id="`shopId${idx}`"
              :name="`purchaseList[${idx}].shopId`"
              as="select"
              style="width: 180px"
              class="form"
              v-model="registerParams[idx].shop_id"
            >
              <option value="" disabled selected>please select</option>
              <option
                v-for="(list, i) in purchases"
                :key="i"
                :value="list.id"
              >
                {{ list.name }}
              </option>
            </Field>
          </div>
          <ErrorMessage class="text-rose-600" :name="`purchaseList[${idx}].shopId`" />

          <div class="flex">
            <p class="label">purchased item</p>
            <Field
              :id="`item${idx}`"
              :name="`purchaseList[${idx}].item`"
              class="form"
              v-model="registerParams[idx].items"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`purchaseList[${idx}].item`" />

          <div class="flex">
            <p class="label">Is it row food?</p>
            <Field
              :id="`isFresh${idx}`"
              :name="`purchaseList[${idx}].isFresh`"
              as="select"
              style="width: 180px"
              class="form"
              v-model="registerParams[idx].isFresh"
            >
              <option value="" disabled selected>please select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Field>
          </div>
          <ErrorMessage class="text-rose-600" :name="`purchaseList[${idx}].isFresh`" />

          <div class="flex">
            <p class="label">Fes Date</p>
            <Field
              :id="`fesDateId${idx}`"
              :name="`purchaseList[${idx}].fesDateId`"
              as="select"
              style="width: 180px"
              class="form"
              v-model="registerParams[idx].fes_date_id"
            >
              <option value="" disabled selected>please select</option>
              <option v-for="(list, i) in fesDates" :key="i" :value="list.id">
                {{ list.date }}
              </option>
            </Field>
          </div>
          <ErrorMessage class="text-rose-600" :name="`purchaseList[${idx}].fesDateId`" />

          <div v-if="idx != 0">
            <RegistPageButton
              text="remove"
              @click="decrement(idx)"
            ></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton @click="resetPurchase" text="reset" ></RegistPageButton>
        <RegistPageButton @click="increment" text="Add" ></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" @click="registerPurchase" text="Regist" />
        <RegistPageButton text="skip" @click="skip"></RegistPageButton>
      </Row>
      <p class="text-red-500">{{ errorMessage }}</p>
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
