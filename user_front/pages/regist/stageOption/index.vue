<script lang="ts" setup>
const config = useRuntimeConfig();
const router = useRouter();

const registerParams = reactive({
  isItem: "",
  isMusic: "",
  isCamera: "",
  isNoise: "",
  stageContent: "",
  groupId: 0,
})

onMounted(async() => {
  registerParams.groupId = Number(localStorage.getItem("group_id"));
})

const registerStageOption = async () => {
  await $fetch(config.APIURL + "/stage_common_options", {
    method: "POST",
    params: {
      group_id: registerParams.groupId,
      own_equipment: registerParams.isItem,
      bgm: registerParams.isMusic,
      camera_permission: registerParams.isCamera,
      loud_sound: registerParams.isNoise,
      stage_content: registerParams.stageContent,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  router.push("/regist/item");
}

const skip = () =>{
  router.push("/regist/item");
}

</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of additional option</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">Bringing in private property</p>
            <select style="width:180px;" v-model="registerParams.isItem">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether speakers are used or not</p>
            <select style="width:180px;" v-model="registerParams.isMusic">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether loud-sound are used or not</p>
            <select style="width:180px;" v-model="registerParams.isNoise">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether camera are used or not</p>
            <select style="width:180px;" v-model="registerParams.isCamera">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Content Details</p>
            <input class="form" v-model="registerParams.stageContent">
          </div>
        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="register" @click="registerStageOption"></RegistPageButton>
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
