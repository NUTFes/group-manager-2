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
                        <v-card-title><v-icon>mdi-account</v-icon>{{ user.name }}</v-card-title>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col>
                        <v-card-text><v-icon>mdi-email</v-icon>{{ user.email }}</v-card-text>
                        <v-card-text><v-icon>mdi-card-account-details</v-icon>{{ role }}</v-card-text>
                        <v-card-text><v-icon>mdi-school</v-icon>{{ department }}</v-card-text>
                        <v-card-text><v-icon>mdi-school-outline</v-icon>{{ grade }}</v-card-text>
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
      user: [],
      user_detail: [],
      role: [],
      grade: [],
      datepart: []
    }
  },
  mounted() {
    this.$axios.get('api/v1/users/get_user_detail', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
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
