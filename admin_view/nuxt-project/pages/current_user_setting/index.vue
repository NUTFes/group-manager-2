<template>
  <div>
    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols=2></v-col>
            <v-col cols=8>
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-account-cog</v-icon>ユーザー個人設定
                <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="reset_password_dialog = true"
                        fab
                      >
                        <v-icon class="ma-5">mdi-lock-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>パスワード変更</span>
                  </v-tooltip>
              </v-card-title>
              <hr class="mt-n3">
            </v-col>
            <v-col cols=2></v-col>
          </v-row>
        
          <v-form ref="form">

            <v-row >
              <v-col cols=2></v-col>
              <v-col cols=3>
                <v-card-title>
                  名前
                </v-card-title>
              </v-col>
              <v-col cols=5>
                <v-text-field
                  label="名前"
                  :rules="[rules.requied]"
                  v-model="name"
                  outlined
                />
              </v-col>
              <v-col cols=2></v-col>
            </v-row>

            <v-row>
              <v-col cols=2></v-col>
              <v-col cols=3>
                <v-card-title>
                   メールアドレス
                </v-card-title>
              </v-col>
              <v-col cols=5>
                <v-text-field
                  label="メールアドレス"
                  :rules="[rules.requied, rules.email]"
                  v-model="email"
                  outlined
                />
              </v-col>
              <v-col cols=2></v-col>
            </v-row>

            <v-row>
              <v-col cols=2></v-col>
              <v-col cols=3>
                <v-card-title>
                  学籍番号
                </v-card-title>
              </v-col>
              <v-col cols=5>
                <v-text-field
                  label="学籍番号"
                  :rules="[rules.requied, rules.student_id_length]"
                  v-model="student_id"
                  counter="8"
                  outlined
                />
              </v-col>
              <v-col cols=2></v-col>
            </v-row>

            <v-row>
              <v-col cols=2></v-col>
              <v-col cols=3>
                <v-card-title>
                  学年
                </v-card-title>
              </v-col>
              <v-col cols=5>
                <v-select
                  label="学年"
                  :rules="[rules.requied]"
                  v-model="grade_id"
                  :items="grades"
                  item-text="name"
                  item-value="id"
                  outlined
                />
              </v-col>
              <v-col cols=2></v-col>
            </v-row>

            <v-row>
              <v-col cols=2></v-col>
              <v-col cols=3>
                <v-card-title>
                  課程
                </v-card-title>
              </v-col>
              <v-col cols=5>
                <v-select
                  label="課程"
                  :rules="[rules.requied]"
                  v-model="department_id"
                  :items="departments"
                  item-text="name"
                  item-value="id"
                  outlined
                />
              </v-col>
              <v-col cols=2></v-col>
            </v-row>

            <v-row>
              <v-col cols=2></v-col>
              <v-col cols=3>
                <v-card-title>
                  電話番号
                </v-card-title>
              </v-col>
              <v-col cols=5>
                <v-text-field
                  label="電話番号"
                  :rules="[rules.requied, rules.tel_length]"
                  counter="11"
                  v-model="tel"
                  outlined
                />
              </v-col>
              <v-col cols=2></v-col>
            </v-row>

            <v-row>
              <v-col cols=2></v-col>
              <v-col cols=8 >
                <v-divider ></v-divider>
              </v-col>
              <v-col cols=2></v-col>
            </v-row>

            <v-row>
              <v-col cols=7></v-col>
              <v-col cols=3>  
                <v-btn
                  rounded
                  depressed
                  dark
                  block
                  color="btn"
                  @click="edit_user_info"
                >
                  変更する
                </v-btn>
              </v-col>
              <v-col cols=2></v-col>
            </v-row>
            
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!--  パスワード再設定ダイアログ -->
    <v-dialog v-model="reset_password_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-lock-outline</v-icon>パスワード変更
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="reset_password_dialog = false" fab dark>
            <v-icon>mdi-close</v-icon>
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
                  :rules="[rules.required, rules.min]"
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
                  :rules="[rules.required, rules.min, rules.match]"
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
          <v-btn color="btn" depressed dark @click="reset_password">
            変更する
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
    
    <v-snackbar
      v-model="snackbar"
      color="blue-grey"
      :multi-line="multiLine"
      top
      elevation="24"
    >
      変更しました
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
      user_id: [],
      name: [],
      email: [],
      tel: [],
      student_id: [],
      grade_id: [],
      department_id: [],
      password: [],
      password_confirmation: [],
      snackbar: false,
      show_pass: true,
      show_pass_confirmation: true,
      reset_password_dialog: false,
      departments:[
        { name: "機械創造工学課程", id: 1 },
        { name: "電気電子情報工学課程", id: 2 },
        { name: "物質材料工学課程", id: 3 },
        { name: "環境社会基盤工学課程", id: 4 },
        { name: "生物機能工学課程", id: 5 },
        { name: "情報・経営システム工学課程", id: 6 },
        { name: "機械創造工学専攻", id: 7 },
        { name: "電気電子情報工学専攻", id: 8 },
        { name: "物質材料工学専攻", id: 9 },
        { name: "環境社会基盤工学専攻", id: 10 },
        { name: "生物機能工学専攻", id: 11 },
        { name: "情報・経営システム工学専攻", id: 12 },
        { name: "原子力システム安全工学専攻", id: 13 },
        { name: "システム安全専攻", id: 14 },
        { name: "技術科学イノベーション専攻", id: 15 },
        { name: "情報・制御工学専攻", id: 16 },
        { name: "材料工学専攻", id: 17 },
        { name: "エネルギー・環境工学専攻", id: 18 },
        { name: "生物統合工学専攻", id: 19 },
        { name: "その他", id: 20 }
      ],
      grades:[
        { name: "B1[学部1年]", id: 1 },
        { name: "B2[学部2年]", id: 2 },
        { name: "B3[学部3年]", id: 3 },
        { name: "B4[学部4年]", id: 4 },
        { name: "M1[修士1年]", id: 5 },
        { name: "M2[修士2年]", id: 6 },
        { name: "D1[博士1年]", id: 7 },
        { name: "D2[博士2年]", id: 8 },
        { name: "D3[博士3年]", id: 9 },
        { name: "GD1[イノベ1年]", id: 10 },
        { name: "GD2[イノベ2年]", id: 11 },
        { name: "GD3[イノベ3年]", id: 12 },
        { name: "GD4[イノベ4年]", id: 13 },
        { name: "GD5[イノベ5年]", id: 14 },
        { name: "その他", id: 15 }
      ],
      
      rules:{
        requied: value => !!value || '入力してください',
				student_id_length: v => v.length == 8  || '8桁かどうかを確認してください',
				tel_length: v => v.length == 11  || '11桁かどうかを確認してください',
        email: v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || '適切なメールアドレスではありません。'
        },
        min: v => v.length >= 8 || "８文字未満です",
        match: v =>
          v === this.password ||
          "パスワードと再確認パスワードが一致していません",
      },
    }
  },

  mounted() {
    this.$axios
      .get("api/v1/current_user/get_user_detail_raw", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response.data)
        this.user_id = response.data.user.id;
        this.name = response.data.user.name;
        this.email = response.data.user.email;
        this.grade_id = response.data.user_detail.grade_id;
        this.department_id = response.data.user_detail.department_id;
        this.student_id = String(response.data.user_detail.student_id)
        this.tel = response.data.user_detail.tel;
      });
 },
 methods:{
    edit_user_info: function() {
      if (!this.$refs.form.validate()) return;
      const edit_user_info_url = "/api/v1/users/edit_user_info";
      var params = {
        user_id: this.user_id,
        name: this.name,
        student_id: this.student_id,
        grade_id: this.grade_id,
        department_id: this.department_id,
        tel: this.tel,
        email: this.email
      };
      this.$axios.post(edit_user_info_url, params).then(response => {
        this.snackbar = true;
        localStorage.setItem('uid', this.email)
      });
    },

    reset_password: function() {
      if (!this.$refs.form.validate()) return;
      const reset_password_url = "/api/v1/users/reset_password";
      var params = {
        user_id: this.user_id,
        password: this.password,
        password_confirmation: this.password_confirmation
      };
      this.$axios.post(reset_password_url, params).then(response => {
        this.reset_password_dialog = false;
        this.snackbar = true;
      });
    },

 }
}
</script>
