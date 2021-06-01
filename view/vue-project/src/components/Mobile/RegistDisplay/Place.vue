<template>
  <v-container>
    <v-card flat>
      <v-card-title class="font-weight-bold subtitle-1">
        <v-icon class="pr-2">mdi-map-marker</v-icon>
        <b>会場申請情報</b>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs  }">
            <v-btn
                v-if="isEditPlace"
                x-small
                fab
                text
                v-bind="attrs"
                v-on="on"
                @click="openPlaceDisplay">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>会場申請情報を編集する</span>
        </v-tooltip>
        <!--編集用プロップス-->
        <Place ref="placeDlg"
               :groupId="regist.group.id"
               :firstId="regist.place_order.first"
               :secondId="regist.place_order.second"
               :thirdId="regist.place_order.third"
               :remark="regist.place_order.remark"
               @reload="reload"
               @openPlaceSnackbar="openPlaceSnackbar"
               ></Place>

        <v-snackbar
            top
            text
            color="purple accent-2"
            v-model="placeSnackbar">
          会場申請情報を更新しました
        </v-snackbar>
      </v-card-title>
      <hr>

      <v-card-text v-if = "regist.first_place_order == -9999">未登録</v-card-text>
      <v-list class="subtitle-2">
        <v-list-item>
          <v-list-item-content>第1志望</v-list-item-content>
          <v-list-item-content v-if="regist.first_place_order == -9999">未登録</v-list-item-content>
          <v-list-item-content v-else>{{ regist.first_place_order }}</v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>第2志望</v-list-item-content>
          <v-list-item-content v-if="regist.second_place_order == -9999">未登録</v-list-item-content>
          <v-list-item-content v-else>{{ regist.second_place_order }}</v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>第3志望</v-list-item-content>
          <v-list-item-content v-if="regist.third_place_order == -9999">未登録</v-list-item-content>
          <v-list-item-content v-else>{{ regist.third_place_order }}</v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>備考</v-list-item-content>
          <v-list-item-content v-if="regist.place_order == -9999">未登録</v-list-item-content>
          <v-list-item-content v-else>{{ regist.place_order.remark }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

  </v-container>
</template>

<script>
import axios from 'axios'
import Place from '@/components/Mobile/EditModal/Place.vue'

export default {
  props: {
    num: String,
    regist: String,
  },
  components: {
    Place,
  },
  data(){
    return{
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ],
      delete_dialog_place: false,
      placeSnackbar: false,
      isEditPlace: [],
    }
  },
  methods:{
    openPlaceDisplay() {
      this.$refs.placeDlg.isDisplay = true
    },
    //編集後Snackbar
    openPlaceSnackbar() {
      this.placeSnackbar = true
    },
    reload() {
      this.$emit('reload');
    },
  },

  mounted() {
    const settingurl = process.env.VUE_APP_URL + '/user_page_settings'
    axios.get(settingurl, {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
      }
    }
    )
      .then(response => {
        this.isEditPlace = response.data[0].is_edit_place
      })
  },
}
</script>
