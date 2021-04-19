<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-cube-outline</v-icon>割り当て物品一覧
              <v-spacer></v-spacer>
              <v-tooltip top v-if="selfRoleId == 1">
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
                    <v-icon class="ma-2" dark>mdi-cube-outline</v-icon
                    >割り当て物品の追加
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
                          item-text="name"
                          item-value="id"
                          outlined
                        ></v-select>
                        <v-select
                          label="物品"
                          v-model="itemId"
                          :items="item_list"
                          item-text="name"
                          item-value="id"
                          outlined
                        ></v-select>
                        <v-text-field
                          class="body-1"
                          label="個数"
                          v-model="num"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-select
                          label="在庫場所"
                          v-model="placeId"
                          :items="places"
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

            <hr class="mt-n3" />
            <template>
              <div
                class="text-center"
                v-if="assign_rental_items.length === 0"
              >
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
                  :items="assign_rental_items"
                  class="elevation-0 my-9"
                  @click:row="
                    data =>
                      $router.push({
                        path: `/assign_rental_items/${data.assign_rental_item.id}`
                      })
                  "
                >
                  <template
                    v-slot:item.assign_rental_item.created_at="{ item }"
                  >
                    {{ item.assign_rental_item.created_at | format-date }}
                  </template>
                  <template
                    v-slot:item.assign_rental_item.updated_at="{ item }"
                  >
                    {{ item.assign_rental_item.updated_at | format-date }}
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      assign_rental_items: [],
      food_products: [],
      groups: [],
      num: [],
      dialog: false,
      Group: [],
      itemId: [],
      foodProductId: [],
      placeId: [],
      item: [],
      item_list: [],
      headers: [
        { text: "ID", value: "assign_rental_item.id" },
        { text: "参加団体", value: "group" },
        { text: "物品", value: "item" },
        { text: "個数", value: "assign_rental_item.num" },
        { text: "在庫場所", value: "stocker_place" },
        { text: "日時", value: "assign_rental_item.created_at" },
        { text: "編集日時", value: "assign_rental_item.updated_at" }
      ]
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
      .get("/api/v1/get_assign_rental_items", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.assign_rental_items = response.data;
      });
  },

  methods: {
    openModal: function() {
      this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.groups = response.data;
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
        .get("/stocker_places", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.places = response.data;
        });
      this.dialog = true;
    },

    reload: function() {
      this.$axios
        .get("/api/v1/get_assign_rental_items", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.assign_rental_items = response.data;
          console.log("reload");
        });
    },

    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("rental_item_id", this.itemId);
      params.append("num", this.num);
      params.append("stocker_place_id", this.placeId);
      this.$axios.post("/assign_rental_items", params).then(response => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.itemId = "";
        this.num = "";
        this.placeId = "";
      });
    }
  }
};
</script>
<<<<<<< HEAD

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
======= >>>>>>> 3f172cd76df3dbaed33f2d88ac0196b12970257b
