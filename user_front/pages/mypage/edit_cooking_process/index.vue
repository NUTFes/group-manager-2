<script lang="ts" setup>
import axios from "axios";
import { CookingProcessOrder } from "@/types/regist/cookingProcessOrder";
import { useForm, useField } from "vee-validate";
import { cookingProcessOrderSchema } from "~~/utils/validate";
import { loginCheck } from "@/utils/methods";

const router = useRouter();
const config = useRuntimeConfig();

const currentCookingProcessOrder = ref<CookingProcessOrder>();
const preOpenKitchen = ref<Text>();
const preOpenTent = ref<Text>();
const duringOpenKitchen = ref<Text>();
const duringOpenTent = ref<Text>();
const groupId = Number(localStorage.getItem("group_id"));
const setting = ref("");
const isEditGroup = ref<boolean>();
const isSubmitting = ref<boolean>(false);

const { meta } = useForm({
  validationSchema: cookingProcessOrderSchema,
});

const { handleChange: handleChangepreOpenKitchen, errorMessage: preOpenKitchenError } = useField("preOpenKitchen");
const { handleChange: handleChangepreOpenTent, errorMessage: preOpenTentError } = useField("preOpenKitchen");
const { handleChange: handleChangeduringOpenKitchen, errorMessage: duringOpenKitchenError } = useField("duringOpenKitchen");
const { handleChange: handleChangeduringOpenTent, errorMessage: duringOpenTentError } = useField("duringOpenTent");

onMounted(() => {
  loginCheck();
  const cookingProcessOrderUrl = config.APIURL + "/cooking_process_orders/";
  axios.get(cookingProcessOrderUrl).then((response) => {
    const cookingProcessOrders: CookingProcessOrder[] = response.data;
    currentCookingProcessOrder.value = cookingProcessOrders.find((cpo) => cpo.group_id === groupId);
    preOpenKitchen.value = currentCookingProcessOrder.value?.pre_open_kitchen;
    preOpenTent.value = currentCookingProcessOrder.value?.pre_open_tent;
    duringOpenKitchen.value = currentCookingProcessOrder.value?.during_open_kitchen;
    duringOpenTent.value = currentCookingProcessOrder.value?.during_open_tent;
  });

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
      setting.value = response.data.data[0];
      isEditGroup.value = response.data.data[0].is_edit_group;
    });
});

const register = () => {
  isSubmitting.value = true;

  if(currentCookingProcessOrder.value){
    const cookingProcessOrderUrl = config.APIURL + "/cooking_process_orders/" + currentCookingProcessOrder.value?.id;
    axios
      .put(cookingProcessOrderUrl, {
        group_id: groupId,
        pre_open_kitchen: preOpenKitchen.value,
        pre_open_tent: preOpenTent.value,
        during_open_kitchen: duringOpenKitchen.value,
        during_open_tent: duringOpenTent.value
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
        pre_open_tent: preOpenTent.value,
        during_open_kitchen: duringOpenKitchen.value,
        during_open_tent: duringOpenTent.value
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
  return !!(
    preOpenKitchenError.value||
    preOpenTentError.value||
    duringOpenKitchenError.value||
    duringOpenTentError.value
  );
});
</script>

<template>
  <div class="w-2/3 mx-auto">
    <div class="w-full text-2xl my-8 font-bold bg-[#eceff1] p-2 rounded-md">
      {{ $t("Cook.cookTitle") }}
    </div>
    <div v-if="!isEditGroup" class="text-3xl text-red-600 font-bold my-5">
      編集は締め切られました
    </div>
    <div class="border p-4 my-4 rounded-md flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.preOpenKitchen") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="group"
          type="text"
          v-model="preOpenKitchen"
          @change="handleChangepreOpenKitchen"
        />
        <p class="text-red-500 text-sm" v-if="preOpenKitchenError">
          {{ preOpenKitchenError }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.preOpenTent") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="project"
          type="text"
          v-model="preOpenTent"
          @change="handleChangepreOpenTent"
        />
        <p class="text-red-500 text-sm" v-if="preOpenTentError">
          {{ preOpenTentError }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.duringOpenKitchen") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="group"
          type="text"
          v-model="duringOpenKitchen"
          @change="handleChangeduringOpenKitchen"
        />
        <p class="text-red-500 text-sm" v-if="duringOpenKitchenError">
          {{ duringOpenKitchenError }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.duringOpenTent") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="activity"
          type="text"
          v-model="duringOpenTent"
          @change="handleChangeduringOpenTent"
        />
        <p class="text-red-500 text-sm" v-if="duringOpenTentError">
          {{ duringOpenTentError }}
        </p>
      </div>
    </div>
    <div class="regist-button">
      <RegistPageButton
        v-if="isEditGroup"
        @click="register"
        class="regist-button"
        :disabled="buttonDisabled || isSubmitting"
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