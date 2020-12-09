<template>
  <div>
    <Header/>
      <v-container>
        <v-card
          class="mx-auto"
        >
          <v-container>
            <v-row justify="end" align="center">
              <v-col> 
                <v-card-title class="font-weight-bold"><v-icon>mdi-account</v-icon>{{ user.name }}</v-card-title>
                <div v-if="user.role_id == 1"><v-chip color="red" text-color="white" x-small class="mt-n8 mx-4"><v-icon x-small>mdi-pencil</v-icon>developer</v-chip></div>
                <div v-if="user.role_id == 2"><v-chip color="green" text-color="white" class="mx-3">manager</v-chip></div>
                <div v-if="user.role_id == 3"><v-chip color="blue" text-color="white" class="mx-3">user</v-chip></div>
             </v-col>
              <v-col align="right">
                <v-btn text><v-icon class="ma-5">mdi-pencil</v-icon></v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
             <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th>学籍番号：</th>
                    <td class="caption">{{ detail.student_id }}</td>
                  </tr>
                  <tr>
                    <th>学年：</th>
                    <td class="caption">{{ grade }}</td>
                  </tr>
                  <tr>
                    <th>課程：</th>
                    <td class="caption">{{ department }}</td>
                  </tr>
                  <tr>
                    <th>電話番号：</th>
                    <td class="caption">{{ detail.tel }}</td>
                  </tr>
                  <tr>
                    <th>登録日時：</th>
                    <td class="caption">{{ user.created_at | format-date }}</td>
                  </tr>
                  <tr>
                    <th>編集日時：</th>
                    <td class="caption">{{ user.updated_at | format-date }}</td>
                    <td v-if="currentUserRole == 1"><v-icon color="#E91E63">mdi-pencil</v-icon></td>
                    <td v-if="currentUserRole == 2"><v-icon color="#E91E63">mdi-eye</v-icon></td>
                	</tr>
                </tbody>
              </template>
            </v-simple-table>
           </v-container>
          </v-card>
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
        user: [],
        role: [],
        grade: [],
        department: [],
        detail: [],
        expand: false,
        currentUserRole: ""
      }
    },
    computed: {
      currentUserRole() {
        return this.$store.state.currentUserRole;
      }
    },
    methods: {
      getCurrentUserRole() {
        this.$store.dispatch("getCurrentUserRoleAction");
      }
    },
    mounted() {
      const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
        this.user = response.data.user
        this.role = response.data.role
        this.grade = response.data.grade
        this.department = response.data.department
        this.detail = response.data.detail
      })
  }
}
</script>
  
