<template>
  <div>
    <v-row justify="center">
      <v-col cols="2"></v-col>
      <v-col cols="8">
        <v-card flat>
          <v-container class="justify-content-center">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10" align="center">
                <v-card-title class="justify-center font-weight-bold">
                  参加団体登録
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-form ref="form">
                    <v-text-field
                      label="団体名"
                      ref="groupName"
                      v-model="groupName"
                      :rules="[rules.required]"
                      text
                      outlined
                      required
                    ></v-text-field>
                    <v-select
                      label="カテゴリ"
                      ref="groupCategory"
                      v-model="groupCategoryId"
                      :rules="[rules.required]"
                      :items="groupCategories"
                      :menu-props="{
                        top: true,
                        offsetY: true,
                      }"
                      item-text="name"
                      item-value="id"
                      outlined
                    ></v-select>
                    <v-textarea
                      label="活動内容"
                      ref="activity"
                      v-model="activity"
                      :rules="[rules.required]"
                      @keydown="adjustHeight"
                      text
                      outlined
                      required
                    ></v-textarea>
                    <v-text-field
                      label="企画名"
                      ref="projectName"
                      v-model="projectName"
                      :rules="[rules.required]"
                      text
                      outlined
                      required
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-divider class="mb-8"></v-divider>
                <v-card-actions>
                  <v-btn
                    color="btn"
                    rounded
                    large
                    text
                    tabindex="1"
                    class="pr-4 font-weight-bold"
                    to="/MyPage"
                    ><v-icon class="pr-n1">mdi-menu-left</v-icon
                    >マイページに戻る</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    color="btn"
                    rounded
                    large
                    dark
                    depressed
                    tabindex="0"
                    class="pl-4 font-weight-bold"
                    @click="submit"
                    >登録<v-icon class="ml-n1">mdi-menu-right</v-icon></v-btn
                  >
                </v-card-actions>
                <v-col cols="1"></v-col>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header.vue";
export default {
  components: {
    Header,
  },
  data() {
    return {
      groupCategories: [
        //      { id: 1, name: '模擬店(食品販売)' },
        { id: 2, name: "模擬店(物品販売)" },
        { id: 3, name: "ステージ企画" },
        { id: 4, name: "展示・体験" },
        { id: 5, name: "研究室公開" },
        { id: 6, name: "その他" },
      ],
      fesYearId: [],
      formHasErrors: false,
      rules: {
        required: (value) => !!value || "入力してください",
      },
    };
  },
  computed: {
    form() {
      return {
        groupName: null,
        user: null,
        activity: null,
        projectName: null,
        groupCategoryId: null,
      };
    },
  },
  methods: {
    adjustHeight() {
      const textarea = this.$refs.activity;
      const resetHeight = new Promise(function(resolve) {
        resolve((textarea.style.height = "auto"));
      });
      resetHeight.then(function() {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    cancel: function() {
      this.$refs.form.reset();
    },
    submit: function() {
      if (!this.$refs.form.validate()) return;

      const url = process.env.VUE_APP_URL + "/groups";
      let params = new URLSearchParams();
      params.append("name", this.groupName);
      params.append("project_name", this.projectName);
      params.append("activity", this.activity);
      params.append("user_id", this.user.id);
      params.append("group_category_id", this.groupCategoryId);
      params.append("fes_year_id", this.fesYearId);

      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.post(url, params).then(
        (response) => {
          console.log("response:", response.data.id);
          localStorage.setItem("group_id", response.data.id);
          localStorage.setItem("group_category_id", this.groupCategoryId);
          if (this.groupCategoryId == 3) {
            this.$router.push("regist_group");
          } else {
            this.$router.push("regist_shop");
          }
        },
        (error) => {
          console.log("登録できませんでした");
          return error;
        }
      );
    },
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
      .then(
        (response) => {
          this.user = response.data.data;
        },
        (error) => {
          console.error(error);
          return error;
        }
      );
    axios
      .get(process.env.VUE_APP_URL + "/user_page_settings/1")
      .then((response) => {
        this.fesYearId = response.data.fes_year_id;
      });
  },
  watch: {
    activity() {
      this.adjustHeight();
    },
  },
};
</script>
