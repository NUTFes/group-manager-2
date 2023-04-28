<script lang="ts" setup>
import { loginCheck } from "@/utils/methods";
import { useForm, useField } from "vee-validate";
import { stageOptionSchema } from "~~/utils/validate";

const { meta, isSubmitting } = useForm({
  validationSchema: stageOptionSchema,
});

const { handleChange: handleItem, errorMessage: itemError } = useField('isItem')
const { handleChange: handleMusic, errorMessage: musicError } = useField('isMusic')
const { handleChange: handleCamera, errorMessage: cameraError } = useField('isCamera')
const { handleChange: handleNoise, errorMessage: noiseError } = useField('isNoise')
const { handleChange: handleContent, errorMessage: contentError } = useField('stageContent')

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

const reset = () => {
  registerParams.isItem = "",
  registerParams.isMusic = "",
  registerParams.isCamera = "",
  registerParams.isNoise = "",
  registerParams.stageContent = "",
  registerParams.groupId = 0
}

onMounted(async() => {
  loginCheck(); // ログインしていない場合は/welcomeに遷移させる
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
        <Card border="none" align="end">
          <div class="flex">
            <p class="label">Bringing in private property</p>
            <select style="width:180px;" v-model="registerParams.isItem" @change="handleItem">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div>{{ itemError }}</div>

          <div class="flex">
            <p class="label">Whether speakers are used or not</p>
            <select style="width:180px;" v-model="registerParams.isMusic" @change="handleMusic">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div>{{ musicError }}</div>

          <div class="flex">
            <p class="label">Whether loud-sound are used or not</p>
            <select style="width:180px;" v-model="registerParams.isNoise" @change="handleNoise">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div>{{ noiseError }}</div>

          <div class="flex">
            <p class="label">Whether camera are used or not</p>
            <select style="width:180px;" v-model="registerParams.isCamera" @change="handleCamera">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div>{{ cameraError }}</div>

          <div class="flex">
            <p class="label">Content Details</p>
            <input class="form" v-model="registerParams.stageContent" @change="handleContent">
          </div>
          <div class="text-rose-600">{{ contentError }}</div>

        </Card>
        <Row>
          <RegistPageButton text="reset" @click="reset"></RegistPageButton>
          <RegistPageButton :disabled="!meta.valid || isSubmitting" text="register" @click="registerStageOption"></RegistPageButton>
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
</style>
