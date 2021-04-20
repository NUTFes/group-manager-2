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
                    <router-link to="/place_orders">会場申請一覧</router-link>
                  </div>
                </li>
                <li>
                  <div class="breadcrumbs-item">{{ group_name }}</div>
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
                {{ group_name }}
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
                      <td class="caption">{{ place_order.id }}</td>
                    </tr>
                    <tr>
                      <th>参加団体：</th>
                      <td class="caption">{{ group_name }}</td>
                    </tr>
                    <tr>
                      <th>第一希望：</th>
                      <td class="caption">{{ first }}</td>
                    </tr>
                    <tr>
                      <th>第二希望：</th>
                      <td class="caption">{{ second }}</td>
                    </tr>
                    <tr>
                      <th>第三希望：</th>
                      <td class="caption">{{ third }}</td>
                    </tr>
                    <tr>
                      <th>備考：</th>
                      <td class="caption">{{ place_order.remark }}</td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">
                        {{ place_order.created_at | format-date }}
                      </td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">
                        {{ place_order.updated_at | format-date }}
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
          <v-btn text color="white" to="/place_orders"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">会場申請一覧に戻る</div></v-btn
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
                <v-select
                  label="第一希望"
                  v-model="first_id"
                  :items="places"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                />
                <v-select
                  label="第二希望希望"
                  v-model="second_id"
                  :items="places"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                />
                <v-select
                  label="第三希望希望"
                  v-model="third_id"
                  :items="places"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                />
                <v-textarea
                  label="備考"
                  v-model="remark"
                  clearable
                  outlined
                  :rules="[rules.required]"
                ></v-textarea>
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
            <v-icon>mdi-close</v-icon>
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
      place_order: [],
      power_orders: [],
      total_power: [],
      places: [],
      group_name: [],
      group_id: [],
      first: [],
      first_id: [],
      second: [],
      second_id: [],
      third: [],
      third_id: [],
      remark: [],
      expand: false,
      dialog: false,
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
    const url = "/api/v1/get_place_order/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.place_order = response.data.place_order;
        this.power_orders = response.data.power_orders;
        this.total_power = response.data.total_power;
        this.group_id = response.data.place_order.group_id;
        this.group_name = response.data.group_name;
        this.first = response.data.first;
        this.second = response.data.second;
        this.third = response.data.third;
        this.first_id = response.data.place_order.first;
        this.second_id = response.data.place_order.second;
        this.third_id = response.data.place_order.third;
        this.remark = response.data.place_order.remark;
      });
  },
  methods: {
    reload: function() {
      const url = "/api/v1/get_place_order/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.place_order = response.data.place_order;
          this.power_orders = response.data.power_orders;
          this.total_power = response.data.total_power;
          this.group_id = response.data.place_order.group_id;
          this.group_name = response.data.group_name;
          this.first = response.data.first;
          this.second = response.data.second;
          this.third = response.data.third;
          this.first_id = response.data.place_order.first;
          this.second_id = response.data.place_order.second;
          this.third_id = response.data.place_order.third;
          this.remark = response.data.place_order.remark;
        });
    },
    edit_dialog_open: function() {
      this.$axios
        .get("/places", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.places = response.data;
        });
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
        "/place_orders/" +
        this.place_order.id +
        "?group_id=" +
        this.group_id +
        "&first=" +
        this.first_id +
        "&second=" +
        this.second_id +
        "&third=" +
        this.third_id +
        "&remark=" +
        this.remark;
      console.log(edit_url);
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
      const url = "/place_orders/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/place_orders");
    }
  }
};
</script>
