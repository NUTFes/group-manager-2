<template>
  <div>
    <Header/>
      <v-container>
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-card-title><v-icon>mdi-account-multiple</v-icon>ユーザー一覧</v-card-title>
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
                          <th class="text-center">
                            ID
                          </th>
                          <th class="text-center">
                            名前
                          </th>
                          <th class="text-center">
                            メールアドレス
                          </th>
                          <th class="text-center">
                            権限
                          </th>
                          <th class="text-center">
                            作成日時
                          </th>
                          <th class="text-center">
                            編集日時
                          </th>
                          <th class="text-center">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="text-center"
                          v-for="user in users"
                          :key="user.id"
                          >
                          <td>{{ user.id }}</td>
                          <td>{{ user.name }}</td>
                          <td>{{ user.email }}</td>
                          <td v-if="user.role_id == 1"><v-chip color="red" text-color="white">developer</v-chip></td>
                          <td v-if="user.role_id == 2"><v-chip color="green" text-color="white">manager</v-chip></td>
                          <td v-if="user.role_id == 3"><v-chip color="blue" text-color="white">user</v-chip></td>
                          <td>{{ user.created_at | format-date }}</td>
                          <td>{{ user.updated_at | format-date}}</td>
                          <td><v-btn dense rounded text color="#01579B" :to="{name:'users-id', params:{id: user.id}}">詳細</v-btn></td>
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
      users: [],
    }
  },
  mounted() {
    this.$axios.get('api/v1/users/index', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.users = response.data.data
      })
  }
}
</script>
