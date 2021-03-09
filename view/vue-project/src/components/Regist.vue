<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8"
      >
      <v-card
        class = "mx-auto"
        outlined
      >
      <v-card-title style="background-color:#ECEFF1; font-size:30px"><v-icon class="pr-2" size="40">mdi-information</v-icon><b>登録情報</b></v-card-title>
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
                <v-icon class="pr-2">mdi-account-multiple</v-icon>副代表情報
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
                        <v-btn v-if="isEditGroup" text fab @click="openGroupDisplay"><v-icon>mdi-pencil</v-icon></v-btn>
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
                          参加団体情報を更新しました
                        </v-snackbar>
                      </v-card-title>
                        <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>団体名</v-list-item-content>
                          <v-list-item-content v-if="regist.sub_rep.name == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.group.name }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>企画名</v-list-item-content>
                          <v-list-item-content v-if="regist.group.project_name == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.group.project_name }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>カテゴリー</v-list-item-content>
                          <v-list-item-content v-if="regist.group_category == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.group_category }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>活動内容</v-list-item-content>
                          <v-list-item-content v-if="regist.group.activity == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.group.activity }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
              </v-tab-item>

              <!--副代表情報 -->
              <v-tab-item>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title  style="color:#333333; font-size:25px">
                      <v-icon class="pr-2" size="30">mdi-account-multiple</v-icon><b>副代表情報</b>
                      <v-spacer></v-spacer>
                      <v-btn v-if="isEditSubRep" text fab @click="openSubRepDisplay"><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      <SubRep ref="subRepDlg"
                          :groupId="regist.group.id"
                          :name="regist.sub_rep.name"
                          :studentId="regist.sub_rep.student_id"
                          :gradeId="regist.sub_rep.grade_id"
                          :departmentId="regist.sub_rep.department_id"
                          :tel="regist.sub_rep.tel"
                          :email="regist.sub_rep.email"
                          @reload="reload"
                          @openSubrepSnackbar="openSubrepSnackbar">
                      </SubRep>
                      <v-snackbar
                          top
                          text
                          color="purple accent-2"
                          v-model="subrepSnackbar"
                          >
                          副代表情報を更新しました
                        </v-snackbar>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>氏名</v-list-item-content>
                          <v-list-item-content v-if="regist.sub_rep.name == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.sub_rep.name }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>学籍番号</v-list-item-content>
                          <v-list-item-content v-if="regist.sub_rep.student_id == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.sub_rep.student_id }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>学科</v-list-item-content>
                          <v-list-item-content v-if="regist.sub_rep.department_id == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.sub_rep.department_id }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>学年</v-list-item-content>
                          <v-list-item-content v-if="regist.sub_rep.grade_id == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.sub_rep.grade_id }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>電話番号</v-list-item-content>
                          <v-list-item-content v-if="regist.sub_rep.tel == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.sub_rep.tel }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>メールアドレス</v-list-item-content>
                          <v-list-item-content v-if="regist.sub_rep.email == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.sub_rep.email }}</v-list-item-content>
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
                        <v-btn v-if="isEditPlace" text fab @click="openPlaceDisplay"><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
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
                          会場申請情報を更新しました
                        </v-snackbar>
                      </v-card-title>
                      <hr>
                      <v-card-text v-if = "regist.first_place_order == -9999">未登録</v-card-text>
                      <v-list v-else>
                        <v-list-item>
                          <v-list-item-content>第1志望</v-list-item-content>
                          <v-list-item-content v-if="regist.first_place_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.first_place_order }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第2志望</v-list-item-content>
                          <v-list-item-content v-if="regist.second_place_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.second_place_order }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第3志望</v-list-item-content>
                          <v-list-item-content v-if="regist.third_place_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.third_place_order }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>備考</v-list-item-content>
                          <v-list-item-content v-if="regist.place_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.place_order.remark }}</v-list-item-content>
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
                        <v-btn v-if="isEditPowerOrder" text fab @click="openPowerDisplay(power_order.id, power_order.group_id, power_order.item, power_order.power, power_order.manufacturer, power_order.model, power_order.item_url)"><v-icon>mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>製品名</v-list-item-content>
                          <v-list-item-content v-if="power_order.item == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ power_order.item }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>電力量</v-list-item-content>
                          <v-list-item-content v-if="power_order.power == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ power_order.power }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>メーカー</v-list-item-content>
                          <v-list-item-content v-if="power_order.manufacturer == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ power_order.manufacturer }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>型番</v-list-item-content>
                          <v-list-item-content v-if="power_order.model == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ power_order.model }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>URL</v-list-item-content>
                          <v-list-item-content v-if="power_order.item_url == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ power_order.item_url }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
                <v-row>
                  <v-col cols="10"></v-col>
                  <v-col cols="1">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs  }">
                        <v-btn
                          fab
                          dark
                          v-bind="attrs"
                          v-on="on"
                          color="purple accent-2"
                          elevation="0"
                          @click="openAddpowerDisplay()">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>電力申請を追加する</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="1"></v-col>
                </v-row>
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
                  v-model="powerSnackbar"
                  >
                  電力申請情報を更新しました
                </v-snackbar>
                <v-snackbar
                  top
                  text
                  color="purple accent-2"
                  v-model="addpowerSnackbar"
                  >
                  電力申請情報を追加しました
                </v-snackbar>
              </v-tab-item>

              <!-- 物品申請情報 -->
              <v-tab-item>
                <v-row
                    v-for="(rental_order, i) in regist.rental_orders"
                    :key="i"
                  >
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-table-chair</v-icon>
                        <b>物品申請情報{{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-btn v-if="isEditRentalOrder" text fab @click="openRentalorderDisplay(rental_order.id, rental_order.rental_item_id, rental_order.num)"><v-icon>mdi-pencil</v-icon></v-btn>
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
                <!--Editmodal-->
                <Rentalorder
                ref="rentalorderDlg"
                :id="this.rental_order_id"
                :groupId="this.regist.group.id"
                :itemId="this.rental_item_id"
                :num="this.num"
                @reload="reload"
                @openRentalorderSnackbar="openRentalorderSnackbar"
                >
                </Rentalorder>
                <!--AddModal-->
                  <AddRentalOrder ref="AddRentalOrderDlg"
                      :groupId="this.regist.group.id"
                      @reload="reload"
                      @openAddrentalorderSnackbar="openAddrentalorderSnackbar">
                  </AddRentalOrder>
                  <v-snackbar
                      top
                      text
                      color="purple accent-2"
                      v-model="rentalorderSnackbar"
                      >
                      物品申請情報を更新しました
                    </v-snackbar>
                  <v-snackbar
                      top
                      text
                      color="purple accent-2"
                      v-model="AddrentalorderSnackbar"
                      >
                      物品申請情報を更新しました
                    </v-snackbar>
                <v-container>
                  <v-row>
                    <v-col cols="10"></v-col>
                    <v-col cols="1">
                  <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                      <v-btn fab elevation="0" v-bind="attrs" v-on="on" dark color="purple accent-2" @click="openAddRentalOrderDisplay"><v-icon>mdi-plus</v-icon></v-btn>
                  </template>
            <span>電力申請を追加する</span>
          </v-tooltip>
                    </v-col>
                    <v-col cols="1"></v-col>
                  </v-row>
                </v-container>
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
                        <v-btn v-if="isEditStageOrder" text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                       <v-list>
                        <v-list-item>
                          <v-list-item-content>月日</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_date == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_date }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第1希望</v-list-item-content>
                          <v-list-item-content v-if="regist.first_stage_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.first_stage_order }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第2希望</v-list-item-content>
                          <v-list-item-content v-if="regist.second_stage_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.second_stage_order }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>準備時間幅</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_order.prepare_time_interval == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_order.prepare_time_interval }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>使用時間幅</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_order.use_time_interval == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_order.use_time_interval }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>掃除時間幅</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_order.cleanup_time_interval == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_order.cleanup_time_interval }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>準備開始時刻</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_order.prepare_start_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_order.prepare_start_time }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>パフォーマンス開始時刻</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_order.performance_start_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_order.performance_start_time }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>パフォーマンス終了時刻</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_order.performance_end_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_order.performance_end_time }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>掃除終了時刻</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_order.cleanup_end_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_order.cleanup_end_time }}</v-list-item-content>
                        </v-list-item>
                       </v-list>
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
                        <v-btn v-if="isEditEmployee" text fab @click="openEmployeeDisplay(employee.id, employee.group_id, employee.name, employee.student_id)"><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>名前</v-list-item-content>
                          <v-list-item-content v-if="employee.name == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ employee.name }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>学籍番号</v-list-item-content>
                          <v-list-item-content v-if="employee.student_id == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ employee.student_id }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
                <v-row>
                  <v-col cols="10"></v-col>
                  <v-col cols="1">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs  }">
                        <v-btn
                          fab
                          dark
                          v-bind="attrs"
                          v-on="on"
                          color="purple accent-2"
                          elevation="0"
                          @click="openAddemployeeDisplay()">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>従業員申請を追加する</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="1"></v-col>
                </v-row>
                <!--EditModal-->
                      <Employee ref="employeeDlg"
                        :id="this.employee_id"
                        :groupId="this.group_id"
                        :studentId ="this.student_id"
                        :name="this.name"
                        @reload="reload"
                        @openEmployeeSnackbar="openEmployeeSnackbar"
                      ></Employee>
                <!--AddModal-->
                <Addemployee ref="addemployeeDlg"
                          :groupId="this.regist.group.id"
                          @reload="reload"
                          @openAddemployeeSnackbar="openAddemployeeSnackbar"           
                          ></Addemployee>
                      <v-snackbar
                        top
                        text
                        color="purple accent-2"
                        v-model="employeeSnackbar"
                        >
                        従業員情報を更新しました
                      </v-snackbar>
                  <v-snackbar
                      top
                      text
                      color="purple accent-2"
                      v-model="addemployeeSnackbar"
                      >
                      従業員情報を追加しました
                    </v-snackbar>
          </v-tab-item>

              <!-- 販売食品情報 -->
              <v-tab-item>
                <v-row
                  v-for="(food_product, i) in regist.food_products"
                  :key="i"
                  >
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-baguette</v-icon>
                        <b>販売食品情報{{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-btn v-if="isEditFoodproduct" text fab @click="openFoodproductDisplay(food_product.id, food_product.group_id, food_product.name, food_product.first_day_num, food_product.second_day_num, food_product.is_cooking)"><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>商品名</v-list-item-content>
                          <v-list-item-content v-if="food_product.name == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ food_product.name }}</v-list-item-content>
                        </v-list-item>
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
                          <v-list-item-content v-else>{{ food_product.is_cooking }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
                <!--EditModal-->
                  <Foodproduct ref="foodproductDlg"
                    :id = "this.food_product_id"
                    :groupId = "this.group_id"
                    :name = "this.name"
                    :firstN = "this.first_day_num"
                    :secondN = "this.second_day_num"
                    :cooking = "this.is_cooking"
                    @reload="reload"
                    @openFoodproductSnackbar="openFoodproductSnackbar"
                  ></Foodproduct>
                  <v-snackbar
                    top
                    text
                    color="purple accent-2"
                    v-model="foodproductSnackbar"
                    >
                    販売食品情報を更新しました
                  </v-snackbar>
              </v-tab-item>

              <!-- 購入品情報 -->
              <v-tab-item>
                <v-row
                  v-for="(purchase_list, i) in regist.purchase_lists"
                  :key="i"
                  >
                  <v-col cols=1></v-col>
                  <v-col>
                    <v-card flat>
                      <v-card-title style="color:#333333; font-size:25px">
                        <v-icon class="pr-2" size="30">mdi-cart</v-icon>
                        <b>購入品情報{{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-btn v-if="isEditPurchaseList" text><v-icon class="pr-2">mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>購入品名</v-list-item-content>
                          <v-list-item-content v-if="purchase_list.item == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ purchase_list.item }}</v-list-item-content>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>使用目的製品</v-list-item-content>
                          <v-list-item-content v-if="purchase_list.food_product == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ purchase_list.food_product }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>生鮮食品の有無</v-list-item-content>
                          <v-list-item-content v-if="purchase_list.is_fresh == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ purchase_list.is_fresh }}</v-list-item-content>
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
  import Employee from '@/components/EditModal/employee.vue'
  import Foodproduct from '@/components/EditModal/foodproduct.vue'
  import Rentalorder from '@/components/EditModal/rental_order.vue'
  import Addpower from '@/components/AddModal/power.vue'
  import AddRentalOrder from '@/components/AddModal/RentalOrder.vue'
  import Addemployee from '@/components/AddModal/employee.vue'

  export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
      Group,
      SubRep,
      Power,
      Place,
      Employee,
      Foodproduct,
      Rentalorder,
      Addpower,
      AddRentalOrder,
      Addemployee
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
      placeSnackbar: false,
      subrepSnackbar: false,
      powerSnackbar: false,
      rentalOrderSnackbar: false,
      employeeSnackbar: false,
      foodproductSnackbar: false,
      addpowerSnackbar: false,
      addRentalOrderSnackbar: false,
      addEmployeeSnackbar: false,
      isEditGroup: [],
      isEditSubRep: [],
      isEditPlace: [],
      isEditPowerOrder: [],
      isEditRentalOrder: [],
      isEditStageOrder: [],
      isEditEmployee: [],
      isEditFoodproduct:[],
      isEditPurchaseList: [],
      // 物品申請編集用
      rental_order_id: [],
      rental_item_id: [],
      // 物品申請用
      isAddRentalOrder: [],
      num: [],
      // 電力申請用
      power_order_id: [],
      group_id: [],
      item:[], 
      manufacturer: [],
      model:[], 
      power: [],
      url:[],
      //従業員申請用
      employee_id: [],
      name:[],
      student_id:[],      
      //販売食品用
      food_product_id: [],
      is_cooking: [],
      first_day_num: [],
      second_day_num: [],
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
          this.isEditGroup = response.data[0].is_edit_group
          this.isEditSubRep = response.data[0].is_edit_sub_rep
          this.isEditPlace = response.data[0].is_edit_place
          this.isEditPowerOrder = response.data[0].is_edit_power_order
          this.isEditRentalOrder = response.data[0].is_edit_rental_order
          this.isEditStageOrder = response.data[0].is_edit_stage_order
          this.isEditEmployee = response.data[0].is_edit_employee
          this.isEditFoodproduct = response.data[0].is_edit_food_product
          this.isEditPurchaseList = response.data[0].is_edit_purchase_list
          this.isAddRentalOrder = response.data[0].is_add_rental_order
          console.log(response)
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
      openSubrepSnackbar() {
        this.subrepSnackbar = true
      },
      openPowerSnackbar() {
        this.powerSnackbar = true
      },
      openEmployeeSnackbar() {
        this.employeeSnackbar = true
      },
      openFoodproductSnackbar() {
        this.foodproductSnackbar = true
      },
      openAddpowerSnackbar() {
        this.addPowerSnackbar = true
      },
      openRentalorderSnackbar(){
        this.rentalorderSnackbar = true
      },
      openAddrentalorderSnackbar(){
        this.addRentalOrderSnackbar = true
      },
      openAddemployeeSnackbar() {
        this.addemployeeSnackbar = true
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
      openAddRentalOrderDisplay(id, group_id, name, num) {
        this.rental_order_id = id
        this.group_id = group_id
        this.name = name
        this.num = num
        this.$refs.AddRentalOrderDlg.isDisplay = true
        console.log(this.$refs.AddRentalOrderDlg.isDisplay)
      },
      openPowerDisplay(id, group_id, item, power, manufacturer, model, url) {
        this.power_order_id = id
        this.group_id = group_id
        this.item = item
        this.power = power
        this.manufacturer = manufacturer
        this.model = model
        this.url = url
        this.$refs.powerDlg.isDisplay = true
        console.log(this.$refs.powerDlg.isDisplay)
      },
      openEmployeeDisplay(id, group_id, name, student_id){
        this.employee_id = id
        this.group_id = group_id
        this.name = name
        this.student_id = student_id
        this.$refs.employeeDlg.isDisplay = true
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
      openAddpowerDisplay() {
        this.$refs.addpowerDlg.isDisplay = true
      },
      openAddemployeeDisplay() {
        this.$refs.addemployeeDlg.isDisplay = true
      },
      openRentalorderDisplay(id, rental_item_id, num){
        this.rental_order_id = id
        this.rental_item_id = rental_item_id
        this.num = num
        this.$refs.rentalorderDlg.isDisplay = true
      },
    }
  }
</script>
