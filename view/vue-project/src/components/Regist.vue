<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8"
      >
      <v-card
        class = "mx-auto"
        outlined
      >
      <v-card-title style="background-color:#ECEFF1; font-size:30px"><v-icon class="pr-2" size="40">mdi-information</v-icon><b>登録情報  {{ num + 1 }}</b></v-card-title>
        <v-divider class="mx-4"></v-divider>
        <v-row>
          <v-col>
            <v-tabs vertical color="#E040FB">
              <v-tab
                :value="tab-1"
                class="font-weight-bold justify-start"
                >
                <v-icon class="pr-2">mdi-account-group</v-icon>団体情報
              </v-tab>

              <v-tab
                :value="tab-2"
                class="font-weight-bold justify-start"
                >
                <v-icon class="pr-2">mdi-account-multiple</v-icon>代表情報
              </v-tab>

              <v-tab
                :value="tab-3"
                class="font-weight-bold justify-start"
              >
                <v-icon class="pr-2">mdi-map-marker</v-icon>会場申請情報
              </v-tab>

              <v-tab
                :value="tab-4"
                class="font-weight-bold justify-start"
              >
                <v-icon class="pr-2">mdi-power-plug</v-icon>電力申請情報
              </v-tab>

              <v-tab
                :value="tab-5"
                class="font-weight-bold justify-start"
              >
                <v-icon class="pr-2">mdi-table-chair</v-icon>物品申請情報
              </v-tab>

              <v-tab
                :value="tab-6"
                class="font-weight-bold justify-start"
              >
                <v-icon class="pr-2">mdi-microphone-variant</v-icon>ステージ利用申請情報
              </v-tab>

              <v-tab
                :value="tab-7"
                class="font-weight-bold justify-start"
              >
                <v-icon class="pr-2">mdi-account</v-icon>従業員情報
              </v-tab>

              <v-tab
                :value="tab-8"
                class="font-weight-bold justify-start"
              >
                <v-icon class="pr-2">mdi-baguette</v-icon>販売食品情報
              </v-tab>

              <v-tab
                :value="tab-9"
                class="font-weight-bold justify-start"
              >
                <v-icon class="pr-2">mdi-cart</v-icon>購入品情報
              </v-tab>
              <v-tab-item
                >
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card
                      flat
                      >
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-account-group</v-icon><b>団体情報</b>
                        <v-spacer></v-spacer>
                        <v-btn text fab @click="openGroupDisplay"><v-icon>mdi-pencil</v-icon></v-btn>
                        <Group ref="groupDlg"
                          :groupId="regist.group.id"
                          :groupName="regist.group.name"
                          :projectName="regist.group.project_name"
                          :groupCategoryId="regist.group.group_category_id"
                          :activity="regist.group.activity"
                          @reload="reload"
                          @openGroupSnackbar="openGroupSnackbar"
                               ></Group>
                        <v-snackbar
                          top
                          text
                          color="purple accent-2"
                          v-model="groupSnackbar"
                          >
                          参加団体情報を修正しました
                        </v-snackbar>
                      </v-card-title>
                        <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>団体名</v-list-item-content>
                          <v-list-item-content>{{ regist.group.name }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>企画名</v-list-item-content>
                          <v-list-item-content>{{ regist.group.project_name }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>カテゴリー</v-list-item-content>
                          <v-list-item-content>{{ regist.group.group_category_id }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>活動内容</v-list-item-content>
                          <v-list-item-content>{{ regist.group.activity }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 代表情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title  style="color:#333333; font-size:25px">
                      <v-icon class="pr-2" size="30">mdi-account-multiple</v-icon><b>代表情報</b>
                      <v-spacer></v-spacer>
                      <v-btn text @click="openSubRepDisplay"><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      <SubRep ref="subRepDlg"></SubRep>
                      </v-card-title>
                      <hr>

                      <v-list>
                        <v-list-item>
                          <v-list-item-content>代表名</v-list-item-content>
                          <v-list-item-content>{{ user.name }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>副代表</v-list-item-content>
                          <v-list-item-content>{{ regist.sub_rep.name }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 会場申請情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-map-marker</v-icon><b>会場申請情報</b>
                        <v-spacer></v-spacer>
                        <v-btn text @click="openPlaceDisplay"><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                        <Place ref="placeDlg"
                          :groupId="regist.group.id"
                          :firstId="regist.place_order.first"
                          :secondId="regist.place_order.second"
                          :thirdId="regist.place_order.third"
                          :remark="regist.place_order.remark"
                          @reload="reload"
                          @openPlaceSnackbar="openPlaceSnackbar"
                          ></Place>
                          <v-snackbar
                          top
                          text
                          color="purple accent-2"
                          v-model="placeSnackbar"
                          >
                          会場申請情報を修正しました
                        </v-snackbar>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>第1志望</v-list-item-content>
                          <v-list-item-content>{{ regist.place_order.first }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第2志望</v-list-item-content>
                          <v-list-item-content>{{ regist.place_order.second }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第3志望</v-list-item-content>
                          <v-list-item-content>{{ regist.place_order.third }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>備考</v-list-item-content>
                          <v-list-item-content>{{ regist.place_order.remark }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 電力申請情報 -->
              <v-tab-item>
                <v-row
                  v-for="(power_order, i) in regist.power_orders"
                  :key="i"
                  >
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-power-plug</v-icon><b>製品 {{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-btn text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>製品名</v-list-item-content>
                          <v-list-item-content>{{ power_order.item }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>電力量</v-list-item-content>
                          <v-list-item-content>{{ power_order.power }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>メーカー</v-list-item-content>
                          <v-list-item-content>{{ power_order.manufacturer }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>型番</v-list-item-content>
                          <v-list-item-content>{{ power_order.model }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>URL</v-list-item-content>
                          <v-list-item-content>{{ power_order.item_url }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 物品申請情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-table-chair</v-icon>
                        <b>物品申請情報</b>
                        <v-spacer></v-spacer>
                        <v-btn text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- ステージ利用申請情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-microphone-variant</v-icon>
                        <b>ステージ利用申請情報</b>
                        <v-spacer></v-spacer>
                        <v-btn text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                      <v-card-text>{{ regist.stage_order }}</v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 従業員情報 -->
              <v-tab-item>
                <v-row
                  v-for="(employee, i) in regist.employees"
                  :key="i"
                  >
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-account</v-icon>
                        <b>従業員 {{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-btn text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>名前</v-list-item-content>
                          <v-list-item-content>{{ employee.name }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>学籍番号</v-list-item-content>
                          <v-list-item-content>{{ employee.name }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 販売食品情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-baguette</v-icon>
                        <b>販売食品情報</b>
                        <v-spacer></v-spacer>
                        <v-btn text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 購入品情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-cart</v-icon>
                        <b>購入品情報</b>
                        <v-spacer></v-spacer>
                        <v-btn text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>

<script>
  import axios from 'axios'
  import Group from '@/components/EditModal/group.vue'
  import SubRep from '@/components/EditModal/sub_rep.vue'
  import Power from '@/components/EditModal/power.vue'
  import Place from '@/components/EditModal/place.vue'

  export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
      Group,
      SubRep,
      Power,
      Place
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
      groupSnackbar: false,
      placeSnackbar: false
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
      openGroupSnackbar() {
        this.groupSnackbar = true
      },
      openPlaceSnackbar() {
        this.placeSnackbar = true
      },
      openGroupDisplay() {
        this.$refs.groupDlg.isDisplay = true
      },
      openSubRepDisplay() {
        this.$refs.subRepDlg.isDisplay = true
      },
      openPlaceDisplay() {
        this.$refs.placeDlg.isDisplay = true
      },
      openPowerDisplay() {
        this.$refs.powerDlg.isDisplay = true
      },
    }
  }
</script>
