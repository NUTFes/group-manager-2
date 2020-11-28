<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8"
      >
      <v-card
        class = "mx-auto"
        outlined
      >
      <v-card-title style="background-color:#ECEFF1; font-size:30px"><b>登録情報  {{ num + 1 }}</b></v-card-title>
        <v-divider class="mx-4"></v-divider>
        <v-row>
          <v-col>
            <v-tabs vertical color="#E040FB">
              <v-tab
                :value="tab-1"
                >
                <h4 style="color:#333333;">団体情報</h4>
              </v-tab>

              <v-tab
                :value="tab-2"
                >
                <h4 style="color:#333333">代表情報</h4>
              </v-tab>

              <v-tab
                :value="tab-3"
              >
                <h4 style="color:#333333">会場申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-4"
              >
                <h4 style="color:#333333">電力申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-5"
              >
                <h4 style="color:#333333">物品申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-6"
              >
                <h4 style="color:#333333">ステージ利用申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-7"
              >
                <h4 style="color:#333333">従業員情報</h4>
              </v-tab>

              <v-tab
                :value="tab-8"
              >
                <h4 style="color:#333333">販売食品情報</h4>
              </v-tab>

              <v-tab
                :value="tab-9"
              >
                <h4 style="color:#333333">購入品情報</h4>
              </v-tab>
              <v-tab-item
                >
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card
                      flat
                      >
                      <v-card-title style="color:#333333; font-size:25px"><b>団体情報</b></v-card-title>
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
                      <v-card-title  style="color:#333333; font-size:25px"><b>代表情報</b></v-card-title>
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
                      <v-card-title style="color:#333333; font-size:25px"><b>会場申請情報</b></v-card-title>
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
                      <v-card-title style="color:#333333; font-size:25px"><b>製品 {{ i+1 }}</b></v-card-title>
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
                      <v-card-title style="color:#333333; font-size:25px"><b>物品申請情報</b></v-card-title>
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
                      <v-card-title style="color:#333333; font-size:25px"><b>ステージ利用申請情報</b></v-card-title>
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
                      <v-card-title style="color:#333333; font-size:25px"><b>従業員 {{ i+1 }}</b></v-card-title>
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
                      <v-card-title style="color:#333333; font-size:25px"><b>販売食品情報</b></v-card-title>
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
                      <v-card-title style="color:#333333; font-size:25px"><b>購入品情報</b></v-card-title>
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
  export default {
    props: {
      num: String,
      regist: String,
    },
    data () {
    return {
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ],
      user: [],
      tab: 'tab-2'
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
    }
  }
</script>
<!-- <style> -->
<!-- table{ -->
<!--   width: 100%; -->
<!--   border-collapse: collapse; -->
<!-- } -->
<!--  -->
<!-- table tr{ -->
<!--   border-bottom: solid 2px white; -->
<!-- } -->
<!--  -->
<!-- table tr:last-child{ -->
<!--   border-bottom: none; -->
<!-- } -->
<!--  -->
<!-- table th{ -->
<!--   position: relative; -->
<!--   text-align: left; -->
<!--   width: 30%; -->
<!--   background-color: #52c2d0; -->
<!--   color: white; -->
<!--   text-align: center; -->
<!--   padding: 10px 0; -->
<!-- } -->
<!--  -->
<!-- table th:after{ -->
<!--   display: block; -->
<!--   content: ""; -->
<!--   width: 0px; -->
<!--   height: 0px; -->
<!--   position: absolute; -->
<!--   top:calc(50% - 10px); -->
<!--   right:-10px; -->
<!--   border-left: 10px solid #52c2d0; -->
<!--   border-top: 10px solid transparent; -->
<!--   border-bottom: 10px solid transparent; -->
<!-- } -->
<!--  -->
<!-- table td{ -->
<!--   text-align: left; -->
<!--   width: 70%; -->
<!--   text-align: center; -->
<!--   background-color: #eee; -->
<!--   padding: 10px 0; -->
<!-- } -->
<!-- </style> -->
