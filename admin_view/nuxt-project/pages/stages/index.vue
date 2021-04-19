<template>
  <div>
    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-microphone-variant</v-icon
                >ステージ一覧
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
                      ステージの追加
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
                            label="名前"
                            v-model="name"
                            text
                            clearable
                            outlined
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="晴れ"
                            v-model="enable_Sunny"
                            :items="enable_items"
                            item-text="label"
                            item-value="value"
                            outlined
                          />
                          <v-select
                            label="雨"
                            v-model="enable_Rainy"
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
                <div class="text-center" v-if="stages.length === 0">
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
                    :items="stages"
                    class="elevation-0 my-9"
                    @click:row="
                      data => $router.push({ path: `/stages/${data.id}` })
                    "
                  >
                    <template v-slot:item.enable_sunny="{ item }">
                      <v-chip
                        v-if="item.enable_sunny == true"
                        color="red"
                        text-color="white"
                        small
                        >使用可能</v-chip
                      >
                      <v-chip
                        v-if="item.enable_sunny == false"
                        color="blue"
                        text-color="white"
                        small
                        >使用不可能</v-chip
                      >
                    </template>
                    <template v-slot:item.enable_rainy="{ item }">
                      <v-chip
                        v-if="item.enable_rainy == true"
                        color="red"
                        text-color="white"
                        small
                        >使用可能</v-chip
                      >
                      <v-chip
                        v-if="item.enable_rainy == false"
                        color="blue"
                        text-color="white"
                        small
                        >使用不可能</v-chip
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
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      stages: [],
      enable_Sunny: [],
      enable_Rainy: [],
      name: [],
      dialog: false,
      rules: {
        required: value => !!value || "入力してください"
      },
      enable_items: [
        { label: "使用可能", value: true },
        { label: "使用不可能", value: false }
      ],
      headers: [
        { text: "ID", value: "id" },
        { text: "名前", value: "name" },
        { text: "晴れ", value: "enable_sunny" },
        { text: "雨", value: "enable_rainy" },
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
      .get("stages", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.stages = response.data;
      });
  },
  methods: {
    reload: function() {
      this.$axios
        .get("/stages", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.stages = response.data;
        });
    },

    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("enable_sunny", this.enable_Sunny);
      params.append("enable_rainy", this.enable_Rainy);
      this.$axios.post("/stages", params).then(response => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.enable_Sunny = "";
        this.enable_Rainy = "";
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
