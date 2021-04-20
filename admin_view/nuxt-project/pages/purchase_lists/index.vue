<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-cart</v-icon>購入品申請一覧
              <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        fab
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="openModal"
                      >
                        <v-icon dark>mdi-plus-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>購入品の追加</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        fab
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="reload"
                      >
                        <v-icon dark>mdi-reload</v-icon>
                      </v-btn>
                    </template>
                    <span>更新する</span>
                  </v-tooltip>
            </v-card-title>

                <v-dialog v-model="dialog" max-width="500">
                  <v-card>
                    <v-card-title class="headline blue-grey darken-3">
                      <div style="color: white">
                        <v-icon class="ma-2" dark>mdi-cart</v-icon
                        >購入品の追加
                      </div>
                      <v-spacer></v-spacer>
                      <v-btn text @click="dialog = false" fab dark>
                        ​ <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <v-form ref="form">
                            <v-select
                              label="参加団体名"
                              v-model="Group"
                              :items="groups"
                              :menu-props="{
                                top: true,
                                offsetY: true,
                              }"
                              item-text="name"
                              item-value="id"
                              outlined
                              @change="getPurchaseList(Group)"
                            ></v-select>
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
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        depressed
                        dark
                        color="btn"
                        @click="register()"
                      >登録
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

            <hr class="mt-n3">
            <template>
              <div class="text-center" v-if="purchase_lists.length === 0">
                <br><br>
                <v-progress-circular
                  indeterminate
                  color="#009688"
                  ></v-progress-circular>
                <br><br>
              </div>
              <div v-else>
                <v-data-table
                  :headers="headers"
                  :items="purchase_lists"
                  class="elevation-0 my-9"
                  @click:row="
                              (data) =>
                              $router.push({ path: `/purchase_lists/${data.purchase_list.id}`})
                              "
                  >
                  <template v-slot:item.purchase_list.is_fresh="{ item }">
                    <v-chip v-if="item.purchase_list.is_fresh == true" color="red" text-color="white" small>はい</v-chip>
                    <v-chip v-if="item.purchase_list.is_fresh == false" color="blue" text-color="white" small>いいえ</v-chip>
                  </template>
                  <template v-slot:item.purchase_list.created_at="{ item }">
                    {{ item.purchase_list.created_at | format-date }}
                  </template>
                  <template v-slot:item.purchase_list.updated_at="{ item }">
                    {{ item.purchase_list.updated_at | format-date }}
                  </template>
                </v-data-table>                      
              </div>
            </template>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      purchase_lists: [],
      food_products: [],
      groups: [],
      fes_dates: [],
      shops: [],
      dialog: false,
      Group: [],
      foodProductId: [],
      fesDateId: [],
      shopId: [],
      item: [],
      isFresh: [
        {label: 'はい', value: 'true'},
        {label: 'いいえ', value: 'false'}
      ],
      headers:[
        { text: 'ID', value: 'purchase_list.id' },
        { text: '参加団体', value: 'group' },
        { text: '販売食品', value: 'food_product' },
        { text: '購入品', value: 'purchase_list.items' },
        // { text: '店名', value: 'shop' },
        // { text: '開催日', value: 'fes_date.date' },
        { text: 'なまもの', value: 'purchase_list.is_fresh' },
        { text: '日時', value: 'purchase_list.created_at' },
        { text: '編集日時', value: 'purchase_list.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_purchase_lists', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.purchase_lists = response.data
      })
  },

  methods: {
    openModal: function() {
    this.$axios
      .get("/groups", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.groups = response.data;
      })
      this.$axios
      .get("/fes_dates", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fes_dates = response.data;
      })
      this.$axios
      .get("/shops", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.shops = response.data;
      })

      this.dialog=true;
    },

    getPurchaseList: function(groupId){
    const url = "/api/v1/get_food_products_from_group/" + groupId;
    this.$axios.get(url, {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.food_products = response.data
        console.log(this.group)
      })
    },

    reload: function () {
      this.$axios
        .get("/api/v1/get_purchase_lists", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.purchase_lists = response.data;
        });
    },

    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("food_product_id", this.foodProductId);
      params.append("fes_date_id", this.fesDateId);
      params.append("shop_id", this.shopId);
      params.append("items", this.item);
      params.append("is_fresh", this.isFresh);
      this.$axios.post("/purchase_lists", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.foodProductId = "";
        this.fesDateId = "";
        this.shopId = "";
        this.item = "";
        this.isFresh = "";
      });
    },
  }
}
</script>
