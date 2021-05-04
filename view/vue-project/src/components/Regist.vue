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
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-account-group</v-icon>団体情報
              </v-tab>

              <v-tab
                :value="tab-2"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-account-multiple</v-icon>副代表情報
              </v-tab>

              <v-tab
                :value="tab-3"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-map-marker</v-icon>会場申請情報
              </v-tab>

              <v-tab
                :value="tab-4"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-power-plug</v-icon>電力申請情報
              </v-tab>

              <v-tab
                :value="tab-5"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-table-chair</v-icon>物品申請情報
              </v-tab>

              <v-tab
                :value="tab-6"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-microphone</v-icon>ステージ利用申請情報
              </v-tab>

              <v-tab
                :value="tab-7"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-microphone-plus</v-icon>ステージオプション申請情報
              </v-tab>

              <v-tab
                :value="tab-8"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-account</v-icon>従業員情報
              </v-tab>

              <v-tab
                :value="tab-9"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-baguette</v-icon>販売食品情報
              </v-tab>

              <v-tab
                :value="tab-10"
                class="font-weight-bold justify-start">
                <v-icon class="pr-2">mdi-cart</v-icon>購入品情報
              </v-tab>

              <!--参加団体情報-->
              <v-tab-item>
                <Registgroup :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!--副代表情報-->
              <v-tab-item>
              <Registsubrep :num="i" :regist="regist" @reload="reload()"/>
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
                <Registrentalorder :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- ステージ利用申請情報 -->
              <v-tab-item>
              <Registstageorder :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- ステージオプション申請情報 -->
              <v-tab-item>
                <Registstagecommonoption :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- 従業員情報 -->
              <v-tab-item>
                <Registemployee :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- 販売食品情報 -->
              <v-tab-item>
                <Registfoodproduct :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

              <!-- 購入品情報 -->
              <v-tab-item>
                <Registpurchase :num="i" :regist="regist" @reload="reload()"/>
              </v-tab-item>

            </v-tabs>
          </v-col>
        </v-row>
      </v-card>

      <!-- 削除ダイアログ(登録情報すべて) -->
      <v-dialog v-model="delete_dialog" width="500">
        <v-card class="mx-auto">
          <v-card-title class="main font-weight-bold">
              <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
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
  import Registgroup from '@/components/RegistDisplay/group.vue'
  import Registemployee from '@/components/RegistDisplay/employee.vue'
  import Registfoodproduct from '@/components/RegistDisplay/foodproduct.vue'
  import Registplace from '@/components/RegistDisplay/place.vue'
  import Registpower from '@/components/RegistDisplay/power.vue'
  import Registpurchase from '@/components/RegistDisplay/purchase_list.vue'
  import Registrentalorder from '@/components/RegistDisplay/rental_order.vue'
  import Registstageorder from '@/components/RegistDisplay/stage_order.vue'
  import Registstagecommonoption from '@/components/RegistDisplay/StageCommonOption.vue'
  import Registsubrep from '@/components/RegistDisplay/sub_rep.vue'

  export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
      Registgroup,
      Registemployee,
      Registfoodproduct,
      Registplace,
      Registpower,
      Registpurchase,
      Registrentalorder,
      Registstagecommonoption,
      Registstageorder,
      Registsubrep,
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