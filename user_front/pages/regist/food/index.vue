<script lang="ts" setup>

const config = useRuntimeConfig();
const router = useRouter();

const registerParams = reactive({
  dishName: "",
  isCooking: false,
  numFirstDay: 0,
  numSecondDay: 0,
  groupId: 0,
});

onMounted(async () =>{
  registerParams.groupId = Number(localStorage.getItem("group_id"));
})

const registerFood = async () => {
  await $fetch(config.APIURL + "/food_products", {
    method: "POST",
    params: {
      group_id: registerParams.groupId,
      name: registerParams.dishName,
      is_cooking: registerParams.isCooking,
      first_day_num: registerParams.numFirstDay,
      second_day_num: registerParams.numSecondDay,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  router.push("/mypage");
};

</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of foodstuffs</h1>
        <Card border="none" align="end" gap="20px">

          <div class="flex">
            <p class="label">name</p>
            <input class="form" v-model="registerParams.dishName">
          </div>

          <div class="flex">
            <p class="label">Do you cook?</p>
            <select style="width:180px;" v-model="registerParams.isCooking">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">number of products on the first day</p>
            <input class="form" v-model="registerParams.numFirstDay">
          </div>

          <div class="flex">
            <p class="label">number of products on the second day</p>
            <input class="form" v-model="registerParams.numSecondDay">
          </div>

        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
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
