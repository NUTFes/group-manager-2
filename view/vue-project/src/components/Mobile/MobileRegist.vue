<template>
  <div>
    <v-card class = "mx-auto" outlined>
      <v-card-title class="main font-weight-bold"><v-icon class="pr-2" size="30">mdi-information</v-icon>登録情報
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="isEditGroup" 
              text
              v-bind="attrs"
              v-on="on"
              class="my-n5"
              @click="open_delete_dialog(regist.group.id)"
              fab
              ><v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>削除</span>
        </v-tooltip>
      </v-card-title>

        <v-row>
          <v-col>
            <v-tabs vertical color="btn">
              <v-tab
                :value="tab-1"
                class="mx-n3">
                <v-icon >mdi-account-group</v-icon>
              </v-tab>

              <v-tab
                :value="tab-2"
                class="mx-n3">
                <v-icon >mdi-account-multiple</v-icon>
              </v-tab>

              <v-tab
                :value="tab-3"
                class="mx-n3">
                <v-icon >mdi-map-marker</v-icon>
              </v-tab>

              <v-tab
                :value="tab-4"
                class="mx-n3">
                <v-icon >mdi-power-plug</v-icon>
              </v-tab>

              <v-tab
                :value="tab-5"
                class="mx-n3">
                <v-icon >mdi-table-chair</v-icon>
              </v-tab>

              <v-tab
                :value="tab-6"
                class="mx-n3">
                <v-icon >mdi-microphone</v-icon>
              </v-tab>

              <v-tab
                :value="tab-7"
                class="mx-n3">
                <v-icon >mdi-microphone-plus</v-icon>
              </v-tab>

              <v-tab
                :value="tab-8"
                class="mx-n3">
                <v-icon >mdi-account</v-icon>
              </v-tab>

              <v-tab
                :value="tab-9"
                class="mx-n3">
                <v-icon >mdi-baguette</v-icon>
              </v-tab>

              <v-tab
                :value="tab-10"
                class="mx-n3">
                <v-icon >mdi-cart</v-icon>
              </v-tab>

              <!--参加団体情報-->
              <v-tab-item>
                <RegistGroup :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!--副代表情報-->
              <v-tab-item>
              <RegistSubRep :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>
              
              <!--会場申請情報-->
              <v-tab-item>
                <Registplace :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>
              
              <!--電力申請情報-->
              <v-tab-item>
                <Registpower :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- 物品申請情報 -->
              <v-tab-item>
                <RegistRentalOrder :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- ステージ利用申請情報 -->
              <v-tab-item>
              <RegistStageOrder :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- ステージオプション申請情報 -->
              <v-tab-item>
                <Registstagecommonoption :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- 従業員情報 -->
              <v-tab-item>
                <RegistEmployee :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- 販売食品情報 -->
              <v-tab-item>
                <RegistFoodProduct :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- 購入品情報 -->
              <v-tab-item>
                <RegistPurchase :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

            </v-tabs>
          </v-col>
        </v-row>
      </v-card>

      <!-- 削除ダイアログ(登録情報すべて) -->
      <v-dialog v-model="delete_dialog" width="500">
        <v-card class="mx-auto">
          <v-card-title class="main font-weight-bold">
              <v-icon  size="30">mdi-delete</v-icon>削除
            <v-spacer></v-spacer>
            <v-btn 
              fab
              text 
              class="my-n2"
              @click="delete_dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-title>
            削除してよろしいですか？
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="red" dark @click="delete_yes">
              はい
            </v-btn>
            <v-btn depressed color="blue" dark @click="delete_dialog = false">
              いいえ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>

</template>


<script>
  import axios from 'axios'
  import RegistGroup from '@/components/Mobile/RegistDisplay/Group.vue'
  import RegistEmployee from '@/components/Mobile/RegistDisplay/Employee.vue'
  import RegistFoodProduct from '@/components/Mobile/RegistDisplay/FoodProduct.vue'
  import Registplace from '@/components/Mobile/RegistDisplay/Place.vue'
  import Registpower from '@/components/Mobile/RegistDisplay/Power.vue'
  import RegistPurchase from '@/components/Mobile/RegistDisplay/PurchaseList.vue'
  import RegistRentalOrder from '@/components/Mobile/RegistDisplay/RentalOrder.vue'
  import RegistStageOrder from '@/components/Mobile/RegistDisplay/StageOrder.vue'
  import Registstagecommonoption from '@/components/Mobile/RegistDisplay/StageCommonOption.vue'
  import RegistSubRep from '@/components/Mobile/RegistDisplay/SubRep.vue'

  export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
      RegistGroup,
      RegistEmployee,
      RegistFoodProduct,
      Registplace,
      Registpower,
      RegistPurchase,
      RegistRentalOrder,
      Registstagecommonoption,
      RegistStageOrder,
      RegistSubRep,
    },
    data () {
      return {
        data: [
          localStorage.getItem('access-token'),
          localStorage.getItem('client'),
          localStorage.getItem('uid')
        ],
        user: [],
        tab: 'tab-2',
        delete_dialog: false,
        group_id: [],
        }
      },

    mounted() {
      const url = process.env.VUE_APP_URL + '/api/v1/users/show'
      axios.get(url, {
        headers: { 
          "Content-Type": "application/json", 
          "access-token": localStorage.getItem('access-token'),
          "client": localStorage.getItem('client'),
          "uid": localStorage.getItem('uid')
        }
      }
      )
        .then(response => {
          this.user = response.data.data
        })
    },

    methods: {
      reload() {
        this.$emit('reload');
      },
      //削除用ダイアログ
      open_delete_dialog(id){
        this.group_id = id
        this.delete_dialog = true
      },
    }
  }
</script>
