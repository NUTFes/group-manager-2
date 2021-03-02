<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
        <v-card-text>
          <div class="breadcrumbs">
            <ul>
              <li><div class="breadcrumbs-item"><router-link to="/project_names">企画名一覧</router-link></div></li>
              <li><div class="breadcrumbs-item">{{ group.project_name }}</div></li>
            </ul>
          </div>
          </v-card-text>
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10"> 
              <v-card-title class="font-weight-bold mt-3">
                {{ group.project_name }}
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
              </v-card-title>
              <hr class="mt-n3">
              <v-simple-table class="my-9">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th>ID：</th>
                      <td class="caption">{{ group.id }}</td>
                    </tr>
                    <tr>
                      <th>ユーザー：</th>
                      <td class="caption">{{ user }}</td>
                    </tr>
                    <tr>
                      <th>グループ名：</th>
                      <td class="caption">{{ group.name }}</td>
                    </tr>
                    <tr>
                      <th>企画名：</th>
                      <td class="caption">{{ group.project_name }}</td>
                    </tr>
                    <tr>
                      <th>活動内容：</th>
                      <td class="caption">{{ group.activity }}</td>
                    </tr>
                    <tr>
                      <th>グループカテゴリ：</th>
                      <td class="caption">
                      <v-chip v-if="group.group_category_id == 1" color="red" text-color="white" small>{{ category[0] }}</v-chip>
                      <v-chip v-if="group.group_category_id == 2" color="pink" text-color="white" small>{{ category[1] }}</v-chip>
                      <v-chip v-if="group.group_category_id == 3" color="blue" text-color="white" small>{{ category[2] }}</v-chip>
                      <v-chip v-if="group.group_category_id == 4" color="green" text-color="white" small>{{ category[3] }}</v-chip>
                      <v-chip v-if="group.group_category_id == 5" color="orange" text-color="white" small>{{ category[4] }}</v-chip>
                      <v-chip v-if="group.group_category_id == 6" color="blue-gray" text-color="white" small>{{ category[5] }}</v-chip>
                      </td>
                    </tr>
                    <tr>
                      <th>開催年：</th>
                      <td class="caption">{{ fes_year }}</td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">{{ group.created_at | format-date }}</td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">{{ group.updated_at | format-date }}</td>
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
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols=1o>
        <div class="card">
        <v-btn text color="white" to="/project_names"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div class="back-button">企画名一覧に戻る</div></v-btn>
        </div>
      </v-col>
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
        group: [],
        user: [],
        group_category_id: [],
        fes_year: [],
        category: [],
        expand: false,
        dialog: false,
      }
    },
    mounted() {
      const url = "api/v1/get_group_from_project_name/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
          this.group = response.data.group
          this.user = response.data.user
          this.group_category_id = response.data.group.group_category_id
          this.fes_year = response.data.fes_year
        })

    const category_url = "group_categories" + this.group_category_id;
    this.$axios.get(category_url, {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        console.log(response)
        this.group_categories = response.data
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]['name'])
        }
      })
  }
}
</script>
  
<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
