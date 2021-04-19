<template>
  <div>
    <div v-if="place.length === 0">
      <NoData />
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <div class="card">
            <v-card-text dark>
              <div class="breadcrumbs">
                <ul>
                  <li>
                    <div class="breadcrumbs-item">
                      <router-link to="/places">会場一覧</router-link>
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">{{ place.name }}</div>
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
                  {{ place.name }}
                  <v-spacer></v-spacer>
                  <v-tooltip top v-if="selfRoleId == 1">
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
                        <th>ID：</th>
                        <td class="caption">{{ place.id }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ place.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ place.updated_at | format-date }}
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
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-for="group in groups" :key="group.id">
        <v-col>
          <v-card flat class="mx-15" v-if="group.user_id === user.id">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon>mdi-account-group</v-icon>
                  参加団体情報
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"
                    ><v-icon class="ma-5" color="#E040FB"
                      >mdi-pencil</v-icon
                    ></v-btn
                  >
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>団体名：</th>
                        <td class="caption">{{ group.name }}</td>
                      </tr>
                      <tr>
                        <th>企画名：</th>
                        <td class="caption">{{ group.project_name }}</td>
                      </tr>
                      <tr>
                        <th>活動内容：</th>
                        <td class="caption">{{ group.activity }}</td>
                      </tr>
                      <tr>
                        <th>グループカテゴリ：</th>
                        <td class="caption">{{ group.group_category_id }}</td>
                      </tr>
                      <tr>
                        <th>開催年：</th>
                        <td class="caption">{{ group.fes_year_id }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn text color="white" to="/places"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">会場一覧に戻る</div></v-btn
          >
        </v-col>
        <v-col></v-col>
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
                  <v-text-field
                    label="名前"
                    v-model="name"
                    clearable
                    outlined
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
            <v-btn depressed color="yes" dark @click="delete_yes">
              はい
            </v-btn>
            <v-btn depressed color="no" dark @click="delete_dialog = false">
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
import { mapState } from "vuex";
import NoData from "../../components/NoData.vue";

export default {
  computed: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  components: {
    NoData
  },
  data() {
    return {
      place: [],
      id: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
      rules: {
        required: value => !!value || "入力してください"
      }
    };
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    const url = "places/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.place = response.data;
        this.id = response.data.id;
        this.name = response.data.name;
      });
  },
  methods: {
    reload: function() {
      console.log("reload");
      const url = "/places/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.place = response.data;
          this.id = response.data.id;
          this.name = response.data.name;
        });
    },
    edit_dialog_open: function() {
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url = "/places/" + this.id + "?name=" + this.name;
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
      const url = "/places/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/places");
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
