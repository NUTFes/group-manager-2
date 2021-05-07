<template>
    <v-container>
        <v-row
            v-for="(power_order, i) in regist.power_orders"
            :key="i">
            <v-col cols=1></v-col>
            <v-col>
                <v-card v-if="power_order.item == -9999"></v-card>
                <v-card v-else flat>
                    <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-power-plug</v-icon>
                        <b>製品 {{i+1}}</b>
                        <v-spacer></v-spacer>
                        
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs  }">
                                <v-btn
                                    v-if="isEditPowerOrder"
                                    fab
                                    text
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="openPowerDisplay(power_order.id, power_order.group_id, power_order.item, power_order.power, power_order.manufacturer, power_order.model, power_order.item_url)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>電力申請情報を編集する</span>
                        </v-tooltip>

                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-if="isEditPowerOrder"
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="open_delete_dialog_power(power_order.id)"
                              fab
                              ><v-icon class="ma-5">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          <span>削除</span>
                        </v-tooltip>
                    </v-card-title>
                    <hr>

                    <v-list>
                    <v-list-item>
                        <v-list-item-content>製品名</v-list-item-content>
                        <v-list-item-content>{{power_order.item}}</v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>電力量</v-list-item-content>
                        <v-list-item-content>{{power_order.power}}</v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>メーカー</v-list-item-content>
                        <v-list-item-content>{{power_order.manufacturer}}</v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>型番</v-list-item-content>
                        <v-list-item-content>{{power_order.model}}</v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>URL</v-list-item-content>
                        <v-list-item-content>{{power_order.item_url}}</v-list-item-content>
                    </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols=1></v-col>
        </v-row>

        <!--AddButtom -->
        <v-row>
            <v-col cols=1></v-col>
            <v-col cols=10>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                    <v-btn
                        v-if="addPowerOrder"
                        fab
                        dark
                        depressed
                        v-bind="attrs"
                        v-on="on"
                        color="btn"
                        @click="openAddpowerDisplay">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <span>電力申請を追加する</span>
            </v-tooltip>
            </v-card-actions>
            </v-col>
            <v-col cols=1></v-col>
        </v-row>

        <!-- 削除ダイアログ(電力申請) -->
        <v-dialog v-model="delete_dialog_power" width="500">
            <v-card class="mx-auto">
            <v-card-title class="main font-weight-bold">
                <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
                <v-spacer></v-spacer>
                <v-btn 
                    fab
                    text 
                    class="my-n2"
                    @click="delete_dialog_power = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-title>
                削除してよろしいですか？
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="red" dark @click="delete_yes_power">
                はい
                </v-btn>
                <v-btn depressed color="blue" dark @click="delete_dialog_power = false">
                いいえ
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <!--EditModal-->
        <Power ref="powerDlg"
            :id="this.power_order_id"
            :groupId="this.group_id"
            :item="this.item"
            :power="this.power"
            :manufacturer="this.manufacturer"
            :model="this.model"
            :url="this.url"
            @reload="reload"
            @openPowerSnackbar="openPowerSnackbar"
        ></Power>

        <!--AddModal-->
        <Addpower ref="addpowerDlg"
            :groupId="this.regist.group.id"
            @reload="reload"
            @openAddpowerSnackbar="openAddpowerSnackbar"           
        ></Addpower>

        <v-snackbar
            top
            text
            color="purple accent-2"
            v-model="powerSnackbar">
            電力申請情報を更新しました
        </v-snackbar>

        <v-snackbar
            top
            text
            color="purple accent-2"
            v-model="addpowerSnackbar">
            電力申請情報を追加しました
        </v-snackbar>

    </v-container>
</template>

<script>
  import axios from 'axios'
  import Power from '@/components/EditModal/power.vue'
  import Addpower from '@/components/AddModal/power.vue'

export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
        Power,
        Addpower,
    },
    data (){
        return { 
            data: [
                localStorage.getItem('access-token'),
                localStorage.getItem('client'),
                localStorage.getItem('uid')
            ],     
            delete_dialog_power: false,
            powerSnackbar: false,
            addpowerSnackbar: false,
            isEditPowerOrder: [],
            addPowerOrder: [], 
            power_order_id: [],
            group_id: [],
            item: [],
            power: [],
            manufacturer: [],
            model: [],
            url: [],
        }
    },
    methods: {
        //削除メソッド
        delete_yes_power() {
        const url = process.env.VUE_APP_URL + "/power_orders/" + this.power_order_id;
        axios.delete(url);
        this.reload()
        this.delete_dialog_power = false
        },
        //リロード
        reload() {
            this.$emit('reload');
        },
      //編集後Snackbar
        openPowerSnackbar() {
            this.powerSnackbar = true
        },
        //追加後Snackkbar
        openAddpowerSnackbar() {
            this.addPowerSnackbar = true
        },
        //編集のコンポーネントに関するプロップス
        openPowerDisplay(id, group_id, item, power, manufacturer, model, url) {
            this.power_order_id = id
            this.group_id = group_id
            this.item = item
            this.power = power
            this.manufacturer = manufacturer
            this.model = model
            this.url = url
            this.$refs.powerDlg.isDisplay = true
        },
        //電力申請の追加用ディスプレイ
        openAddpowerDisplay() {
            this.$refs.addpowerDlg.isDisplay = true
        },
        //削除用のメソッドのプロップス
        open_delete_dialog_power(id){
            this.power_order_id = id
            this.delete_dialog_power = true
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
          this.isEditPowerOrder = response.data[0].is_edit_power_order
          this.addPowerOrder = response.data[0].add_power_order
        })
    },    
}
</script>