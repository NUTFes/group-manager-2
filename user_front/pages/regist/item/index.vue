<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item"
import { loginCheck } from "@/utils/methods"
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate"
import { itemSchema } from "~~/utils/validate"

const initialData = {
  items: [
    {
      itemNameId: 0,
      itemNum: 0,
    },
  ],
};

const reset = (idx: number) => {
  registerParams[idx].rentalItemId = 0,
  registerParams[idx].num = 0
}

const { meta, isSubmitting } = useForm({
  validationSchema: itemSchema,
  initialValues: initialData,
});

const { fields: itemValidate, push: addValidate, remove: removeValidate } = useFieldArray('items')

const config = useRuntimeConfig();
const router = useRouter();
const itemList = ref<ItemList[]>([]);
const formCount = ref(1)

const state = reactive({
  groupId: 0,
});

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  if (Number(localStorage.getItem("group_category_id")) === 3 ) {
    const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_stage_rentable_items");
      itemData.data.forEach((item) => {
        itemList.value.push(item);
      });
  } else {
    const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_shop_rentable_items");
      itemData.data.forEach((item) => {
        itemList.value.push(item);
      });
  }
  state.groupId= Number(localStorage.getItem("group_id"));
});

const registerParams = [
  reactive({
    num: 0,
    rentalItemId: 0,
  }),
]

const increment = () => {
  formCount.value++
  registerParams.push(
    reactive({
      num: 0,
      rentalItemId: 0,
    })
  )
  addValidate({ itemNameId: 0, itemNum: 0 })
}

const decrement = (idx: number) => {
  formCount.value--
  removeValidate(idx)
}

const registerItem = async () => {
  for (let i = 0; i < formCount.value; i++) {
    await $fetch(config.APIURL + "/rental_orders", {
      method: "POST",
      params: {
        group_id: state.groupId,
        num: registerParams[i].num,
        rental_item_id: registerParams[i].rentalItemId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  router.push("/regist/power");
};

const skip = () =>{
  router.push("/regist/power");
}
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">Registration of places</h1>
      <Card border="none" align="end" gap="20px">
        <div v-for="(field, idx) in itemValidate" :key="field.key">
          <div class="flex">
            <p class="label">Necessary items</p>
            <Field
              :id="`itemNameId${idx}`"
              :name="`items[${idx}].itemNameId`"
              as="select"
              style="width:180px;"
              class="form"
              v-model="registerParams[idx].rentalItemId"
            >
              <option value="" selected disabled></option>
              <option v-for = "item in itemList" :key="item.id" :value="item.id">{{item.name}}</option>
            </Field>
          </div>
          <ErrorMessage class="text-rose-600" :name="`items[${idx}].itemNameId`" />

          <div class="flex">
            <p class="label">number of pieces required</p>
            <Field
              :id="`itemNum${idx}`"
              :name="`items[${idx}].itemNum`"
              class="form"
              v-model="registerParams[idx].num"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`items[${idx}].itemNum`" />

          <div v-if="idx == 0">
            <RegistPageButton text="reset" @click="reset(idx)"></RegistPageButton>
          </div>

          <div v-if="idx != 0" class="flex gap-3">
            <RegistPageButton text="reset" @click="reset(idx)"></RegistPageButton>
            <RegistPageButton text="remove" @click="decrement(idx) "></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton @click="increment" text="Add"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" @click="registerItem" text="登録"></RegistPageButton>
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
