<script lang="ts" setup>
import axios from "axios";

interface Announcement {
  id: number;
  group_id: number;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const router = useRouter();
const state = reactive({
  groupId: 0,
  language: "",
});

const currentAnnouncement = ref<Announcement>();
const config = useRuntimeConfig();
const groupId = ref<number>(0);
const message = ref<string>("");
const status = ref<string>("未申請");
const isEditAnnouncement = ref<boolean>();

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.language = localStorage.getItem("local") || "";
  groupId.value = Number(localStorage.getItem("group_id"));

  const getAnnouncementUrl = "/announcements";
  axios.get(config.APIURL + getAnnouncementUrl).then((res) => {
    const announcements = res.data.data;
    // 同じgroup_idのannouncementを取得
    currentAnnouncement.value = announcements.find(
      (announcement: Announcement) => announcement.group_id === groupId.value
    );

    if (currentAnnouncement.value) {
      message.value = currentAnnouncement.value.message;
      status.value = currentAnnouncement.value.status || "未申請";
    }
  });
  const settingUrl = config.APIURL + "/user_page_settings";
  axios
    .get(settingUrl, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then((response) => {
      isEditAnnouncement.value = response.data.data[0].is_edit_announcement;
    });
});

// アナウンス文のバリデーションチェック300字より多いか
const isMessageOver = computed(() => {
  if (state.language == "en") {
    const messageEng = message.value.split(" ");
    return messageEng.length > 125;
  } else {
    return message.value.length > 300;
  }
});

const postAnnouncement = () => {
  console.log("message.value",message.value)
  console.log("status.value",status.value)
  if (message.value.length === 0) {
    alert("会場アナウンス文を入力してください\nPlease enter the text of the venue announcement");
    return;
  }

  if (status.value === "申請しない") {
    message.value = "";
  }

  if (currentAnnouncement.value) {
    const putURL = "/announcements/" + currentAnnouncement.value?.id;
    axios
      .put(config.APIURL + putURL, {
        group_id: groupId.value,
        message: message.value,
        status: status.value,
      })
      .then((res) => {
        alert("会場アナウンスを更新しました\nVenue announcements have been updated");
        router.push("/mypage");
      })
      .catch((err) => {
        alert("会場アナウンスの更新に失敗しました\nFailed to update venue announcements");
      });
  } else {
    const postUrl = "/announcements?group_id=" + groupId.value;
    axios
      .post(config.APIURL + postUrl, {
        message: message.value,
        status: status.value,
      })
      .then((res) => {
        alert("会場アナウンスを登録しました\nVenue announcements have been registered");
        router.push("/mypage");
      })
      .catch((err) => {
        alert("会場アナウンスの登録に失敗しました\nFailed to register for venue announcements");
      });
  }
};
</script>

<template>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl">{{ $t("Announcement.editAnnouncement") }}</h1>
    <div v-if="!isEditAnnouncement" class="text-3xl text-red-600 font-bold my-5">
      編集は締め切られました
    </div>
    <Card>
      <div class="text-left">
        <span class="text-3xl mr-4">{{ $t("Announcement.text") }}</span>
        <p v-if="isMessageOver" class="text-red-500 text-sm">{{ $t("Announcement.over") }}</p>
      </div>
      <div class="my-4 flex">
        <div class="mr-4">
          <input type="radio" id="apply" name="apply" value="申請済み" v-model="status">
          <label for="apply">{{ $t('Announcement.apply') }}</label>
        </div>
        <div>
          <input type="radio" id="noApply" name="apply" value="申請しない" v-model="status">
          <label for="noApply">{{ $t('Announcement.noApply') }}</label>
        </div>
      </div>
      <textarea v-if="status === '申請済み'" class="border-2 w-[60%]" v-model="message"></textarea>
      <RegistPageButton
        v-if="isEditAnnouncement"
        :text="$t('Announcement.regist')"
        @click="postAnnouncement"
        :disabled="isMessageOver"
      ></RegistPageButton>
    </Card>
  </div>
</template>
