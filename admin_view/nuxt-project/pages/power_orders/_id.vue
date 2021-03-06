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
                    <router-link to="/power_orders">電力申請一覧</router-link>
                  </div>
                </li>
                <li>
                  <div class="breadcrumbs-item">{{ power_order.item }}</div>
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
                {{ power_order.item }}
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
                      <td class="caption">{{ power_order.id }}</td>
                    </tr>
                    <tr>
                      <th>参加団体：</th>
                      <td class="caption">{{ group_name }}</td>
                    </tr>
                    <tr>
                      <th>製品：</th>
                      <td class="caption">{{ power_order.item }}</td>
                    </tr>
                    <tr>
                      <th>電力：</th>
                      <td class="caption">{{ power_order.power }}</td>
                    </tr>
                    <tr>
                      <th>メーカー：</th>
                      <td class="caption">{{ power_order.manufacturer }}</td>
                    </tr>
                    <tr>
                      <th>型番：</th>
                      <td class="caption">{{ power_order.model }}</td>
                    </tr>
                    <tr>
                      <th>製品URL：</th>
                      <td class="caption">
                        <a :href="power_order.item_url" target="_blank"
                          ><font color="blue">{{
                            power_order.item_url
                          }}</font></a
                        >
                      </td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">
                        {{ power_order.created_at | format-date }}
                      </td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">
                        {{ power_order.updated_at | format-date }}
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
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                その他
                <v-spacer></v-spacer>
              </v-card-title>
              <hr class="mt-n3" />
              <v-simple-table class="my-9">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th>申請会場 第一希望：</th>
                      <td class="caption">{{ first }}</td>
                    </tr>
                    <tr>
                      <th>申請会場 第二希望：</th>
                      <td class="caption">{{ second }}</td>
                    </tr>
                    <tr>
                      <th>申請会場 第三希望：</th>
                      <td class="caption">{{ third }}</td>
                    </tr>
                    <tr
                      v-for="(power_order, index) in power_orders"
                      :key="(power_order, index)"
                    >
                      <th>製品{{ index + 1 }}：</th>
                      <td class="caption">{{ power_order.item }}</td>
                    </tr>
                    <tr>
                      <th>合計電力：</th>
                      <td class="caption">{{ total_power }} W</td>
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
          <v-btn text color="white" to="/power_orders"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">電力申請一覧に戻る</div></v-btn
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
                  :items="group_list"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                />
                <v-text-field
                  label="製品名"
                  v-model="item"
                  clearable
                  outlined
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  label="電力(ワット)"
                  v-model="power"
                  clearable
                  outlined
                  type="number"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  label="メーカー"
                  v-model="manufacturer"
                  :rules="[rules.required]"
                  text
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  label="型番"
                  v-model="model"
                  :rules="[rules.required]"
                  text
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  label="製品URL"
                  v-model="itemUrl"
                  :rules="[rules.required]"
                  text
                  outlined
                  required
                ></v-text-field>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      power_orders: [],
      power_order: [],
      expand: false,
      dialog: false,
      group: [],
      group_id: [],
      group_name: [],
      first: [],
      second: [],
      third: [],
      item: [],
      power: [],
      manufacturer: [],
      model: [],
      itemUrl: [],
      edit_dialog: false,
      delete_dialog: false,
      group_list: [],
      success_snackbar: false,
      delete_snackbar: false,
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
    const url = "/api/v1/get_power_order/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.power_orders = response.data.power_orders;
        this.power_order = response.data.power_order;
        this.total_power = response.data.total_power;
        this.group = response.data.group;
        this.group_name = response.data.group_name;
        this.group_id = response.data.power_order.group_id;
        this.item = response.data.power_order.item;
        this.power = response.data.power_order.power;
        this.manufacturer = response.data.power_order.manufacturer;
        this.model = response.data.power_order.model;
        this.itemUrl = response.data.power_order.item_url;
        this.first = response.data.first;
        this.second = response.data.second;
        this.third = response.data.third;
      });
  },
  methods: {
    reload: function () {

      const url = "/api/v1/get_power_order/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.power_order = response.data.power_order;
          this.group = response.data.group;
          this.group_id = response.data.power_order.group_id;
          this.item = response.data.power_order.item;
          this.power = response.data.power_order.power;
          this.manufacturer = response.data.power_order.manufacturer;
          this.model = response.data.power_order.model;
          this.itemUrl = response.data.power_order.item_url;
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
    edit: function () {
      const edit_url =
        "power_orders/" +
        this.power_order.id +
        "?group_id=" +
        this.group_id +
        "&item=" +
        this.item +
        "&power=" +
        this.power +
        "&manufacturer=" +
        this.manufacturer +
        "&model=" +
        this.model +
        "&item_url=" +
        this.itemUrl;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {

          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function () {
      const url = "/power_orders/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/power_orders");
    },
  },

};
</script>
