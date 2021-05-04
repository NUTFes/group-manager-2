<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-map-marker</v-icon>
        <b>会場登録</b>
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
                  label="第一希望場所"
                  ref="first"
                  v-model="firstId"
                  :rules="[rules.required]"
                  :items="this.placeList"
                  :menu-props="{
                                top: true,
                                offsetY: true,
                                }"
                  item-text="name"
                  item-value="id"
                  outlined
                  ></v-select>
                <v-select
                  label="第二希望場所"
                  ref="second"
                  v-model="secondId"
                  :rules="[rules.required]"
                  :items="this.placeList"
                  :menu-props="{
                                top: true,
                                offsetY: true,
                                }"
                  item-text="name"
                  item-value="id"
                  outlined
                  ></v-select>
                <v-select
                  label="第三希望場所"
                  ref="third"
                  v-model="thirdId"
                  :rules="[rules.required]"
                  :items="this.placeList"
                  :menu-props="{
                                top: true,
                                offsetY: true,
                                }"
                  item-text="name"
                  item-value="id"
                  outlined
                  ></v-select>
                <v-text-field
                  label="備考"
                  ref="remark"
                  v-model="remark"
                  text
                  outlined
                  required
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

// 電力登録をUIで増やして一気に登録させないようにする。
// MyPageでエラー吐かせる。

import axios from 'axios'
export default {
   props: {
    groupId: Number,
    firstId: Number,
    secondId: Number,
    thirdId: Number,
    remark: String,
  },
  data () {
    return {
      isDisplay: false,
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
      },
      placeList: [],
    }
  },
  methods: {
    submit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/place_orders' + '/' + this.groupId + '?' + 'first=' + this.firstId + '&second=' + this.secondId + '&third=' + this.thirdId + '&remark=' + this.remark
      console.log(url)

      axios.put(url).then(
        (response) => {
          console.log('response:', response)
          this.isDisplay = false
          this.$emit('reload')
          this.$emit('openPlaceSnackbar')
        },
        (error) => {
          console.log('登録できませんでした')
          return error;
        }
      )
    },
  },
  mounted() {
    const placeUrl = process.env.VUE_APP_URL + '/places'
    axios.get(placeUrl, {
      headers: {
        "Content-Type": "application/json",
      }
    }).then(
      (response) => {
        this.placeList = response.data
      },
      (error) => {
        console.error(error)
        return error;
      }
    )
  },
}

</script>
