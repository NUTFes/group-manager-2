<script lang="ts" setup>
import { Purchase } from "@/types";
import { FoodProduct, FesDate, Date } from "~~/types/mypage/registAlarm";
import { loginCheck } from "@/utils/methods";

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
};

const decrement = () => {
  formCount.value--;
  registerParams.pop();
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
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of purchase</h1>
        <Card border="none" align="end" gap="20px">
          <div v-for="(count, i) in formCount" class="flex flex-col gap-2">
            <p class="text-2xl border-b-2">Purchase {{ i + 1 }}</p>
            <div class="flex">
              <p class="label">Target food</p>
              <select
                style="width: 180px"
                v-model="registerParams[i].food_product_id"
              >
                <option value="" disabled selected>please select</option>
                <option
                  v-for="(list, i) in foodProducts"
                  :key="i"
                  :value="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
            </div>
            <div class="flex">
              <p class="label">Place of purchase</p>
              <select style="width: 180px" v-model="registerParams[i].shop_id">
                <option value="" disabled selected>please select</option>
                <option
                  v-for="(list, i) in purchases"
                  :key="i"
                  :value="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
            </div>
            <div class="flex">
              <p class="label">purchased item</p>
              <input class="form" v-model="registerParams[i].items" />
            </div>
            <div class="flex">
              <p class="label">Is it row food?</p>
              <select style="width: 180px" v-model="registerParams[i].isFresh">
                <option value="" disabled selected>please select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div class="flex">
              <p class="label">Fes Date</p>
              <select
                style="width: 180px"
                v-model="registerParams[i].fes_date_id"
              >
                <option value="" disabled selected>please select</option>
                <option v-for="(list, i) in fesDates" :key="i" :value="list.id">
                  {{ list.date }}
                </option>
              </select>
            </div>
            <div v-if="i != 0">
              <RegistPageButton
                text="remove form"
                @click="decrement"
              ></RegistPageButton>
            </div>
          </div>
        </Card>
        <Row>
          <RegistPageButton @click="resetPurchase" text="reset" ></RegistPageButton>
          <RegistPageButton @click="increment" text="Add form" ></RegistPageButton>
          <RegistPageButton @click="registerPurchase" text="Regist" />
          <RegistPageButton text="skip" @click="skip"></RegistPageButton>
        </Row>
        <p class="text-red-500">{{ errorMessage }}</p>
      </Card>
    </div>
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
