<template>
  <div>
    <div v-if="news.length===0">
          <NoData/>
    </div>
    <div v-else>  
    <v-row>
      <v-col>
        <v-card-text>
          <div class="breadcrumbs">
            <ul>
              <li><div class="breadcrumbs-item"><router-link to="/news">お知らせ一覧</router-link></div></li>
              <li><div class="breadcrumbs-item">{{ news.title }}</div></li>
            </ul>
          </div>
        </v-card-text>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10"> 
              <v-card-title class="font-weight-bold mt-3">
                {{ news.title }}
                <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                    text 
                    v-bind="attrs"
                    v-on="on"
                    @click="edit_dialog_open" 
                    fab>
                    <v-icon class="ma-5">mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>編集</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                  <v-btn 
                    text 
                    v-bind="attrs"
                    v-on="on"
                    @click="delete_dialog = true" 
                    fab>
                    <v-icon class="ma-5">mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>削除</span>
              </v-tooltip>
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
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
        <v-btn text color="white" to="/news"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div class="back-button">お知らせ一覧に戻る</div></v-btn>
        </div>
      </v-col>
    </v-row>

<!-- 編集ダイアログ -->

    <v-dialog
      v-model="edit_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-pencil</v-icon>編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
                <v-text-field
                label="タイトル"
                v-model="title"
                clearable
                outlined
                :rules="[rules.required]"
                />
                <v-textarea
                label="内容"
                v-model="body"
                clearable
                outlined
                :rules="[rules.required]"
                />
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          dark
          color="btn"
          @click="edit"
          >
          編集する
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 

    <!-- 削除ダイアログ -->
    <v-dialog
      v-model="delete_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-delete</v-icon>削除
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="delete_dialog = false" fab dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

      <v-card-title>
        削除してよろしいですか？
      </v-card-title>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          dark
          color="yes"
          @click="delete_yes"
          >
          はい
        </v-btn>
        <v-btn
          depressed
          dark
          color="no"
          @click="delete_dialog = false"
          >
          いいえ
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 

    <!-- 編集成功SnackBar -->
    <v-snackbar
      v-model="success_snackbar"
      color="blue-grey"
      top
      elevation="24"
    >
      編集しました

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
        <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
  </div>
</template>

<script>
import NoData from "../../components/NoData.vue" ;
export default {
  components :{
    NoData
  },
  data() {
    return {
      news: [],
      id : [],
      title: [],
      body: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
       rules: {
        required: value => !!value || '入力してください',
      },
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
        this.id = response.data.id
        this.title = response.data.title
        this.body = response.data.body
      })
  },
  methods: {
    reload: function(){
      console.log("reload")
      const url = "/news/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
        this.news = response.data
        this.id = response.data,id
        this.title = response.data.title
        this.body = response.data.body
        })
    },
    edit_dialog_open: function() {
      this.edit_dialog = true
    },
    edit: function() {
      const edit_url = '/news/' + this.id + '?title=' + this.title + '&body=' + this.body
      console.log(edit_url)
      this.$axios.put(edit_url , {
        headers: { 
          "Content-Type": "application/json", 
        }
      }).then(response => {
        console.log(response)
        this.reload()
        this.edit_dialog = false
        this.success_snackbar = true
      })
    },
    delete_yes: function() {
      const url = "/news/" + this.$route.params.id;
      this.$axios.delete(url)
      this.$router.push('/news')
    }
  }
}
</script>
