<script lang="ts" setup>
import {loginCheck} from '@/utils/methods'

// ログインしていない場合は/welcomeに遷移させる
loginCheck()

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);

const state = reactive({
  groupId: 0,
});

onMounted(async () => {
  
  state.groupId = Number(localStorage.getItem("group_id"));
})

const registerParams = [reactive({
  employeeName: "",
  studentId: "",
  stooltest: 0,
})];

const increment = () => {
  formCount.value++
  registerParams.push(reactive({
    employeeName: "",
    studentId: "",
    stooltest: 0,
  }))
}

const decrement = () => {
  formCount.value--
  registerParams.pop()
}

const registerEmployee = async () => {
  for (let i = 0; i < formCount.value; i++) {
    await $fetch(config.APIURL + "/employees", {
      method: "POST",
      params: {
        group_id: state.groupId,
        name: registerParams[i].employeeName,
        student_id: registerParams[i].studentId,
        stool_test_id: 1,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  router.push("/regist/food");
};

const skip = () =>{
  router.push("/regist/food");
}

</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of employees</h1>
        <Card border="none" align="end" gap="20px">

          <div v-for="count, i in formCount">
            <div class="flex">
              <p class="label">name</p>
              <input class="form" v-model="registerParams[i].employeeName">
            </div>

            <div class="flex">
              <p class="label">student id</p>
              <input class="form" v-model="registerParams[i].studentId">
            </div>

            <div v-if="i != 0">
              <RegistPageButton text="remove form" @click="decrement"></RegistPageButton>
            </div>
          </div>

        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="register" @click="registerEmployee"></RegistPageButton>
          <RegistPageButton text="Add form" @click="increment"></RegistPageButton>
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
