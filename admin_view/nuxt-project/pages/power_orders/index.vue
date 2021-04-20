<template>
  <div>
    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-power-plug</v-icon>電力申請一覧
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
                  <span>電力申請の追加</span>
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
                        <v-icon class="ma-5" dark>mdi-power-plug</v-icon
                        >電力申請の追加
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
                            <v-text-field
                              class="body-1"
                              label="製品名"
                              v-model="item"
                              background-color="white"
                              outlined
                              clearable
                            >
                            </v-text-field>
                            <v-text-field
                              class="body-1"
                              label="電力（ワット）"
                              v-model="power"
                              background-color="white"
                              outlined
                              clearable
                              type="number"
                            >
                            </v-text-field>
                            <v-text-field
                              class="body-1"
                              label="メーカー"
                              v-model="manufacturer"
                              background-color="white"
                              outlined
                              clearable
                            >
                            </v-text-field>
                            <v-text-field
                              class="body-1"
                              label="型番"
                              v-model="model"
                              background-color="white"
                              outlined
                              clearable
                            >
                            </v-text-field>
                            <v-text-field
                              class="body-1"
                              label="製品URL"
                              v-model="itemUrl"
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

              <hr class="mt-n3">
              <template>
                <div class="text-center" v-if="power_orders.length === 0">
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
                  :items="power_orders"
                  class="elevation-0 my-9"
                  @click:row="
                               (data) =>
                               $router.push({ path: `/power_orders/${data.power_order.id}`})
                               "
                  >
                  <template v-slot:item.power_order.created_at="{ item }">
                    {{ item.power_order.created_at | format-date }}
                  </template>
                  <template v-slot:item.power_order.updated_at="{ item }">
                    {{ item.power_order.updated_at | format-date }}
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
export default {
  data() {
    return {
      power_orders: [],
      groups: [],
      dialog: false,
      Group: [],
      item: [],
      power: [],
      manufacturer: [],
      model: [],
      itemUrl: [],
      headers:[
        { text: 'ID', value: 'power_order.id' },
        { text: '参加団体', value: 'group' },
        { text: '製品', value: 'power_order.item' },
        { text: '電力', value: 'power_order.power' },
        { text: '日時', value: 'power_order.created_at' },
        { text: '編集日時', value: 'power_order.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_power_orders', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.power_orders = response.data
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
        .get("/api/v1/get_power_orders", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.power_orders = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("item", this.item);
      params.append("power", this.power);
      params.append("manufacturer", this.manufacturer);
      params.append("model", this.model);
      params.append("item_url", this.itemUrl);
      this.$axios.post("/power_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.power_order.item = "";
        this.power_order.power = "";
        this.manufacturer = "";
        this.model = "";
        this.itemUrl = "";
      });
    },
  }
}
</script>
