<template>
  <v-container>
    <v-card-title class="font-weight-bold subtitle-1">
      <v-icon class="pr-2">mdi-account-group</v-icon><b>団体情報</b>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs  }">
          <v-btn
              v-if="isEditGroup" 
              x-small
              fab
              text
              v-bind="attrs"
              v-on="on"
              @click="openGroupDisplay">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>団体情報を編集する</span>
      </v-tooltip>
      <!--編集用プロップス-->
      <Group ref="groupDlg"
             :groupId="regist.group.id"
             :groupName="regist.group.name"
             :projectName="regist.group.project_name"
             :groupCategoryId="regist.group.group_category_id"
             :activity="regist.group.activity"
             @reload="reload"
             @openGroupSnackbar="openGroupSnackbar"
             ></Group>

      <v-snackbar
          top
          text
          color="purple accent-2"
          v-model="groupSnackbar">
        参加団体情報を更新しました
      </v-snackbar>

    </v-card-title>
    <hr>

    <v-list class="subtitle-2">
      <v-list-item>
        <v-list-item-content>団体名</v-list-item-content>
        <v-list-item-content v-if="regist.sub_rep.name == -9999">未登録</v-list-item-content>
        <v-list-item-content v-else>{{ regist.group.name }}</v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>企画名</v-list-item-content>
        <v-list-item-content v-if="regist.group.project_name == -9999">未登録</v-list-item-content>
        <v-list-item-content v-else>{{ regist.group.project_name }}</v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>カテゴリー</v-list-item-content>
        <v-list-item-content v-if="regist.group_category == -9999">未登録</v-list-item-content>
        <v-list-item-content v-else>{{ regist.group_category }}</v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>活動内容</v-list-item-content>
        <v-list-item-content v-if="regist.group.activity == -9999">未登録</v-list-item-content>
        <v-list-item-content v-else>{{ regist.group.activity }}</v-list-item-content>
      </v-list-item>
    </v-list>

  </v-container>
</template>

<script>
import axios from 'axios'
import Group from '@/components/Mobile/EditModal/Group.vue'

export default {
  props: {
    num: String,
    regist: String,
  },
  components: {
    Group,
  },
  data(){
    return{
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ],
      delete_dialog: false,
      groupSnackbar: false,
      isEditGroup: [],
    }
  },
  methods: {
    openGroupDisplay() {
      this.$refs.groupDlg.isDisplay = true
    },
    //編集後Snackbar
    openGroupSnackbar() {
      this.groupSnackbar = true
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
        this.isEditGroup = response.data[0].is_edit_group
      })
  },
}
</script>
