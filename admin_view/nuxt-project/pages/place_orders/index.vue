<template>
  <div>
    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-map-marker</v-icon>会場申請一覧
                <v-spacer></v-spacer>              
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="dialog=true"
                            >
                            <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>会場申請の追加</span>
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
                        <v-icon class="ma-5" dark>mdi-map-marker</v-icon
                        >会場申請の追加
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
                            ></v-select>
                            <v-select
                              label="第一希望"
                              v-model.number="placeFirst"
                              :items="places"
                              :menu-props="{ top: true, offsetY: true }"
                              item-text="name"
                              item-value="id"
                              background-color="white"
                              outlined
                              clearable
                            >
                            </v-select>
                            <v-select
                              label="第二希望"
                              v-model.number="placeSecond"
                              :items="places"
                              :menu-props="{ top: true, offsetY: true }"
                              item-text="name"
                              item-value="id"
                              background-color="white"
                              outlined
                              clearable
                            >
                            </v-select>
                            <v-select
                              label="第三希望"
                              v-model.number="placeThird"
                              :items="places"
                              :menu-props="{ top: true, offsetY: true }"
                              item-text="name"
                              item-value="id"
                              background-color="white"
                              outlined
                              clearable
                            >
                            </v-select>
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
                <div class="text-center" v-if="place_orders.length === 0">
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
                  :items="place_orders"
                  class="elevation-0 my-9"
                  @click:row="
                              (data) =>
                              $router.push({ path: `/place_orders/${data.place_order.id}`})
                              "
                  >
                  <template v-slot:item.place_order.created_at="{ item }">
                    {{ item.place_order.created_at | format-date }}
                  </template>
                  <template v-slot:item.place_order.updated_at="{ item }">
                    {{ item.place_order.updated_at | format-date }}
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
import axios from 'axios'
export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || "入力してください",
      },
      place_orders: [],
      places: [],
      groups: [],
      dialog: false,
      Group: [],
      placeFirst: [],
      placeSecond: [],
      placeThird: [],
      place_list: [],
      headers:[
        { text: 'ID', value: 'place_order.id' },
        { text: '参加団体', value: 'group' },
        { text: '第一希望', value: 'first' },
        { text: '第二希望', value: 'second' },
        { text: '第三希望', value: 'third' },
        { text: '日時', value: 'place_order.created_at' },
        { text: '編集日時', value: 'place_order.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/places', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.places = response.data
        for (let i = 0; i < this.places.length; i++) {
          this.place_list.push(this.places[i]['name'])
        }
      })
   this.$axios.get('/api/v1/get_place_orders', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.place_orders = response.data
      })
    this.$axios.get('/groups', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.groups = response.data
      })
  },

  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_place_orders", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.place_orders = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("first", this.placeFirst);
      params.append("second", this.placeSecond);
      params.append("third", this.placeThird);
      this.$axios.post("/place_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.placeFirst = "";
        this.placeSecond = "";
        this.placeThird = "";
      });
    },
  }
}
</script>
