<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
        <v-card-text>
          <div class="breadcrumbs">
            <ul>
              <li><div class="breadcrumbs-item"><router-link to="/rental_orders">物品申請一覧</router-link></div></li>
              <li><div class="breadcrumbs-item">{{rental_order.rental_item_id}}</div></li>
            </ul>
          </div>
        </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10"> 
              <v-card-title class="font-weight-bold mt-3">
                  {{rental_order.rental_item_id}}
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
              </v-card-title>
              <hr class="mt-n3">
              <v-simple-table class="my-9">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th>ID：</th>
                      <td class="caption">{{ rental_order.id }}</td>
                    </tr>
                    <tr>
                      <th>group_id：</th>
                      <td class="caption">{{ rental_order.group_id }}</td>
                    </tr>
                    <tr>
                      <th>貸し出し物品</th>
                      <td class="caption">{{ rental_order.rental_item_id }}</td>
                    </tr>
                    <tr>
                      <th>個数</th>
                      <td class="caption">{{ rental_order.num }}</td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">{{ rental_order.created_at | format-date }}</td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">{{ rental_order.updated_at | format-date }}</td>
                      <td v-if="rights == 1"><v-icon color="#E91E63">mdi-pencil</v-icon></td>
                      <td v-if="rights == 2"><v-icon color="#E91E63">mdi-eye</v-icon></td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn text color="white" to="/rental_orders"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div style="color:#333333">物品申請一覧に戻る</div></v-btn>
      </v-col>
    </v-row>

    <!-- modal window to edit -->
    <v-dialog
      v-model="dialog"
      width="1200"
      >
      <v-card>
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
  import Header from '~/components/Header.vue'
  import Menu from '~/components/Menu.vue'
  import axios from 'axios'
  import { mapState } from 'vuex'
  
  export default {
    components: {
      Header,
      Menu,
    },
    fetch({ store }) {
      store.dispatch('getRights')
    },
    computed: {
      ...mapState(['rights'])
    },
    data() {
      return {
        rental_order: [],
        expand: false,
        dialog: false,
      }
    },
    mounted() {
      const url = "/rental_orders/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
        this.rental_order = response.data
      })
    }
}
</script>
  
