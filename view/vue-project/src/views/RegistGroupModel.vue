<template>
  <div id="app">
    <h1 class="tytle">団体登録</h1>
    <div class="Blank">
      <span>団体名</span>
      <input id="group" type="text" v-model="groupName" @change="validationGroup" />
    </div>
    <div class="Blank">
      <span>企画名</span>
      <input  id="project" type="text" v-model="projectName" @change="validationProject" />
    </div>
    <div class="Blank">
      <span>カテゴリ</span>
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
    <div class="Blank">
      <span>活動内容</span>
      <input id="activity" type="text" v-model="activity" @change="validationActivity" />
    </div>
    <div  class="Blank">
      <router-link to="/mypage"><button style="margin-left:8%;">←戻る</button></router-link>
      <button @click="register" style="margin-left:15%;">登録する→</button>
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
            console.log("response:", response);
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
  #app{
    margin: 1%;
  }
  span {
    display: inline-block;
    width: 100px;
    padding-right: 10px;
  }
  .tytle{
     text-align:center;
     padding:1%;
  }
  .Blank{
    text-align: center;
    margin:1%;
  }
  select,input{
    text-align: center;
    width: 30%;
    height:40px;
    border-radius: 7px;
    box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF;
    font-size: 25px;
  }
  select,input:required{
    border: 2px solid red;
  }
  select,input:invalid{
    border: 2px solid red;
  }
  select,input:valid{
    border: 2px solid black;
  }
  button{
  color: black;
  font-weight: bold;
  border: solid 2px;
  border-radius: 10px;
  cursor: pointer;
  margin: 1%;
  padding:1%;
  }
  button:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  button:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>