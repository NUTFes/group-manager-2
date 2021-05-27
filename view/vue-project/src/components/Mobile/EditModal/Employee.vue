<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-account-single</v-icon><b>従業員情報を修正する</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols=2></v-col>
          <v-col cols=8>
            <v-form ref="form">
              <v-text-field
                label="名前"
                ref="name"
                v-model="name"
                text
                outlined
                ></v-text-field>
            <v-text-field
                label="学籍番号"
                ref="studentId"
                v-model="studentId"
                counter="8"
                text
                outlined
                ></v-text-field>
            </v-form>
            <br>
          </v-col>
          <v-col cols=2></v-col>
        </v-row>
        <v-row>
          <v-col cols=4></v-col>
            <v-col cols=4>
            <v-btn color="blue darken-1" large block dark @click="edit">編集する</v-btn>
            </v-col>
            <v-col cols=4></v-col>
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
    name: String,
    studentId: Number,
  },
  data () {
    return {
      isDisplay: false,
      }
    },
    computed: {
    form () {
      return {
      }
    },
  },
  methods: {
    adjustHeight(){
      const textarea = this.$refs.activity
      const resetHeight = new Promise(function(resolve) {
        resolve(textarea.style.height = 'auto')
      });
      resetHeight.then(function(){
        textarea.style.height = textarea.scrollHeight + 'px'
      });
    },
    cancel: function() {
      this.$refs.form.reset();
    },
    edit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/employees' + '/' + this.id + '?group_id=' + this.groupId + '&name=' + this.name + '&student_id=' + this.studentId
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.put(url).then(
        (response) => {
          this.isDisplay = false
          this.$emit('openEmployeeSnackbar')
          this.$emit('reload')
        },
        (error) => {
          return error;
        }
      )
    },
  },
  mounted() {
  },
}
</script>
