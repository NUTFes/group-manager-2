<template>
    <v-container>
        <v-row
            v-for="(rental_order, i) in regist.rental_orders"
            :key="i">
            <v-col cols=1></v-col>
            <v-col>
                <v-card flat>
                    <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-table-chair</v-icon>
                        <b>物品申請情報{{ i+1 }}</b>
                        <v-spacer></v-spacer>

                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs  }">
                                <v-btn
                                v-if="isEditRentalOrder"
                                    fab
                                    text
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="openRentalorderDisplay(rental_order.id, rental_order.rental_item_id, rental_order.num)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>物品申請情報を編集する</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    v-if="isEditRentalOrder"
                                    text
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="open_delete_dialog_item(rental_order.id)"
                                    fab>
                                    <v-icon class="ma-5">mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span>削除</span>
                        </v-tooltip>

                    </v-card-title>
                    <hr>

                    <v-list>
                        <v-list-item>
                            <v-list-item-content>物品名</v-list-item-content>
                            <v-list-item-content v-if="rental_order.name == -9999">未登録</v-list-item-content>
                            <v-list-item-content v-else>{{ rental_order.name }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-content>数量</v-list-item-content>
                            <v-list-item-content v-if="rental_order.num == -9999">未登録</v-list-item-content>
                            <v-list-item-content v-else>{{ rental_order.num }}</v-list-item-content>
                        </v-list-item>
                    </v-list>

                </v-card>
            </v-col>
            <v-col cols=1></v-col>
        </v-row>

        <!-- 削除ダイアログ(物品申請) -->
        <v-dialog v-model="delete_dialog_item" width="500">
            <v-card>
                <v-card-title class="main font-weight-bold">
                    <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
                    <v-spacer></v-spacer>
                    <v-btn 
                    fab
                    text 
                    class="my-n2"
                    @click="delete_dialog_item = false" 
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
                    <v-btn depressed color="red" dark @click="delete_yes_item">
                    はい
                    </v-btn>
                    <v-btn depressed color="blue" dark @click="delete_dialog_item = false">
                    いいえ
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
                       
        <!--AddButton-->
        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                    <template v-slot:activator="{ on, attrs  }">
                        <v-btn
                        v-if="isAddRentalOrder"
                        fab 
                        v-bind="attrs" 
                        depressed
                        v-on="on" 
                        dark 
                        color="purple accent-2" 
                        @click="openAddRentalOrderDisplay"><v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>物品申請を追加する</span>
                    </v-tooltip>
                </v-card-actions>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <!--Editmodal-->
        <Rentalorder
            ref="rentalorderDlg"
            :id="this.rental_order_id"
            :groupId="this.regist.group.id"
            :itemId="this.rental_item_id"
            :num="this.num"
            @reload="reload"
            @openRentalorderSnackbar="openRentalorderSnackbar">
        </Rentalorder>

        <!--AddModal-->
        <AddRentalOrder ref="AddRentalOrderDlg"
            :groupId="this.regist.group.id"
            @reload="reload"
            @openAddrentalorderSnackbar="openAddrentalorderSnackbar">
        </AddRentalOrder>
        
        <!--Addsnackbar-->
        <v-snackbar
            top
            text
            color="purple accent-2"
            v-model="addrentalorderSnackbar">
            物品申請情報を追加しました
        </v-snackbar>

        <!--Editsnackbar-->
        <v-snackbar
            top
            text
            color="purple accent-2"
            v-model="rentalorderSnackbar">
            物品申請情報を更新しました
        </v-snackbar>

    </v-container>
</template>

<script>
  import axios from 'axios'
  import Rentalorder from '@/components/EditModal/rental_order.vue'
  import AddRentalOrder from '@/components/AddModal/RentalOrder.vue'

export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
        Rentalorder,
        AddRentalOrder,
    },
    data (){
        return {
            data: [
                localStorage.getItem('access-token'),
                localStorage.getItem('client'),
                localStorage.getItem('uid')
            ],            
            delete_dialog_item: false,
            rentalOrderSnackbar: false,
            addRentalOrderSnackbar: false,
            isEditRentalOrder: [],
            isAddRentalOrder: [],
            addRentalOrder: [],
            rental_order_id: [],
        }
    },

    methods: {
        //削除メソッド(物品申請)
        delete_yes_item() {
            const url = process.env.VUE_APP_URL +  "/rental_orders/" + this.rental_order_id;
            axios.delete(url);
            this.reload()
            this.delete_dialog_item = false
        },
        reload() {
            this.$emit('reload');
        },
        openRentalorderSnackbar(){
            this.rentalorderSnackbar = true
        },
        openAddrentalorderSnackbar(){
            this.addrentalorderSnackbar = true
        },
        openAddRentalOrderDisplay(id, group_id, name, num) {
            this.rental_order_id = id
            this.group_id = group_id
            this.name = name
            this.num = num
            this.$refs.AddRentalOrderDlg.isDisplay = true
        },
        openRentalorderDisplay(id, rental_item_id, num){
            this.rental_order_id = id
            this.rental_item_id = rental_item_id
            this.num = num
            this.$refs.rentalorderDlg.isDisplay = true
        },
        open_delete_dialog_item(id){
            this.rental_order_id = id
            this.delete_dialog_item = true
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
          this.isEditRentalOrder = response.data[0].is_edit_rental_order
          this.isAddRentalOrder = response.data[0].add_rental_order
        })
    },

}
</script>
