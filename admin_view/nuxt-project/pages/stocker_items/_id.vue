<template>
  <div>
    <div v-if="stocker_item.length === 0">
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
                      <router-link to="/stocker_items"
                        >在庫物品一覧</router-link
                      >
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">
                      {{ stocker_item.rental_item_id }}
                    </div>
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
                  {{ stocker_item.rental_item_id }}
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
                        <td class="caption">{{ stocker_item.id }}</td>
                      </tr>
                      <tr>
                        <th>物品：</th>
                        <td class="caption">{{ item }}</td>
                      </tr>
                      <tr>
                        <th>場所：</th>
                        <td class="caption">{{ stocker_place }}</td>
                      </tr>
                      <tr>
                        <th>個数：</th>
                        <td class="caption">{{ stocker_item.num }}</td>
                      </tr>
                      <tr>
                        <th>開催年：</th>
                        <td class="caption">{{ fes_year }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ stocker_item.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ stocker_item.updated_at | format-date }}
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
          <v-btn text color="white" to="/stocker_items"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">在庫物品一覧に戻る</div></v-btn
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
              ​ <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col>
                <v-form ref="form">
                  <v-select
                    label="物品"
                    v-model="item_id"
                    :items="item_list"
                    item-text="name"
                    item-value="id"
                    outlined
                  />
                  <v-select
                    label="場所"
                    v-model="place_id"
                    :items="places"
                    item-text="name"
                    item-value="id"
                    outlined
                  />
                  <v-text-field
                    label="数"
                    v-model="num"
                    clearable
                    outlined
                    :rules="[rules.required]"
                  />
                  <v-select
                    label="開催年"
                    v-model="fes_year_id"
                    :items="fes_years"
                    item-text="year_num"
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
      stocker_item: [],
      id: [],
      item: [],
      item_id: [],
      item_list: [],
      place: [],
      places: [],
      place_id: [],
      stocker_place: [],
      fes_year: [],
      fes_years: [],
      fes_year_id: [],
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
      .get("/stocker_places", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.places = response.data;
      });
    this.$axios
      .get("/rental_items", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.item_list = response.data;
      });
    this.$axios
      .get("/fes_years", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.fes_years = response.data;
      });
    const url = "/api/v1/get_stocker_item/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.data = response.data;
        this.stocker_item = response.data.stocker_item;
        this.id = response.data.stocker_item.id;
        this.place = response.data.place;
        this.place_id = response.data.stocker_item.stocker_place_id;
        this.item = response.data.item;
        this.item_id = response.data.stocker_item.rental_item_id;
        this.num = response.data.stocker_item.num;
        this.stocker_place = response.data.stocker_place;
        this.stocker_place = response.data.stocker_place;
        this.fes_year = response.data.fes_year;
        this.fes_year_id = response.data.stocker_item.fes_year_id;
      });
  },
  methods: {
    reload: function() {
      console.log("reload");
      const url = "/api/v1/get_stocker_item/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.data = response.data;
          this.stocker_item = response.data.stocker_item;
          this.id = response.data.stocker_item.id;
          this.place = response.data.place;
          this.place_id = response.data.stocker_item.stocker_place_id;
          this.item = response.data.item;
          this.item_id = response.data.stocker_item.rental_item_id;
          this.num = response.data.stocker_item.num;
          this.stocker_place = response.data.stocker_place;
          this.fes_year = response.data.fes_year;
          this.fes_year_id = response.data.stocker_item.fes_year_id;
        });
    },
    edit_dialog_open: function() {
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "/stocker_items/" +
        this.id +
        "?rental_item_id=" +
        this.item_id +
        "&stocker_place_id=" +
        this.place_id +
        "&num=" +
        this.num +
        "&fes_year_id=" +
        this.fes_year_id;
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
      const url = "/stocker_items/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/stocker_items");
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
