<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
            <div class="breadcrumbs">
              <ul>
                <li><div class="breadcrumbs-item"><router-link to="/purchase_lists">購入品一覧</router-link></div></li>
                <li><div class="breadcrumbs-item">{{ purchase.items }}</div></li>
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
                  {{ purchase.items }}
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                      <th>id：</th>
                        <td class="caption">
                          {{ purchase.id }}
                        </td>
                      </tr>
                      <tr>
                      <th>food_product_id：</th>
                        <td class="caption">
                          {{ purchase.food_product_id }}
                        </td>
                      </tr>
                      <tr>
                      <th>参加団体：</th>
                        <td class="caption">
                          {{ group }}
                        </td>
                      </tr>
                      <tr>
                      <th>販売食品：</th>
                        <td class="caption">
                          {{ food_product }}
                        </td>
                      </tr>
                      <tr>
                      <th>使用日：</th>
                      <td class="caption">
                        {{ fes_date.date }} - {{ fes_date.day }} - {{ fes_date.days_num }}日目
                      </td>
                      </tr>
                      <tr>
                      <th>店：</th>
                        <td class="caption">
                          {{ shop }}
                        </td>
                      </tr>
                      <tr>
                      <th>なまもの：</th>
                        <td class="caption">
                          <v-chip v-if="purchase.is_fresh == true" color="red" text-color="white" small>はい</v-chip>
                          <v-chip v-if="purchase.is_fresh == false" color="red" text-color="white" small>いいえ</v-chip>
                        </td>
                      </tr>
                      <tr>
                      <th>登録日時：</th>
                        <td class="caption">
                          {{ purchase.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ purchase.updated_at | format-date }}
                        </td>
                        <td v-if="rights == 1">
                          <v-icon color="#E91E63">mdi-pencil</v-icon>
                        </td>
                        <td v-if="rights == 2">
                          <v-icon color="#E91E63">mdi-eye</v-icon>
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
        <v-btn text color="white" to="/purchase_lists"><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div style="color: #333333">購入品一覧に戻る</div></v-btn>
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
export default {
  data() {
    return {
      purchase: [],
      food_product: [],
      group: [],
      shop: [],
      fes_date: [],
      expand: false,
      dialog: false,
    };
  },
  mounted() {
    const url = "/api/v1/get_purchase_list/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.purchase = response.data.purchase_list
        this.food_product = response.data.food_product
        this.group = response.data.group
        this.shop = response.data.shop
        this.fes_date = response.data.fes_date
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
