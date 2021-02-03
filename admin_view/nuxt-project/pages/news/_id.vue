<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text><router-link to="/news">お知らせ一覧</router-link> > {{ news.title }}</v-card-text>
          <v-card flat>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10"> 
                <v-card-title class="font-weight-bold mt-3">
                  {{ news.title }}
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
                </v-card-title>
                <hr class="mt-n3">
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>ID：</th>
                        <td class="caption">{{ news.id }}</td>
                      </tr>
                      <tr>
                        <th>タイトル：</th>
                        <td class="caption">{{ news.title }}</td>
                      </tr>
                      <tr>
                        <th>内容：</th>
                        <td class="caption">{{ news.body }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">{{ news.created_at | format-date }}</td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">{{ news.updated_at | format-date }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
        <v-btn text color="white" to="/news"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div style="color:#333333">お知らせ一覧に戻る</div></v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- modal window to edit -->
    <v-dialog
      v-model="dialog"
      width="1200"
      >
      <v-card flat>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-card-title class="font-weight-bold"><v-icon class="pa-2">mdi-pencil</v-icon>登録情報の編集</v-card-title>
            <v-text-field
              label="グループ名"
              background-color="white"
              outlined
              v-model="name"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="企画名"
              background-color="white"
              outlined
              v-model="project_name"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="企画内容"
              background-color="white"
              outlined
              v-model="activity"
              filled
              clearable
              ></v-text-field>
            <v-btn color="blue darken-1" block dark @click="submit">登録</v-btn>
            <v-btn color="blue darken-1" text block @click="cancel">リセット</v-btn>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      news: [],
      expand: false,
      dialog: false,
    }
  },
  mounted() {
    const url = "/news/" + this.$route.params.id;
    this.$axios.get(url, {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.news = response.data
      })
  }
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
