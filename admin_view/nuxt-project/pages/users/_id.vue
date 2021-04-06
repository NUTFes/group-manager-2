<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
            <div class="breadcrumbs">
              <ul>
                <li>
                  <div class="breadcrumbs-item">
                    <router-link to="/users">ユーザー一覧</router-link>
                  </div>
                </li>
                <li>
                  <div class="breadcrumbs-item">{{ show.user_name }}</div>
                </li>
              </ul>
            </div>
          </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
          <v-card flat>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon v-if="user.role_id == 1" color="red" class="ma-1"
                    >mdi-account-cog</v-icon
                  >
                  <v-icon v-if="user.role_id == 2" color="green"
                    >mdi-account-tie</v-icon
                  >
                  <v-icon v-if="user.role_id == 3" color="blue"
                    >mdi-account</v-icon
                  >
                  {{ show.user_name }}
                  <v-spacer></v-spacer>
                  <v-tooltip top v-if="email != uid && selfRoleId == 1">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="edit_user_info_dialog = true"
                        fab
                      >
                        <v-icon class="ma-5">mdi-account-edit-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>ユーザー情報編集</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="reset_password_dialog = true"
                        fab
                      >
                        <v-icon class="ma-5">mdi-lock-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>パスワード変更</span>
                  </v-tooltip>
                  <v-tooltip top v-if="selfRoleId == 1">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="edit_role_dialog_open"
                        fab
                      >
                        <v-icon class="ma-5">mdi-star-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>権限編集</span>
                  </v-tooltip>
                  <v-tooltip top v-if="selfRoleId == 1">
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
                        <th>学籍番号：</th>
                        <td class="caption">{{ show.student_id }}</td>
                      </tr>
                      <tr>
                        <th>学年：</th>
                        x
                        <td class="caption">{{ show.grade }}</td>
                      </tr>
                      <tr>
                        <th>課程：</th>
                        <td class="caption">{{ show.department }}</td>
                      </tr>
                      <tr>
                        <th>電話番号：</th>
                        <td class="caption">{{ show.tel }}</td>
                      </tr>
                      <tr>
                        <th>メールアドレス：</th>
                        <td class="caption">{{ show.email }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ user.created_at || format - date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ user.updated_at || format - date }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row v-for="(group, i) in show.groups" :key="i">
      <v-col>
        <div class="card">
          <v-card
            flat
            :to="{
              name: 'groups-id',
              params: {
                id: group.group.id
              }
            }"
          >
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10"
                >{{ data }}
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon class="mr-2">mdi-account-group</v-icon>
                  申請参加団体情報
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"></v-btn>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>団体名：</th>
                        <td class="caption">{{ group.group.name }}</td>
                      </tr>
                      <tr>
                        <th>企画名：</th>
                        <td class="caption">{{ group.group.project_name }}</td>
                      </tr>
                      <tr>
                        <th>活動内容：</th>
                        <td class="caption">{{ group.group.activity }}</td>
                      </tr>
                      <tr>
                        <th>グループカテゴリ：</th>
                        <td class="caption">{{ group.category }}</td>
                      </tr>
                      <tr>
                        <th>開催年：</th>
                        <td class="caption">{{ group.fes_year }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn text color="white" to="/users"
          ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div class="back-button">ユーザー一覧に戻る</div></v-btn
        >
      </v-col>
      <v-col></v-col>
    </v-row>

    <!-- ユーザー情報編集ダイアログ -->
    <v-dialog v-model="edit_user_info_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-account-edit-outline</v-icon
            >ユーザー情報編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_user_info_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-form ref="form">
                <v-text-field
                  label="名前"
                  v-model="name"
                  :rules="[rules.requied]"
                  outlined
                />
                <v-text-field
                  label="学籍番号"
                  v-model="student_id"
                  :rules="[rules.requied]"
                  outlined
                  counter="8"
                />
                <v-select
                  label="学年"
                  v-model="grade_id"
                  :items="items_grade"
                  item-text="label"
                  item-value="id"
                  outlined
                />
                <v-select
                  label="課程"
                  v-model="department_id"
                  :items="items_department"
                  item-text="label"
                  item-value="id"
                  outlined
                />
                <v-text-field
                  label="電話番号"
                  v-model="tel"
                  :rules="[rules.requied]"
                  outlined
                  counter="11"
                />
                <v-text-field
                  label="メールアドレス"
                  v-model="email"
                  :rules="[rules.requied]"
                  outlined
                />
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#78909C" dark @click="edit_user_info">
            編集する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  パスワード再設定ダイアログ -->
    <v-dialog v-model="reset_password_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-lock-outline</v-icon>パスワード変更
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="reset_password_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-form ref="form">
                <v-text-field
                  label="新しいパスワード"
                  v-model="password"
                  :append-icon="show_pass ? 'mdi-eye-off' : 'mdi-eye'"
                  :rules="[rules.requied, rules.min]"
                  :type="show_pass ? 'password' : 'text'"
                  hint="8文字以上"
                  counter
                  outlined
                  @click:append="show_pass = !show_pass"
                ></v-text-field>
                <v-text-field
                  label="新しいパスワードの再入力"
                  v-model="password_confirmation"
                  :append-icon="
                    show_pass_confirmation ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  :rules="[rules.requied, rules.min, rules.match]"
                  :type="show_pass_confirmation ? 'password' : 'text'"
                  hint="8文字以上"
                  counter
                  outlined
                  @click:append="
                    show_pass_confirmation = !show_pass_confirmation
                  "
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#78909C" dark @click="reset_password">
            変更する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 権限編集ダイアログ -->
    <v-dialog v-model="edit_role_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-star-outline</v-icon>権限編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_role_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-form ref="form">
                <v-select
                  label="権限"
                  v-model="role_id"
                  :items="items_role"
                  item-text="label"
                  item-value="id"
                  outlined
                />
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#78909C" dark @click="edit_role">
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
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-title>
          削除してよろしいですか？
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="red" dark @click="delete_yes">
            はい
          </v-btn>
          <v-btn flat color="blue" dark @click="delete_dialog = false">
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
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  data() {
    return {
      uid: localStorage.getItem("uid"),
      show: [],
      user: [],
      user_id: [],
      name: [],
      email: [],
      password: [],
      password_confirmation: [],
      role_id: [],
      role: [],
      tel: [],
      student_id: [],
      grade_id: [],
      department_id: [],
      detail: [],
      group_categories: [],
      fes_years: [],
      expand: false,
      show_pass: true,
      show_pass_confirmation: true,
      edit_user_info_dialog: false,
      reset_password_dialog: false,
      edit_role_dialog: false,
      delete_dialog: false,
      items_role: [
        { label: "developer", id: 1 },
        { label: "maneger", id: 2 },
        { label: "user", id: 3 }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        console.log(response);
        this.student_id = response.data.student_id;
        this.grade_id = response.data.grade_id;
        this.department_id = response.data.department_id;
        this.tel = response.data.tel;
        this.show = response.data;
        this.user = response.data.user;
        this.user_id = response.data.user_id;
        this.name = response.data.user.name;
        this.email = response.data.user.email;
        this.role_id = response.data.user.role_id;
      });
  },
  methods: {
    reload: function() {
      const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.show = response.data;
          this.user = response.data.user;
          this.role_id = response.data.user.role_id;
        });
    },
    edit_role_dialog_open: function() {
      this.edit_role_dialog = true;
    },
    edit_role: function() {
      const edit_url =
        "/api/v1/update_user/" + this.user.id + "/" + this.role_id;
      console.log(edit_url);
      this.$axios
        .get(edit_url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          console.log(response);
          this.reload();
          this.edit_role_dialog = false;
          this.success_snackbar = true;
        });
    },
    edit_user_info: function() {
      if (!this.$refs.form.validate()) return;
      const edit_user_info_url = "/api/v1/users/edit_user_info";
      var params = {
        user_id: this.user_id,
        name: this.name,
        student_id: this.student_id,
        grade_id: this.grade_id,
        department_id: this.department_id,
        tel: this.tel,
        email: this.email
      };
      this.$axios.post(edit_user_info_url, params).then(response => {
        this.reload();
        this.edit_user_info_dialog = false;
        this.success_snackbar = true;
      });
    },
    reset_password: function() {
      if (!this.$refs.form.validate()) return;
      const reset_password_url = "/api/v1/users/reset_password";
      var params = {
        user_id: this.user_id,
        password: this.password,
        password_confirmation: this.password_confirmation
      };
      this.$axios.post(reset_password_url, params).then(response => {
        this.reload();
        this.reset_password_dialog = false;
        this.success_snackbar = true;
      });
    },
    delete_yes: function() {
      this.$router.push("/users");
    }
  }
};
</script>

<style scoped>
td {
  width: 70%;
}
th {
  width: 30%;
}
</style>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
