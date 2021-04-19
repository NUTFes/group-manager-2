<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-seat-outline</v-icon>物品一覧
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
                    <v-icon class="ma-2" dark>mdi-seat-outline</v-icon
                    >物品の追加
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
                        <v-text-field
                          class="body-1"
                          label="名前"
                          v-model="name"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-select
                          label="貸出"
                          v-model="isRentable"
                          :items="rental_available"
                          item-text="label"
                          item-value="value"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-select>
                        <v-card-actions>
                          <v-btn
                            flatk
                            large
                            block
                            dark
                            color="blue"
                            @click="register()"
                            >登録 ​
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>
                <br />
              </v-card>
            </v-dialog>

            <hr class="mt-n3" />
            <template>
              <div class="text-center" v-if="rental_items.length === 0">
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
                  :items="rental_items"
                  class="elevation-0 my-9"
                  @click:row="
                    data => $router.push({ path: `/rental_items/${data.id}` })
                  "
                >
                  <template v-slot:item.is_rentable="{ item }">
                    <v-chip
                      v-if="item.is_rentable == true"
                      color="red"
                      text-color="white"
                      small
                      ><v-icon class="mr-1">mdi-check</v-icon>可能</v-chip
                    >
                    <v-chip
                      v-if="item.is_rentable == false"
                      color="blue"
                      text-color="white"
                      small
                      ><v-icon class="mr-1">mdi-close</v-icon>不可能</v-chip
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
      rental_items: [],
      dialog: false,
      name: [],
      isRentable: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "名前", value: "name" },
        { text: "貸し出し", value: "is_rentable" },
        { text: "日時", value: "created_at" },
        { text: "編集日時", value: "updated_at" }
      ],
      rental_available: [
        { label: "可能", value: true },
        { label: "不可能", value: false }
      ]
    };
  },
  compouted: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    this.$axios
      .get("/rental_items", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid")
        }
      })
      .then(response => {
        this.rental_items = response.data;
      });
  },

  methods: {
    reload: function() {
      this.$axios
        .get("/rental_items", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.rental_items = response.data;
        });
    },
    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("is_rentable", this.isRentable);
      console.log(params);
      this.$axios.post("/rental_items", params).then(response => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.isRentable = "";
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
