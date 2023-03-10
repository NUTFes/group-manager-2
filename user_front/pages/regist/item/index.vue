<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item"

const config = useRuntimeConfig();
const router = useRouter();
const itemList = ref<ItemList[]>([]);
const formCount = ref(1)

const state = reactive({
  groupId: 0,
});

onMounted(async () => {
  const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_stage_rentable_items");
    itemData.data.forEach((item) => {
      itemList.value.push(item);
    });
  state.groupId= Number(localStorage.getItem("group_id"));
});


const registerParams = [
  reactive({
    num: 0,
    rentalItemId: 0,
  }),]

const increment = () => {
  formCount.value++
  registerParams.push(
    reactive({
      num: 0,
      rentalItemId: 0,
    })
  )
}

const decrement = () => {
  formCount.value--
  registerParams.pop()
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
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of places</h1>
        <Card border="none" align="end" gap="20px">

        <div v-for="count, i in formCount">
          <div class="flex">
              <p class="label">Necessary items</p>
            <select style="width:180px;" v-model="registerParams[i].rentalItemId">
              <option value="" selected disabled></option>
              <option v-for = "item in itemList" :key="item.id" :value="item.id">{{item.name}}</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">number of pieces required</p>
            <input class="form" v-model="registerParams[i].num">
          </div>

          <div v-if="i != 0">
            <RegistPageButton text="remove form" @click="decrement"></RegistPageButton>
          </div>
        </div>

        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton @click="increment" text="Add form"></RegistPageButton>
          <RegistPageButton @click="registerItem" text="登録"></RegistPageButton>
          <RegistPageButton text="skip" @click="skip"></RegistPageButton>
        </Row>
      </Card>
    </div>
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
</style>>
