<template>
  <div>
    <div v-if="stage.length === 0">
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
                      <router-link to="/stages">ステージ一覧</router-link>
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">{{ stage.name }}</div>
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
                  {{ stage.name }}
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
                        <td class="caption">{{ stage.id }}</td>
                      </tr>
                      <tr>
                        <th>晴れ：</th>
                        <td>
                          <v-chip
                            v-if="stage.enable_sunny == true"
                            color="red"
                            text-color="white"
                            small
                            >使用可能</v-chip
                          >
                          <v-chip
                            v-if="stage.enable_sunny == false"
                            color="blue"
                            text-color="white"
                            small
                            >使用不可能</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>雨：</th>
                        <td>
                          <v-chip
                            v-if="stage.enable_rainy == true"
                            color="red"
                            text-color="white"
                            small
                            >使用可能</v-chip
                          >
                          <v-chip
                            v-if="stage.enable_rainy == false"
                            color="blue"
                            text-color="white"
                            small
                            >使用不可能</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ stage.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ stage.updated_at | format-date }}
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
          <div class="card">
            <v-btn text color="white" to="/stages"
              ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
              <div class="back-button">ステージ一覧に戻る</div></v-btn
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
                  <v-text-field
                    label="名前"
                    v-model="name"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-select
                    label="晴れ"
                    v-model="enable_sunny"
                    :items="enable_items"
                    item-text="label"
                    item-value="value"
                    outlined
                  />
                  <v-select
                    label="雨"
                    v-model="enable_rainy"
                    :items="enable_items"
                    item-text="label"
                    item-value="value"
                    outlined
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
      stage: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
      id: [],
      name: [],
      enable_sunny: [],
      enable_rainy: [],
      enable_items: [
        { label: "使用可能", value: true },
        { label: "使用不可能", value: false }
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
    this.$store.dispatch("users/getRole");
    const url = "/stages/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.stage = response.data;
        this.id = response.data.id;
        this.name = response.data.name;
        this.enable_sunny = response.data.enable_sunny;
        this.enable_rainy = response.data.enable_rainy;
      });
  },
  methods: {
    reload: function() {
      console.log("reload");
      const url = "/stages/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.stage = response.data;
          this.name = response.data.name;
          this.id = response.data.id;
          this.enable_sunny = response.data.enable_sunny;
          this.enable_rainy = response.data.enable_rainy;
        });
    },
    edit_dialog_open: function() {
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "/stages/" +
        this.id +
        "?name=" +
        this.name +
        "&enable_sunny=" +
        this.enable_sunny +
        "&enable_rainy=" +
        this.enable_rainy;
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
      const url = "/stages/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/stages");
    }
  }
};
</script>
