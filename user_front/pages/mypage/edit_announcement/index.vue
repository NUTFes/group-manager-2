<script lang="ts" setup>
import axios from "axios";
import { useForm, useField } from "vee-validate";
import { Announcement } from "~~/types/regist/announcement";
import { announcementSchema } from "~~/utils/validate";

const router = useRouter();
const config = useRuntimeConfig();

const currentAnnouncement = ref<Announcement>();
const groupId = Number(localStorage.getItem("group_id"));
const message = ref<string>();
const status = ref<string>();
const isEditAnnouncement = ref<boolean>();

const { meta, isSubmitting } = useForm({
  validationSchema: announcementSchema,
});

const { handleChange: handleChangeAnnouncementStatus, errorMessage: statusError } = useField("status");
const { handleChange: handleChangeAnnouncementMessage, errorMessage: messageError } = useField("message");
const handleChangeStatus = () => {
  handleChangeAnnouncementStatus(status.value);
};
const handleChangeMessage = () => {
  if (status.value === "申請済み") {
    handleChangeAnnouncementMessage(message.value);
  } else {
    handleChangeAnnouncementMessage(" ");
  }
};

onMounted(async () => {
  loginCheck();
  const getAnnouncementUrl = "/announcements";
  axios.get(config.APIURL + getAnnouncementUrl).then((res) => {
    const announcements: Announcement[] = res.data.data;
    currentAnnouncement.value = announcements.find(
      (announcement) => announcement.group_id === groupId
    );
    message.value = currentAnnouncement.value?.message;
    status.value = currentAnnouncement.value?.status;
    handleChangeAnnouncementStatus(currentAnnouncement.value?.status);
    if (status.value === "申請済み") {
      handleChangeAnnouncementMessage(currentAnnouncement.value?.message);
    } else {
      handleChangeAnnouncementMessage(" ");
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

const postAnnouncement = () => {
  if (status.value === "申請しない") {
    message.value = "";
  }

  if (currentAnnouncement.value) {
    const putURL = "/announcements/" + currentAnnouncement.value?.id;
    axios
      .put(config.APIURL + putURL, {
        group_id: groupId,
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
    const postUrl = "/announcements?group_id=" + groupId;
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


const buttonDisabled = computed(() => {
  if (status.value === "申請済み") {
    return !!(!status.value || !message.value);
  } else {
    return !!(!status.value);
  }
});
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
      </div>
      <div class="my-4 flex">
        <div class="mr-4">
          <input type="radio" id="apply" name="apply" value="申請済み" v-model="status" @change="handleChangeStatus">
          <label for="apply">{{ $t('Announcement.apply') }}</label>
        </div>
        <div>
          <input type="radio" id="noApply" name="apply" value="申請しない" v-model="status" @change="handleChangeStatus">
          <label for="noApply">{{ $t('Announcement.noApply') }}</label>
        </div>
      </div>
      <p class="text-red-500 text-sm" v-if="statusError">
        {{ statusError }}
      </p>
        <textarea v-if="status === '申請済み'" class="border-2 w-[60%]" v-model="message" @change="handleChangeMessage"></textarea>
        <p class="text-red-500 text-sm" v-if="messageError">
          {{ messageError }}
        </p>
      <RegistPageButton
        v-if="isEditAnnouncement"
        :text="$t('Announcement.regist')"
        @click="postAnnouncement"
        :disabled="buttonDisabled || !meta.valid || isSubmitting"
      ></RegistPageButton>
    </Card>
  </div>
</template>
