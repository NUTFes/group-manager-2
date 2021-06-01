<template>
  <v-container>
    <v-row
        v-for="(food_product, i) in regist.food_products"
        :key="i">
      <v-col>
        <v-card flat>
          <v-card-title class="font-weight-bold subtitle-1">
            <v-icon class="pr-2">mdi-baguette</v-icon>
            <b>販売食品情報{{i+1}}</b>
            <v-spacer></v-spacer>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs  }">
                <v-btn
                    v-if="isEditFoodproduct"
                    x-small
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="openFoodproductDisplay(food_product.id, food_product.group_id, food_product.name, food_product.first_day_num, food_product.second_day_num, food_product.is_cooking)"
                    >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>販売食品情報を編集する</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-if="isEditFoodproduct"
                    x-small
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="open_delete_dialog_food(food_product.id)"
                    fab
                    ><v-icon class="ma-5">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>削除</span>
            </v-tooltip>
          </v-card-title>
          <hr>
          <v-list class="subtitle-2">
            <v-list-item>
              <v-list-item-content>商品名</v-list-item-content>
              <v-list-item-content v-if="food_product.name == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ food_product.name }}</v-list-item-content>                </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>1日目の個数</v-list-item-content>
              <v-list-item-content v-if="food_product.first_day_num == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ food_product.first_day_num }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>2日目の個数</v-list-item-content>
              <v-list-item-content v-if="food_product.second_day_num == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ food_product.second_day_num }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>調理の有無</v-list-item-content>
              <v-list-item-content v-if="food_product.is_cooking == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else-if="food_product.is_cooking == true">調理する</v-list-item-content>
              <v-list-item-content v-else-if="food_product.is_cooking == false">調理しない</v-list-item-content>
              <v-list-item-content v-else>{{ food_product.is_cooking }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- 削除ダイアログ(販売食品) -->
    <v-dialog v-model="delete_dialog_food" width="500">
      <v-card class="mx-auto">
        <v-card-title class="main font-weight-bold">
          <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
          <v-spacer></v-spacer>
          <v-btn 
                               fab
                               text 
                               class="my-n2"
                               @click="delete_dialog_food = false" 
                               >
                               <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-title>
          削除してよろしいですか？
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="red" dark @click="delete_yes_food">
            はい
          </v-btn>
          <v-btn depressed color="blue" dark @click="delete_dialog_food = false">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--AddButtom -->
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="10">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs  }">
              <v-btn
                  v-if="addFoodProduct"
                  fab
                  dark
                  v-bind="attrs"
                  v-on="on"
                  color="btn"
                  depressed
                  @click="openAddFoodProductDisplay()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>販売食品を追加する</span>
          </v-tooltip>
        </v-card-actions>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

    <!-- AddModal -->  
    <AddFoodProduct ref="AddFoodProductDlg"
                    :groupId="this.regist.group.id"
                    @reload="reload">
    </AddFoodProduct>

    <!--EditModal-->
    <Foodproduct ref="foodproductDlg"
                 :id = "this.food_product_id"
                 :groupId = "this.group_id"
                 :name = "this.name"
                 :firstN = "this.first_day_num"
                 :secondN = "this.second_day_num"
                 :cooking = "this.is_cooking"
                 @reload="reload"
                 @openFoodproductSnackbar="openFoodproductSnackbar">
    </Foodproduct>

    <v-snackbar
        top
        text
        color="purple accent-2"
        v-model="foodproductSnackbar">
      販売食品情報を更新しました
    </v-snackbar>

  </v-container>
</template>

<script>
  import axios from 'axios'
  import Foodproduct from '@/components/Mobile/EditModal/FoodProduct.vue'
  import AddFoodProduct from '@/components/Mobile/AddModal/FoodProduct.vue'

export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
        Foodproduct,
        AddFoodProduct,
    },
    data (){
        return {
            data: [
                localStorage.getItem('access-token'),
                localStorage.getItem('client'),
                localStorage.getItem('uid')
            ],  
            delete_dialog_food: false,
            foodproductSnackbar: false,
            isEditFoodproduct:[],
            addFoodProduct: [],
            food_product_id: [],
            group_id: [],
            name: [],
            first_day_num: [],
            second_day_num: [],
            is_cooking: [],
        }
    },
    methods: {
        //削除メソッド(販売食品)
        delete_yes_food() {
            const url = process.env.VUE_APP_URL + "/food_products/" + this.food_product_id;
            axios.delete(url);      
            this.reload()
            this.delete_dialog_food = false
        },
        reload() {
            this.$emit('reload');
        },
        //編集後Snackbar
        openFoodproductSnackbar() {
            this.foodproductSnackbar = true
        },
        openAddFoodProductDisplay() {
            this.$refs.AddFoodProductDlg.isDisplay = true
        },
        openFoodproductDisplay(id, group_id, name, first_day_num, second_day_num, is_cooking) {
            this.food_product_id = id
            this.group_id = group_id
            this.name = name
            this.first_day_num = first_day_num
            this.second_day_num = second_day_num
            this.is_cooking = is_cooking
            this.$refs.foodproductDlg.isDisplay = true
        },
        open_delete_dialog_food(id){
            this.food_product_id = id
            this.delete_dialog_food = true
        },
    },

    mounted() {
      const settingurl = process.env.VUE_APP_URL + '/user_page_settings'
      axios.get(settingurl, {
        headers: { 
          "Content-Type": "application/json", 
          "access-token": localStorage.getItem('access-token'),
          "client": localStorage.getItem('client'),
        }
      }
      )
        .then(response => {
          this.isEditFoodproduct = response.data[0].is_edit_food_product
          this.addFoodProduct = response.data[0].add_food_product
        })
    },

}
</script>
