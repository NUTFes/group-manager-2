<template>
    <v-container>
        <v-card flat>
            <v-card-title>
                <v-icon class="pr-2" size="30">mdi-account-multiple</v-icon>
                <b>副代表情報</b>
                <v-spacer></v-spacer>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs  }">
                        <v-btn
                            v-if="isEditSubRep" 
                            fab
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="openSubRepDisplay">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>副代表情報を編集する</span>
                </v-tooltip>
                <!--編集用プロップス-->
                <SubRep ref="subRepDlg"
                    :groupId="regist.group.id"
                    :name="regist.sub_rep.name"
                    :studentId="regist.sub_rep.student_id"
                    :gradeId="regist.sub_rep.sub_rep.grade_id"
                    :departmentId="regist.sub_rep.sub_rep.department_id"
                    :tel="regist.sub_rep.tel"
                    :email="regist.sub_rep.email"
                    @reload="reload"
                    @openSubrepSnackbar="openSubrepSnackbar">
                </SubRep>
                
                <v-snackbar
                    top
                    text
                    color="purple accent-2"
                    v-model="subrepSnackbar">
                    副代表情報を更新しました
                </v-snackbar>

            </v-card-title>
            <hr>

            <v-list>
                <v-list-item>
                    <v-list-item-content>氏名</v-list-item-content>
                    <v-list-item-content v-if="regist.sub_rep.name == -9999">未登録</v-list-item-content>
                    <v-list-item-content v-else>{{ regist.sub_rep.name }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>学籍番号</v-list-item-content>
                    <v-list-item-content v-if="regist.sub_rep.student_id == -9999">未登録</v-list-item-content>
                    <v-list-item-content v-else>{{ regist.sub_rep.student_id }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>学科</v-list-item-content>
                    <v-list-item-content v-if="regist.sub_rep.department_id == -9999">未登録</v-list-item-content>
                    <v-list-item-content v-else>{{ regist.sub_rep.department_id }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>学年</v-list-item-content>
                    <v-list-item-content v-if="regist.sub_rep.grade_id == -9999">未登録</v-list-item-content>
                    <v-list-item-content v-else>{{ regist.sub_rep.grade_id }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>電話番号</v-list-item-content>
                    <v-list-item-content v-if="regist.sub_rep.tel == -9999">未登録</v-list-item-content>
                    <v-list-item-content v-else>{{ regist.sub_rep.tel }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>メールアドレス</v-list-item-content>
                    <v-list-item-content v-if="regist.sub_rep.email == -9999">未登録</v-list-item-content>
                    <v-list-item-content v-else>{{ regist.sub_rep.email }}</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>

    </v-container>
</template>

<script>
  import axios from 'axios'
  import SubRep from '@/components/EditModal/sub_rep.vue'

export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
        SubRep,
    },
    data(){
        return{
            data: [
                localStorage.getItem('access-token'),
                localStorage.getItem('client'),
                localStorage.getItem('uid')
            ],
            delete_dialog_subrep: false,
            subrepSnackbar: false,
            isEditSubRep: [],
        }
    },
    methods:{
        openSubRepDisplay() {
            this.$refs.subRepDlg.isDisplay = true
        },
        //編集後Snackbar
        openSubrepSnackbar() {
            this.subrepSnackbar = true
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
          this.isEditSubRep = response.data[0].is_edit_sub_rep
        })
    },
}
</script>