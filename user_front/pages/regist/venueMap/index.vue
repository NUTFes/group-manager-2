<script lang="ts" setup>
import { getDownloadURL, getStorage, ref as fireRef, uploadBytes } from "firebase/storage";
import { loginCheck } from "~~/utils/methods";

const config = useRuntimeConfig();
const state = reactive({
  groupId: 0,
});

const selectedFile = ref<File | null>(null)
const fileName = ref<string>("選択してください")
const pictureName = ref<string>("")

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
  fileName.value = file.name
}

const storage = getStorage();
const storageRef = fireRef(storage, fileName.value);

const postImageURL = () => {
  selectedFile.value &&
    uploadBytes(storageRef, selectedFile.value).then((snapshot) => {
      pictureName.value = snapshot.ref.name
    });
  getDownloadURL(fireRef(storage, pictureName.value)).then((url) => {
    const postUrl =
      "/venue_maps?group_id=" +
      state.groupId;

    useFetch(config.APIURL + postUrl, {
      method: "POST",
      params: {
        picture_name: fileName.value,
        picture_path: url,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
  })
}
</script>

<template>
  <NuxtLink to="/mypage" class="ml-4 text-left text-2xl text-pink-500 hover:font-bold">マイページに戻る</NuxtLink>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl ">会場配置図の申請</h1>
    <Card>
      <div class="flex my-4 items-center">
        <span class="text-3xl mr-4">配置図(pdf, png, jpgのみ)</span>
        <label>
          <input type="file" accept=".pdf, .png, .jpg" @change="fileUpload">
        </label>
      </div>
      <RegistPageButton text="登録" @click="postImageURL"></RegistPageButton>
    </Card>
  </div>
</template>
