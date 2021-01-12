<template>
  <div>
  <Header/>
  <v-container align="center">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="8">
        <v-card
          flat
          >
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <br>
              <v-card-title><h2>ユーザーの詳細を登録</h2></v-card-title>
              <br>
              <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="8">
                  <v-text-field
                    label="学籍番号８桁"
                    background-color="white"
                    outlined
                    v-model="student_id"
                    hint="お持ちでない方：0を8桁入力"
                    :rules="[rules.min, rules.over]"
                    counter="8"
                    filled
                    clearable
                    ></v-text-field>
                  <br>
                  <v-text-field
                    label="TEL"
                    background-color="white"
                    outlined
                    v-model="tel"
                    counter="11"
                    hint="ハイフンなしで半角入力"
                    persistent-hint
                    filled
                    clearable
                    ></v-text-field>
                  <br>
                  <v-select
                    v-model.number="department_id"
                    :items="departments"
                    :menu-props="{ top: true, offsetY: true }"
                    label="学科"
                    item-text="name"
                    item-value="id"
                    outlined
                    clearable
                    ></v-select>
                  <br>
                  <v-select
                    v-model.number="grade_id"
                    :items="grades"
                    :menu-props="{ top: true, offsetY: true }"
                    label="学年"
                    item-text="name"
                    item-value="id"
                    outlined
                    clearable
                    ></v-select>
                </v-col>
                <v-col cols="2"></v-col>
              </v-row>
              <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="8">
                  <v-card-actions>
                    <v-btn large block color="primary" @click="register">登録</v-btn>
                  </v-card-actions>
                  <v-card-actions>
                    <v-btn large block text @click="reset">クリア</v-btn>
                  </v-card-actions>
                </v-col>
                <v-col cols="2"></v-col>
              </v-row>
              <br>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>
  </div>
</template>

<style>
h1{
  text-align: center;
  color: purple;
}
</style>

<script>
import axios from 'axios'
import Header from '@/components/Header.vue'
export default {
  components: {
    Header, 
　},
  data () {
    return {
      student_id: [],
      tel: [],
      user: [],
      department_id: [],
      grade_id: [],

      rules:{
        min: v => v.length >= 8 || '8桁かどうかを確認してください',
        over: v => v.length <= 8 || '8桁かどうかを確認してください',
      },

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
      ]
    }

  },

  methods: {
    register: function() {
      const url = process.env.VUE_APP_URL + '/user_details'
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      params.append('student_id', this.student_id);
      params.append('tel', this.tel);
      params.append('department_id', this.department_id);
      params.append('grade_id', this.grade_id);
      params.append('user_id', this.user.id);
      axios.post(url, params).then(
        (response) => {
          this.$router.push('mypage')
        },
        (error) => {
          return error
        }
        )
    },

    reset: function(){
      this.student_id = ''
      this.tel = ''
      this.department_id = ''
      this.grade_id = ''
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
    }
    )
      .then(response => {
        this.user = response.data.data
      })
  }
}
</script>

