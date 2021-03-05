<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-account-group</v-icon><b>団体の登録情報を修正する</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols=2></v-col>
          <v-col cols=8>
            <v-form ref="form">
              <v-text-field
                label="団体名"
                ref="groupName"
                v-model="groupName"
                text
                outlined
                :rules="[rules.required]"
                default="groupName"
                ></v-text-field>
              <v-select
                label="カテゴリ"
                ref="groupCategory"
                v-model="groupCategoryId"
                :items="groupCategories"
                :rules="[rules.required]"
                :menu-props="{
                               top: true,
                               offsetY: true,
                               }"
                item-text="name"
                item-value="id"
                outlined
                ></v-select>
              <v-textarea
                label="活動内容"
                ref="activity"
                v-model="activity"
                @keydown="adjustHeight"
                :rules="[rules.required]"
                text
                outlined
                clearable
                ></v-textarea>
              <v-text-field
                label="企画名"
                ref="projectName"
                :rules="[rules.required]"
                v-model="projectName"
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
    groupId: Number,
    groupName: String,
    projectName: String,
    groupCategoryId: String,
    activity: String,
  },
  data () {
    return {
      isDisplay: false,
      groupCategories: [
      { id: 1, name: '模擬店(食品販売)' },
      { id: 2, name: '模擬店(物品販売)' },
      { id: 3, name: 'ステージ企画' },
      { id: 4, name: '展示・体験' },
      { id: 5, name: '研究室公開' },
      { id: 6, name: 'その他' }
      ],
      fesYearId: 1,
      formHasErrors: false,
      rules: {
      required: value => !!value || '入力してください',
      },
    }
    },
    computed: {
    form () {
      return {
      groupName: null,
      user: null,
      activity: null,
      projectName: null,
      groupCategoryId: null,
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

      const url = process.env.VUE_APP_URL + '/groups' + '/' + this.groupId + '?' + 'name=' + this.groupName + '&project_name=' + this.projectName + '&group_category_id=' + this.groupCategoryId + '&activity=' + this.activity
      console.log(this.groupName, this.projectName, this.activity, this.user.id, this.groupCategoryId, this.fesYearId)

      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.put(url).then(
        (response) => {
          console.log('response:', response)
          this.isDisplay = false
          this.$emit('openGroupSnackbar')
          this.$emit('reload')
        },
        (error) => {
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
  },
  watch: {
    activity() {
      this.adjustHeight();
    }
  }
}

</script>
