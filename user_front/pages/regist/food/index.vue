<script lang="ts" setup>

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);

const state = reactive({
  groupId: 0,
});

onMounted(async () =>{
  state.groupId = Number(localStorage.getItem("group_id"));
})

const registerParams = [reactive({
  dishName: "",
  isCooking: false,
  numFirstDay: 0,
  numSecondDay: 0,
})];

const registerFood = async () => {
  for (let i =0; i < formCount.value; i++){
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
  router.push("/mypage");
  }
};

const increment = () => {
  formCount.value++;
  registerParams.push(reactive({
    dishName: "",
    isCooking: false,
    numFirstDay: 0,
    numSecondDay: 0,
  }));
};

const decrement = () => {
  formCount.value--;
  registerParams.pop();
};

</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of foodstuffs</h1>
        <Card border="none" align="end" gap="20px">

        <div v-for="count , i in formCount">
          <div class="flex">
            <p class="label">name</p>
            <input class="form" v-model="registerParams[i].dishName">
          </div>

          <div class="flex">
            <p class="label">Do you cook?</p>
            <select style="width:180px;" v-model="registerParams[i].isCooking">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">number of products on the first day</p>
            <input class="form" v-model="registerParams[i].numFirstDay">
          </div>

          <div class="flex">
            <p class="label">number of products on the second day</p>
            <input class="form" v-model="registerParams[i].numSecondDay">
          </div>
          <div v-if="i != 0">
            <RegistPageButton @click="decrement" text="削除"></RegistPageButton>
          </div>
        </div>

        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="Add form" @click="increment"></RegistPageButton>
          <RegistPageButton @click="registerFood" text="登録"></RegistPageButton>
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
