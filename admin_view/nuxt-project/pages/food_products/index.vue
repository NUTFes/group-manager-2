<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-baguette</v-icon>販売食品申請一覧
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
                <span>販売食品の追加</span>
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
                      <v-icon class="ma-5" dark>mdi-baguette</v-icon
                      >販売食品の追加
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
                            label="販売食品名"
                            v-model="productName"
                            background-color="white"
                            outlined
                            clearable
                          >
                          </v-text-field>
                          <v-select
                            class="body-1"
                            label="調理の有無"
                            v-model="isCooking"
                            :items="cooking_available"
                            item-text="label"
                            item-value="value"
                            background-color="white"
                            outlined
                            clearable
                          >
                          </v-select>
                          <v-text-field
                            class="body-1"
                            label="1日目の個数"
                            v-model="firstDayNum"
                            background-color="white"
                            outlined
                            clearable
                            type="number"
                          >
                          </v-text-field>
                          <v-text-field
                            class="body-1"
                            label="2日目の個数"
                            v-model="secondDayNum"
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

            <hr class="mt-n3">
            <template>
              <div class="text-center" v-if="food_products.length === 0">
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
                :items="food_products"
                class="elevation-0 my-9"
                @click:row="
                            (data) =>
                            $router.push({ path: `/food_products/${data.food_product.id}`})
                            "
                >
                <template v-slot:item.food_product.is_cooking="{ item }">
                  <v-chip v-if="item.food_product.is_cooking == true" color="red" text-color="white" small>する</v-chip>
                  <v-chip v-if="item.food_product.is_cooking == false" color="blue" text-color="white" small>しない</v-chip>
                </template>
                <template v-slot:item.food_product.created_at="{ item }">
                  {{ item.food_product.created_at | format-date }}
                </template>
                <template v-slot:item.food_product.updated_at="{ item }">
                  {{ item.food_product.updated_at | format-date }}
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
      food_products: [],
      groups: [],
      dialog: false,
      Group: [],
      productName: [],
      isCooking: [],
      firstDayNum: [],
      secondDayNum: [],
      headers:[
        { text: 'ID', value: 'food_product.id' },
        { text: 'group_id', value: 'group' },
        { text: '名前', value: 'food_product.name' },
        { text: '1日目の個数', value: 'food_product.first_day_num' },
        { text: '2日目の個数', value: 'food_product.second_day_num' },
        { text: '調理の有無', value: 'food_product.is_cooking' },
        { text: '日時', value: 'food_product.created_at' },
        { text: '編集日時', value: 'food_product.updated_at' },
      ],
      cooking_available:[
        {label:"する",value:true},
        {label:"しない",value:false}
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_food_products', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.food_products = response.data
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
        .get("/api/v1/get_food_products", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.food_products = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("name", this.productName);
      params.append("is_cooking", this.isCooking);
      params.append("first_day_num", this.firstDayNum);
      params.append("second_day_num", this.secondDayNum);
      this.$axios.post("/food_products", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.productName = "";
        this.isCooking = "";
        this.firstDayNum = "";
        this.secondDayNum = "";
      });
    },
  }
}
</script>
