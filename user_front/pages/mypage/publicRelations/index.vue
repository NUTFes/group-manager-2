<script lang="ts" setup>
import {
  getDownloadURL,
  getStorage,
  ref as fireRef,
  uploadBytes,
} from "firebase/storage";
import { loginCheck } from "~~/utils/methods";
import axios from "axios";

interface PublicRelation {
  id: number;
  group_id: number;
  picture_name: string;
  picture_path: string;
  blurb: string;
  created_at: string;
  updated_at: string;
}

const router = useRouter();
const config = useRuntimeConfig();
const state = reactive({
  groupId: 0,
  language: ''
});

const currentPublicRelation = ref<PublicRelation | null>(null);
const selectedFile = ref<File | null>(null);
const selectedFileUrl = ref<string>("");
const fileName = ref<string>("選択してください");
const pictureName = ref<string>("");
const blurb = ref<string>("");
const isSubmitting = ref<boolean>(false);
//const language = ref<string>("");

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.language = localStorage.getItem("local") || "";
  state.groupId = Number(localStorage.getItem("group_id"));

  const getPublicRelationUrl = "/public_relations";
  axios
    .get(config.APIURL + getPublicRelationUrl)
    .then((response) => {
      const publicRelations: PublicRelation[] = response.data.data;
      const publicRelation = publicRelations.find(
        (pr) => pr.group_id === state.groupId
      );
      currentPublicRelation.value = publicRelation || null;
      blurb.value = publicRelation?.blurb || "";
    })
    .catch((error) => {
      console.log(error);
    });
});

const isBlurbOver = computed(() => {
  if(state.language == "en"){
    const blurbEng = blurb.value.split(" ");
    return blurbEng.length > 25;
  } else {
    return blurb.value.length > 50;
  }
});

const fileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  const file = files![0];
  selectedFile.value = file;
  selectedFileUrl.value = URL.createObjectURL(file);
  fileName.value = file.name;
};

const storage = getStorage();
const storageRef = fireRef(storage, fileName.value);

const editImageURL = () => {
  if (blurb.value.length === 0) {
    alert("PR文を入力してください");
    return;
  }

  // currentPublicRelationがなくて、画像が未選択の場合はエラー
  if (!selectedFile.value && !currentPublicRelation.value) {
    alert("画像を選択してください");
    return;
  }

  isSubmitting.value = true;
  // currentPublicRelationがない場合は新規登録する
  selectedFile.value &&
    uploadBytes(storageRef, selectedFile.value).then((snapshot) => {
      pictureName.value = snapshot.ref.name;
      getDownloadURL(fireRef(storage, pictureName.value))
        .then((url) => {
          const postUrl = "/public_relations?group_id=" + state.groupId;

          useFetch(config.APIURL + postUrl, {
            method: "POST",
            params: {
              picture_name: fileName.value,
              picture_path: url,
              blurb: blurb.value,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
        })
        .then(
          (response) => {
            alert("登録しました（画像の反映には数分かかります）");
            router.push("/mypage");
          },
          (error) => {
            alert("登録できませんでした");
          }
        );
    });

  // 画像は選択してないが、currentPublicRelationがある場合はPR文のみ更新する
  if (!selectedFile.value && currentPublicRelation.value) {
    const putUrl = "/public_relations/" + currentPublicRelation.value.id;
    useFetch(config.APIURL + putUrl, {
      method: "PUT",
      params: {
        blurb: blurb.value,
        picture_name: currentPublicRelation.value.picture_name,
        picture_path: currentPublicRelation.value.picture_path,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      (response) => {
        alert("PR文を更新しました");
        router.push("/mypage");
      },
      (error) => {
        alert("PR文を更新きませんでした");
      }
    );
  }
};
</script>

<template>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl">{{ $t("PR.PR") }}</h1>
    <Card>
      <div class="left text-3xl">
        {{ $t("PR.text") }}
      </div>
      <textarea class="border-2 w-[60%]" v-model="blurb"></textarea>
      <p v-if="isBlurbOver" class="text-red-500 text-sm">{{ $t("PR.over") }}</p>
      <div class="my-4 items-center">
        <label>
          <span class="text-3xl mr-4">{{ $t("PR.illustration") }}</span>
          <input type="file" @change="fileUpload" />
        </label>
      </div>
      <div class="flex flex-col gap-2 my-4">
        <div
          v-if="currentPublicRelation"
          class="flex flex-col items-center gap-2"
        >
          <p>現在登録済みの画像</p>
          <img :src="currentPublicRelation.picture_path" class="w-1/3" />
        </div>
        <div v-if="selectedFile" class="flex flex-col items-center gap-2">
          <p>選択中の画像</p>
          <img :src="selectedFileUrl" class="w-1/3" />
        </div>
      </div>
      <RegistPageButton
        :text="$t('Button.register')"
        @click="editImageURL"
        :disabled="isBlurbOver || isSubmitting"
      ></RegistPageButton>
    </Card>
  </div>
</template>
