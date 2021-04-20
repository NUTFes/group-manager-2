<template>
  <div>
    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-account-outline</v-icon>副代表一覧
                <v-spacer></v-spacer>               
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="dialog=true"
                            >
                            <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>副代表の追加</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="reload"
                    >
                      <v-icon dark>mdi-reload</v-icon>
                    </v-btn>
                  </template>
                  <span>更新する</span>
                </v-tooltip>
              </v-card-title>

            <v-dialog v-model="dialog" max-width="500">
              <v-card>
                <v-card-title class="headline blue-grey darken-3">
                  <div style="color: white">
                    <v-icon class="ma-5" dark>mdi-account-outline</v-icon
                    >副代表の追加
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false" fab dark>
                    ​ <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-form ref="form">
                        <v-text-field
                          class="body-1"
                          label="名前"
                          v-model="subRepName"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-select
                          label="参加団体名"
                          v-model="Group"
                          :items="groups"
                          :menu-props="{
                            top: true,
                            offsetY: true,
                          }"
                          item-text="name"
                          item-value="id"
                          outlined
                        ></v-select>
                        <v-text-field
                          class="body-1"
                          label="学籍番号"
                          v-model="subRepSutudentId"
                          :rules="[rules.min8, rules.over8]"
                          hint="お持ちでない方：0を8桁入力"
                          background-color="white"
                          counter="8"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-select
                          label="学科"
                          v-model.number="subRepDepartmentId"
                          :items="departments"
                          :menu-props="{ top: true, offsetY: true }"
                          item-text="name"
                          item-value="id"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-select>
                        <v-select
                          label="学年"
                          v-model.number="subRepGradeId"
                          :items="grades"
                          :menu-props="{ top: true, offsetY: true }"
                          item-text="name"
                          item-value="id"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-select>
                        <v-text-field
                          label="電話番号"
                          v-model="subRepTel"
                          :rules="[rules.min11, rules.over11]"
                          hint="ハイフンなしで半角入力"
                          persistent-hint
                          counter="11"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-text-field
                          label="メールアドレス"
                          v-model="subRepEmail"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    depressed
                    dark
                    color="btn"
                    @click="register()"
                    >登録
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <hr class="mt-n3" />
            <template>
              <div class="text-center" v-if="sub_reps.length === 0">
                <br /><br />
                <v-progress-circular
                  indeterminate
                  color="#009688"
                ></v-progress-circular>
                <br /><br />
              </div>
              <div v-else>
                <v-data-table
                  :headers="headers"
                  :items="sub_reps"
                  class="elevation-0 my-9"
                  @click:row="
                    (data) => $router.push({ path: `/sub_reps/${data.id}` })
                  "
                >
                  <template v-slot:item.created_at="{ item }">
                    {{ item.created_at | format-date }}
                  </template>
                  <template v-slot:item.updated_at="{ item }">
                    {{ item.updated_at | format-date }}
                  </template>
                </v-data-table>
              </div>
            </template>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from "~/components/Header.vue";
import Menu from "~/components/Menu.vue";
export default {
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "入力してください",
        min8: (v) => v.length >= 8 || "8桁かどうかを確認してください",
        over8: (v) => v.length <= 8 || "8桁かどうかを確認してください",
        min11: (v) => v.length >= 11 || "11桁かどうかを確認してください",
        over11: (v) => v.length <= 11 || "11桁かどうかを確認してください",
        max: (value) => value <= 1000 || "大きすぎます",
      },
      sub_reps: [],
      groups: [],
      dialog: false,
      Group: [],
      subRepName: [],
      subRepSutudentId: [],
      subRepGradeId: [],
      subRepDepartmentId: [],
      subRepTel: [],
      subRepEmail: [],
      headers: [
        { text: "ID", value: "id" },
        // { text: 'group_id', value: 'group_id' },
        { text: "名前", value: "name" },
        // { text: '学科', value: 'department_id' },
        // { text: '学年', value: 'grade_id' },
        { text: "電話番号", value: "tel" },
        { text: "メールアドレス", value: "email" },
        // { text: '学籍番号', value: 'student_id' },
        { text: "日時", value: "created_at" },
        { text: "編集日時", value: "updated_at" },
      ],
      // 課程
      departments: [
        { name: "機械創造工学課程", id: 1 },
        { name: "電気電子情報工学課程", id: 2 },
        { name: "物質材料工学課程", id: 3 },
        { name: "環境社会基盤工学課程", id: 4 },
        { name: "生物機能工学課程", id: 5 },
        { name: "情報・経営システム工学課程", id: 6 },
        { name: "機械創造工学専攻", id: 7 },
        { name: "電気電子情報工学専攻", id: 8 },
        { name: "物質材料工学専攻", id: 9 },
        { name: "環境社会基盤工学専攻", id: 10 },
        { name: "生物機能工学専攻", id: 11 },
        { name: "情報・経営システム工学専攻", id: 12 },
        { name: "原子力システム安全工学専攻", id: 13 },
        { name: "システム安全専攻", id: 14 },
        { name: "技術科学イノベーション専攻", id: 15 },
        { name: "情報・制御工学専攻", id: 16 },
        { name: "材料工学専攻", id: 17 },
        { name: "エネルギー・環境工学専攻", id: 18 },
        { name: "生物統合工学専攻", id: 19 },
        { name: "その他", id: 20 },
      ],
      // 学年
      grades: [
        { name: "B1 [学部1年]", id: 1 },
        { name: "B2 [学部2年]", id: 2 },
        { name: "B3 [学部3年]", id: 3 },
        { name: "B4 [学部4年]", id: 4 },
        { name: "M1 [修士1年]", id: 5 },
        { name: "M2 [修士2年]", id: 6 },
        { name: "D1 [博士1年]", id: 7 },
        { name: "D2 [博士2年]", id: 8 },
        { name: "D3 [博士3年]", id: 9 },
        { name: "GD1 [イノベ1年]", id: 10 },
        { name: "GD2 [イノベ2年]", id: 11 },
        { name: "GD3 [イノベ3年]", id: 12 },
        { name: "GD4 [イノベ4年]", id: 13 },
        { name: "GD5 [イノベ5年]", id: 14 },
        { name: "その他", id: 15 },
      ],
    };
  },
  mounted() {
    this.$axios
      .get("sub_reps", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.sub_reps = response.data;
      });

    this.$axios
      .get("/groups", {
        headers: {
          "Content-Type": "applicatiokn/json",
        },
      })
      .then((response) => {
        this.groups = response.data;
      });
  },

  methods: {
    reload: function () {
      this.$axios
        .get("/sub_reps", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.sub_reps = response.data;
        });
    },
    adjustHeight() {
      const textarea = this.$refs.activity;
      const resetHeight = new Promise(function (resolve) {
        resolve((textarea.style.height = "auto"));
      });
      resetHeight.then(function () {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.subRepName);
      params.append("student_id", this.subRepSutudentId);
      params.append("grade_id", this.subRepGradeId);
      params.append("group_id", this.Group);
      params.append("department_id", this.subRepDepartmentId);
      params.append("tel", this.subRepTel);
      params.append("email", this.subRepEmail);
      this.$axios.post("/sub_reps", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.subRepName = "";
        this.subRepSutudentId = "";
        this.subRepGradeId = "";
        this.groupCategoryId = "";
        this.subRepTel = "";
        this.subRepEmail = "";
      });
    },
  },
};
</script>
