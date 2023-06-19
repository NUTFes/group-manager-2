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

const reset = (idx: number) => {
  (registerParams[idx].food_product_id = ""),
    (registerParams[idx].shop_id = ""),
    (registerParams[idx].items = ""),
    (registerParams[idx].isFresh = ""),
    (registerParams[idx].fes_date_id = "");
};

const { meta, isSubmitting } = useForm({
  validationSchema: purchaseSchema,
  initialValues: initialData,
});

const {
  fields: purchaseValidate,
  push: addValidate,
  remove: removeValidate,
} = useFieldArray("purchaseList");

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);
const errorMessage = ref("");

const purchases = ref<Purchase[]>([]);
const foodProducts = ref<FoodProduct[]>([]);
const fesDates = ref<Date[]>([]);
onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
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
  router.push("/regist/publicRelations");
};

const skip = () => {
  router.push("/regist/publicRelations");
};

const back = () => {
  router.push("/regist/food");
};
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">{{ $t("Purchase.registPurchase") }}</h1>
      <Card border="none" align="center">
        <div
          v-for="(field, idx) in purchaseValidate"
          :key="field.key"
          class="border rounded-md p-2 flex flex-col gap-4 items-center"
        >
          <p class="text-2xl border-b-2">
            {{ $t("Purchase.purchase") }} {{ idx + 1 }}
          </p>
          <div class="grid grid-cols-2 gap-y-2">
            <p class="label">{{ $t("Purchase.target") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`foodName[${idx}]`"
                :name="`purchaseList[${idx}].foodProductId`"
                as="select"
                style="width: 180px"
                class="form"
                v-model="registerParams[idx].food_product_id"
              >
                <option value="" disabled selected>
                  {{ $t("Purchase.select") }}
                </option>
                <option
                  v-for="(list, i) in foodProducts"
                  :key="i"
                  :value="list.id"
                >
                  {{ list.name }}
                </option>
              </Field>
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`purchaseList[${idx}].foodProductId`"
              />
            </div>
            <p class="label">{{ $t("Purchase.place") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`shopId${idx}`"
                :name="`purchaseList[${idx}].shopId`"
                as="select"
                style="width: 180px"
                class="form"
                v-model="registerParams[idx].shop_id"
              >
                <option value="" disabled selected>
                  {{ $t("Purchase.select") }}
                </option>
                <option
                  v-for="(list, i) in purchases"
                  :key="i"
                  :value="list.id"
                >
                  {{ list.name }}
                </option>
              </Field>
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`purchaseList[${idx}].shopId`"
              />
            </div>
            <p class="label">{{ $t("Purchase.purchase") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`item${idx}`"
                :name="`purchaseList[${idx}].item`"
                class="form"
                v-model="registerParams[idx].items"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`purchaseList[${idx}].item`"
              />
            </div>
            <p class="label">{{ $t("Purchase.rowFood") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`isFresh${idx}`"
                :name="`purchaseList[${idx}].isFresh`"
                as="select"
                style="width: 180px"
                class="form"
                v-model="registerParams[idx].isFresh"
              >
                <option value="" disabled selected>
                  {{ $t("Purchase.select") }}
                </option>
                <option value="true">{{ $t("Purchase.yes") }}</option>
                <option value="false">{{ $t("Purchase.no") }}</option>
              </Field>
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`purchaseList[${idx}].isFresh`"
              />
            </div>
            <p class="label">{{ $t("Purchase.date") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`fesDateId${idx}`"
                :name="`purchaseList[${idx}].fesDateId`"
                as="select"
                style="width: 180px"
                class="form"
                v-model="registerParams[idx].fes_date_id"
              >
                <option value="" disabled selected>
                  {{ $t("Purchase.select") }}
                </option>
                <option v-for="(list, i) in fesDates" :key="i" :value="list.id">
                  {{ list.date }}
                </option>
              </Field>
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`purchaseList[${idx}].fesDateId`"
              />
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
        ></RegistPageButton>
        <RegistPageButton
          @click="increment"
          :text="$t('Button.add')"
          variant="success"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          @click="registerPurchase"
          :text="$t('Button.register')"
        />
        <RegistPageButton
          :text="$t('Button.skip')"
          @click="skip"
          variant="secondary"
        ></RegistPageButton>
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
