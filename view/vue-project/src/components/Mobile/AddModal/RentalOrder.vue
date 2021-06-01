<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-map-marker</v-icon><b>物品申請追加</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8" align="center">
            <v-card-text>
              <v-form ref="form">
                <v-select
                  label="貸し出し物品"
                  v-model="item_id"
                  :items="item_list"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                  :rules="[rules.required]"
                  />
                <v-text-field
                  label="個数"
                  v-model="item_num"
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
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
      },
      rental_orders: [],
      groups: [],
      Group: [],
      item_list: [],
      item: [],
      item_id: [],
      item_num: [],
      dialog: false,
    }
  },
  mounted() {
    const itemurl = process.env.VUE_APP_URL + "/rental_items"
    axios.get(itemurl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.item_list = response.data;
      });
    const groupUrl = process.env.VUE_APP_URL + '/groups'
    axios.get(groupUrl, {
      headers: {
        "Content-Type": "application/json",
      }
    }).then(
      (response) => {
        this.groups = response.data
      },
      (error) => {
        return error;
      }
    )
  },
  methods: {
    reload: function () {
      axios.get(process.env.VUE_APP_URL + "/api/v1/get_rental_orders", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          this.rental_orders = response.data;
        });
    },
    register: function () {
      axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("rental_item_id", this.item_id);
      params.append("num", this.item_num);
      axios.post(process.env.VUE_APP_URL + "/rental_orders", params).then((response) => {
        console.log(response);
        this.isDisplay = false;
        this.$emit('reload')
        this.$emit('openRentalorderSnackbar')
        this.Group = "";
        this.item_id = "";
        this.item_num = "";
      });
    },
  },

}

</script>