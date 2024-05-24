<script lang="ts" setup>
import axios from "axios";
import { useForm, useField } from "vee-validate";
import { GroupCategory } from '@/types/regist/groupCategory';

const router = useRouter();
const config = useRuntimeConfig();

const groupName = ref<string>("");
const projectName = ref<string>("");
const groupCategoryId = ref<number>();
const activity = ref<string>("");
const user = ref("");
const isEditGroup = ref<boolean>();
const userId = ref<number>();
const international = ref<boolean>();
const external = ref<boolean>();
const fesYearId = ref<number>();
const groupId = localStorage.getItem("group_id");

const { meta, isSubmitting } = useForm({
  validationSchema: groupSchema,
});

const { handleChange: handleChangeGroupName, errorMessage: groupNameError } =
  useField("groupName");
const {
  handleChange: handleChangeProjectName,
  errorMessage: projectNameError,
} = useField("projectName");
const { handleChange: handleChangeActivity, errorMessage: activityError } =
  useField("activity");
const { handleChange: handleChangeCategory, errorMessage: categoryError } =
  useField("category");

onMounted(() => {
  loginCheck();
  const groupUrl = config.APIURL + "/groups/" + groupId;
  axios.get(groupUrl).then((response) => {
    projectName.value = response.data.data.project_name;
    groupCategoryId.value = response.data.data.group_category_id;
    activity.value = response.data.data.activity;
    groupName.value = response.data.data.name;
    international.value = response.data.data.is_international;
    external.value = response.data.data.is_external;
    handleChangeGroupName(response.data.data.name);
    handleChangeProjectName(response.data.data.project_name);
    handleChangeActivity(response.data.data.activity);
    handleChangeCategory(response.data.data.group_category_id);
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
      isEditGroup.value = response.data.data[0].is_edit_group;
    });
});

const register = () => {
  const registUrl = config.APIURL + "/groups/" + groupId;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios
    .put(
      registUrl,
      {
        name: groupName.value,
        project_name: projectName.value,
        activity: activity.value,
        user_id: userId.value,
        group_category_id: groupCategoryId.value,
        fes_year_id: fesYearId.value,
        is_international: international.value,
        is_external: external.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      }
    )
    .then(
      (response) => {
        localStorage.setItem("group_id", response.data.data.id);
        localStorage.setItem(
          "group_category_id",
          response.data.data.group_category_id
        );
        alert("登録できました\nRegistration Success");
        router.push("/mypage");
      },
      (error) => {
        alert("登録できませんでした\nRegistration Failure");
      }
    );
};

const groupCategoryList = await $fetch<GroupCategory>(config.APIURL + "/group_categories");

const buttonDisabled = computed(() => {
  return !!(
    !groupName.value ||
    !projectName.value ||
    !activity.value
  );
});
</script>

<template>
  <div class="w-2/3 mx-auto">
    <div class="w-full text-2xl my-8 font-bold bg-[#eceff1] p-2 rounded-md">
      {{ $t("Group.editGroup") }}
    </div>
    <div v-if="!isEditGroup" class="text-3xl text-red-600 font-bold my-5">
      編集は締め切られました
    </div>
    <div class="border p-4 my-4 rounded-md flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Group.groupName") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="group"
          type="text"
          v-model="groupName"
          @change="handleChangeGroupName"
        />
        <p class="text-red-500 text-sm" v-if="groupNameError">
          {{ groupNameError }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Group.shopName") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="project"
          type="text"
          v-model="projectName"
          @change="handleChangeProjectName"
        />
        <p class="text-red-500 text-sm" v-if="projectNameError">
          {{ projectNameError }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Group.category") }}
        </div>
        <select
          class="rounded-md border border-black p-2 text-xl"
          id="category"
          v-model="groupCategoryId"
          @change="handleChangeCategory"
        >
          <option
            v-for="item in groupCategoryList.data"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </option>
        </select>
        <p class="text-red-500 text-sm" v-if="categoryError">
          {{ categoryError }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Group.international") }}
        </div>
        <input class="rounded-md border border-black p-2 text-xl" type="checkbox" v-model="international">
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Group.external") }}
        </div>
        <input class="rounded-md border border-black p-2 text-xl" type="checkbox" v-model="external">
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Group.activityDetails") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="activity"
          type="text"
          v-model="activity"
          @change="handleChangeActivity"
        />
        <p class="text-red-500 text-sm" v-if="activityError">
          {{ activityError }}
        </p>
      </div>
    </div>
    <div class="regist-button">
      <RegistPageButton
        v-if="isEditGroup"
        @click="register"
        :disabled="buttonDisabled || !meta.valid || isSubmitting"
        :text="$t('Button.register')"
      ></RegistPageButton>
    </div>
  </div>
</template>

<style scoped>
.regist-button {
  @apply text-right
    mb-8;
}
</style>