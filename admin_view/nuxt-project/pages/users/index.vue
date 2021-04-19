<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-account-multiple</v-icon>ユーザー一覧
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                  <v-btn 
                          class="mx-2" 
                          fab 
                          text
                          v-bind="attrs"
                          v-on="on"
                          @click="reload"
                          >
                          <v-icon dark>mdi-reload</v-icon>
                  </v-btn>
                </template>
                <span>更新する</span>
              </v-tooltip>
            </v-card-title>
            <hr class="mt-n3">
            <template>
              <div class="text-center" v-if="users.length === 0">
                <br><br>
                <v-progress-circular
                  indeterminate
                  color="#009688"
                  ></v-progress-circular>
                <br><br>
              </div>
              <div v-else>
              <v-data-table
                :headers="headers"
                :items="users"
                class="elevation-0 my-9"
                @click:row="
                             (data) =>
                             $router.push({ path: `/users/${data.id}`})
                             "
                >
                <template v-slot:item.role_id="{ item }">
                  <v-chip v-if="item.role_id == 1" color="red" text-color="white" small><v-icon class="mr-1">mdi-account-cog</v-icon>developer</v-chip>
                  <v-chip v-if="item.role_id == 2" color="green" text-color="white" small><v-icon class="mr-1">mdi-account-tie</v-icon>manager</v-chip>
                  <v-chip v-if="item.role_id == 3" color="blue" text-color="white" small><v-icon class="mr-1">mdi-account</v-icon>user</v-chip>
                </template>
                <template v-slot:item.created_at="{ item }">
                  {{ item.created_at | format-date }}
                </template>
                <template v-slot:item.updated_at="{ item }">
                  {{ item.updated_at | format-date }}
                </template>
              </v-data-table>                      
              </div>
            </template>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: '名前', value: 'name' },
        // { text: 'メールアドレス', value: 'email' },
        { text: '権限', value: 'role_id' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
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
  },
  methods: {
    reload: function() {
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
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
