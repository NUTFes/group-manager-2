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
                    <router-link to="/purchase_lists">購入品一覧</router-link>
                  </div>
                </li>
                <li>
                  <div class="breadcrumbs-item">{{ purchase.items }}</div>
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
                {{ purchase.items }}
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="openModal"
                      fab
                      ><v-icon class="ma-5">mdi-pencil</v-icon>
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
                      ><v-icon class="ma-5">mdi-delete</v-icon>
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
                      <th>id：</th>
                      <td class="caption">
                        {{ purchase.id }}
                      </td>
                    </tr>
                    <tr>
                      <th>food_product_id：</th>
                      <td class="caption">
                        {{ purchase.food_product_id }}
                      </td>
                    </tr>
                    <tr>
                      <th>参加団体：</th>
                      <td class="caption">
                        {{ group }}
                      </td>
                    </tr>
                    <tr>
                      <th>販売食品：</th>
                      <td class="caption">
                        {{ food_product }}
                      </td>
                    </tr>
                    <tr>
                      <th>使用日：</th>
                      <td class="caption">
                        {{ fes_date.date }} - {{ fes_date.day }} -
                        {{ fes_date.days_num }}日目
                      </td>
                    </tr>
                    <tr>
                      <th>店：</th>
                      <td class="caption">
                        {{ shop }}
                      </td>
                    </tr>
                    <tr>
                      <th>なまもの：</th>
                      <td class="caption">
                        <v-chip
                          v-if="purchase.is_fresh == true"
                          color="red"
                          text-color="white"
                          small
                          >はい</v-chip
                        >
                        <v-chip
                          v-if="purchase.is_fresh == false"
                          color="blue"
                          text-color="white"
                          small
                          >いいえ</v-chip
                        >
                      </td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">
                        {{ purchase.created_at | format-date }}
                      </td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">
                        {{ purchase.updated_at | format-date }}
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
        <v-btn text color="white" to="/purchase_lists"
          ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div class="back-button">購入品一覧に戻る</div></v-btn
        >
      </v-col>
      <v-col></v-col>
    </v-row>

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

    <!-- modal window to edit -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline secondary white--text">
            <v-icon dark class="ma-5">mdi-pencil</v-icon>
            編集
          <v-spacer />
          <v-btn text @click="dialog = false" fab dark>
            <v-icon class="ma-5">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-form ref="form">
            <v-select
              label="団体"
              v-model.number="group_id"
              :items="groupList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              @change="changeGroupFoodProductList"
              clearable
              outlined
            />
            <v-select
              label="食品"
              v-model.number="food_product_id"
              :items="foodProductList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              clearable
              outlined
            ></v-select>
            <v-select
              label="購入店"
              ref="shop"
              v-model="shop_id"
              :items="shopList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
            <v-select
              label="生ものか"
              v-model="is_fresh"
              :menu-props="{ top: false, offsetY: true }"
              :items="isFreshList"
              item-text="name"
              item-value="bool"
              ref="isFresh"
              clearable
              outlined
            ></v-select>
            <v-select
              label="購入日"
              v-model.number="fes_date_id"
              :items="fesDateList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="date"
              item-value="id"
              clearable
              outlined
            />
            <v-text-field
              label="購入物"
              ref="item"
              v-model="items"
              text
              outlined
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="btn" @click="edit">登録</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      purchase: [],
      food_product: [],
      food_product_id: [],
      group: [],
      groups: [],
      shop: [],
      shop_id: [],
      fes_date: [],
      fes_date_id: [],
      items: [],
      expand: false,
      is_fresh: false,
      dialog: false,
      delete_dialog: false,
      fesDateList: [
        { date: "9/18", id: 1 },
        { date: "9/19", id: 2 },
        { date: "9/20", id: 3 }
      ],
      foodProductList: [],
      shopList: [
        { name: "アピタ 長岡店", id: 1 },
        { name: "イオン 長岡店", id: 2 },
        { name: "ウオロク 北山店", id: 3 },
        { name: "ウオロク 長岡店", id: 4 },
        { name: "カトウ食材", id: 5 },
        { name: "業務スーパー 中沢店", id: 6 },
        { name: "サンマート", id: 7 },
        { name: "スーパーセンタームサシ", id: 8 },
        { name: "チャレンジャー 北長岡店", id: 9 },
        { name: "ドン・キホーテ 長岡インター店", id: 10 },
        { name: "ナルス 大島店", id: 11 },
        { name: "なんじゃ村", id: 12 },
        { name: "原信 今朝白店", id: 13 },
        { name: "原信 古正寺店", id: 14 },
        { name: "原信 関原店", id: 15 },
        { name: "原信 寺島店", id: 16 },
        { name: "原信 来迎寺店", id: 17 },
        { name: "PLANT-5 見附店", id: 18 },
        { name: "三和園茶舗", id: 19 },
        { name: "大和屋 本店", id: 20 },
        { name: "やまや", id: 21 },
        { name: "リカードコミュニケーション おぐまや", id: 22 },
        { name: "良食生活館 きたまち店", id: 23 },
        { name: "山ス流通サービス株式会社", id: 24 },
        { name: "菜加", id: 25 },
        { name: "ひらせい 長岡ニュータウン店", id: 26 },
        { name: "紅屋重正", id: 27 },
        { name: "ダイレックス 喜多町店", id: 28 }
      ],
      isFreshList: [
        { name: "はい", bool: true },
        { name: "いいえ", bool: false }
      ]
    };
  },
  computed: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  methods: {
    async reload() {
      const url = "api/v1/get_purchase_list/" + this.$route.params.id;
      await this.$axios
        .get(url, {
          headers: { "Content-Type": "application/json" }
        })
        .then(response => {
          console.log(response.data.purchase_list);
          this.purchase = response.data.purchase_list;
          this.food_product = response.data.food_product;
          this.food_product_id = this.purchase.food_product_id;
          this.group = response.data.group;
          this.group_id = response.data.group_id;
          this.shop = response.data.shop;
          this.shop_id = this.purchase.shop_id;
          this.fes_date = response.data.fes_date;
          this.fes_date_id = this.purchase.fes_date_id;
          this.is_fresh = this.purchase.is_fresh;
          this.items = this.purchase.items;
        });
    },
    delete_yes() {
      const url = "/purchase_lists/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/purchase_lists");
    },
    async edit() {
      const edit_url =
        "/purchase_lists/" +
        this.purchase.id +
        "?group_id=" +
        this.group_id +
        "&food_product_id=" +
        this.food_product_id +
        "&shop_id=" +
        this.shop_id +
        "&fes_date_id" +
        this.fes_date_id +
        "&is_fresh=" +
        this.is_fresh +
        "&items=" +
        this.items;
      await this.$axios.put(edit_url, {
        headers: { "Content-Type": "application/json" }
      });
      await this.reload();

      this.dialog = false;
    },
    async openModal() {
      await this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.groupList = response.data;
        });

      await this.changeGroupFoodProductList();

      this.dialog = true;
    },
    changeGroupFoodProductList() {
      this.foodProductList = [];
      const foodProductUrl = "/api/v1/group_food_products/" + this.group_id;
      this.$axios
        .get(foodProductUrl, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(
          response => {
            response.data.forEach(foodProduct => {
              this.foodProductList.push(foodProduct);
            });
          },
          error => {
            console.error(error);
            return error;
          }
        );
    }
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    const url = "/api/v1/get_purchase_list/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.purchase = response.data.purchase_list;
        this.food_product = response.data.food_product;
        this.food_product_id = this.purchase.food_product_id;
        this.group = response.data.group;
        this.group_id = response.data.group_id;
        this.shop = response.data.shop;
        this.shop_id = this.purchase.shop_id;
        this.fes_date = response.data.fes_date;
        this.fes_date_id = this.purchase.fes_date_id;
        this.is_fresh = Boolean(this.purchase.is_fresh);
        this.items = this.purchase.items;
      });
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
