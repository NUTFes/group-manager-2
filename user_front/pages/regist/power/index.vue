<script lang="ts" setup>

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1)

let registerParams = [
  reactive({
    prodcutName: "",
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
  state.groupId = Number(localStorage.getItem("group_id"));
});

const increment = () => {
  formCount.value++
  registerParams.push(
    reactive({
      prodcutName: "",
      maxPower: 0,
      manufacturer: "",
      model: "",
      url: "",
    })
  )
}

const decrement = () => {
  formCount.value--
  registerParams.pop()
}

const registerPower = async () => {
  for (let i = 0; i < formCount.value; i++) {
    await $fetch(config.APIURL + "/power_orders", {
      method: "POST",
      params: {
        group_id: state.groupId,
        item: registerParams[i].prodcutName,
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
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of organization</h1>
        <Card border="none" align="end" gap="20px">
        <div v-for="count, i in formCount">
          <div class="flex">
            <p class="label">product name</p>
            <input class="form" v-model="registerParams[i].prodcutName">
          </div>

          <div class="flex">
            <p class="label">maximum rated power</p>
            <input class="form" v-model="registerParams[i].maxPower">
          </div>

          <div class="flex">
            <p class="label">maker</p>
            <input class="form" v-model="registerParams[i].manufacturer">
          </div>

          <div class="flex">
            <p class="label">model</p>
            <input class="form" v-model="registerParams[i].model">
          </div>

          <div class="flex">
            <p class="label">product URL</p>
            <input class="form" v-model="registerParams[i].url">
          </div>
          <div v-if="i != 0">
            <RegistPageButton text="remove form" @click="decrement"></RegistPageButton>
          </div>
        </div>
        </Card>
        <Row>
          <RegistPageButton text="add form" @click="increment"></RegistPageButton>
          <RegistPageButton text="register" @click="registerPower"></RegistPageButton>
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
