<template>
  <div>
    <Header/>
        <v-row>
          <v-col cols=2>
            <Menu/>
          </v-col>
          <v-col cols=10>
            <v-row>
              <v-col cols=1></v-col>
              <v-col cols=10>
                <v-card>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-card-title><v-icon>mdi-account-multiple</v-icon>グループ一覧</v-card-title>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <br>
                    <v-row>
                      <v-col>
                        <template>
                          <v-simple-table>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th v-for="(header, i) in headers" :key="i" class="text-center">
                                    {{ header.text }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  class="text-center"
                                  v-for="group in groups"
                                  :key="group.id"
                                  >
                                  <td>{{ group.id }}</td>
                                  <td>{{ group.name }}</td>
                                  <td>{{ group.project_name }}</td>
                                  <td>{{ group.activity }}</td>
                                  <td>{{ group.user_id }}</td>
                                  <td>{{ group.group_category_id }}</td>
                                  <td>{{ group.fes_year_id }}</td>
                                  <td>{{ group.created_at | format-date }}</td>
                                  <td>{{ group.updated_at | format-date}}</td>
                                  <td><v-btn dense rounded text color="#01579B" :to="{name:'groups-id', params:{id: group.id}}">詳細</v-btn></td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </template>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
                </v-col>
              <v-col cols=1></v-col>
            </v-row>
          </v-col>
        </v-row>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
import axios from 'axios'

export default {
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      groups: [],
      headers: [
        {
          text: 'ID'
        },
        {
          text: '参加団体名'
        },
        {
          text: '企画名'
        },
        {
          text: '活動内容'
        },
        {
          text: 'user_id'
        },
        {
          text: 'カテゴリ'
        },
        {
          text: '開催年'
        },
        {
          text: '登録日時'
        },
        {
          text: '編集日時'
        },
        {
          text: '操作'
        },
      ],
    }
  },
  mounted() {
    this.$axios.get('/groups', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.groups = response.data
      })
  }
}
</script>