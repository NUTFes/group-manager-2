<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-table-chair</v-icon>在庫物品一覧
              <v-spacer></v-spacer>
              <v-tooltip top v-if="selfRoleId == 1">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2"
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="open_add_dialog"
                  >
                    <v-icon dark>mdi-plus-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>在庫物品の追加</span>
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
                    <v-icon class="ma-5" dark>mdi-table-chair</v-icon
                    >在庫物品の追加
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
                          label="物品"
                          v-model="rentalItemId"
                          :items="rental_items"
                          :menu-props="{
                            top: true,
                            offsetY: true
                          }"
                          item-text="name"
                          item-value="id"
                          outlined
                        ></v-select>
                        <v-select
                          label="場所"
                          v-model="stockerPlaceId"
                          :items="stocker_places"
                          :menu-props="{
                            top: true,
                            offsetY: true
                          }"
                          item-text="name"
                          item-value="id"
                          outlined
                        ></v-select>
                        <v-select
                          label="開催年"
                          v-model="fesYearId"
                          :items="fes_years"
                          :menu-props="{
                            top: true,
                            offsetY: true
                          }"
                          item-text="year_num"
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
              <div class="text-center" v-if="stocker_items.length === 0">
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
                  :items="stocker_items"
                  class="elevation-0 my-9"
                  @click:row="
                    data =>
                      $router.push({
                        path: `/stocker_items/${data.stocker_item.id}`
                      })
                  "
                >
                  <template v-slot:item.stocker_item.created_at="{ item }">
                    {{ item.stocker_item.created_at | format-date }}
                  </template>
                  <template v-slot:item.stocker_item.updated_at="{ item }">
                    {{ item.stocker_item.updated_at | format-date }}
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
      stocker_items: [],
      stocker_places: [],
      rental_items: [],
      fes_years: [],
      dialog: false,
      rentalItemId: [],
      stockerPlaceId: [],
      fesYearId: [],
      num: [],
      headers: [
        { text: "ID", value: "stocker_item.id" },
        { text: "場所", value: "stocker_place" },
        { text: "物品", value: "item" },
        { text: "個数", value: "stocker_item.num" },
        { text: "開催年", value: "fes_year" },
        { text: "日時", value: "stocker_item.created_at" },
        { text: "編集日時", value: "stocker_item.updated_at" }
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
      .get("/api/v1/get_stocker_items", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.stocker_items = response.data;
      });
  },
  methods: {
    open_add_dialog: function() {
      this.$axios
        .get("/stocker_places", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.stocker_places = response.data;
        });
      this.$axios
        .get("/rental_items", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.rental_items = response.data;
        });
      this.$axios
        .get("/fes_years", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.fes_years = response.data;
        });
      this.dialog = true;
    },
    reload: function() {
      this.$axios
        .get("/api/v1/get_stocker_items", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.stocker_items = response.data;
        });
    },
    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("rental_item_id", this.rentalItemId);
      params.append("stocker_place_id", this.stockerPlaceId);
      params.append("fes_year_id", this.fesYearId);
      params.append("num", this.num);
      this.$axios.post("/stocker_items", params).then(response => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.rentalItemId = "";
        this.stockerPlaceId = "";
        this.fesYearId = "";
        this.num = "";
      });
    }
  }
};
</script>
