<template>
  <div>
    <div v-if="rental_item_allow_list.length===0">
          <NoData/>
    </div>
    <div v-else>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
            <div class="breadcrumbs">
              <ul>
                <li><div class="breadcrumbs-item"><router-link to="/rental_item_allow_lists">使用可能物品一覧</router-link></div></li>
                <li><div class="breadcrumbs-item">{{ rental_item_allow_list.rental_item_id }}</div></li>
              </ul>
            </div>
          </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                {{ rental_item_allow_list.rental_item_id }}
                <v-spacer></v-spacer>
              <v-tooltip top v-if="selfRoleId==1">
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
              <v-tooltip top v-if="selfRoleId==1">
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
              <hr class="mt-n3" />
              <v-simple-table class="my-9">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th>ID：</th>
                      <td class="caption">{{ rental_item_allow_list.id }}</td>
                    </tr>
                    <tr>
                      <th>物品：</th>
                      <td class="caption">{{ item }}</td>
                    </tr>
                    <tr>
                      <th>グループカテゴリー：</th>
                      <td class="caption">
                        <v-chip v-if="group_category == 1" color="red" text-color="white" small>{{ category[0] }}</v-chip>
                        <v-chip v-if="group_category == 2" color="pink" text-color="white" small>{{ category[1] }}</v-chip>
                        <v-chip v-if="group_category == 3" color="blue" text-color="white" small>{{ category[2] }}</v-chip>
                        <v-chip v-if="group_category == 4" color="green" text-color="white" small>{{ category[3] }}</v-chip>
                        <v-chip v-if="group_category == 5" color="orange" text-color="white" small>{{ category[4] }}</v-chip>
                        <v-chip v-if="group_category == 6" color="blue-gray" text-color="white" small>{{ category[5] }}</v-chip>
                      </td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">
                        {{ rental_item_allow_list.created_at | format-date }}
                      </td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">
                        {{ rental_item_allow_list.updated_at | format-date }}
                      </td>
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
        <v-btn text color="white" to="/rental_item_allow_lists"><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div class="back-button">使用可能物品一覧に戻る</div></v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>

    <v-col cols="1"></v-col>

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
              <v-select
                label="物品"
                v-model="item_id"
                :items="item_list"
                item-text="name"
                item-value="id"
                outlined
                />
              <v-select
                label="グループカテゴリ"
                v-model="group_category"
                :items="group_categories"
                item-text="name"
                item-value="id"
                outlined
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
import axios from "axios";
import NoData from "../../components/NoData.vue" ;
import {mapState} from "vuex"
export default {
  components :{
    NoData
  },
  data() {
    return {
      rental_item_allow_list: [],
      id: [],
      item: [],
      item_id: [],
      item_list: [],
      group_category: [],
      group_categories: [],
      category: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,

    };
  },
  computed:{
    ...mapState({
      selfRoleId: state=>state.users.role
    })
  },
  mounted() {
    window.scrollTo(0, 0);

    this.$store.dispatch("users/getUser")
    this.$axios.get('/group_categories', {
      headers: { 
        "Content-Type": "application/json", 
      },
      
    })
      .then(response => {
        this.group_categories = response.data
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]['name'])
        }
      })
      this.$axios.get('/rental_items', {
        headers: { 
          "Content-Type": "application/json", 
        }
      }).then(response => {
        this.item_list = response.data
      })
    const url = "/api/v1/get_rental_item_allow_list/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.rental_item_allow_list = response.data.rental_item_allow_list
        this.item = response.data.item
        this.id = response.data.rental_item_allow_list.id
        this.group_category = response.data.group_category.id
        this.item_id = response.data.rental_item_allow_list.rental_item_id
      })
  },
  methods: {
    reload: function(){
      console.log("reload")
      const url = "/api/v1/get_rental_item_allow_list/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
        this.rental_item_allow_list = response.data.rental_item_allow_list
        this.item = response.data.item
        this.id = response.data.rental_item_allow_list.id
        this.group_category = response.data.group_category.id
        this.item_id = response.data.rental_item_allow_list.rental_item_id
        })
    },
    edit_dialog_open: function() {
      this.edit_dialog = true
    },
    edit: function() {
      const edit_url = '/rental_item_allow_lists/' + this.id + '?rental_item_id=' + this.item_id + '&group_category_id=' + this.group_category 
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
      const url = "/rental_item_allow_lists/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push('/rental_item_allow_lists')
    }
  }
}
</script>

<style scoped>
  td{
    width: 70%;
  }
  th{
    width: 30%;
  }
</style>  
