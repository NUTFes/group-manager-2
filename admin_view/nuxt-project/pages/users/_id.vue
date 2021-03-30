<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
              <div class="breadcrumbs">
              <ul>
                <li><div class="breadcrumbs-item"><router-link to="/users">ユーザー一覧</router-link></div></li>
                <li><div class="breadcrumbs-item">{{show.user_name}}</div></li>
              </ul>
            </div>
          </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
          <v-card flat>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon v-if="user.role_id == 1" color="red" class="ma-1">mdi-account-cog</v-icon>
                  <v-icon v-if="user.role_id == 2" color="green">mdi-account-tie</v-icon>
                  <v-icon v-if="user.role_id == 3" color="blue">mdi-account</v-icon>
                  {{show.user_name}}
                  <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                      <v-btn 
                      text 
                      v-bind="attrs"
                      v-on="on"
                      @click="edit_dialog_open" 
                      fab>
                      <v-icon class="ma-5">mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>編集</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                      text 
                      v-bind="attrs"
                      v-on="on"
                      @click="delete_dialog = true" 
                      fab>
                      <v-icon class="ma-5">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>削除</span>
                </v-tooltip>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>学籍番号：</th>
                        <td class="caption">{{show.student_id}}</td>
                      </tr>
                      <tr>
                        <th>学年：</th>
                        <td class="caption">{{show.grade}}</td>
                      </tr>
                      <tr>
                        <th>課程：</th>
                        <td class="caption">{{show.department}}</td>
                      </tr>
                      <tr>
                        <th>電話番号：</th>
                        <td class="caption">{{show.tel}}</td>
                      </tr>
                      <tr>
                        <th>メールアドレス：</th>
                        <td class="caption">{{show.email}}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ user.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ user.updated_at | format-date }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row
    v-for="(group, i) in show.groups"
    :key="i"
    >
      <v-col>
        <div class="card">
          <v-card flat
              :to="{
              name: 'groups-id',
              params:{
                id: group.group.id
              }
            }">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">{{data}}
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon>mdi-account-group</v-icon>
                  参加団体情報
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"></v-btn>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>団体名：</th>
                        <td class="caption">{{group.group.name}}</td>
                      </tr>
                      <tr>
                        <th>企画名：</th>
                        <td class="caption">{{group.group.project_name}}</td>
                      </tr>
                      <tr>
                        <th>活動内容：</th>
                        <td class="caption">{{group.group.activity}}</td>
                      </tr>
                      <tr>
                        <th>グループカテゴリ：</th>
                        <td class="caption">{{group.category}}
                        </td>
                      </tr>
                      <tr>
                        <th>開催年：</th>
                        <td class="caption">{{group.fes_year}}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn text color="white" to="/users"><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div class="back-button">ユーザー一覧に戻る</div></v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>

    <!-- 編集ダイアログ -->
    <v-dialog
      v-model="edit_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-pencil</v-icon>編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
            <v-select
              label="権限"
              v-model="role_id"
              :items="items_role"
              item-text="label"
              item-value="id"
              outlined
              /></v-select>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#78909C"
          dark
          @click="edit"
          >
          編集する
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 

    <!-- 削除ダイアログ -->
    <v-dialog
      v-model="delete_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-delete</v-icon>削除
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="delete_dialog = false" fab dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

      <v-card-title>
        削除してよろしいですか？
      </v-card-title>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          color="red"
          dark
          @click="delete_yes"
          >
          はい
        </v-btn>
        <v-btn
          flat
          color="blue"
          dark
          @click="delete_dialog = false"
          >
          いいえ
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 

    <!-- 編集成功SnackBar -->
    <v-snackbar
      v-model="success_snackbar"
      color="blue-grey"
      top
      elevation="24"
    >
      編集しました

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
        <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>
import Header from "~/components/Header.vue";
import Menu from "~/components/Menu.vue";
import axios from "axios";
import { mapState } from "vuex";
export default {
  components: {
    Header,
    Menu,
  },
  fetch({ store }) {
    store.dispatch("getRights");
  },
  computed: {
    ...mapState(["rights"]),
  },
  data() {
    return {
      show: [],
      user: [],
      id: [],
      role_id: [],
      role: [],
      grade: [],
      department: [],
      detail: [],
      spgroup:[],
      group_categories:[],
      fes_years:[],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
      items_role:[
        {label:"developer",id:1},
        {label:"maneger",id:2},
        {label:"user",id:3}
      ]
    };
  },
  mounted() {
    const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
    this.$axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.show = response.data
      })
  },
  methods: {
    edit_dialog_open: function() {
      this.edit_dialog = true
    },
    edit: function() {
      const edit_url = '/api/v1/update_user/' + this.id + '/' + this.role_id
      console.log(edit_url)
      this.$axios.get(edit_url , {
        headers: { 
          "Content-Type": "application/json", 
        }
      }).then(response => {
        console.log(response)
        this.reload()
        this.edit_dialog = false
        this.success_snackbar = true
      })
    },
    delete_yes: function() {
      this.$router.push('/users')
    }
  }
}
</script>

<style scoped>
  td{
    width: 70%;
  }
  th{
    width: 30%;
  }
</style>  

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
