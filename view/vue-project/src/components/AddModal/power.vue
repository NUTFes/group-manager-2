<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-power-plug</v-icon><b>電力申請の登録情報を追加する</b>
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
                    <v-btn color="blue darken-1" large block dark @click="submit">追加する</v-btn>
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
      item: [],
      power: [],
      manufacturer: [],
      model: [],
      url: [],
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
        min: value => value >= 0 || '小さすぎます',
      },
    }
  },

  methods: {
    submit: function() {
      const post_url = process.env.VUE_APP_URL + '/power_orders';
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      params.append('group_id', this.groupId);
      params.append('item', this.item);
      params.append('power', this.power);
      params.append('manufacturer', this.manufacturer);
      params.append('model', this.model);
      params.append('item_url', this.url);

      axios.post(post_url, params).then(
        (response) => {
          this.isDisplay = false
          this.$emit('reload')
          this.$emit('openAddpowerSnackbar')
          this.item = []
          this.power = []
          this.manufacturer = []
          this.model = []
          this.url = []
        },
        (error) => {
          return error;
        }
      )
    }
  },
}

</script>
