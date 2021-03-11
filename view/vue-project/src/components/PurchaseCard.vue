<template>
  <v-container class="justify-content-center">
    <v-row>
      <v-col cols="1" />
      <v-col cols="10" align="center">
        <v-card-text>
          <v-form ref="form">
            <v-select
              label="食品"
              v-model.number="foodProductId"
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
              v-model="shopId"
              :rules="[rules.required]"
              :items="shopList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
            <p align="left">
              生ものか
              <v-btn-toggle
                class="mb-6 ml-6"
                v-model="isFresh"
                borderless
                dense
                ref="isFresh"
                color="purple accent-2"
              >
                <v-btn value="true">YES</v-btn>
                <v-btn value="false">NO</v-btn>
              </v-btn-toggle>
            </p>
            <v-select
              label="購入日"
              v-model.number="fesDateId"
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
              v-model="item"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-col>
      <v-col cols="1" />
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      rules: {
        required: value => !!value || "入力してください"
      },
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
      valid: false,
      groupId: localStorage.getItem("group_id")
    };
  },

  computed: {
    form() {
      return {
        foodProductId: "",
        shopId: "",
        fesDateId: "",
        isFresh: "",
        item: ""
      };
    }
  },
  methods: {
    cancel() {
      this.$refs.form.reset();
    },
    validate() {
      if (!this.$refs.form.validate()) {
        valid = false;
        return false;
      }
      return true;
    },
    submit() {
      const url = process.env.VUE_APP_URL + "/purchase_lists";
      let params = new URLSearchParams();
      params.append("food_product_id", this.foodProductId);
      params.append("shop_id", this.shopId);
      params.append("fes_date_id", this.fesDateId);
      params.append("is_fresh", this.isFresh);
      params.append("items", this.item);

      params.forEach(element => console.log(element));
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.post(url, params).then(
        response => {
          console.log("response:", response);
          return "ok";
        },
        error => {
          console.log("登録できませんでした");
          return error;
        }
      );
    }
  },

  mounted() {
    const foodProductUrl =
      process.env.VUE_APP_URL + "/api/v1/group_food_products/" + this.groupId;
    axios
      .get(foodProductUrl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid")
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
};
</script>
