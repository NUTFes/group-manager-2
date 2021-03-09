<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-power-plug</v-icon><b>従業員の登録情報を追加する</b>
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
                    label="名前"
                    v-model="name"
                    text
                    outlined
                    required
                    clearable
                  ></v-text-field>
                  <v-text-field
                    label="学籍番号"
                    v-model="student_id"
                    type="number"
                    counter="8"
                    text
                    outlined
                    required
                    clearable
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
      rules: {
        required: value => !!value || '入力してください',
        max: value => value <= 1000 || '大きすぎます',
        min: value => value >= 0 || '小さすぎます',
      },
    }
  },

  methods: {
    submit: function() {
      const url = process.env.VUE_APP_URL + '/employees';
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      params.append('group_id', this.groupId);
      params.append('name', this.name);
      params.append('student_id', this.student_id);

      axios.post(url,params).then(
        (response) => {
          this.isDisplay = false
          this.$emit('reload')
          this.$emit('openAddemployeeSnackbar')
          this.name = []
          this.student_id = []
        },
        (error) => {
          return error;
        }
      )
    }
  },
}

</script>
