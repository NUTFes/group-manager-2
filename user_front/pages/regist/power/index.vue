<script lang="ts" setup>
import { powerSchema } from "~~/utils/validate";
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate";
import { loginCheck } from "@/utils/methods";

const initialData = {
  powers: [
    {
      productName: '',
      maxPower: 0,
      manufacturer: '',
      model: '',
      url: '',
    },
  ],
};

const { meta, isSubmitting } = useForm({
  validationSchema: powerSchema,
  initialValues: initialData,
});

const { fields: powerValidate, push: addValidate, remove: removeValidate } = useFieldArray('powers')

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1)

let registerParams = [
  reactive({
    productName: "",
    maxPower: 0,
    manufacturer: "",
    model: "",
    url: "",
  },)
]
const state = reactive({
  groupId: 0,
});

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));
});

const increment = () => {
  formCount.value++
  registerParams.push(
    reactive({
      productName: "",
      maxPower: 0,
      manufacturer: "",
      model: "",
      url: "",
    })
  )
  addValidate({ productName: '', maxPower: 0, manufacturer: '', model: '', url: '' })
}

const decrement = (idx: number) => {
  formCount.value--
  removeValidate(idx)
}

const registerPower = async () => {
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
  router.push("/regist/employees");
};

const skip = () =>{
  router.push("/regist/employees");
}

</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <Card border="none" align="end" gap="20px">
        <div v-for="(field, idx) in powerValidate" :key="field.key">
          <div class="flex">
            <p class="label">product name</p>
            <Field
              :id="`productName${idx}`"
              :name="`powers[${idx}].productName`"
              type="text"
              class="form"
              v-model="registerParams[idx].productName"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`powers[${idx}].productName`" />
          <div class="flex">
            <p class="label">maximum rated power</p>
            <Field
              :id="`maxPower${idx}`"
              :name="`powers[${idx}].maxPower`"
              type="number"
              class="form"
              v-model="registerParams[idx].maxPower"
            />
            <p>[W]</p>
          </div>
          <ErrorMessage class="text-rose-600" :name="`powers[${idx}].maxPower`" />
          <div class="flex">
            <p class="label">maker</p>
            <Field
              :id="`manufacturer${idx}`"
              :name="`powers[${idx}].manufacturer`"
              type="text"
              class="form"
              v-model="registerParams[idx].manufacturer"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`powers[${idx}].manufacturer`" />
          <div class="flex">
            <p class="label">model</p>
            <Field
              :id="`model${idx}`"
              :name="`powers[${idx}].model`"
              type="text"
              class="form"
              v-model="registerParams[idx].model"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`powers[${idx}].model`" />
          <div class="flex">
            <p class="label">product URL</p>
            <Field
              :id="`url${idx}`"
              :name="`powers[${idx}].url`"
              type="url"
              class="form"
              v-model="registerParams[idx].url"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`powers[${idx}].url`" />
          <div v-if="idx != 0">
            <RegistPageButton text="remove" @click="decrement(idx)"></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton text="add" @click="increment"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="register" @click="registerPower"></RegistPageButton>
        <RegistPageButton text="skip" @click="skip"></RegistPageButton>
      </Row>
    </Card>
  </div>
</template>

<style scoped>
  .error-border {
   @apply
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
label {
  display: block;
  margin-top: 20px;
}
</style>
