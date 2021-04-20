<template>
  <div>
    <div v-if="shop.length === 0">
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
                      <router-link to="/shops">店一覧</router-link>
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">{{ shop.name }}</div>
                  </li>
                </ul>
              </div>
            </v-card-text>
            <v-card flat class="mx-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    {{ shop.name }}
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
                          <td class="caption">{{ shop.id }}</td>
                        </tr>
                        <tr>
                          <th>店名：</th>
                          <td class="caption">{{ shop.name }}</td>
                        </tr>
                        <tr>
                          <th>開店時間：</th>
                          <td class="caption">{{ shop.opening_hours }}</td>
                        </tr>
                        <tr>
                          <th>電話番号：</th>
                          <td class="caption">{{ shop.tel }}</td>
                        </tr>
                        <tr>
                          <th>住所：</th>
                          <td class="caption">{{ shop.address }}</td>
                        </tr>
                        <tr>
                          <th>登録日時：</th>
                          <td class="caption">
                            {{ shop.created_at | format-date }}
                          </td>
                        </tr>
                        <tr>
                          <th>編集日時：</th>
                          <td class="caption">
                            {{ shop.updated_at | format-date }}
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

      <v-row>
        <v-col>
          <div class="card">
            <v-btn text color="white" to="/shops"
              ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
              <div class="back-button">店一覧に戻る</div></v-btn
            >
          </div>
        </v-col>
      </v-row>

      <!-- 編集ダイアログ -->
      <v-dialog v-model="edit_dialog" width="500">
        <v-card>
          <v-card-title class="headline secondary">
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
                  <v-text-field
                    label="店名"
                    v-model="name"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    label="開店時間"
                    v-model="opening_hours"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    label="電話番号"
                    v-model="tel"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    label="住所"
                    v-model="address"
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
            <v-btn depressed dark color="btn" @click="edit"> 編集する </v-btn>
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

          <v-card-title> 削除してよろしいですか？ </v-card-title>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed dark color="yes" @click="delete_yes"> はい </v-btn>
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
      shop: [],
      id: [],
      name: [],
      tel: [],
      opening_hours: [],
      address: [],
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
    const url = "/shops/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.shop = response.data;
        this.id = response.data.id;
        this.name = response.data.name;
        this.tel = response.data.tel;
        this.opening_hours = response.data.opening_hours;
        this.address = response.data.address;
      });
  },
  methods: {
    reload: function() {
      console.log("reload");
      const url = "/shops/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.shop = response.data;
          this.id = response.data.id;
          this.name = response.data.name;
          this.tel = response.data.tel;
          this.opening_hours = response.data.opening_hours;
          this.address = response.data.address;
        });
    },
    edit_dialog_open: function() {
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "/shops/" +
        this.id +
        "?name=" +
        this.name +
        "&tel=" +
        this.tel +
        "&opening_hours=" +
        this.opening_hours +
        "&address=" +
        this.address;
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
      const url = "/shops/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/shops");
    }
  }
};
</script>
