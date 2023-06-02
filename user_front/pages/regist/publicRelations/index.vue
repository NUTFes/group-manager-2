<script lang="ts" setup>
import { getDownloadURL, getStorage, ref as fireRef, uploadBytes } from "firebase/storage";
import { loginCheck } from "~~/utils/methods";

const router = useRouter()
const config = useRuntimeConfig();
const state = reactive({
  groupId: 0,
});
const errorMessage = ref("");

const selectedFile = ref<File | null>(null)
const selectedFileUrl = ref<string>("")
const fileName = ref<string>('選択してください\nPlease select')
const pictureName = ref<string>("")
const blurb = ref<string>("")

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck()
  state.groupId = Number(localStorage.getItem("group_id"));
})

const fileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  const file = files![0]
  selectedFile.value = file
  selectedFileUrl.value = URL.createObjectURL(file)
  fileName.value = file.name
}

const storage = getStorage();
const storageRef = fireRef(storage, fileName.value);

const registImageURL = () =>{
  if (blurb.value.length === 0) {
    alert('PR文を入力してください\nPlease enter your PR statement')
    return
  }

  // 画像がない場合はalertを出す
  if (!selectedFile.value) {
    alert('画像を選択してください\nPlease select an image')
    return
  }

  selectedFile.value &&
  uploadBytes(storageRef, selectedFile.value).then((snapshot) => {
    pictureName.value = snapshot.ref.name
    getDownloadURL(fireRef(storage, pictureName.value))
    .then((url) => {
        const postUrl =
        "/public_relations?group_id=" +
        state.groupId;

        useFetch(config.APIURL + postUrl,{
          method: "POST",
          params: {
            picture_name: fileName.value,
            picture_path: url,
            blurb: blurb.value,
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
    })
    .then(
    (response) =>{
      router.push("/mypage");
    })
  })
}

const skip = () => {
  router.push("/mypage");
};

const back = () => {
  router.push("/regist/announcement");
};

const isBlurbOver = computed(() => {
  return blurb.value.length > 40
})
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">{{ $t("PR.regitstPR") }}</h1>
      <Card border="none" align="center">
        <div class="border rounded-md p-2 flex flex-col gap-4 items-center">
          <div class="grid grid-cols-2 gap-y-2">
            <p class="label">{{ $t("PR.text") }}</p>
            <div class="flex flex-col">
              <textarea class="form" v-model="blurb"></textarea>
              <p v-if="isBlurbOver" class="text-red-500">{{ $t("PR.over") }}</p>
            </div>
            <p class="label">{{ $t("PR.illustration") }}</p>
            <div class="flex flex-col">
              <input class="form" type="file" @change="fileUpload">
            </div>
          </div>
          <div v-if="selectedFileUrl" class="my-4">
            <p class="w-fit mx-auto">選択した画像</p>
            <img :src="selectedFileUrl" class="w-1/2 mx-auto">
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton
          :text="$t('Button.back')"
          @click="back"
          variant="secondary"
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.register')"
          @click="registImageURL"
          :disabled="isBlurbOver"
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.skip')"
          @click="skip"
          variant="secondary"
        ></RegistPageButton>
      </Row>
      <p class="text-red-500">{{ errorMessage }}</p>
    </Card>
  </div>
</template>

<style scoped>
.label {
  @apply flex-none
      text-xl
      pr-5;
}
.form {
  @apply flex-none
    border-solid
    border-2;
}
</style>
