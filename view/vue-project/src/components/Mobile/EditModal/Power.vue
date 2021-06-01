<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-power-plug</v-icon><b>電力申請の登録情報を修正する</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container class="justify-content-center">
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8" align="center">
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    label="製品名"
                    v-model="item"
                    :rules="[rules.required]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="電力量"
                    v-model="power"
                    type="number"
                    :rules="[rules.required,
                      rules.max,rules.min]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="メーカー"
                    v-model="manufacturer"
                    :rules="[rules.required]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="型番"
                    v-model="model"
                    :rules="[rules.required]"
                    text
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    label="製品URL"
                    v-model="url"
                    :rules="[rules.required]"
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
import axios from 'axios'
export default {
  props: {
    id: Number,
    groupId: Number,
    item: String,
    power: Number,
    manufacturer: String,
    model: String,
    url: String,
  },
  data () {
    return {
      isDisplay: false,
      groups: [],
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
        min: value => value >= 0 || '小さすぎます',
      },
    }
  },

  methods: {
    submit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/power_orders' + '/' + this.id + '?group_id=' + this.groupId + '&item=' + this.item + '&power=' + this.power + '&manufacturer=' + this.manufacturer + '&model=' + this.model + '&item_url=' + this.url
      console.log(url)
      axios.put(url).then(
        (response) => {
          this.isDisplay = false
          this.$emit('openPowerSnackbar')
          this.$emit('reload')
        },
        (error) => {
          return error;
        }
      )
    }
  },

  mounted() {
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
}

</script>
