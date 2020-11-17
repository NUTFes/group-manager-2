<template>
  <v-row justify="center">
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-card>
        <v-container class="justify-content-center">
          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8" align="center">
              <v-card-title class="justify-center">
                <h1>電力登録</h1>
              </v-card-title>
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
                  <v-text-field
                    label="製品名"
                    ref="item"
                    v-model="item"
                    :rules="[rules.required]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="電力量"
                    ref="power"
                    v-model="power"
                    type="number"
                    :rules="[rules.required,
                      rules.max]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="メーカー"
                    ref="manufacturer"
                    v-model="manufacturer"
                    :rules="[rules.required]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="型番"
                    ref="model"
                    v-model="model"
                    :rules="[rules.required]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="製品URL"
                    ref="itemUrl"
                    v-model="itemUrl"
                    :rules="[rules.required]"
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
            <v-col cols="2"></v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>

<script>

import axios from 'axios'
export default {
  data () {
    return {
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
      },
      group: [],
    }
    },
    computed: {
    form () {
      return {
        item: null,
        power: null,
        manufacturer: null,
        model: null,
        itemUrl: null,
        groupId: null
      }
    },
  },
  methods: {
    cancel: function() {
      this.$refs.form.reset();
    },
    submit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/power_orders'
      let params = new URLSearchParams();
      params.append('group_id', this.groupId);
      params.append('item', this.item);
      params.append('power', this.power);
      params.append('manufacturer', this.manufacturer);
      params.append('model', this.model);
      params.append('item_url', this.itemUrl);

      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.post(url, params).then(
        (response) => {
          console.log('response:', response)
          this.$router.push('MyPage')
        },
        (error) => {
          console.log('登録できませんでした')
          return error;
        }
      )
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
        console.log(this.group)
      },
      (error) => {
        console.error(error)
        return error;
      }
    )
  },
}

</script>