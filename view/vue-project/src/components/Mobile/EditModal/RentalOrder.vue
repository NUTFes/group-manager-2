<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-power-plug</v-icon><b>物品申請の登録情報を修正する</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container class="justify-content-center">
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8" align="center">
              <v-card-text>
                <v-form ref="form">
                  <v-select
                    label="物品名"
                    v-model="itemId"
                    :items="item_list"
                    :menu-props="{
                      top: true,
                      offsetY: true,
                    }"
                    item-text="name"
                    item-value="id"
                    outlined
                  ></v-select>
                  <v-text-field
                    label="数量"
                    v-model="num"
                    type="number"
                    text
                    outlined
                  ></v-text-field>
                </v-form>
              </v-card-text>
                  <v-row>
                    <v-col cols=4></v-col>
                    <v-col cols=4>
                    <v-btn color="blue darken-1" large block dark @click="submit">編集する</v-btn>
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
    id: Number,
    groupId: Number,
    itemId: Number,
    num: Number,
  },
  data () {
    return {
      isDisplay: false,
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
        min: value => value >= 0 || '小さすぎます',
      },
      item_list: [],
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
  },

  methods: {
    submit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/rental_orders' + '/' + this.id + '?group_id=' + this.groupId + '&rental_item_id=' + this.itemId + '&num=' + this.num
      axios.put(url).then(
        (response) => {
          this.isDisplay = false
          this.$emit('openRentalorderSnackbar')
          this.$emit('reload')
        },
        (error) => {
          return error;
        }
      )
    }
  },
}
</script>
