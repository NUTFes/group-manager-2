<template>
  <div>
      <router-link to="/mypage" style="text-decoration: none"><span class="regist-back-link">マイページに戻る</span></router-link>
    <div class="regist-title">参加団体の登録</div>
    <div class="regist-card">
      <div class="regist-card-content">
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">団体名</div>
          <input id="group" type="text" v-model="groupName" @change="validationGroup" />
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">企画名</div>
          <input id="project" type="text" v-model="projectName" @change="validationProject" />
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">カテゴリ</div>
          <select v-model="groupCategoryId" @change="validationCategory" id="category">
            <option
              v-for="item in groupCategories"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">活動内容</div>
          <input id="activity" type="text" v-model="activity" @change="validationActivity" />
        </div>
      </div>
      <div class="regist-button">
        <button @click="register" class="regist-submit-button">登録する</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      resultGroup: false,
      resultProject: false,
      resultCategory: false,
      resultActivity: false,
      user: [],
      setting: [],
      groupName: [],
      projectName: [],
      groupCategoryId: [],
      activity: [],
      fesYearId: [],
      groupCategories: [
        // { id: 1, name: "模擬店(食品販売)" },
        // { id: 2, name: "模擬店(物品販売)" },
        { id: 3, name: "ステージ企画" },
        { id: 4, name: "展示・体験" },
        // { id: 5, name: "研究室公開" },
        { id: 6, name: "その他" },
      ],
    };
  },
  mounted() {
    // 直リンク対策
    if (!this.$store.state.registGroupPermission) {
      this.$router.push("/mypage");
    }
    const url = process.env.VUE_APP_URL + "/api/v1/users/show";
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
        this.user = response.data.data;
      });
    const setting =
    process.env.VUE_APP_URL + "/user_page_settings";
    axios
      .get(setting, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.setting=response.data.data[0];
      });

  },
  computed: {
    validationGroup(){
      if (this.groupName.length) {
        this.onGroupValidation();
      } else {
        this.offGroupValidation();
      }
      return this.resultGroup
    },
    validationProject(){
      if (this.projectName.length) {
        this.onProjectValidation();
      } else {
        this.offProjectValidation();
      }
      return this.resultProject
    },
    validationCategory(){
      if (this.groupCategoryId != 0) {
        this.onCategoryValidation();
      } else {
        this.offCategoryValidation();
      }
      return this.resultCategory
    },
    validationActivity(){
      if (this.activity.length) {
        this.onActivityValidation();
      } else {
        this.offActivityValidation();
      }
      return this.resultActivity
    },
  },
  methods: {
    onGroupValidation: function() {
      this.resultGroup = true;
    },
    offGroupValidation: function() {
      this.resultGroup = false;
    },
    onProjectValidation: function() {
      this.resultProject = true;
    },
    offProjectValidation: function() {
      this.resultProject= false;
    },
    onCategoryValidation: function() {
      this.resultCategory = true;
    },
    offCategoryValidation: function() {
      this.resultCategory = false;
    },
    onActivityValidation: function() {
      this.resultActivity = true;
    },
    offActivityValidation: function() {
      this.resultActivity = false;
    },
    register: function () {
      if (this.resultGroup && this.resultProject && this.resultCategory && this.resultActivity) {
        const url = process.env.VUE_APP_URL + "/groups";
        let params = new URLSearchParams();
        params.append("name", this.groupName);
        params.append("project_name", this.projectName);
        params.append("activity", this.activity);
        params.append("user_id", this.user.id);
        params.append("group_category_id", this.groupCategoryId);
        params.append("fes_year_id", this.setting.fes_year_id);
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post(url, params).then(
          (response) => {
            localStorage.setItem("group_id", response.data.data.id);
            localStorage.setItem("group_category_id", response.data.data.group_category_id);
            this.$store.commit("acceptRegistSubRepPermission");
            this.$store.commit("rejectRegistGroupPermission");
            this.$router.push("regist_subrep");
          },
          (error) => {
            console.log("登録できませんでした");
            return error;
          }
        );
      } else {
        if (this.resultGroup==false) {
          const groupError = document.getElementById("group");
          groupError.style.border="2px solid red";
        } else {
          const groupError = document.getElementById("group");
          groupError.style.border="2px solid black";
        }
        if (this.resultProject==false) {
          const projectError = document.getElementById("project");
          projectError.style.border="2px solid red";
        } else {
          const projectError = document.getElementById("project");
          projectError.style.border="2px solid black";
        }
        if (this.resultCategory==false) {
          const categoryError = document.getElementById("category");
          categoryError.style.border="2px solid red";
        } else {
          const categoryError = document.getElementById("category");
          categoryError.style.border="2px solid black";
        }
        if (this.resultActivity==false) {
          const activityError = document.getElementById("activity");
          activityError.style.border="2px solid red";
        } else {
          const activityError = document.getElementById("activity");
          activityError.style.border="2px solid black";
        }
      }
    },
  }
};
</script>

<style scoped>
  .blank{
    text-align: center;
    margin-bottom: 4%;
  }
  select, input{
    text-align: left;
    padding: 1%;
    height: 50px;
    width: 800px;
    border-radius: 7px;
    font-size: 18px;
    vertical-align: top;
  }
  select,input:required{
    border: 1px solid red;
  }
  select,input:invalid{
    border: 1px solid red;
  }
  select,input:valid{
    border: 1px solid #333333;
  }
</style>