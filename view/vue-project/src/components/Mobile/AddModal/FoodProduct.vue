<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-map-marker</v-icon><b>販売食品情報追加</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8" align="center">
            <v-card-text>
              <v-form ref="form">
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
            </v-card-text>
            <v-row>
              <v-col cols=4></v-col>
                <v-col cols=4>
                  <v-btn color="blue darken-1" large block dark @click="register">編集する</v-btn>
                </v-col>
                <v-col cols=4></v-col>
            </v-row>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>

</template>
<script>
import axios from 'axios'
export default {
   props: {
    groupId: Number,
  },
  data () {
    return {
      isDisplay: false,
      food_products: [],
      groups: [],
      dialog: false,
      Group: [],
      productName: [],
      isCooking: [],
      firstDayNum: [],
      secondDayNum: [],
      cooking_available:[
        {label:"する",value:true},
        {label:"しない",value:false}
      ],
    }
  },
  mounted() {
    axios.get(process.env.VUE_APP_URL + '/api/v1/get_food_products', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.food_products = response.data
      })
  },
  methods: {
    reload: function () {
      axios.get(process.env.VUE_APP_URL + "/api/v1/get_food_products", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          this.food_products = response.data;
        });
    },
    register: function () {
      axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("name", this.productName);
      params.append("is_cooking", this.isCooking);
      params.append("first_day_num", this.firstDayNum);
      params.append("second_day_num", this.secondDayNum);
      axios.post(process.env.VUE_APP_URL + "/food_products", params).then((response) => {
        console.log(response);
        this.isDisplay = false;
        this.$emit('reload')
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
