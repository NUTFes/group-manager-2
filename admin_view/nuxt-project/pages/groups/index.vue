<template>
  <div>
    <Header/>
      <v-container>
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
      </v-container>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import axios from 'axios'

export default {
  components: {
    Header,
  },
  data() {
    return {
      groups: [],
      headers: [
        {
          text: 'ID'
        },
        {
          text: 'グループ名'
        },
        {
          text: '企画名'
        },
        {
          text: '活動内容'
        },
        {
          text: 'user_name'
        },
        {
          text: '開催年'
        },
        {
          text: '操作日時'
        },
        {
            text: '詳細'
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