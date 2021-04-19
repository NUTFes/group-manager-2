<template>
  <div>
    <div v-if="employee.length === 0">
      <NoData />
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <div class="card">
            <v-card-text>
              <div class="breadcrumbs">
                <ul>
                  <li>
                    <div class="breadcrumbs-item">
                      <router-link to="/employees">従業員一覧</router-link>
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">{{ employee.name }}</div>
                  </li>
                </ul>
              </div>
            </v-card-text>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat class="mx-15">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  {{ employee.name }}
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
                        <th>ID：</th>
                        <td class="caption">{{ employee.id }}</td>
                      </tr>
                      <tr>
                        <th>参加団体：</th>
                        <td class="caption">{{ group }}</td>
                      </tr>
                      <tr>
                        <th>学籍番号：</th>
                        <td class="caption">{{ employee.student_id }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ employee.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ employee.updated_at | format-date }}
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

      <v-row>
        <v-col>
          <v-btn text color="white" to="/employees"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">従業員一覧に戻る</div></v-btn
          >
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
              ​ <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col>
                <v-form ref="form">
                  <v-select
                    label="参加団体"
                    v-model="group_id"
                    :items="groups"
                    item-text="name"
                    item-value="id"
                    outlined
                  />
                  <v-text-field
                    label="名前"
                    v-model="name"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    label="学籍番号"
                    v-model="student_id"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
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
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-title>
            削除してよろしいですか？
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
      <v-snackbar
        v-model="success_snackbar"
        color="blue-grey"
        top
        elevation="24"
      >
        編集しました

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
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
      data: [],
      id: [],
      group: [],
      employee: [],
      student_id: [],
      name: [],
      group_id: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
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
    this.$axios
      .get("/groups", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.groups = response.data;
      });
    const url = "/api/v1/get_employee/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.data = response.data;
        this.employee = response.data.employee;
        this.id = response.data.employee.id;
        this.group = response.data.group;
        this.student_id = response.data.employee.student_id;
        this.group_id = response.data.employee.group_id;
        this.name = response.data.employee.name;
      });
  },
  methods: {
    reload: function() {
      console.log("reload");
      const url = "/api/v1/get_employee/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.employee = response.data.employee;
          this.id = response.data.employee.id;
          this.group = response.data.group;
          this.student_id = response.data.employee.student_id;
          this.group_id = response.data.employee.group_id;
          this.name = response.data.employee.name;
        });
    },
    edit_dialog_open: function() {
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "/employees/" +
        this.id +
        "?group_id=" +
        this.group_id +
        "&name=" +
        this.name +
        "&student_id=" +
        this.student_id;
      console.log(edit_url);
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          console.log(response);
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function() {
      const url = "/employees/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/employees");
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
