<template>
  <v-container>
    <v-row
        v-for="(purchase_list, i) in regist.purchase_lists"
        :key="i">
      <v-col>
        <v-card v-if="purchase_list.food_product == -9999"></v-card>
        <v-card v-else flat>
          <v-card-title class="font-weight-bold subtitle-1">
            <v-icon class="pr-2">mdi-cart</v-icon>
            <b>購入品情報{{ i+1 }}</b>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs  }">
                <v-btn
                    v-if="isEditPurchaseList"
                    x-small
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="openPurchaseListDisplay(purchase_list.food_product_id, purchase_list.group_id, purchase_list.id, purchase_list.item, purchase_list.food_product, purchase_list.shop_id, purchase_list.fes_date_id, purchase_list.is_fresh)"
                    >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>購入品情報情報を編集する</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-if="isEditPurchaseList"
                    x-small
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="open_delete_dialog_purchase(purchase_list.id)"
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
              <v-list-item-content>購入品名</v-list-item-content>
              <v-list-item-content v-if="purchase_list.item == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ purchase_list.item }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>使用目的製品</v-list-item-content>
              <v-list-item-content v-if="purchase_list.food_product == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ purchase_list.food_product }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>生鮮食品</v-list-item-content>
              <v-list-item-content v-if="purchase_list.is_fresh == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else-if="purchase_list.is_fresh === true">はい</v-list-item-content>
              <v-list-item-content v-else-if="purchase_list.is_fresh === false">いいえ</v-list-item-content>
              <v-list-item-content v-else>その他</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>購入店舗</v-list-item-content>
              <v-list-item-content v-if="purchase_list.shop == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ purchase_list.shop }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>使用日</v-list-item-content>
              <v-list-item-content v-if="purchase_list.fes_date == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ purchase_list.fes_date }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- 削除ダイアログ(購入品) -->
    <v-dialog v-model="delete_dialog_purchase" width="500">
      <v-card class="mx-auto">
        <v-card-title class="main font-weight-bold">
          <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
          <v-spacer></v-spacer>
          <v-btn 
                               fab
                               text 
                               class="my-n2"
                               @click="delete_dialog_purchase = false" 
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
          <v-btn depressed color="red" dark @click="delete_yes_purchase">
            はい
          </v-btn>
          <v-btn depressed color="blue" dark @click="delete_dialog_purchase = false">
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
                  v-if="addPurchaseList"
                  fab
                  dark
                  v-bind="attrs"
                  v-on="on"
                  color="btn"
                  depressed
                  @click="openAddPurchaseListDisplay">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>購入品を追加する</span>
          </v-tooltip>
        </v-card-actions>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

    <!-- EditModal -->
    <PurchaseList
        ref="PurchaseListDlg"
        :foodProductId="this.food_product_id"
        :groupId="this.regist.group.id"
        :id="this.purchase_list_id"
        :item="this.item"
        :foodProduct="this.food_product"
        :shopId="this.shop_id"
        :fesDateId="this.fes_date_id"
        :isFresh="this.is_fresh"
        @reload="reload"
        @getFoodProducts="getFoodProducts"
        ></PurchaseList>

    <!-- AddModal -->
    <AddPurchaseList ref="AddPurchaseListDlg"
                     :groupId="this.regist.group.id"
                     @reload="reload"
                     @openPurchaselistSnackbar="openPurchaselistSnackbar"
                     @getFoodProducts="getFoodProducts"
                     ></AddPurchaseList>

    <v-snackbar
        top
        text
        color="purple accent-2"
        v-model="PurchaselistSnackbar">
      購入品情報を更新しました
    </v-snackbar>

  </v-container>
</template>

<script>
import axios from 'axios'
import PurchaseList from '@/components/Mobile/EditModal/PurchaseList.vue'
import AddPurchaseList from '@/components/Mobile/AddModal/PurchaseList.vue'

export default {
  props: {
    num: String,
    regist: String,
  },
  components: {
    PurchaseList,
    AddPurchaseList,
  },
  data(){
    return{
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ],   
      delete_dialog_purchase: false,
      PurchaselistSnackbar: false,
      isEditPurchaseList: [],
      addPurchaseList: [],
      purchase_list_id: [],
      item: [],
      food_product: [],
      food_product_id: [],
      shop_id: [],
      is_fresh: [],
      fes_date_id: [],
      group_id: [],
    }
  },
  methods: {
    //削除メソッド(購入品)
    delete_yes_purchase() {
      const url = process.env.VUE_APP_URL + "/purchase_lists/" + this.purchase_list_id;
      axios.delete(url)      
      this.reload()
      this.delete_dialog_purchase = false
    },
    reload() {
      this.$emit('reload');
    },

    openPurchaseListDisplay(food_product_id, group_id, purchase_list_id, item, food_product, shop_id, fes_date_id, is_fresh) {
      this.food_product_id = food_product_id
      this.group_id = group_id
      this.purchase_list_id = purchase_list_id
      this.item = item
      this.food_product = food_product
      this.shop_id = shop_id
      this.fes_date_id = fes_date_id
      this.is_fresh = is_fresh
      this.$refs.PurchaseListDlg.isDisplay = true
      this.$refs.PurchaseListDlg.getFoodProducts()
      //axios.get(process.env.VUE_APP_URL + "/api/v1/get_food_products_from_group/" + this.regist.group.id, {
      //headers: { 
      //"Content-Type": "application/json", 
      //}
      //})
      //.then(response => {
      //  this.$refs.PurchaseListDlg.food_products = response.data
      // })
    },

    openAddPurchaseListDisplay() {
      this.$refs.AddPurchaseListDlg.isDisplay = true
      this.$refs.AddPurchaseListDlg.getFoodProducts()
      //axios.get(process.env.VUE_APP_URL + "/api/v1/get_food_products_from_group/" + this.regist.group.id, {
      //headers: { 
      //"Content-Type": "application/json", 
      //}
      //})
      //.then(response => {
      //  this.$refs.PurchaseListDlg.food_products = response.data
      // })
    },
    openPurchaseListSnackbar(){
      this.PurchaselistSnackbar = true
    },
    open_delete_dialog_purchase(id){
      this.purchase_list_id = id
      this.delete_dialog_purchase = true
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
        this.isEditPurchaseList = response.data[0].is_edit_purchase_list
        this.addPurchaseList = response.data[0].add_purchase_list
      })
  },

}
</script>
