<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8"
      >
      <v-card
        class = "mx-auto"
        color = "white"
        flat
      >
      <v-card-title>登録情報  {{ num + 1 }}</v-card-title>
        <v-divider class="mx-4"></v-divider>
        <v-row>
          <v-col>
            <v-tabs
              dark
              grow
              background-color="white"
              v-model="tab"
              >
              <v-tabs-slider color="black"></v-tabs-slider>
              <v-tab
                :value="tab-1"
              >
              <h4 style="color:black;">団体情報</h4>
              </v-tab>

              <v-tab
                :value="tab-2"
              >
                <h4 style="color:black">代表情報</h4>
              </v-tab>

              <v-tab
                :value="tab-3"
              >
                <h4 style="color:black">会場申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-4"
              >
                <h4 style="color:black">電力申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-5"
              >
                <h4 style="color:black">物品申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-6"
              >
                <h4 style="color:black">ステージ利用申請情報</h4>
              </v-tab>

              <v-tab
                :value="tab-7"
              >
                <h4 style="color:black">従業員情報</h4>
              </v-tab>

              <v-tab
                :value="tab-8"
              >
                <h4 style="color:black">販売食品情報</h4>
              </v-tab>

              <v-tab
                :value="tab-9"
              >
                <h4 style="color:black">購入品情報</h4>
              </v-tab>
            </v-tabs>
            <v-tabs-items
              v-model="tab"
              >
              <!-- 団体情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <br>
                    <table>
                      <tr>
                        <th>団体名</th>
                        <td>{{ regist.group.name }}</td>
                      </tr>
                      <tr>
                        <th>企画名</th>
                        <td>{{ regist.group.project_name }}</td>
                      </tr>
                      <tr>
                        <th>活動内容</th>
                        <td>{{ regist.group.activity }}</td>
                      </tr>
                      <tr>
                        <th>カテゴリー</th>
                        <td>{{ regist.group.group_category_id }}</td>
                      </tr>
                    </table>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 代表情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <br>
                    <table>
                      <tr>
                        <th>代表名</th>
                        <td>{{ user.name }}</td>
                      </tr>
                      <tr>
                        <th>副代表名</th>
                        <td>{{ regist.sub_rep.name }}</td>
                      </tr>
                    </table>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 会場申請情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <br>
                    <table>
                      <tr>
                        <th>第1志望</th>
                        <td>{{ regist.place_order.first }}</td>
                      </tr>
                      <tr>
                        <th>第2志望</th>
                        <td>{{ regist.place_order.second }}</td>
                      </tr>
                      <tr>
                        <th>第3志望</th>
                        <td>{{ regist.place_order.third }}</td>
                      </tr>
                      <tr>
                        <th>備考</th>
                        <td>{{ regist.place_order.remark }}</td>
                      </tr>
                    </table>
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
                    <v-card-text>製品  {{i+1}}</v-card-text>
                    <v-divider class="mx-4"></v-divider>
                    <br>
                    <table>
                      <tr>
                        <th>製品名</th>
                        <td>{{ power_order.item }}</td>
                      </tr>
                      <tr>
                        <th>電力量</th>
                        <td>{{ power_order.power }}</td>
                      </tr>
                      <tr>
                        <th>メーカー</th>
                        <td>{{ power_order.manufacturer }}</td>
                      </tr>
                      <tr>
                        <th>型番</th>
                        <td>{{ power_order.model }}</td>
                      </tr>
                      <tr>
                        <th>URL</th>
                        <td>{{ power_order.item_url }}</td>
                      </tr>
                    </table>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 物品申請情報 -->
              <v-tab-item>
                <h1>物品申請情報</h1>
              </v-tab-item>

              <!-- ステージ利用申請情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card-text>{{ regist.stage_order }}</v-card-text>
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
                    <v-card-text>従業員  {{i+1}}</v-card-text>
                    <v-divider class="mx-4"></v-divider>
                    <table>
                      <tr>
                        <th>名前</th>
                        <td>{{ employee.name }}</td>
                      </tr>
                      <tr>
                        <th>学籍番号</th>
                        <td>{{ employee.student_id }}</td>
                      </tr>
                    </table>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!-- 販売食品情報 -->
              <v-tab-item>
                <h1>販売食品情報</h1>
              </v-tab-item>

              <!-- 購入品情報 -->
              <v-tab-item>
                <h1>購入品情報</h1>
              </v-tab-item>

            </v-tabs-items>
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
<style>
table{
  width: 100%;
  border-collapse: collapse;
}

table tr{
  border-bottom: solid 2px white;
}

table tr:last-child{
  border-bottom: none;
}

table th{
  position: relative;
  text-align: left;
  width: 30%;
  background-color: #52c2d0;
  color: white;
  text-align: center;
  padding: 10px 0;
}

table th:after{
  display: block;
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  top:calc(50% - 10px);
  right:-10px;
  border-left: 10px solid #52c2d0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}

table td{
  text-align: left;
  width: 70%;
  text-align: center;
  background-color: #eee;
  padding: 10px 0;
}
</style>
