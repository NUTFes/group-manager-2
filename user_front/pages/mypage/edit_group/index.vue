<script lang="ts" setup>
import axios from "axios";
import { groupCategoryList } from "~~/utils/list";

const router = useRouter()
const config = useRuntimeConfig()

const groupName = ref<string>("")
const projectName = ref<string>("")
const groupCategoryId = ref<number>()
const activity = ref<string>("")
const user = ref("")
const setting = ref("")
const userId = ref<number>()
const fesYearId = ref<number>()
const groupId = localStorage.getItem("group_id")

onMounted( () =>{
  const groupUrl = config.APIURL + "/groups/" + groupId;
  axios.get(groupUrl).then((response) => {
    projectName.value = response.data.data.project_name;
    groupCategoryId.value = response.data.data.group_category_id;
    activity.value = response.data.data.activity;
    groupName.value = response.data.data.name;
  });
  const url = config.APIURL + "/api/v1/users/show";
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then((response) => {
      user.value = response.data.data;
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
      setting.value = response.data.data[0];
    });
})

const register = () => {
  const registUrl = config.APIURL + "/groups/" + groupId;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.put(
    registUrl,
    {
      name:groupName.value,
      project_name: projectName.value,
      activity: activity.value,
      user_id: userId.value,
      group_category_id: groupCategoryId.value,
      fes_year_id: fesYearId.value
    }, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        "client": localStorage.getItem("client"),
        "uid": localStorage.getItem("uid"),
      },
    }).then(
      (response) => {
        localStorage.setItem("group_id", response.data.data.id);
        localStorage.setItem(
          "group_category_id",
          response.data.data.group_category_id
        );
        router.push("/regist/subrep");
      },
      (error) => {
        console.log("登録できませんでした");
        return error;
      }
    );
}

const destroy = () => {
  const delUrl = config.APIURL+"/groups/"+groupId;
  axios.delete(delUrl).then(() => {
    router.push("/regist/group")
  });
}
</script>

<template>
  <div class="regidt-card">
    <NuxtLink to="/mypage" class="regist-back-link">{{ $t('Mypage.goToMypage') }}</NuxtLink>
    <div class="reist-title-content">
      <div class="regist-title">{{ $t('Group.editGroup') }}</div>
    </div>
    <div class="regist-card-content">
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">{{ $t('Group.groupName') }}</div>
        <input
          class="input"
          id="group"
          type="text"
          v-model="groupName"
        />
      </div>
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">{{ $t('Group.shopName') }}</div>
        <input
          class="input"
          id="project"
          type="text"
          v-model="projectName"
        />
      </div>
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">{{ $t('Group.category') }}</div>
        <select
          class="input"
          id="category"
          v-model="groupCategoryId"
        >
          <option
            v-for="item in groupCategoryList"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">{{ $t('Group.ActivityDetails') }}</div>
        <input
          class="input"
          id="activity"
          type="text"
          v-model="activity"
        />
      </div>
    </div>
    <div class="regist-button">
      <button @click="register" class="regist-submit-button">{{ $t('Button.edit') }}</button>
    </div>
    <div class="delete-button">
      <button @click="destroy" class="regist-submit-button">
        {{ $t('Button.delete') }}
      </button>
    </div>
  </div>
</template>

<style>
.regidt-card {
  @apply
    w-[1000px]
    mx-auto;
}

.reist-title-content {
  @apply
    flex
    flex-col
    justify-center
    items-center;
}

.regist-back-link {
  @apply
    block
    text-lg
    text-[#e040fb]
    cursor-pointer
    w-fit
    mt-5;
}

.regist-back-link:hover {
  @apply
    font-bold
    text-[#e040fb];
}

.regist-title {
  @apply
    w-[1000px]
    text-2xl
    font-bold
    bg-[#eceff1]
    mt-[2%];
  padding: 1% 1% 1% 2%;
}

.regist-card-content {
  @apply
    mt-[2%];
  border: solid 1px #d3d3d3;
  padding: 5% 1% 5% 1%;
}

.regist-card-content-question {
  @apply
    text-center
    h-[86px]
    w-[800px]
    mb-[3%]
    mx-auto;
}

.regist-card-content-question-label {
  @apply
    text-lg
    text-left
    mb-[1%];
}

.input {
  @apply
    text-left
    p-[1%]
    h-[50px]
    w-[800px]
    rounded-[7px]
    text-lg
    align-top
    box-border;
}
.input:required {
  border: 1px solid red;
}
.input:invalid {
  border: 1px solid red;
}
.input:valid {
  border: 1px solid #333333;
}

.regist-button {
  @apply
    text-right;
}
.delete-button {
  @apply
    text-center
    mb-8;
}

.regist-submit-button {
  @apply
    text-xl
    text-[#333333]
    bg-[#eceff1]
    font-bold
    rounded-[5px]
    mt-[2%]
    py-[1%]
    px-[5%]
    cursor-pointer;
}
.regist-submit-button:hover {
  @apply
    text-[#333333];
  background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
}
.regist-submit-button:active{
  @apply
    text-[#333333];
  box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
}
</style>
