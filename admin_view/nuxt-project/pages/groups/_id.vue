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
                        <v-card-title><v-icon>mdi-account</v-icon>{{ group.name }}</v-card-title>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <br>
                    <v-row>
                      <v-col>
                        <v-card-text>ID：{{ group.id }}</v-card-text>
                        <v-card-text>グループ名：{{ group.name }}</v-card-text>
                        <v-card-text>企画名：{{ group.project_name }}</v-card-text>
                        <v-card-text>活動内容：{{ group.activity }}</v-card-text>
                        <v-card-text>userID：{{ group.user_id }}</v-card-text>
                        <v-card-text>カテゴリ：{{ group.group_category_id }}</v-card-text>
                        <v-card-text>開催年：{{ group.fes_year_id }}</v-card-text>
                        <v-card-text>登録日時：{{ group.created_at | format-date }}</v-card-text>
                        <v-card-text>編集日時：{{ group.updated_at | format-date }}</v-card-text>
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
      group: [],
      id: [],
      name: [],
      project_name: [],
      activity: [],
      user_id: [],
      group_category_id: [],
      fes_year_id: [],
    }
  },
  mounted() {
    const url = "groups/" + this.$route.params.id;
    this.$axios.get(url, {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.group = response.data
      })
  }
}
</script>