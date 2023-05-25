<script lang="ts" setup>
import { powerSchema } from "~~/utils/validate";
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate";
import { loginCheck } from "@/utils/methods";

const initialData = {
  powers: [
    {
      productName: "",
      maxPower: 0,
      manufacturer: "",
      model: "",
      url: "",
    },
  ],
};

const reset = (idx: number) => {
  (registerParams[idx].productName = ""),
    (registerParams[idx].maxPower = 0),
    (registerParams[idx].manufacturer = ""),
    (registerParams[idx].model = ""),
    (registerParams[idx].url = "");
};

const { meta, isSubmitting } = useForm({
  validationSchema: powerSchema,
  initialValues: initialData,
});

const {
  fields: powerValidate,
  push: addValidate,
  remove: removeValidate,
} = useFieldArray("powers");

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);

let registerParams = [
  reactive({
    productName: "",
    maxPower: 0,
    manufacturer: "",
    model: "",
    url: "",
  }),
];
const state = reactive({
  groupId: 0,
});

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));
});

const increment = () => {
  formCount.value++;
  registerParams.push(
    reactive({
      productName: "",
      maxPower: 0,
      manufacturer: "",
      model: "",
      url: "",
    })
  );
  addValidate({
    productName: "",
    maxPower: 0,
    manufacturer: "",
    model: "",
    url: "",
  });
};

const decrement = (idx: number) => {
  formCount.value--;
  removeValidate(idx);
};

const maxPowerValidate = () => {
  let totalPower: number = 0;
  for (let i = 0; i < formCount.value; i++) {
    totalPower += Number(registerParams[i].maxPower);
  }
  if (totalPower > 1500) {
    return true;
  } else {
    return false;
  }
};

const registerPower = async () => {
  if (maxPowerValidate()) {
    alert("合計消費電力を1500W以下にしてください");
  } else {
    for (let i = 0; i < formCount.value; i++) {
      await $fetch(config.APIURL + "/power_orders", {
        method: "POST",
        params: {
          group_id: state.groupId,
          item: registerParams[i].productName,
          power: registerParams[i].maxPower,
          manufacturer: registerParams[i].manufacturer,
          model: registerParams[i].model,
          item_url: registerParams[i].url,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    router.push("/regist/announcement");
  }
};

const skip = () => {
  router.push("/regist/announcement");
};

const back = () => {
  router.push("/regist/item");
};
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">{{ $t("Power.registPower") }}</h1>
      <Card border="none" align="center" gap="20px">
        <div
          v-for="(field, idx) in powerValidate"
          :key="field.key"
          class="border rounded-md p-4 flex flex-col items-center gap-4"
        >
          <div class="grid grid-cols-2 gap-y-2">
            <p class="label">{{ $t("Power.name") }}</p>
            <div class="flex flex-col gap-2">
              <Field
                :id="`productName${idx}`"
                :name="`powers[${idx}].productName`"
                type="text"
                class="form"
                v-model="registerParams[idx].productName"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`powers[${idx}].productName`"
              />
            </div>
            <p class="label">{{ $t("Power.maximum") }}</p>
            <div class="flex flex-col">
              <div class="flex gap-2">
                <Field
                  :id="`maxPower${idx}`"
                  :name="`powers[${idx}].maxPower`"
                  type="number"
                  class="form"
                  v-model="registerParams[idx].maxPower"
                />
                <p>[W]</p>
              </div>
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`powers[${idx}].maxPower`"
              />
            </div>
            <p class="label">{{ $t("Power.maker") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`manufacturer${idx}`"
                :name="`powers[${idx}].manufacturer`"
                type="text"
                class="form"
                v-model="registerParams[idx].manufacturer"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`powers[${idx}].manufacturer`"
              />
            </div>
            <p class="label">{{ $t("Power.model") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`model${idx}`"
                :name="`powers[${idx}].model`"
                type="text"
                class="form"
                v-model="registerParams[idx].model"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`powers[${idx}].model`"
              />
            </div>
            <p class="label">{{ $t("Power.URL") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`url${idx}`"
                :name="`powers[${idx}].url`"
                type="url"
                class="form"
                v-model="registerParams[idx].url"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`powers[${idx}].url`"
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
          :text="$t('Button.add')"
          @click="increment"
          variant="success"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.register')"
          @click="registerPower"
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
.error-border {
  @apply border-rose-600;
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
