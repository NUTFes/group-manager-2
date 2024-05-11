<script lang="ts" setup>
// フロントだけ作った。多分他のとこからデータ持ってきて入力データ送り返せるようにしていらないところを消したら完成する。
import { is } from "@vee-validate/rules";
import axios from "axios";
import { useForm, useField } from "vee-validate";
import { GroupCategory } from '@/types/regist/groupCategory';
import { groupSchema } from "~~/utils/validate";

const router = useRouter();
const config = useRuntimeConfig();

const groupName = ref<string>("");
const projectName = ref<string>("");
const groupCategoryId = ref<number>();
const activity = ref<string>("");
const user = ref("");
const setting = ref("");
const isEditGroup = ref<boolean>();
const userId = ref<number>();
const international = ref<boolean>();
const external = ref<boolean>();
const fesYearId = ref<number>();
const groupId = localStorage.getItem("group_id");
// ここより上がもとからあったやつ ///
const preOpenKitchen = ref<string>("");
const preOpenTent = ref<string>("");
const duringOpenKitchen = ref<string>("");
const duringOpenTent = ref<string>("");

const { meta } = useForm({
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
const { handleChange: handleChangeInternational, errorMessage: internarionalError } =
  useField("international");
const { handleChange: handleChangeExternal, errorMessage: externalError } =
  useField("external");
const { handleChange: handleChangeCategory, errorMessage: categoryError } =
  useField("category");
// ここより上のconstはもとからあったやつ ///
const { handleChange: handleChangepreOpenKitchen, errorMessage: preOpenKitchenError } =
  useField("preOpenKitchen");
const { handleChange: handleChangepreOpenTent, errorMessage: preOpenTentError } =
  useField("preOpenKitchen");
const { handleChange: handleChangeduringOpenKitchen, errorMessage: duringOpenKitchenError } =
  useField("duringOpenKitchen");
const { handleChange: handleChangeduringOpenTent, errorMessage: duringOpenTentError } =
  useField("duringOpenTent");

onMounted(() => {// せいかいはこっちか？
  loginCheck();
  const groupUrl = config.APIURL + "/groups/" + groupId;
  axios.get(groupUrl).then((response) => {
    projectName.value = response.data.data.project_name;
    groupCategoryId.value = response.data.data.group_category_id;
    activity.value = response.data.data.activity;
    groupName.value = response.data.data.name;
    international.value = response.data.data.is_international;
    external.value = response.data.data.is_external;
    //ここより上のvalueはもとからあったやつ///
    //これ多分データーベースから持ってきた初期値いれるやつ
    preOpenKitchen.value = response.data.data.pre_open_kitchen;
    preOpenTent.value = response.data.data.pre_open_tent;
    duringOpenKitchen.value = response.data.data.during_open_kitchen;
    duringOpenTent.value = response.data.data.during_open_tent;
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
      isEditGroup.value = response.data.data[0].is_edit_group;
    });
});

const register = () => {
  const registUrl = config.APIURL + "/groups/" + groupId;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios
    .put(// 多分ここがデータ送り出すとこ
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
        // ここより上はもとからあったやつ///
        pre_open_kitchen: preOpenKitchen.value,
        pre_open_tent: preOpenTent.value,
        during_open_kitchen: duringOpenKitchen.value,
        during_open_tent: duringOpenTent.value
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

const groupCategoryList = await $fetch<GroupCategory>(config.APIURL + "/group_categories");// 変数が使用されてる形跡がない

const buttonDisabled = computed(() => {
  return !!(
    groupNameError.value ||
    projectNameError.value ||
    categoryError.value ||
    activityError.value ||
    internarionalError.value || 
    externalError.value 
    // ここより上はもとからあったやつ///
    ||preOpenKitchenError.value||
    preOpenTentError.value||
    duringOpenKitchenError.value||
    duringOpenTentError.value
  );
});
// ボタンを押せないようにするやつ
// !! <- 二重否定:複数の否定演算子を連続して使用することで、明示的にあらゆる値を対応する論理型プリミティブに変換することができます。
// だから、各値がエラー文持ってたら絶対にtrueを返す
</script>

<template>
  <div class="w-2/3 mx-auto">
    <div class="w-full text-2xl my-8 font-bold bg-[#eceff1] p-2 rounded-md">
      {{ $t("Cook.cookTitle") }}
    </div>
    <div v-if="!isEditGroup" class="text-3xl text-red-600 font-bold my-5">
      編集は締め切られました
    </div>
    <div class="border p-4 my-4 rounded-md flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          <!--
            $t("~~")の中身を書き換える
          -->
          {{ $t("Cook.preOpenKitchen") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="group"
          type="text"
          v-model="preOpenKitchen"
          @change="handleChangepreOpenKitchen"
        />
        <p class="text-red-500 text-sm" v-if="preOpenKitchenError">
          {{ preOpenKitchenError }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.preOpenTent") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="project"
          type="text"
          v-model="preOpenTent"
          @change="handleChangepreOpenTent"
        />
        <p class="text-red-500 text-sm" v-if="preOpenTentError">
          {{ preOpenTentError }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.duringOpenKitchen") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="group"
          type="text"
          v-model="duringOpenKitchen"
          @change="handleChangeduringOpenKitchen"
        />
        <p class="text-red-500 text-sm" v-if="duringOpenKitchenError">
          {{ duringOpenKitchenError }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("Cook.duringOpenTent") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="activity"
          type="text"
          v-model="duringOpenTent"
          @change="handleChangeduringOpenTent"
        />
        <p class="text-red-500 text-sm" v-if="duringOpenTentError">
          {{ duringOpenTentError }}
        </p>
      </div>
    </div>
    <div class="w-fit ml-auto mt-4 mb-12">
      <!-- styleタグないを参考にグラデーションをかける -->
      <button
        v-if="isEditGroup"
        @click="register"
        class="text-xl text-gray-800 bg-gray-300 rounded-lg py-2 px-4 font-bold disabled:opacity-50 bg-gradient-to-r hover:from-pink-400 hover:to-yellow-500"
        :disabled="buttonDisabled"
      >
        {{ $t("Button.edit") }}
      </button>
    </div>
  </div>
</template>
