<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-map-marker-check-outline</v-icon
              >使用可能会場一覧
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
                <span>使用可能会場の追加</span>
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

            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title class="headline blue-grey darken-3">
                  <div style="color: white">
                    <v-icon class="ma-5" dark
                      >mdi-map-marker-check-outline</v-icon
                    >
                    使用可能会場の追加
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
                          label="場所"
                          v-model="place_id"
                          :items="places"
                          item-text="name"
                          item-value="id"
                          outlined
                        />
                        <v-select
                          label="グループカテゴリ"
                          v-model="group_category_id"
                          :items="group_categories"
                          item-text="name"
                          item-value="id"
                          outlined
                        />
                        <v-select
                          label="使用"
                          v-model="enable"
                          :items="enable_items"
                          item-text="label"
                          item-value="value"
                          outlined
                        />
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="btn"
                    depressed
                    dark
                    @click="register()"
                  >登録
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <hr class="mt-n3" />
            <template>
              <div class="text-center" v-if="place_allow_list.length === 0">
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
                  :items="place_allow_list"
                  class="elevation-0 my-9"
                  @click:row="
                    data =>
                      $router.push({
                        path: `/place_allow_lists/${data.place_allow_list.id}`
                      })
                  "
                >
                  <template v-slot:item.group_category.id="{ item }">
                    <v-chip
                      v-if="item.group_category.id == 1"
                      color="red"
                      text-color="white"
                      small
                      >{{ category[0] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group_category.id == 2"
                      color="pink"
                      text-color="white"
                      small
                      >{{ category[1] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group_category.id == 3"
                      color="blue"
                      text-color="white"
                      small
                      >{{ category[2] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group_category.id == 4"
                      color="green"
                      text-color="white"
                      small
                      >{{ category[3] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group_category.id == 5"
                      color="orange"
                      text-color="white"
                      small
                      >{{ category[4] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group_category.id == 6"
                      color="blue-gray"
                      text-color="white"
                      small
                      >{{ category[5] }}</v-chip
                    >
                  </template>
                  <template v-slot:item.place_allow_list.enable="{ item }">
                    <v-chip
                      v-if="item.place_allow_list.enable == true"
                      color="red"
                      text-color="white"
                      small
                      ><v-icon class="mr-1">mdi-check</v-icon>可能</v-chip
                    >
                    <v-chip
                      v-if="item.place_allow_list.enable == false"
                      color="blue"
                      text-color="white"
                      small
                      ><v-icon class="mr-1">mdi-close</v-icon>不可能</v-chip
                    >
                  </template>
                  <template
                    v-slot:item.place_allow_list.created_at="{ item }"
                  >
                    {{ item.place_allow_list.created_at | format-date }}
                  </template>
                  <template
                    v-slot:item.place_allow_list.updated_at="{ item }"
                  >
                    {{ item.place_allow_list.updated_at | format-date }}
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
      id: [],
      place_allow_list: [],
      place_id: [],
      places: [],
      group_category_id: [],
      category: [],
      enable: [],
      expand: false,
      dialog: false,
      enable_items: [
        { label: "使用可能", value: true },
        { label: "使用不可能", value: false }
      ],
      headers: [
        { text: "ID", value: "place_allow_list.id" },
        { text: "場所", value: "place" },
        { text: "グループカテゴリー", value: "group_category.id" },
        { text: "使用", value: "place_allow_list.enable" },
        { text: "作成日時", value: "place_allow_list.created_at" },
        { text: "編集日時", value: "place_allow_list.updated_at" }
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
      .get("/places", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.places = response.data;
      });
    this.$axios
      .get("/group_categories", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.group_categories = response.data;
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]["name"]);
        }
      });
    this.$axios
      .get("/api/v1/get_place_allow_lists", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.place_allow_list = response.data;
      });
  },
  methods: {
    reload: function() {
      this.$axios
        .get("/api/v1/get_place_allow_lists", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.place_allow_list = response.data;
        });
    },

    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("place_id", this.place_id);
      params.append("group_category_id", this.group_category_id);
      params.append("enable", this.enable);
      this.$axios.post("/place_allow_lists", params).then(response => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.place_id = "";
        this.group_category = "";
        this.enable = "";
      });
    }
  }
};
</script>
