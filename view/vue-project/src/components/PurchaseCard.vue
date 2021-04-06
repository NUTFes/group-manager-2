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
                        <v-text-field
              label="購入物"
              ref="item"
              v-model="item"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
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
      fesDateList: [],
      foodProductList: [],
      shopList: [],
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
    axios.get(process.env.VUE_APP_URL + '/api/v1/get_current_fes_dates').then(
      (response) => {
        this.fesDateList = response.data
      }
    )
    axios.get(process.env.VUE_APP_URL + '/shops').then(
      (response) => {
        this.shopList = response.data
      }
    )
  }
};
</script>
