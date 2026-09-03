<script lang="ts" setup>
import axios from "axios";
import { useForm, useField } from "vee-validate";
import { CookingProcessOrder } from "@/types/regist/cookingProcessOrder";
import { Setting } from "~~/types";

const router = useRouter();
const config = useRuntimeConfig();

const currentCookingProcessOrder = ref<CookingProcessOrder>();
const preOpenKitchen = ref<boolean>();
const duringOpenKitchen = ref<boolean>();
const isEditCookingProcess = ref<boolean>();
const tent = ref<Text>();
const groupId = Number(localStorage.getItem("group_id"));
const isEditGroup = ref<boolean>();

const { meta, isSubmitting } = useForm({
  validationSchema: cookingProcessOrderSchema,
});

const {
  handleChange: handleChangepreOpenKitchen,
  errorMessage: preOpenKitchenError,
} = useField("preOpenKitchen");
const {
  handleChange: handleChangeduringOpenKitchen,
  errorMessage: duringOpenKitchenError,
} = useField("duringOpenKitchen");
const { handleChange: handleChangetent, errorMessage: tentError } =
  useField("tent");

onMounted(async() => {
  loginCheck();
  const cookingProcessOrderUrl = config.APIURL + "/cooking_process_orders/";
  axios.get(cookingProcessOrderUrl).then((response) => {
    const cookingProcessOrders: CookingProcessOrder[] = response.data;
    currentCookingProcessOrder.value = cookingProcessOrders.find(
      (cpo) => cpo.group_id === groupId
    );
    preOpenKitchen.value = currentCookingProcessOrder.value?.pre_open_kitchen;
    duringOpenKitchen.value =
      currentCookingProcessOrder.value?.during_open_kitchen;
    tent.value = currentCookingProcessOrder.value?.tent;
    handleChangepreOpenKitchen(
      currentCookingProcessOrder.value?.pre_open_kitchen
    );
    handleChangeduringOpenKitchen(
      currentCookingProcessOrder.value?.during_open_kitchen
    );
    handleChangetent(currentCookingProcessOrder.value?.tent);
  });

  const setting =
    (await $fetch<Setting>(config.APIURL + "/user_page_settings")) || null;
  isEditCookingProcess.value = setting.data[0].is_edit_cooking_process;

  const settingUrl = config.APIURL + "/user_page_settings";
  axios
    .get(settingUrl, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then((response) => {
      isEditGroup.value = response.data.data[0].is_edit_group;
    });
});

const register = () => {
  isSubmitting.value = true;

  if (currentCookingProcessOrder.value) {
    const cookingProcessOrderUrl =
      config.APIURL +
      "/cooking_process_orders/" +
      currentCookingProcessOrder.value?.id;
    axios
      .put(cookingProcessOrderUrl, {
        group_id: groupId,
        pre_open_kitchen: preOpenKitchen.value,
        during_open_kitchen: duringOpenKitchen.value,
        tent: tent.value,
      })
      .then(() => {
        alert("登録できました\nRegistration Success");
        router.push("/mypage");
      })
      .catch(() => {
        alert("登録できませんでした\nRegistration Failure");
      });
  } else {
    const cookingProcessOrderUrl = config.APIURL + "/cooking_process_orders/";
    axios
      .post(cookingProcessOrderUrl, {
        group_id: groupId,
        pre_open_kitchen: preOpenKitchen.value,
        during_open_kitchen: duringOpenKitchen.value,
        tent: tent.value,
      })
      .then(() => {
        alert("登録できました\nRegistration Success");
        router.push("/mypage");
      })
      .catch(() => {
        alert("登録できませんでした\nRegistration Failure");
      });
  }
};

const buttonDisabled = computed(() => {
  return !!!tent.value;
});
</script>

<template>
  <div class="w-2/3 mx-auto">
    <div class="w-full text-2xl my-8 font-bold bg-[#eceff1] p-2 rounded-md">
      {{ $t("Cook.cookTitle") }}
    </div>
    <div v-if="!isEditCookingProcess" class="text-3xl text-red-600 font-bold my-5">
      編集は締め切られました
    </div>
    <div class="border p-4 my-4 rounded-md flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.preOpenKitchen") }}
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="preOpenKitchenYes"
            value="true"
            v-model="preOpenKitchen"
            @change="handleChangepreOpenKitchen"
            class="form-radio h-4 w-4 text-blue-600"
          />
          <label for="preOpenKitchenYes" class="ml-2 text-xl">使用する</label>
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="preOpenKitchenNo"
            value="false"
            v-model="preOpenKitchen"
            @change="handleChangepreOpenKitchen"
            class="form-radio h-4 w-4 text-blue-600"
          />
          <label for="preOpenKitchenNo" class="ml-2 text-xl">使用しない</label>
        </div>
        <p class="text-red-500 text-sm" v-if="preOpenKitchenError">
          {{ preOpenKitchenError }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.duringOpenKitchen") }}
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="duringOpenKitchenYes"
            value="true"
            v-model="duringOpenKitchen"
            @change="handleChangeduringOpenKitchen"
            class="form-radio h-4 w-4 text-blue-600"
          />
          <label for="duringOpenKitchenYes" class="ml-2 text-xl"
            >使用する</label
          >
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="duringOpenKitchenNo"
            value="false"
            v-model="duringOpenKitchen"
            @change="handleChangeduringOpenKitchen"
            class="form-radio h-4 w-4 text-blue-600"
          />
          <label for="duringOpenKitchenNo" class="ml-2 text-xl"
            >使用しない</label
          >
        </div>
        <p class="text-red-500 text-sm" v-if="duringOpenKitchenError">
          {{ duringOpenKitchenError }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.tent") }}
        </div>
        <textarea
          class="rounded-md border border-black p-2 text-xl"
          id="activity"
          v-model="tent"
          @change="handleChangetent"
        ></textarea>
        <p class="text-red-500 text-sm" v-if="tentError">
          {{ tentError }}
        </p>
      </div>
    </div>
    <div class="regist-button">
      <RegistPageButton
        v-if="isEditCookingProcess"
        @click="register"
        :disabled="buttonDisabled || !meta.valid || isSubmitting"
        :text="$t('Button.register')"
      ></RegistPageButton>
    </div>
  </div>
</template>
<style scoped>
.regist-button {
  @apply text-right
    mb-8;
}
</style>
