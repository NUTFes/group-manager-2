<template>
  <div>
    <v-row>
      <v-col>
        <v-card-text>
          <div class="breadcrumbs">
            <ul>
              <li><div class="breadcrumbs-item"><router-link to="/project_names">企画名一覧</router-link></div></li>
              <li><div class="breadcrumbs-item">{{ group.project_name }}</div></li>
            </ul>
          </div>
          </v-card-text>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10"> 
              <v-card-title class="font-weight-bold mt-3">
                {{ group.project_name }}
                <v-spacer></v-spacer>
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
      </v-col>
    </v-row>

    <v-row>
      <v-col cols=1o>
        <div class="card">
        <v-btn text color="white" to="/project_names"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div class="back-button">企画名一覧に戻る</div></v-btn>
        </div>
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
