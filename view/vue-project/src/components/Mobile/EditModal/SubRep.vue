<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-account</v-icon><b>副代表</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
              <v-text-field
                label="名前"
                background-color="white"
                v-model="name"
                outlined
                clearable
                ></v-text-field>

              <v-text-field
                label="学籍番号"
                background-color="white"
                v-model="studentId"
                :rules="[rules.min1, rules.over1]"
                hint="お持ちでない方：0を8桁入力"
                persistent-hint
                item-text="name"
                item-value="id"
                counter="8"
                outlined
                clearable
                ></v-text-field>

              <v-select
                label="学科"
                v-model="departmentId"
                :items="departments"
                :menu-props="{ top: true, offsetY: true }"
                item-text="name"
                item-value="id"
                outlined
                clearable
                ></v-select>

              <v-select
                label="学年"
                v-model="gradeId"
                :items="grades"
                :menu-props="{ top: true, offsetY: true }"
                item-text="name"
                item-value="id"
                outlined
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
                outlined
                clearable
                ></v-text-field>

              <v-text-field
                label="EMAIL"
                background-color="white"
                v-model="email"
                outlined
                clearable
                ></v-text-field>
            </v-col>
            <v-col cols="2"></v-col>
          </v-row>
          <v-row>
            <v-col cols=4></v-col>
            <v-col cols=4>
            <v-btn color="blue darken-1" large block dark @click="submit">編集する</v-btn>
            </v-col>
            <v-col cols=4></v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    groupId: Number,
    name: String,
    studentId: Number,
    gradeId: Number,
    departmentId: Number,
    tel: String,
    email: String,
  },
    data () {
        return{
            isDisplay: false,
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
        submit: function() {
        const url = process.env.VUE_APP_URL + '/sub_reps' + '/' + this.groupId + '?' + 'name=' + this.name + '&grade_id=' + this.gradeId + '&department_id=' + this.departmentId + '&student_id=' + this.studentId + '&tel=' + this.tel + '&email=' + this.email ;
        axios.put(url).then(
            (response) => {
          this.isDisplay = false
          this.$emit('openSubrepSnackbar')
          this.$emit('reload')
            },
            (error) => {
            return error
            }
            )
        },
    },
}
</script>
