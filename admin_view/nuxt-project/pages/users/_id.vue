<template>
  <div>
    <Header/>
      <v-container>
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-card-title><v-icon>mdi-account</v-icon>{{ user.name }}</v-card-title>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <br>
            <v-row>
              <v-col>
                <div v-if="user.role_id == 1"><v-chip color="red" text-color="white">developer</v-chip></div>
                <div v-if="user.role_id == 2"><v-chip color="green" text-color="white">manager</v-chip></div>
                <div v-if="user.role_id == 3"><v-chip color="blue" text-color="white">user</v-chip></div>
                <v-card-text>学年：{{ grade }}</v-card-text>
                <v-card-text>課程：{{ department }}</v-card-text>
                <v-card-text>登録日時：{{ user.created_at | format-date }}</v-card-text>
                <v-card-text>編集日時：{{ user.updated_at | format-date }}</v-card-text>
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
      user: [],
      role: [],
      grade: [],
      department: [],
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
      })
  }
}
</script>
