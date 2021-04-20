<template>
  <div>
    <div v-if="this.sub_rep.length === 0">
      <NoData />
    </div>
    <div v-else>
      <v-row>
        <v-col>
            <v-card-text>
              <div class="breadcrumbs">
                <ul>
                  <li>
                    <div class="breadcrumbs-item">
                      <router-link to="/sub_reps">副代表一覧</router-link>
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">{{ sub_rep.name }}</div>
                  </li>
                </ul>
              </div>
            </v-card-text>
            <v-card flat class="mx-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    {{ sub_rep.name }}
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          text
                          v-bind="attrs"
                          v-on="on"
                          @click="edit_dialog_open"
                          fab
                        >
                          <v-icon class="ma-5">mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>編集</span>
                    </v-tooltip>
                    <v-tooltip top v-if="selfRoleId == (1 || 2)">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          text
                          v-bind="attrs"
                          v-on="on"
                          @click="delete_dialog = true"
                          fab
                        >
                          <v-icon class="ma-5">mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>削除</span>
                    </v-tooltip>
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th>参加団体：</th>
                          <td class="caption">{{ group }}</td>
                        </tr>
                        <tr>
                          <th>学籍番号：</th>
                          <td class="caption">{{ sub_rep.student_id }}</td>
                        </tr>
                        <tr>
                          <th>メールアドレス：</th>
                          <td class="caption">{{ sub_rep.email }}</td>
                        </tr>
                        <tr>
                          <th>電話番号：</th>
                          <td class="caption">{{ sub_rep.tel }}</td>
                        </tr>
                        <tr>
                          <th>課程：</th>
                          <td class="caption">{{ department }}</td>
                        </tr>
                        <tr>
                          <th>学年：</th>
                          <td class="caption">{{ grade }}</td>
                        </tr>
                        <tr>
                          <th>登録日時：</th>
                          <td class="caption">
                            {{ sub_rep.created_at | format-date }}
                          </td>
                        </tr>
                        <tr>
                          <th>編集日時：</th>
                          <td class="caption">
                            {{ sub_rep.updated_at | format-date }}
                          </td>
                          <td v-if="rights == 1">
                            <v-icon color="#E91E63">mdi-pencil</v-icon>
                          </td>
                          <td v-if="rights == 2">
                            <v-icon color="#E91E63">mdi-eye</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-card>
        </v-col>
      </v-row>
    </div>

    <v-row>
      <v-col>
        <div class="card">
          <v-btn text color="white" to="/sub_reps"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">副代表一覧に戻る</div></v-btn
          >
        </div>
      </v-col>
    </v-row>

    <!-- 編集ダイアログ -->
    <v-dialog v-model="edit_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-pencil</v-icon>編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_dialog = false" fab dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-form ref="form">
                <v-select
                  label="参加団体"
                  v-model="group_id"
                  :items="group_list"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                />
                <v-text-field
                  label="名前"
                  v-model="name"
                  clearable
                  outlined
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  label="学籍番号"
                  v-model="student_id"
                  clearable
                  outlined
                  :rules="[rules.required]"
                ></v-text-field>
                <v-select
                  label="学科"
                  v-model="department_id"
                  :items="departments"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                />
                <v-select
                  label="学年"
                  v-model="grade_id"
                  :items="grades"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                />
                <v-text-field
                  label="電話番号"
                  v-model="tel"
                  clearable
                  outlined
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  label="メールアドレス"
                  v-model="email"
                  clearable
                  outlined
                  :rules="[rules.required]"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="btn" @click="edit">
            編集する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 削除ダイアログ -->
    <v-dialog v-model="delete_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-delete</v-icon>削除
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="delete_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-title>
          {{ sub_rep.name }} を削除してよろしいですか？
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="yes" @click="delete_yes">
            はい
          </v-btn>
          <v-btn depressed dark color="no" @click="delete_dialog = false">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 編集成功SnackBar -->
    <v-snackbar v-model="success_snackbar" color="blue-grey" top elevation="24">
      編集しました

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import NoData from "../../components/NoData.vue";
import { mapState } from "vuex";

export default {
  components: {
    NoData
  },
  data() {
    return {
      sub_rep: [],
      name: [],
      group: [],
      group_id: [],
      email: [],
      tel: [],
      student_id: [],
      grade: [],
      grade_id: [],
      department: [],
      department_id: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
      group_list: [],
      success_snackbar: false,
      delete_snackbar: false,
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
        { name: "その他", id: 20 }
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
        { name: "その他", id: 15 }
      ],
      rules: {
        required: value => !!value || "入力してください"
      }
    };
  },
  computed: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    const url = "/api/v1/get_sub_rep_details/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.sub_rep = response.data.sub_rep;
        this.name = response.data.sub_rep.name;
        this.group = response.data.group;
        this.group_id = response.data.sub_rep.group_id;
        this.department_id = response.data.sub_rep.department_id;
        this.grade_id = response.data.sub_rep.grade_id;
        this.student_id = response.data.sub_rep.student_id;
        this.email = response.data.sub_rep.email;
        this.tel = response.data.sub_rep.tel;
        this.grade = response.data.grade;
        this.department = response.data.department;
      });
  },
  methods: {
    reload: function() {
      const url = "/api/v1/get_sub_rep_details/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.sub_rep = response.data.sub_rep;
          this.name = response.data.sub_rep.name;
          this.group = response.data.group;
          this.group_id = response.data.sub_rep.group_id;
          this.department_id = response.data.sub_rep.department_id;
          this.grade_id = response.data.sub_rep.grade_id;
          this.student_id = response.data.sub_rep.student_id;
          this.email = response.data.sub_rep.email;
          this.tel = response.data.sub_rep.tel;
          this.grade = response.data.grade;
          this.department = response.data.department;
        });
    },
    edit_dialog_open: function() {
      this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.group_list = response.data;
        });
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "sub_reps/" +
        this.sub_rep.id +
        "?group_id=" +
        this.group_id +
        "&name=" +
        this.name +
        "&department_id=" +
        this.department_id +
        "&grade_id=" +
        this.grade_id +
        "&tel=" +
        this.tel +
        "&email=" +
        this.email +
        "&student_id=" +
        this.student_id;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function() {
      const url = "/sub_reps/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/sub_reps");
    }
  }
};
</script>
