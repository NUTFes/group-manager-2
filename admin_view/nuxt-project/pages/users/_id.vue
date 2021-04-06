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
          <v-card flat class="mx-15">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon v-if="user.role_id == 1" color="red" class="ma-1">mdi-account-cog</v-icon>
                  <v-icon v-if="user.role_id == 2" color="green">mdi-account-tie</v-icon>
                  <v-icon v-if="user.role_id == 3" color="blue">mdi-account</v-icon>
                  {{show.user_name}}
                  <v-spacer></v-spacer>
                <v-tooltip top v-if="email != uid">
                  <template v-slot:activator="{ on, attrs  }">
                      <v-btn 
                      text 
                      v-bind="attrs"
                      v-on="on"
                      @click="edit_user_info_dialog = true" 
                      fab>
                      <v-icon class="ma-5">mdi-account-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>ユーザー情報編集</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                      <v-btn 
                      text 
                      v-bind="attrs"
                      v-on="on"
                      @click="reset_password_dialog = true" 
                      fab>
                      <v-icon class="ma-5">mdi-lock-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>パスワード変更</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                      <v-btn 
                      text 
                      v-bind="attrs"
                      v-on="on"
                      @click="edit_role_dialog_open" 
                      fab>
                      <v-icon class="ma-5">mdi-star-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>権限編集</span>
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
      </v-col>
    </v-row>

    <v-row
    v-for="(group, i) in show.groups"
    :key="i"
    >
      <v-col>
          <v-card 
              flat
              class="mx-15"
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
                  <v-icon class="mr-2">mdi-account-group</v-icon>
                  申請参加団体情報
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
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn text color="white" to="/users"><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div class="back-button">ユーザー一覧に戻る</div></v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>

    <!-- ユーザー情報編集ダイアログ -->
    <v-dialog
      v-model="edit_user_info_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-account-edit-outline</v-icon>ユーザー情報編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_user_info_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
            <v-text-field
              label="名前"
              v-model="name"
              :rules="[rules.requied]"
              outlined
              /></v-text-field>
            <v-text-field
              label="学籍番号"
              v-model="student_id"
              :rules="[rules.requied]"
              outlined
              counter=8
              /></v-text-field>
            <v-select
              label="学年"
              v-model="grade_id"
              :items="items_grade"
              item-text="label"
              item-value="id"
              outlined
              /></v-select>
            <v-select
              label="課程"
              v-model="department_id"
              :items="items_department"
              item-text="label"
              item-value="id"
              outlined
              /></v-select>
            <v-text-field
              label="電話番号"
              v-model="tel"
              :rules="[rules.requied]"
              outlined
              counter=11
              /></v-text-field>
            <v-text-field
              label="メールアドレス"
              v-model="email"
              :rules="[rules.requied]"
              outlined
              /></v-text-field>
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
          @click="edit_user_info"
          >
          編集する
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 
    
    <!--  パスワード再設定ダイアログ -->
    <v-dialog
      v-model="reset_password_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-lock-outline</v-icon>パスワード変更
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="reset_password_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
              <v-text-field
                label="新しいパスワード"
                v-model="password"
                :append-icon="show_pass ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="[rules.requied, rules.min]"
                :type="show_pass ? 'password' : 'text'"
                hint="8文字以上"
                counter
                outlined
                @click:append="show_pass = !show_pass"
              ></v-text-field>
              <v-text-field
                label="新しいパスワードの再入力"
                v-model="password_confirmation"
                :append-icon="show_pass_confirmation ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="[rules.requied, rules.min, rules.match]"
                :type="show_pass_confirmation ? 'password' : 'text'"
                hint="8文字以上"
                counter
                outlined
                @click:append="show_pass_confirmation = !show_pass_confirmation"
              ></v-text-field>
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
          @click="reset_password"
          >
          変更する
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 


    <!-- 権限編集ダイアログ -->
    <v-dialog
      v-model="edit_role_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-star-outline</v-icon>権限編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_role_dialog = false" fab dark>
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
          @click="edit_role"
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
export default {

  data() {
    return {
      uid: localStorage.getItem('uid'),
      show: [],
      user: [],
      user_id: [],
      name: [],
      email: [],
      password: [],
      password_confirmation: [],
      role_id: [],
      role: [],
      tel: [],      
      student_id: [],
      grade_id: [],
      department_id: [],
      detail: [],
      group_categories:[],
      fes_years:[],
      expand: false,
      show_pass: true,
      show_pass_confirmation: true,
      edit_user_info_dialog: false,
      reset_password_dialog: false,
      edit_role_dialog: false,
      delete_dialog: false,
      items_role:[
        {label:"developer",id:1},
        {label:"maneger",id:2},
        {label:"user",id:3}
      ],
      items_department:[
        { label: "機械創造工学課程", id: 1 },
        { label: "電気電子情報工学課程", id: 2 },
        { label: "物質材料工学課程", id: 3 },
        { label: "環境社会基盤工学課程", id: 4 },
        { label: "生物機能工学課程", id: 5 },
        { label: "情報・経営システム工学課程", id: 6 },
        { label: "機械創造工学専攻", id: 7 },
        { label: "電気電子情報工学専攻", id: 8 },
        { label: "物質材料工学専攻", id: 9 },
        { label: "環境社会基盤工学専攻", id: 10 },
        { label: "生物機能工学専攻", id: 11 },
        { label: "情報・経営システム工学専攻", id: 12 },
        { label: "原子力システム安全工学専攻", id: 13 },
        { label: "システム安全専攻", id: 14 },
        { label: "技術科学イノベーション専攻", id: 15 },
        { label: "情報・制御工学専攻", id: 16 },
        { label: "材料工学専攻", id: 17 },
        { label: "エネルギー・環境工学専攻", id: 18 },
        { label: "生物統合工学専攻", id: 19 },
        { label: "その他", id: 20 }
      ],
      items_grade:[
        { label: "B1[学部1年]", id: 1 },
        { label: "B2[学部2年]", id: 2 },
        { label: "B3[学部3年]", id: 3 },
        { label: "B4[学部4年]", id: 4 },
        { label: "M1[修士1年]", id: 5 },
        { label: "M2[修士2年]", id: 6 },
        { label: "D1[博士1年]", id: 7 },
        { label: "D2[博士2年]", id: 8 },
        { label: "D3[博士3年]", id: 9 },
        { label: "GD1[イノベ1年]", id: 10 },
        { label: "GD2[イノベ2年]", id: 11 },
        { label: "GD3[イノベ3年]", id: 12 },
        { label: "GD4[イノベ4年]", id: 13 },
        { label: "GD5[イノベ5年]", id: 14 },
        { label: "その他", id: 15 }
      ],
      rules: {
        requied: value => !!value || '入力してください',
        min: v => v.length >= 8 || '８文字未満です',
        match: v => v === this.password || 'パスワードと再確認パスワードが一致していません',
      }
    };
  },
  mounted() {
    const get_user_detail_url = "/user_details/" + this.$route.params.id;
    this.$axios.get(get_user_detail_url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response)
        this.student_id = response.data.student_id
        this.grade_id = response.data.grade_id
        this.department_id = response.data.department_id
        this.tel = response.data.tel
      })
    const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
    this.$axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.show = response.data
        this.user = response.data.user
        this.user_id = response.data.user_id
        this.name = response.data.user.name
        this.email = response.data.user.email
        this.role_id = response.data.user.role_id
      })
  },
  methods: {
    reload: function() {
      const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.show = response.data
        this.user = response.data.user
        this.role_id = response.data.user.role_id
      })
    },
    edit_role_dialog_open: function() {
      this.edit_role_dialog = true
    },
    edit_role: function() {
      const edit_url = '/api/v1/update_user/' + this.user.id + '/' + this.role_id
      console.log(edit_url)
      this.$axios.get(edit_url , {
        headers: { 
          "Content-Type": "application/json", 
        }
      }).then(response => {
        console.log(response)
        this.reload()
        this.edit_role_dialog = false
        this.success_snackbar = true
      })
    },
    edit_user_info: function() {
      if ( !this.$refs.form.validate() ) return;
      const edit_user_info_url = '/api/v1/users/edit_user_info'
      var params = {
        'user_id': this.user_id,
        'name': this.name,
        'student_id': this.student_id,
        'grade_id': this.grade_id,
        'department_id': this.department_id,
        'tel': this.tel,
        'email': this.email 
      }
      this.$axios.post(edit_user_info_url, params).then(response => {
        this.reload()
        this.edit_user_info_dialog = false
        this.success_snackbar = true
      })
    },
    reset_password: function() {
      if ( !this.$refs.form.validate() ) return;
      const reset_password_url = '/api/v1/users/reset_password'
      var params = {
        'user_id': this.user_id,
        'password': this.password,
        'password_confirmation': this.password_confirmation
      }
      this.$axios.post(reset_password_url, params).then(response => {
        this.reload()
        this.reset_password_dialog = false
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
