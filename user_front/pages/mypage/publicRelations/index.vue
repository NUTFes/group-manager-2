<script lang="ts" setup>
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
  language: "",
});

const changeImage2base64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
};

const currentPublicRelation = ref<PublicRelation | null>(null);
const selectedFile = ref<File | null>(null);
const selectedFileUrl = ref<string>("");
const fileName = ref<string>("選択してください");
const blurb = ref<string>("");
const isSubmitting = ref<boolean>(false);
const clientId = config.IMGUR_CLIENT_ID;

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
  if (state.language == "en") {
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

  if (selectedFile.value) {
    changeImage2base64(selectedFile.value).then((base64Text) => {
      const text = String(base64Text);
      const base64 = text.replace(new RegExp("data.*base64,"), "");
      const URL = "https://api.imgur.com/3/image";
      axios
        .post(
          URL,
          { image: base64 },
          { headers: { Authorization: `Client-ID ${clientId}` } }
        )
        .then((res) => {
          const imgLink = res.data.data.link;

          const fetchUrl = currentPublicRelation.value
            ? "/public_relations/" + currentPublicRelation.value.id
            : "/public_relations?group_id=" + state.groupId;
          const fetchMethod = currentPublicRelation.value ? "PUT" : "POST";
          const fetchParams = currentPublicRelation.value
            ? {
                picture_name: fileName.value,
                picture_path: imgLink,
                blurb: blurb.value,
                group_id: state.groupId,
              }
            : {
                picture_name: fileName.value,
                picture_path: imgLink,
                blurb: blurb.value,
              };
          useFetch(config.APIURL + fetchUrl, {
            method: fetchMethod,
            params: fetchParams,
          })
            .then(() => {
              alert("PR文を登録しました");
              router.push("/mypage");
            })
            .catch(() => {
              alert("PR文の登録に失敗しました");
              router.push("/mypage");
            });
        })
        .catch(() => {
          alert("PR文の登録に失敗しました");
          router.push("/mypage");
        });
    });
  } else {
    const fetchUrl = "/public_relations/" + currentPublicRelation.value?.id;
    useFetch(config.APIURL + fetchUrl, {
      method: "PUT",
      params: {
        picture_name: currentPublicRelation.value?.picture_name,
        picture_path: currentPublicRelation.value?.picture_path,
        blurb: blurb.value,
        group_id: state.groupId,
      },
    })
      .then((response) => {
        alert("PR文を登録しました");
        router.push("/mypage");
      })
      .catch((err) => {
        alert("PR文の登録に失敗しました");
        router.push("/mypage");
      });
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
      <p v-if="isSubmitting">登録中です...</p>
    </Card>
  </div>
</template>
