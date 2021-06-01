<template>
  <v-container class="justify-content-center">
    <v-row justify="center">
      <v-col cols="1"></v-col>
      <v-col cols="10" align="center">
        <v-card-title class="justify-center">
          <h1>会場登録</h1>
        </v-card-title>
        <hr>
        <v-card-text>
          <v-form ref="form">
            <v-select
              label="団体"
              ref="group"
              v-model="groupId"
              :rules="[rules.required]"
              :items="group"
              :menu-props="{
                top: true,
                offsetY: true,
              }"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
            <v-select
              label="第一希望場所"
              ref="first"
              v-model="firstId"
              :rules="[rules.required]"
              :items="this.placeList[getIndex()]['place_list']"
              :menu-props="{
                top: true,
                offsetY: true,
              }"
              item-text="place"
              item-value="place_id"
              outlined
            ></v-select>
            <v-select
              label="第二希望場所"
              ref="second"
              v-model="secondId"
              :rules="[rules.required]"
              :items="this.placeList[getIndex()]['place_list']"
              :menu-props="{
                top: true,
                offsetY: true,
              }"
              item-text="place"
              item-value="place_id"
              outlined
            ></v-select>
            <v-select
              label="第三希望場所"
              ref="third"
              v-model="thirdId"
              :rules="[rules.required]"
              :items="this.placeList[getIndex()]['place_list']"
              :menu-props="{
                top: true,
                offsetY: true,
              }"
              item-text="place"
              item-value="place_id"
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
        <v-card-action>
          <v-btn color="blue darken-1" block @click="submit">登録</v-btn>
          <v-btn color="blue darken-1" text block @click="cancel">リセット</v-btn>
        </v-card-action>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>

// 電力登録をUIで増やして一気に登録させないようにする。
// MyPageでエラー吐かせる。

import axios from 'axios'
export default {
  data () {
    return {
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
      },
      group: [],
      placeList: [],
      firstId: null,
      secondId: null,
      thirdId: null,
      remark: null,
      groupId: null
    }
  },
  computed: {
  },
  methods: {
    cancel: function() {
      this.$refs.form.reset();
    },
    submit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/place_orders'
      let params = new URLSearchParams();
      params.append('group_id', this.groupId);
      params.append('first', this.firstId);
      params.append('second', this.secondId);
      params.append('third', this.thirdId);
      params.append('remark', this.remark);


      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.post(url, params).then(
        (response) => {
          console.log('response:', response)
          this.$router.push('mobile_mypage')
        },
        (error) => {
          console.log('登録できませんでした')
          return error;
        }
      )
    },
    getIndex: function(){
      console.log('getIndex',this.placeList.length)
      for(let i=0; i<this.placeList.length;i++){
        console.log(this.placeList[i])
        if(this.placeList[i]['group_id'] === this.groupId){
          return i;
        }
      }
      return 0;
    },
  },
  mounted() {
    const url = process.env.VUE_APP_URL + '/api/v1/users/show'
    axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }).then(
      (response) => {
        this.user = response.data.data
        console.log(this.user)
        console.log(this.user.id)
      },
      (error) => {
        console.error(error)
        return error;
      }
    )
    const groupUrl = process.env.VUE_APP_URL + '/api/v1/current_user/groups'
    axios.get(groupUrl, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }).then(
      (response) => {
        for(let i=0;i<response.data.length;i++){
          this.group.push(response.data[i])
        }
        console.log('group: ',this.group)
      },
      (error) => {
        console.error(error)
        return error;
      }
    )
    const placeUrl = process.env.VUE_APP_URL + '/api/v1/current_user/groups/places'
    axios.get(placeUrl, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }).then(
      (response) => {
        for(let i=0;i<response.data.length;i++){
          this.placeList.push(response.data[i])
        }
        console.log('place: ',this.placeList)
      },
      (error) => {
        console.error(error)
        return error;
      }
    )
  },
}

</script>
