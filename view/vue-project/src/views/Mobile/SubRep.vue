<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-card flat>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <br>
                <v-card-title class="title font-weight-bold justify-center">副代表の詳細登録画面</v-card-title>
                <br>
                <v-row>
                  <v-col>
                    <v-select
                        label="団体"
                        ref="group"
                        v-model="group_id"
                        :rules="[rules.required]"
                        :items="group"
                        :menu-props="{
                                      top: true,
                                      offsetY: true,
                                      }"
                        item-text="name"
                        item-value="id"
                        outlined
                        ></v-select>
                    <v-text-field
                        label="名前"
                        background-color="white"
                        v-model="name"
                        clearable
                        ></v-text-field>

                    <v-text-field
                        label="学籍番号"
                        background-color="white"
                        v-model="student_id"
                        :rules="[rules.min1, rules.over1]"
                        hint="お持ちでない方：0を8桁入力"
                        persistent-hint
                        item-text="name"
                        item-value="id"
                        counter="8"
                        clearable
                        ></v-text-field>

                    <v-select
                        label="学科"
                        v-model.number="department_id"
                        :items="departments"
                        :menu-props="{ top: true, offsetY: true }"
                        item-text="name"
                        item-value="id"
                        clearable
                        ></v-select>

                    <v-select
                        label="学年"
                        v-model.number="grade_id"
                        :items="grades"
                        :menu-props="{ top: true, offsetY: true }"
                        item-text="name"
                        item-value="id"
                        clearable
                        ></v-select>

                    <v-text-field
                        label="TEL"
                        background-color="white"
                        v-model="tel"
                        :rules="[rules.min2, rules.over2]"
                        hint="ハイフンなしで半角入力"
                        persistent-hint
                        counter="11"
                        clearable
                        ></v-text-field>

                    <v-text-field
                        label="EMAIL"
                        background-color="white"
                        v-model="email"
                        clearable
                        ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
            <v-row>
              <v-col cols="2"></v-col>
              <v-col cols="8">
                <v-card-actions>
                  <v-btn depressed block color="primary" @click="register">登録</v-btn>
                </v-card-actions>
                <v-card-actions>
                  <v-btn depressed block text @click="reset">クリア</v-btn>
                </v-card-actions>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return{
            group: [],
            group_id: [],
            name: [],
            student_id: [],
            department_id: [],
            grade_id: [],
            tel: [],
            email: [],
            rules:{
                min1: v => v.length >= 8 || '8桁かどうかを確認してください',
                over1: v => v.length <= 8 || '8桁かどうかを確認してください',
            },
            rules:{
                min2: v => v.length >= 11 || '11桁かどうかを確認してください',
                over2: v => v.length <= 11 || '11桁かどうかを確認してください',
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
            grades: [
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
        }
    },
    methods: {
        register: function() {
        const url = process.env.VUE_APP_URL + '/sub_reps';
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        var params = new URLSearchParams();
        params.append('group_id', this.group_id);
        params.append('name', this.name);
        params.append('student_id', this.student_id);
        params.append('department_id', this.department_id);
        params.append('grade_id' , this.grade_id);
        params.append('tel' , this.tel);
        params.append('email' , this.email);
        axios.post(url, params).then(
            (response) => {
            this.$router.push('mobile_mypage')
            },
            (error) => {
            return error
            }
            )
        },
        reset: function(){
            this.student_id = ''
            this.email = ''
            this.group_id = ''
            this.tel = ''
            this.department_id = ''
            this.grade_id = ''
            this.name = ''
        },
    },
    mounted(){
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
    const groupUrl = process.env.VUE_APP_URL + '/api/v1/current_user/groups'
    axios.get(groupUrl, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }).then(
      (response) => {
        for(let i=0;i<response.data.length;i++){
          this.group.push(response.data[i])
        }
        console.log('group: ',this.group)
      },
      (error) => {
        console.error(error)
        return error;
      }
    )
    },
}
</script>
