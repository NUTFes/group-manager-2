<script lang="ts" setup>
const config = useRuntimeConfig();
const router = useRouter();

const registerParams = reactive({
  item: "",
  music: "",
  picture: "",
  noise: "",
  stageContent: "",
  groupId: 0,
})

const registerStageOption = async () => {
  await $fetch(config.APIURL + "/stage_common_options", {
    method: "POST",
    params: {
      group_id: registerParams.groupId,
      item: registerParams.item,
      music: registerParams.music,
      picture: registerParams.picture,
      noise: registerParams.noise,
      stage_content: registerParams.stageContent,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
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
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether speakers are used or not</p>
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether loud-sound are used or not</p>
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether camera are used or not</p>
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Content Details</p>
            <input class="form" />
          </div>
        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="register" @click="registerStageOption"></RegistPageButton>
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
