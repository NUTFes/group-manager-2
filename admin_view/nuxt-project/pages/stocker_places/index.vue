<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-home-map-marker</v-icon>在庫場所一覧
              <v-spacer></v-spacer>
              <v-tooltip top v-if="selfRoleId == 1">
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
                <span>在庫場所の追加</span>
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
                    <v-icon class="ma-5" dark>mdi-home-map-marker</v-icon
                    >在庫場所の追加
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
                        <v-text-field
                          class="body-1"
                          label="名前"
                          v-model="name"
                          background-color="white"
                          outlined
                          clearable
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
              <div class="text-center" v-if="stocker_places.length === 0">
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
                  :items="stocker_places"
                  class="elevation-0 my-9"
                  @click:row="
                    data =>
                      $router.push({ path: `/stocker_places/${data.id}` })
                  "
                >
                  <template v-slot:item.stock_item_status="{ item }">
                    <v-chip
                      v-if="item.stock_item_status == 1"
                      color="red"
                      text-color="white"
                      small
                      >未着手</v-chip
                    >
                    <v-chip
                      v-if="item.stock_item_status == 2"
                      color="blue"
                      text-color="white"
                      small
                      >入力中</v-chip
                    >
                    <v-chip
                      v-if="item.stock_item_status == 3"
                      color="green"
                      text-color="white"
                      small
                      >完了</v-chip
                    >
                  </template>
                  <template v-slot:item.assign_item_status="{ item }">
                    <v-chip
                      small
                      v-if="item.assign_item_status == 1"
                      color="red"
                      ><div style="color: white">未着手</div></v-chip
                    >
                    <v-chip
                      small
                      v-if="item.assign_item_status == 2"
                      color="blue"
                      ><div style="color: white">入力中</div></v-chip
                    >
                    <v-chip
                      small
                      v-if="item.assign_item_status == 3"
                      color="green"
                      ><div style="color: white">完了</div></v-chip
                    >
                  </template>
                  <template v-slot:item.created_at="{ item }">
                    {{ item.created_at | format-date }}
                  </template>
                  <template v-slot:item.updated_at="{ item }">
                    {{ item.updated_at | format-date }}
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
      stocker_places: [],
      name: [],
      dialog: false,
      stock_item_status: 1,
      assign_item_status: 1,
      headers: [
        { text: "ID", value: "id" },
        { text: "名前", value: "name" },
        { text: "在庫登録", value: "stock_item_status" },
        { text: "物品割り当て", value: "assign_item_status" },
        { text: "日時", value: "created_at" },
        { text: "編集日時", value: "updated_at" }
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
      .get("/stocker_places", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.stocker_places = response.data;
      });
  },
  methods: {
    reload: function() {
      this.$axios
        .get("/stocker_places", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.stocker_places = response.data;
        });
    },
    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("stock_item_status", this.stock_item_status);
      params.append("assign_item_status", this.assign_item_status);
      this.$axios.post("/stocker_places", params).then(response => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.stock_item_status = "";
        this.assign_item_status = "";
      });
    }
  }
};
</script>
