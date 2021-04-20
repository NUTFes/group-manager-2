<template>
  <div>
    <div v-if="food_product.length === 0">
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
                      <router-link to="/food_products"
                        >販売食品一覧</router-link
                      >
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">{{ food_product.name }}</div>
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
                  {{ food_product.name }}
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
                        <td class="caption">{{ food_product.id }}</td>
                      </tr>
                      <tr>
                        <th>参加団体：</th>
                        <td class="caption">{{ group }}</td>
                      </tr>
                      <tr>
                        <th>１日目の個数：</th>
                        <td class="caption">
                          {{ food_product.first_day_num }}
                        </td>
                      </tr>
                      <tr>
                        <th>２日目の個数：</th>
                        <td class="caption">
                          {{ food_product.second_day_num }}
                        </td>
                      </tr>
                      <tr>
                        <th>調理の有無：</th>
                        <td
                          v-if="food_product.is_cooking == true"
                          class="caption"
                        >
                          <v-chip color="red" text-color="white" small
                            >する</v-chip
                          >
                        </td>
                        <td
                          v-if="food_product.is_cooking == false"
                          class="caption"
                        >
                          <v-chip color="blue" text-color="white" small
                            >しない</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ food_product.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ food_product.updated_at | format-date }}
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

      <v-row>
        <v-col>
          <v-btn text color="white" to="/food_products"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">販売食品一覧に戻る</div></v-btn
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
                  <v-text-field
                    label="名前"
                    v-model="name"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-select
                    label="参加団体"
                    v-model="group_id"
                    :items="groups"
                    item-text="name"
                    item-value="id"
                    outlined
                  />
                  <v-text-field
                    label="1日目の個数"
                    v-model="first_day_num"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    label="2日目の個数"
                    v-model="second_day_num"
                    text
                    outlined
                    clearable
                    :rules="[rules.required]"
                  />
                  <v-select
                    label="調理の有無"
                    v-model="is_cooking"
                    :items="cooking_items"
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
            <v-btn depressed dark color="yes" dark @click="delete_yes">
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
      food_product: [],
      name: [],
      group: [],
      group_id: [],
      first_day_num: [],
      second_day_num: [],
      is_cooking: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
      cooking_items: [
        { label: "する", value: true },
        { label: "しない", value: false }
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
    this.$axios
      .get("/groups", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.groups = response.data;
      });
    const url = "/api/v1/get_food_product/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.data = response.data;
        this.food_product = response.data.food_product;
        this.id = response.data.food_product.id;
        this.name = response.data.food_product.name;
        this.group = response.data.group;
        this.group_id = response.data.food_product.group_id;
        this.first_day_num = response.data.food_product.first_day_num;
        this.second_day_num = response.data.food_product.second_day_num;
        this.is_cooking = response.data.food_product.is_cooking;
      });
  },
  methods: {
    reload: function() {
      console.log("reload");
      const url = "/api/v1/get_food_product/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.data = response.data;
          this.food_product = response.data.food_product;
          this.id = response.data.food_product.id;
          this.name = response.data.food_product.name;
          this.group = response.data.group;
          this.group_id = response.data.food_product.group_id;
          this.first_day_num = response.data.food_product.first_day_num;
          this.second_day_num = response.data.food_product.second_day_num;
          this.is_cooking = response.data.food_product.is_cooking;
        });
    },
    edit_dialog_open: function() {
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "/food_products/" +
        this.id +
        "?group_id=" +
        this.group_id +
        "&name=" +
        this.name +
        "&first_day_num=" +
        this.first_day_num +
        "&second_day_num=" +
        this.second_day_num +
        "&is_cooking=" +
        this.is_cooking;
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
      const url = "/food_products/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/food_products");
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
