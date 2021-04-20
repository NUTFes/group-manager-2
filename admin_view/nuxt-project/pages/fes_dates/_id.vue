<template>
  <div>
    <div v-if="fes_date.length===0">
      <NoData/>
    </div>
    <div v-else>
    <v-row>
      <v-col>
        <v-card-text>
          <div class="breadcrumbs">
            <ul>
              <li><div class="breadcrumbs-item"><router-link to="/fes_dates">開催日一覧</router-link></div></li>
              <li><div class="breadcrumbs-item">{{ fes_date.fes_date.date }}</div></li>
            </ul>
          </div>
        </v-card-text>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10"> 
              <v-card-title class="font-weight-bold mt-3">
                {{ fes_date.fes_date.date }}
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
                      <td class="caption">{{ fes_date.fes_date.id }}</td>
                    </tr>
                    <tr>
                      <th>開催年：</th>
                      <td class="caption">{{ fes_date.fes_year }}</td>
                    </tr>
                    <tr>
                      <th>num：</th>
                      <td class="caption">{{ fes_date.fes_date.days_num }}</td>
                    </tr>
                    <tr>
                      <th>開催日：</th>
                      <td class="caption">{{ fes_date.fes_date.date }}</td>
                    </tr>
                    <tr>
                      <th>曜日：</th>
                      <td class="caption">{{ fes_date.fes_date.day }}</td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">{{ fes_date.fes_date.created_at | format-date }}</td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">{{ fes_date.fes_date.updated_at | format-date }}</td>
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
        <v-btn text color="white" to="/fes_dates"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div class="back-button">開催日一覧に戻る</div></v-btn>
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
            <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
              <v-select
                class="body-1"
                label="開催年"
                background-color="white"
                outlined
                v-model="fes_year_id"
                :items="fes_years"
                item-text="year_num"
                item-value="id"
                clearable
                >
              </v-select>
                <v-select
                  class="body-1"
                  label="days_num"
                  background-color="white"
                  outlined
                  v-model="days_num"
                  :items="days_num_list"
                  clearable
                  >
                </v-select>
                  <v-text-field
                    class="body-1"
                    label="開催日"
                    background-color="white"
                    outlined
                    v-model="date"
                    clearable
                    >
                  </v-text-field>
                    <v-text-field
                      class="body-1"
                      label="曜日"
                      background-color="white"
                      outlined
                      v-model="day"
                      clearable
                      >
                    </v-text-field>
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
      fes_date: [],
      id: [],
      fes_year_id: [],
      days_num: [],
      date: [],
      day: [],
      fes_years: [],
      expand: false,
      edit_dialog: false,
      days_num_list: [0, 1, 2],
      delete_dialog: false,
       rules: {
        required: value => !!value || '入力してください',
      },
    }
  },
  mounted() {
    const url = "/api/v1/get_fes_date/" + this.$route.params.id;
    this.$axios.get(url, {
      headers: { 
        "Content-Type": "application/json", 
      }}
    )
      .then(response => {
        this.fes_date = response.data
        this.id = this.fes_date.fes_date.id
        this.days_num = this.fes_date.fes_date.days_num
        this.date = this.fes_date.fes_date.date
        this.day = this.fes_date.fes_date.day
        this.fes_year_id = this.fes_date.fes_date.fes_year_id
      })
  },
  methods: {
    reload: function(){
      const url = "/api/v1/get_fes_date/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }}
      )
        .then(response => {
          this.fes_date = response.data
          this.id = this.fes_date.fes_date.id
          this.days_num = this.fes_date.fes_date.days_num
          this.date = this.fes_date.fes_date.date
          this.day = this.fes_date.fes_date.day
          this.fes_year_id = this.fes_date.fes_date.fes_year_id
        })
    },
    edit_dialog_open: function() {
      this.$axios
        .get("/fes_years", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.fes_years = response.data;
        })
      this.edit_dialog = true
    },
    edit: function() {
      const edit_url = '/fes_dates/' + this.id + '?days_num=' + this.days_num + '&date=' + this.date + '&day=' + this.day + '&fes_year_id=' + this.fes_year_id
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
      const url = "/fes_dates/" + this.id
      this.$axios.delete(url)
      this.$router.push('/fes_dates')
    }
  }
}
</script>
