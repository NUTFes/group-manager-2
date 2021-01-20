<template>
  <div>
    <Header/>
        <v-row>
          <v-col cols=2>
            <Menu/>
          </v-col>
              <v-col cols=10>
          <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-text><router-link to="/sub_reps">副代表一覧</router-link> > {{ sub_rep.name }}</v-card-text>
            <v-card>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10"> 
                  <v-card-title class="font-weight-bold mt-3">
                    {{ sub_rep.name }}
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
                  </v-card-title>
                  <hr class="mt-n3">
                  <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>学籍番号：</th>
                        <td class="caption">{{ sub_rep.student_id }}</td>
                      </tr>
                      <tr>
                        <th>学年：</th>
                        <td class="caption">{{ sub_rep.grade_id }}</td>
                      </tr>
                      <tr>
                        <th>課程：</th>
                        <td class="caption">{{ sub_rep.department_id }}</td>
                      </tr>
                      <tr>
                        <th>電話番号：</th>
                        <td class="caption">{{ sub_rep.tel }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">{{ sub_rep.created_at | format-date }}</td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">{{ sub_rep.updated_at | format-date }}</td>
                        <td v-if="rights == 1"><v-icon color="#E91E63">mdi-pencil</v-icon></td>
                        <td v-if="rights == 2"><v-icon color="#E91E63">mdi-eye</v-icon></td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            </v-card>
            <v-row>
            <v-col>
              <v-btn text color="white" to="/sub_reps"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div style="color:#333333">副代表一覧に戻る</div></v-btn>
            </v-col>
            </v-row>
          </v-col>
          <v-col cols="1"></v-col>
          </v-row>
            <!-- modal window to edit -->
            <v-dialog
              v-model="dialog"
              width="1200"
            >
              <v-card>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="8">
                    <v-card-title class="font-weight-bold"><v-icon class="pa-2">mdi-pencil</v-icon>登録情報の編集</v-card-title>
                      <v-text-field
                        label="氏名"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        filled
                        clearable
                      ></v-text-field>
                      <v-select
                        label="権限"
                        ref="groupCategory"
                        v-model="groupCategoryId"
                        :menu-props="{
                                    top: true,
                                    offsetY: true,
                                    }"
                        item-text="name"
                        item-value="id"
                        outlined
                      ></v-select>
                      <v-text-field
                        label="学籍番号８桁"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        counter="8"
                        filled
                        clearable
                      ></v-text-field>
                      <v-text-field
                        label="課程（専攻）"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        filled
                        clearable
                      ></v-text-field>
                      <v-text-field
                        label="団体"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        filled
                        clearable
                      ></v-text-field>
                      <v-text-field
                        label="電話番号"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        filled
                        clearable
                      ></v-text-field>
                      <v-btn color="blue darken-1" block dark @click="submit">登録</v-btn>
                      <v-btn color="blue darken-1" text block @click="cancel">リセット</v-btn>
                    </v-col>
                    <v-col cols="2"></v-col>
                  </v-row>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
    </div>
  </template>

  <script>
  import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
  import axios from 'axios'
  import { mapState } from 'vuex'
  
  export default {
    components: {
      Header,
      Menu,
    },
    fetch({ store }) {
      store.dispatch('getRights')
    },
    computed: {
      ...mapState(['rights'])
    },
    data() {
      return {
        sub_rep: [],
        expand: false,
        dialog: false,
      }
    },
    mounted() {
      const url = "/sub_reps/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
        this.sub_rep = response.data
      })
    }
}
</script>
  
