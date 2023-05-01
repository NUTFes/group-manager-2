<script lang="ts" setup>
import { getDownloadURL, getStorage, ref as fireRef, uploadBytes } from "firebase/storage";
import { loginCheck } from "~~/utils/methods";

const config = useRuntimeConfig();
const state = reactive({
  groupId: 0,
});

const selectedFile = ref<File|null>(null)
const fileName = [{ name: "選択してください" }]
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
  fileName[0].name = file.name
}

const storage = getStorage();
const storageRef = fireRef(storage, fileName[0].name);

const getImageURL = () =>{
  selectedFile.value &&
  uploadBytes(storageRef, selectedFile.value).then((snapshot) => {
    pictureName.value = snapshot.ref.name
    console.log('Uploaded a blob or file!');
  });
  getDownloadURL(fireRef(storage, pictureName.value))
    .then((url) => {
      const postUrl =
      "/public_relations?group_id=" +
      state.groupId;

      useFetch(config.APIURL + postUrl,{
        method: "POST",
        params: {
          picture_name: pictureName.value,
          picture_path: url,
          blurb: blurb.value,
        },
        headers: {
          "Content-Type": "application/json",
        },
    })
  })
}
</script>

<template>
  <NuxtLink to="/mypage" class="ml-4 text-left text-2xl">マイページに戻る</NuxtLink>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl ">パンフレット用PR・会場アナウンス文</h1>
    <Card>
      <div class="flex mb-4 items-center">
        <span class="text-3xl mr-4">PR文(40文字程度)</span>
        <textarea class="border-2" v-model="blurb"></textarea>
      </div>
      <div class="flex my-4 items-center">
        <span class="text-3xl mr-4">イラスト</span>
        <label>
          <input type="file" @change="fileUpload">
        </label>
      </div>
      <RegistPageButton text="登録" @click="getImageURL"></RegistPageButton>
    </Card>
  </div>
</template>
