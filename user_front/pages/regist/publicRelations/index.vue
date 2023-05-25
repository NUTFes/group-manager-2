<script lang="ts" setup>
import { getDownloadURL, getStorage, ref as fireRef, uploadBytes } from "firebase/storage";
import { loginCheck } from "~~/utils/methods";

const router = useRouter()
const config = useRuntimeConfig();
const state = reactive({
  groupId: 0,
});

const selectedFile = ref<File|null>(null)
const fileName = ref<string>('選択してください')
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
  fileName.value = file.name
}

const storage = getStorage();
const storageRef = fireRef(storage, fileName.value);

const getImageURL = () =>{
  selectedFile.value &&
  uploadBytes(storageRef, selectedFile.value).then((snapshot) => {
    pictureName.value = snapshot.ref.name
    console.log('Uploaded a blob or file!');
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
        alert('登録できました')
        console.log('登録できました ')
        router.push("/mypage");
      },
      (error) => {
        alert('登録できませんでした')
      }
    )
  });
}
</script>

<template>
  <NuxtLink to="/mypage" class="ml-4 text-left text-xl text-pink-500 hover:font-bold">マイページに戻る</NuxtLink>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl ">パンフレット用PR</h1>
    <Card>
      <div class="left text-3xl">
        PR文(40文字程度)
      </div>
      <textarea class="border-2 w-[60%]" v-model="blurb"></textarea>
      <div class="my-4 items-center">
        <label>
          <span class="text-3xl mr-4">イラスト</span>
          <input type="file" @change="fileUpload">
        </label>
      </div>
      <RegistPageButton text="登録" @click="getImageURL"></RegistPageButton>
    </Card>
  </div>
</template>
