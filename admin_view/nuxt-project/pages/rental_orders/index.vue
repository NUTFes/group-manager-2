<template>
  <v-row>
    <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-seat</v-icon>物品申請一覧
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="dialog = true"
                    >
                      <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>物品の追加</span>
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
                      <v-icon class="ma-5" dark>mdi-account-group</v-icon
                      >参加団体の追加
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false" fab dark>
                      <v-icon>mdi-close</v-icon>
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
                          ></v-select>
                          <v-select
                            label="貸し出し物品"
                            v-model="item_id"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-text-field
                            label="個数"
                            v-model="num"
                            background-color="white"
                            outlined
                            clearable
                            type="number"
                          >
                          </v-text-field>
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

              <hr class="mt-n3" />
              <template>
                <div class="text-center" v-if="rental_orders.length === 0">
                  <br /><br />
                  <v-progress-circular
                    indeterminate
                    color="#009688"
                  ></v-progress-circular>
                  <br /><br />
                </div>
                <div v-else>
                  <v-data-table
                    :headers="headers"
                    :items="rental_orders"
                    class="elevation-0 my-9"
                    @click:row="
                      (data) =>
                        $router.push({
                          path: `/rental_orders/${data.rental_order.id}`,
                        })
                    "
                  >
                    <template v-slot:item.rental_order.created_at="{ item }">
                      {{ item.rental_order.created_at | format-date }}
                    </template>
                    <template v-slot:item.rental_order.updated_at="{ item }">
                      {{ item.rental_order.updated_at | format-date }}
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
      rules: {
        required: (value) => !!value || "入力してください",
      },
      rental_orders: [],
      groups: [],
      Group: [],
      item_list: [],
      item: [],
      item_id: [],
      num: [],
      dialog: false,
      headers: [
        { text: "ID", value: "rental_order.id" },
        { text: "参加団体", value: "group" },
        { text: "貸し出し物品", value: "item" },
        { text: "個数", value: "rental_order.num" },
        { text: "日時", value: "rental_order.created_at" },
        { text: "編集日時", value: "rental_order.updated_at" },
      ],
    };
  },
  mounted() {
    this.$axios
      .get("/api/v1/get_rental_orders", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.rental_orders = response.data;
        this.item_id = response.data.rental_item_id
        this.num = response.data.num
        console.log(response.data)
      });
      
    this.$axios
      .get("/groups", {
        headers: {
          "Content-Type": "applicatiokn/json",
        },
      })
      .then((response) => {
        this.groups = response.data;
      });
      
    this.$axios
      .get("/rental_items", {
        headers: {
          "Content-Type": "applicatiokn/json",
        },
      })
      .then((response) => {
        this.item_list = response.data;
      });
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_rental_orders", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.rental_orders = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("rental_item_id", this.item_id);
      params.append("num", this.num);
      this.$axios.post("/rental_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.item_id = "";
        this.num = "";
      });
    },
  },
};
</script>
