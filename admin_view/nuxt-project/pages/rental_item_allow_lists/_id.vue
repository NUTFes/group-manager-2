<template>
  <div>
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
        <div class="card">
          <v-card flat>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  {{ rental_item_allow_list.rental_item_id }}
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
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
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn text color="white" to="/rental_item_allow_lists"><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div style="color: #333333">使用可能物品一覧に戻る</div></v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>

    </v-col>
    <v-col cols="1"></v-col>
    </v-row>
    <!-- modal window to edit -->
    <v-dialog v-model="dialog" width="1200">
      <v-card>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-card-title class="font-weight-bold"
                          ><v-icon class="pa-2">mdi-pencil</v-icon>登録情報の編集</v-card-title>
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
            <v-btn color="blue darken-1" block dark @click="submit"
                   >登録</v-btn>
            <v-btn color="blue darken-1" text block @click="cancel">リセット</v-btn>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-card>
    </v-dialog>
        </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rental_item_allow_list: [],
      item: [],
      group_category: [],
      group_categories: [],
      category: [],
      expand: false,
      dialog: false,
    };
  },
  mounted() {
    this.$axios.get('/group_categories', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.group_categories = response.data
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]['name'])
        }
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
        this.group_category = response.data.group_category.id
      })
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

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
