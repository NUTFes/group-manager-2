<template>
  <div>
    <Header/>
      <v-row>
        <v-col cols=2>
          <Menu/>
        </v-col>
        <v-col cols=10>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
            <v-card>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    <v-icon>mdi-account-multiple</v-icon>ユーザー一覧
                    <v-spacer></v-spacer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs  }">
                          <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            to="/users/print"
                          >
                          <v-icon dark>mdi-printer</v-icon>
                          </v-btn>
                        </template>
                        <span>印刷する</span>
                      </v-tooltip>
                  </v-card-title>
                  <hr class="mt-n3">
                  <template>
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
                  </template>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'

export default {
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      users: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: '名前', value: 'name' },
        { text: 'メールアドレス', value: 'email' },
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
}
</script>
