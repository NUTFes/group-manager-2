<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-map-marker</v-icon><b>購入品情報追加</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8" align="center">
            <v-card-text>
              <v-form ref="form">
                <v-select
                  label="販売食品"
                  v-model="foodProductId"
                  :items="food_products"
                  :menu-props="{
                    top: true,
                    offsetY: true,
                  }"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
              <v-text-field
                class="body-1"
                label="購入品"
                v-model="item"
                background-color="white"
                outlined
                clearable
              >
              </v-text-field>
                <v-select
                  label="なまもの"
                  :items="isFresh"
                  item-text="label"
                  item-value="value"
                  :menu-props="{
                    top: true,
                    offsetY: true,
                  }"
                  outlined
                ></v-select>
                <v-select
                  label="開催日"
                  v-model="fesDateId"
                  :items="fes_dates"
                  item-text="date"
                  item-value="id"
                  outlined
                ></v-select>
                <v-select
                  label="店"
                  v-model="shopId"
                  :items="shops"
                  :menu-props="{
                    top: true,
                    offsetY: true,
                  }"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
              </v-form>
            </v-card-text>
            <v-row>
              <v-col cols=4></v-col>
                <v-col cols=4>
                  <v-btn color="blue darken-1" large block dark @click="register">編集する</v-btn>
                </v-col>
                <v-col cols=4></v-col>
            </v-row>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
   props: {
    groupId: Number,
  },
  data () {
    return {
      isDisplay: false,
      food_products: [],
      purchase_lists: [],
      groups: [],
      fes_dates: [],
      shops: [],
      Group: [],
      foodProductId: [],
      fesDateId: [],
      shopId: [],
      item: [],
      isFresh: [
        {label: 'はい', value: 'true'},
        {label: 'いいえ', value: 'false'}
      ],

    }
  },
  mounted(groupId) {
    axios.get(process.env.VUE_APP_URL + "/fes_dates", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fes_dates = response.data;
      })
    axios.get(process.env.VUE_APP_URL + "/shops", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.shops = response.data;
      })
      axios.get(process.env.VUE_APP_URL + "/api/v1/get_food_products_from_group/" + this.groupId, {
        headers: {
        "Content-Type": "application/json",
        }
        })
        .then(response => {
        this.food_products = response.data;
        })
    },

  methods: {
    register: function () {
      axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("food_product_id", this.foodProductId);
      params.append("fes_date_id", this.fesDateId);
      params.append("shop_id", this.shopId);
      params.append("items", this.item);
      params.append("is_fresh", this.isFresh);
      axios.post(process.env.VUE_APP_URL + "/purchase_lists", params).then((response) => {
        console.log(response);
        this.isDisplay = false;
        this.$emit('reload')
        this.Group = "";
        this.foodProductId = "";
        this.fesDateId = "";
        this.shopId = "";
        this.item = "";
        this.isFresh = "";
      });
    },
    getFoodProducts: function() {
      axios.get(process.env.VUE_APP_URL + "/api/v1/get_food_products_from_group/" + this.groupId, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid")
        }
      })
        .then(response => {
          this.food_products = response.data;
        });
    },
  }
}
</script>
