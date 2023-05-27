<script lang="ts" setup>
import { loginCheck } from "~~/utils/methods";
import axios from "axios";

interface VenueMap {
  id: number;
  group_id: number;
  picture_name: string;
  picture_path: string;
  created_at: string;
  updated_at: string;
}

const router = useRouter();
const config = useRuntimeConfig();
const state = reactive({
  groupId: 0,
});

const selectedFile = ref<File | null>(null);
const selectedFileUrl = ref<string>("");
const fileName = ref<string>("選択してください");
const clientId = config.IMGUR_CLIENT_ID;
const isSubmitting = ref<boolean>(false);
const currentVenueMap = ref<VenueMap | null>(null);

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));

  const getVenueMapUrl = "/venue_maps";
  axios.get(config.APIURL + getVenueMapUrl).then((response) => {
    const venueMaps: VenueMap[] = response.data.data;
    const venueMap = venueMaps.find((vm) => vm.group_id === state.groupId);
    currentVenueMap.value = venueMap || null;
  });
});

const fileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  const file = files![0];
  selectedFile.value = file;
  fileName.value = file.name;
  selectedFileUrl.value = URL.createObjectURL(file);
};

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

const postImageURL = () => {
  if (!selectedFile.value) {
    alert("画像を選択してください");
    return;
  }

  isSubmitting.value = true;

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

        const fetchUrl = currentVenueMap.value
          ? "/venue_maps/" + currentVenueMap.value.id
          : "/venue_maps?group_id=" + state.groupId;
        const fetchMethod = currentVenueMap.value ? "PUT" : "POST";
        const fetchParams = currentVenueMap.value
          ? {
              group_id: state.groupId,
              picture_name: fileName.value,
              picture_path: imgLink,
            }
          : {
              picture_name: fileName.value,
              picture_path: imgLink,
            };
        useFetch(config.APIURL + fetchUrl, {
          method: fetchMethod,
          params: fetchParams,
        })
          .then((response) => {
            alert("会場配置図を登録しました");
            router.push("/mypage");
          })
          .catch((err) => {
            alert("会場配置図の登録に失敗しました");
            router.push("/mypage");
          });
      })
      .catch((err) => {
        alert("会場配置図の登録に失敗しました");
        router.push("/mypage");
      });
  });
};
</script>

<template>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl">会場配置図の申請</h1>
    <Card>
      <div class="flex flex-col my-4 items-center gap-4">
        <span class="text-3xl mr-4">配置図(pdf, png, jpgのみ)</span>
        <input type="file" accept=".pdf, .png, .jpg" @change="fileUpload" />
        <div class="flex flex-col items-center gap-4" v-if="currentVenueMap">
          <p>現在選択している画像</p>
          <img :src="currentVenueMap.picture_path" class="w-[50%]" />
        </div>
        <div class="flex flex-col items-center gap-4" v-if="selectedFileUrl">
          <p>選択した画像</p>
          <img :src="selectedFileUrl" class="w-[50%]" />
        </div>
      </div>
      <RegistPageButton
        text="登録"
        @click="postImageURL"
        :disabled="isSubmitting"
      ></RegistPageButton>
      <p v-if="isSubmitting">登録中です...</p>
    </Card>
  </div>
</template>
