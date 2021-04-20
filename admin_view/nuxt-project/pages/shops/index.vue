<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-cart-outline</v-icon>店一覧
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
                <span>店の追加</span>
              </v-tooltip>
              <v-tooltip top v-if="selfRoleId == 1">
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
                        <v-text-field
                          label="店名"
                          v-model="name"
                          outlined
                          clearable
                          :rules="[rules.required]"
                        />
                        <v-text-field
                          label="開店時間"
                          v-model="opening_hours"
                          clearable
                          outlined
                          :rules="[rules.required]"
                        />
                        <v-text-field
                          label="電話番号"
                          v-model="tel"
                          clearable
                          outlined
                          :rules="[rules.required]"
                        />
                        <v-text-field
                          label="住所"
                          v-model="address"
                          clearable
                          outlined
                          :rules="[rules.required]"
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
              <div class="text-center" v-if="shops.length === 0">
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
                  :items="shops"
                  class="elevation-0 my-9"
                  @click:row="
                    data => $router.push({ path: `/shops/${data.id}` })
                  "
                >
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
      shops: [],
      name: [],
      tel: [],
      opening_hours: [],
      address: [],
      dialog: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "店名", value: "name" },
        { text: "電話番号", value: "tel" },
        // { text: '開店時間', value: 'opening_hours' },
        { text: "住所", value: "address" }
        // { text: '日時', value: 'created_at' },
        // { text: '編集日時', value: 'updated_at' },
      ],
      rules: {
        required: value => !!value || "入力してください"
      }
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
      .get("/shops", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.shops = response.data;
      });
  },
  methods: {
    reload: function() {
      this.$axios
        .get("/shops", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.shops = response.data;
        });
    },

    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("tel", this.tel);
      params.append("opening_hours", this.opening_hours);
      params.append("address", this.address);
      this.$axios.post("/shops", params).then(response => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.tel = "";
        this.opening_hours = "";
        this.address = "";
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
=======
>>>>>>> 3f172cd76df3dbaed33f2d88ac0196b12970257b
