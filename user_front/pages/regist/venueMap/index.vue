<script lang="ts" setup>
import { loginCheck } from "~~/utils/methods";
import axios from "axios";
import { Setting } from "~~/types";

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
const fileName = ref<string>("選択してください\nPlease select");
const clientId = config.IMGUR_CLIENT_ID;
const isSubmitting = ref<boolean>(false);
const currentVenueMap = ref<VenueMap | null>(null);
const isEditVenueMap = ref<boolean>();
const isFileCheck = ref<boolean>(false);

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
  const setting =
    (await $fetch<Setting>(config.APIURL + "/user_page_settings")) || null;
  isEditVenueMap.value = setting.data[0].is_edit_venue_map;
});

const fileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  const file = files![0];
  selectedFile.value = file;
  fileName.value = file.name;
  selectedFileUrl.value = URL.createObjectURL(file);
  fileCheck();
};

// 画像ファイルのバリデーション。uploadした瞬間に発火する
const fileCheck = () => {
  // 初期状態ではバリデーションを成功とする
  isFileCheck.value = true;

  if (selectedFile.value) {
    // jpeg, pngの指定、それ以外の場合はエラー
    if (!["image/jpeg", "image/png"].includes(selectedFile.value.type)) {
      alert("JPEG、PNG形式の画像を選択してください\nPlease select an image in JPEG or PNG format");
      isFileCheck.value = false;
      return; // エラーメッセージが表示された場合はバリデーションを終了
    }
  }

  // ファイル名のチェック。"_"で区切られているかどうかのチェック
  const fileNameRegex = /^[^\\/:*?"<>|\r\n]+_[^\\/:*?"<>|\r\n]+$/;
  if (!fileNameRegex.test(fileName.value)) {
    alert("ファイル名は「参加形式_団体名」の形式で入力してください\nPlease enter the file name in the format of 'participation_format_organization_name'");
    isFileCheck.value = false;
    return; // エラーメッセージが表示された場合はバリデーションを終了
  }
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
    alert("画像を選択してください\nPlease select an image");
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
            alert("模擬店平面図を登録しました\nVenue map has been registered.");
            router.push("/mypage");
          })
          .catch((err) => {
            alert(
              "模擬店平面図の登録に失敗しました\nFailed to register the venue map"
            );
            router.push("/mypage");
          });
      })
      .catch((err) => {
        alert(
          "模擬店平面図の登録に失敗しました\nFailed to register the venue map"
        );
        router.push("/mypage");
      });
  });
};
</script>

<template>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl">{{ $t("VenueMap.regitstVenueMap") }}</h1>
    <div v-if="!isEditVenueMap" class="text-3xl text-red-600 font-bold my-5">
      編集は締め切られました
    </div>
    <Card>
      <div class="flex flex-col my-4 items-center gap-4">
        <span class="text-3xl mr-4">{{ $t("VenueMap.map") }}</span>
        <input type="file" accept=".png, .jpg" @change="fileUpload" />
        <div class="flex flex-col items-center gap-4" v-if="currentVenueMap">
          <p>{{ $t("VenueMap.currently") }}</p>
          <img :src="currentVenueMap.picture_path" class="w-[50%]" />
        </div>
        <div class="flex flex-col items-center gap-4" v-if="selectedFileUrl">
          <p>{{ $t("VenueMap.selected") }}</p>
          <img :src="selectedFileUrl" class="w-[50%]" />
        </div>
      </div>
      <RegistPageButton
        v-if="isEditVenueMap"
        :text="$t('Button.register')"
        @click="postImageURL"
        :disabled="isSubmitting || !isFileCheck"
      ></RegistPageButton>
      <p v-if="isSubmitting">{{ $t("PR.registering") }}</p>
    </Card>
  </div>
</template>
