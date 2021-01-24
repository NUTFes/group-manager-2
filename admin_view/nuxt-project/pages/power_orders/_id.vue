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
            <v-card-text><router-link to="/power_orders">電力申請一覧</router-link>>{{ power_order.group_id }}</v-card-text>
            <v-card>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10"> 
                  <v-card-title class="font-weight-bold mt-3">
                  group_id: {{power_order.group_id}}
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
                  </v-card-title>
                  <hr class="mt-n3">
                  <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>ID：</th>
                        <td class="caption">{{ power_order.id }}</td>
                      </tr>
                      <tr>
                        <th>group_id：</th>
                        <td class="caption">{{ power_order.group_id }}</td>
                      </tr>
                      <tr>
                        <th>製品：</th>
                        <td class="caption">{{ power_order.item }}</td>
                      </tr>
                      <tr>
                        <th>電力：</th>
                        <td class="caption">{{ power_order.power }}</td>
                      </tr>
                      <tr>
                        <th>メーカー：</th>
                        <td class="caption">{{ power_order.manufacturer }}</td>
                      </tr>
                      <tr>
                        <th>型番：</th>
                        <td class="caption">{{ power_order.model }}</td>
                      </tr>
                      <tr>
                        <th>製品URL：</th>
                        <td class="caption">{{ power_order.item_url }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">{{ power_order.created_at | format-date }}</td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">{{ power_order.updated_at | format-date }}</td>
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
            <v-row>
            <v-col>
              <v-btn text color="white" to="/power_orders"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div style="color:#333333">電力申請一覧に戻る</div></v-btn>
            </v-col>
            </v-row>
          </v-col>
          <v-col cols="1"></v-col>
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
                        label="氏名"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        filled
                        clearable
                      ></v-text-field>
                      <v-select
                        label="権限"
                        ref="groupCategory"
                        v-model="groupCategoryId"
                        :menu-props="{
                                    top: true,
                                    offsetY: true,
                                    }"
                        item-text="name"
                        item-value="id"
                        outlined
                      ></v-select>
                      <v-text-field
                        label="学籍番号８桁"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        counter="8"
                        filled
                        clearable
                      ></v-text-field>
                      <v-text-field
                        label="課程（専攻）"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        filled
                        clearable
                      ></v-text-field>
                      <v-text-field
                        label="団体"
                        background-color="white"
                        outlined
                        v-model="student_id"
                        filled
                        clearable
                      ></v-text-field>
                      <v-text-field
                        label="電話番号"
                        background-color="white"
                        outlined
                        v-model="student_id"
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
          </v-col>
        </v-row>
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
        power_order: [],
        expand: false,
        dialog: false,
      }
    },
    mounted() {
      const url = "/power_orders/" + this.$route.params.id;
      this.$axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
        this.power_order = response.data
      })
    }
}
</script>
  
