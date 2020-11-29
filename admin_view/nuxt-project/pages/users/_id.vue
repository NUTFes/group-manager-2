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
              </v-col>
              <v-col align="right" class="justify-center">
                <div v-if="user.role_id == 1"><v-chip color="red" text-color="white" small>developer</v-chip></div>
                <div v-if="user.role_id == 2"><v-chip color="green" text-color="white">manager</v-chip></div>
                <div v-if="user.role_id == 3"><v-chip color="blue" text-color="white">user</v-chip></div>
              </v-col>           
            </v-row>
            <v-divider></v-divider>
            <table border="0">
              <tr>
                <td class="font-weight-bold">学籍番号</td><td>{{ detail.student_id }}</td>
              </tr>
             <tr>
                <td>学年:</td><td>{{ detail.student_id }}</td>
              </tr>
             <tr>
                <tb>課程:</tb><tb>{{ detail.student_id }}</tb>
              </tr>
             <tr>
                <tb>電話番号:</tb><tb>{{ detail.student_id }}</tb>
              </tr>
             <tr>
                <tb>編集日時:</tb><tb>{{ detail.student_id }}</tb>
              </tr>
            </table>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th>学籍番号：</th>
                    <td>{{ detail.student_id }}</td>
                  </tr>
                  <tr>
                    <th>学年：</th>
                    <td>{{ grade }}</td>
                  </tr>
                  <tr>
                    <th>課程：</th>
                    <td>{{ department }}</td>
                  </tr>
                  <tr>
                    <th>電話番号：</th>
                    <td>{{ detail.tel }}</td>
                  </tr>
                  <tr>
                    <th>登録日時：</th>
                    <td>{{ user.created_at | format-date }}</td>
                  </tr>
                  <tr>
                    <th>編集日時：</th>
                    <td>{{ user.updated_at | format-date }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-list>
              <v-list-item>
                <v-list-item-content>学籍番号：</v-list-item-content>
                <v-list-item-content class="align-end">{{ detail.student_id }}</v-list-item-content>
              </v-list-item>
              <v-list-item><v-list-item-title>学年：</v-list-item-title></v-list-content>{{ grade }}</v-list-content></v-list-item>
                  <v-list-item>課程：</v-list-content>{{ department }}</v-list-content></v-list-item>
                  <v-list-item>電話番号：</v-list-content>{{ detail.tel }}</v-list-content></v-list-item>
                  <v-list-item>登録日時：</v-list-content>{{ user.created_at | format-date }}</v-list-content></v-list-item>
                  <v-list-item>編集日時：</v-list-content>{{ user.updated_at | format-date }}</v-list-content></v-list-item>
              </v-list>
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
