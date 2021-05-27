<template>
  <div>
    <v-card
      outlined
    >
      <v-card-title class="main font-weight-bold">
        <v-icon class="pr-2" size="30">mdi-information</v-icon>
        登録情報
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
                class="mx-n3"
                >
                <v-icon >mdi-account-group</v-icon>              
              </v-tab>
              <v-tab
                :value="tab-2"
                class="mx-n3"
                >
                <v-icon class="">mdi-account-multiple</v-icon>
              </v-tab>

              <v-tab
                :value="tab-3"
                class="mx-n3"
              >
                <v-icon class="">mdi-map-marker</v-icon>
              </v-tab>

              <v-tab
                :value="tab-4"
                class="mx-n3"
              >
                <v-icon class="">mdi-power-plug</v-icon>
              </v-tab>

              <v-tab
                :value="tab-5"
                class="mx-n3"
              >
                <v-icon class="">mdi-table-chair</v-icon>
              </v-tab>

              <v-tab
                :value="tab-6"
                class="mx-n3"
              >
                <v-icon class="">mdi-microphone</v-icon>
              </v-tab>

              <v-tab
                :value="tab-7"
                class="mx-n3"
              >
                <v-icon class="">mdi-microphone-plus</v-icon>
              </v-tab>

              <v-tab
                :value="tab-8"
                class="mx-n3"
              >
                <v-icon class="">mdi-account</v-icon>
              </v-tab>

              <v-tab
                :value="tab-9"
                class="mx-n3"
              >
                <v-icon class="">mdi-baguette</v-icon>
              </v-tab>

              <v-tab
                :value="tab-10"
                class="mx-n3"
              >
                <v-icon class="">mdi-cart</v-icon>
              </v-tab>
              <v-tab-item>
                <v-row>
                  
                  <v-col>
                    <v-card
                      flat
                      >
                      <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-account-group</v-icon><b>団体情報</b>
                        <v-spacer></v-spacer>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs  }">
                            <v-btn
                              x-small
                              v-if="isEditGroup" 
                              fab
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="openGroupDisplay"
                              >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>団体情報を編集する</span>
                        </v-tooltip>
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
                  
                </v-row>
              </v-tab-item>

              <!--副代表情報 -->
              <v-tab-item>
                <v-row>
                  
                  <v-col>
                    <v-card flat>
                      <v-card-title>
                      <v-icon class="pr-2" size="30">mdi-account-multiple</v-icon><b>副代表情報</b>
                      <v-spacer></v-spacer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs  }">
                          <v-btn
                            v-if="isEditSubRep" 
                            x-small
                            fab
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="openSubRepDisplay"
                            >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>副代表情報を編集する</span>
                      </v-tooltip>
                      <SubRep ref="subRepDlg"
                          :groupId="regist.group.id"
                          :name="regist.sub_rep.name"
                          :studentId="regist.sub_rep.student_id"
                          :gradeId="regist.sub_rep.sub_rep.grade_id"
                          :departmentId="regist.sub_rep.sub_rep.department_id"
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
                  
                </v-row>
              </v-tab-item>

              <!-- 会場申請情報 -->
              <v-tab-item>
                <v-row>
                  
                  <v-col>
                    <v-card flat>
                      <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-map-marker</v-icon><b>会場申請情報</b>
                        <v-spacer></v-spacer>
                        <v-tooltip top>
                        <template v-slot:activator="{ on, attrs  }">
                          <v-btn
                            v-if="isEditPlace"
                            x-small
                            fab
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="openPlaceDisplay"
                            >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>会場申請情報を編集する</span>
                      </v-tooltip>
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
                  
                </v-row>
              </v-tab-item>

              <!-- 電力申請情報 -->
              <v-tab-item>
                <v-row
                  v-for="(power_order, i) in regist.power_orders"
                  :key="i"
                  >
                  
                  <v-col>
                    <v-card flat>
                      <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-power-plug</v-icon><b>製品 {{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-tooltip top>
                        <template v-slot:activator="{ on, attrs  }">
                          <v-btn
                            v-if="isEditPowerOrder"
                            x-small
                            fab
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="openPowerDisplay(power_order.id, power_order.group_id, power_order.item, power_order.power, power_order.manufacturer, power_order.model, power_order.item_url)"
                            >
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
                              x-small
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
                  
                </v-row>
                <!--AddButtom -->
                <v-row>
                  
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
                          @click="openAddpowerDisplay()">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>電力申請を追加する</span>
                    </v-tooltip>
                    </v-card-actions>
                  </v-col>
                  
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
                            x-small
                            fab
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="openRentalorderDisplay(rental_order.id, rental_order.rental_item_id, rental_order.num)"
                            >
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
                              x-small
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
                  
                </v-row>
                <!--AddButtom -->
                <v-row>
                  <v-col cols="1"></v-col>
                  <v-col cols="10">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs  }">
                          <v-btn 
                            x-small
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
              </v-tab-item>
              <!-- ステージ利用申請情報 -->
              <v-tab-item>
                <v-row
                  v-for="(stage_order, i) in regist.stage_orders"
                  :key="i">
                  
                  <v-col>
                    <v-card flat>
                      <v-card-title class="font-weight-bold subtitle-1">
                        <v-icon class="pr-2" size="30">mdi-microphone</v-icon>
                        <b>ステージ利用申請情報</b>
                        <v-spacer></v-spacer>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs  }">
                            <v-btn
                              v-if="isEditStageOrder"
                              x-small
                              fab
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="openStageOrderDisplay(stage_order.id, stage_order.group_id, stage_order.is_sunny, stage_order.stage_date.id, stage_order.first_stage_order.id, stage_order.second_stage_order.id, stage_order.use_time_interval, stage_order.prepare_time_interval, stage_order.cleanup_time_interval, stage_order.prepare_start_time, stage_order.performance_start_time, stage_order.performance_end_time, stage_order.cleanup_end_time)"
                              >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>ステージ利用申請情報を編集する</span>
                        </v-tooltip>
                      </v-card-title>
                      <hr>
                       <v-list>
                        <v-list-item>
                          <v-list-item-content>月日</v-list-item-content>
                          <v-list-item-content v-if="stage_order.stage_date.id == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.stage_date.date }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>天気</v-list-item-content>
                          <v-list-item-content v-if="stage_order.is_sunny == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else-if="stage_order.is_sunny==true">晴れ</v-list-item-content>
                          <v-list-item-content v-else>雨</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第1希望</v-list-item-content>
                          <v-list-item-content v-if="stage_order.first_stage_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.first_stage_order.name }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>第2希望</v-list-item-content>
                          <v-list-item-content v-if="stage_order.second_stage_order == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.second_stage_order.name }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>準備時間幅</v-list-item-content>
                          <v-list-item-content v-if="stage_order.prepare_time_interval == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.prepare_time_interval }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>使用時間幅</v-list-item-content>
                          <v-list-item-content v-if="stage_order.use_time_interval == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.use_time_interval }}</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>掃除時間幅</v-list-item-content>
                          <v-list-item-content v-if="stage_order.cleanup_time_interval == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.cleanup_time_interval }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>準備開始時刻</v-list-item-content>
                          <v-list-item-content v-if="stage_order.prepare_start_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.prepare_start_time }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>パフォーマンス開始時刻</v-list-item-content>
                          <v-list-item-content v-if="stage_order.performance_start_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.performance_start_time }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>パフォーマンス終了時刻</v-list-item-content>
                          <v-list-item-content v-if="stage_order.performance_end_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.performance_end_time }}</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>掃除終了時刻</v-list-item-content>
                          <v-list-item-content v-if="stage_order.cleanup_end_time == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ stage_order.cleanup_end_time }}</v-list-item-content>
                        </v-list-item>
                       </v-list>
                    </v-card>
                  </v-col>
                  
                </v-row>
                <!-- Edit Modal -->
                 <StageOrder ref="stageOrderDlg"
                  :id="this.stage_order_id"
                  :groupId="this.regist.group.id"
                  :isSunny="this.is_sunny"
                  :stageDateId="this.stage_date"
                  :stageFirst="this.stage_first"
                  :stageSecond="this.stage_second"
                  :useTimeInterval="this.use_time_interval"
                  :prepareTimeInterval="this.prepare_time_interval"
                  :cleanupTimeInterval="this.cleanup_time_interval"
                  :prepareStartTime="this.prepare_start_time"
                  :performanceStartTime="this.performance_start_time"
                  :performanceEndTime="this.performance_end_time"
                  :cleanupEndTime="this.cleanup_end_time"
                  @reload="reload"
                  @openStageOrderSnackbar="openStageOrderSnackbar"
                ></StageOrder> 
                <v-snackbar
                  top
                  text
                  color="purple accent-2"
                  v-model="stageOrderSnackbar"
                >
                  ステージ申請情報を更新しました
                </v-snackbar>
              </v-tab-item>

              <!-- ステージオプション申請情報 -->
              <v-tab-item>
                <v-row>
                  
                  <v-col>
                    <v-card flat>
                      <v-card-title class="font-weight-bold subtitle-1">
                        <v-icon class="pr-2" size="30">mdi-microphone-plus</v-icon>
                        <b>ステージオプション申請情報</b>
                        <v-spacer></v-spacer>
                        <v-btn
                          v-if="isEditStageOption" 
                          text 
                          x-small
                          fab 
                          @click="openStageOptionDisplay"
                        >
                        <v-icon>mdi-pencil</v-icon></v-btn>
                      </v-card-title>
                      <hr>
                       <v-list>
                        <v-list-item>
                          <v-list-item-content>所持機器の使用</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_common_option.own_equipment == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else-if="regist.stage_common_option.own_equipment === true">使用</v-list-item-content>
                          <v-list-item-content v-else>使用しない</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>音楽</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_common_option.bgm == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else-if="regist.stage_common_option.bgm === true">使用</v-list-item-content>
                          <v-list-item-content v-else>使用しない</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>撮影許可</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_common_option.camera_permission == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else-if="regist.stage_common_option.camera_permission === true">許可</v-list-item-content>
                          <v-list-item-content v-else>許可しない</v-list-item-content>
                        </v-list-item>
                      <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>騒音</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_common_option.loud_sound == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else-if="regist.stage_common_option.loud_sound === true">出す</v-list-item-content>
                          <v-list-item-content v-else>出さない</v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <v-list-item-content>ステージ内容</v-list-item-content>
                          <v-list-item-content v-if="regist.stage_common_option.stage_content == -9999">未登録</v-list-item-content>
                          <v-list-item-content v-else>{{ regist.stage_common_option.stage_content }}</v-list-item-content>
                        </v-list-item>
                       </v-list>
                    </v-card>
                  </v-col>
                  
                </v-row>
                <!--EditModal-->
                <StageOption ref="StageOptionDlg"
                      :id = "regist.stage_common_option.id"
                      :groupId = "regist.stage_common_option.group_id"
                      :ownEquipment = "regist.stage_common_option.own_equipment"
                      :Bgm = "regist.stage_common_option.bgm"
                      :cameraPermission = "regist.stage_common_option.camera_permission"
                      :loudSound = "regist.stage_common_option.loud_sound"
                      :stageContent = "regist.stage_common_option.stage_content"
                      @reload="reload"
                ></StageOption>
              </v-tab-item>
              <!-- 従業員情報 -->
              <v-tab-item>
                <v-row
                  v-for="(employee, i) in regist.employees"
                  :key="i"
                  >
                  
                  <v-col>
                    <v-card flat>
                      <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-account</v-icon>
                        <b>従業員 {{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs  }">
                            <v-btn
                              v-if="isEditEmployee"
                              x-small
                              fab
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="openEmployeeDisplay(employee.id, employee.group_id, employee.name, employee.student_id)"
                              >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>従業員情報を編集する</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-if="isEditEmployee"
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="open_delete_dialog_employee(employee.id)"
                              x-small
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
                  
                </v-row>
                <!--AddButtom -->
                <v-row>
                  <v-col cols="10"></v-col>
                  <v-col cols="1">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs  }">
                        <v-btn
                          v-if="addEmployee"
                          x-small
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
                  
                  <v-col>
                    <v-card flat>
                      <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-baguette</v-icon>
                        <b>販売食品情報{{ i+1 }}</b>
                        <v-spacer></v-spacer>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs  }">
                            <v-btn
                              v-if="isEditFoodProduct"
                              x-small
                              fab
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="openFoodProductDisplay(food_product.id, food_product.group_id, food_product.name, food_product.first_day_num, food_product.second_day_num, food_product.is_cooking)"
                              >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>販売食品情報を編集する</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-if="isEditFoodProduct"
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="open_delete_dialog_food(food_product.id)"
                              x-small
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
                          <v-list-item-content v-else-if="food_product.is_cooking == true">調理する</v-list-item-content>
                          <v-list-item-content v-else-if="food_product.is_cooking == false">調理しない</v-list-item-content>
                          <v-list-item-content v-else>{{ food_product.is_cooking }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                  
                </v-row>
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
                          x-small
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
                  @reload="reload"
                  >
                </AddFoodProduct>
                <!--EditModal-->
                <FoodProduct ref="foodproductDlg"
                  :id = "this.food_product_id"
                  :groupId = "this.group_id"
                  :name = "this.name"
                  :firstN = "this.first_day_num"
                  :secondN = "this.second_day_num"
                  :cooking = "this.is_cooking"
                  @reload="reload"
                  @openFoodProductSnackbar="openFoodProductSnackbar"
                ></FoodProduct>
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
                  
                  <v-col>
                    <v-card v-if="purchase_list.food_product == -9999"></v-card>
                    <v-card v-else flat>
                      <v-card-title>
                        <v-icon class="pr-2" size="30">mdi-cart</v-icon>
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
                              @click="openPurchaseListDisplay(purchase_list.id, purchase_list.item, purchase_list.food_product_id, purchase_list.shop_id, purchase_list.fes_date_id, purchase_list.is_fresh)"
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
                              text
                              v-bind="attrs"
                              v-on="on"
                              @click="open_delete_dialog_purchase(purchase_list.id)"
                              x-small
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
                          x-small
                          fab
                          dark
                          v-bind="attrs"
                          v-on="on"
                          color="btn"
                          depressed
                          @click="openAddPurchaseListDisplay()">
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
                <PurchaseList ref="PurchaseListDlg"
                  :id="this.edit_purchase_list_id"
                  :groupId="this.regist.group.id"
                  :item="this.purchase_list_item"
                  :shopId="this.shop_id"
                  :fesDateId="this.fes_date_id"
                  :foodProductId="this.purchase_food_product_id"
                  :isFresh="this.is_fresh"
                  @reload="reload"
                />
               <!-- AddModal -->
                <AddPurchaseList ref="AddPurchaseListDlg"
                  :groupId="this.regist.group.id"
                  @reload="reload"
                />
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
              x-small
              fab
              text 
              class="my-n2"
              @click="delete_dialog = false" 
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
            <v-btn depressed color="red" dark @click="delete_yes">
              はい
            </v-btn>
            <v-btn depressed color="blue" dark @click="delete_dialog = false">
              いいえ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 削除ダイアログ(電力申請) -->
      <v-dialog v-model="delete_dialog_power" width="500">
        <v-card class="mx-auto">
          <v-card-title class="main font-weight-bold">
              <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
            <v-spacer></v-spacer>
            <v-btn 
              x-small
              fab
              text 
              class="my-n2"
              @click="delete_dialog_power = false" 
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
            <v-btn depressed color="red" dark @click="delete_yes_power">
              はい
            </v-btn>
            <v-btn depressed color="blue" dark @click="delete_dialog_power = false">
              いいえ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <!-- 削除ダイアログ(従業員) -->
      <v-dialog v-model="delete_dialog_employee" width="500">
        <v-card>
          <v-card-title class="main font-weight-bold">
              <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
            <v-spacer></v-spacer>
            <v-btn 
              fab
              text 
              class="my-n2"
              @click="delete_dialog_employee = false" 
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
            <v-btn depressed color="red" dark @click="delete_yes_employee">
              はい
            </v-btn>
            <v-btn depressed color="blue" dark @click="delete_dialog_employee = false">
              いいえ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
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
    </div>

</template>


<script>
  import axios from 'axios'
  import Group from '@/components/Mobile/EditModal/Group.vue'
  import SubRep from '@/components/Mobile/EditModal/SubRep.vue'
  import Power from '@/components/Mobile/EditModal/Power.vue'
  import Place from '@/components/Mobile/EditModal/Place.vue'
  import StageOrder from '@/components/Mobile/EditModal/StageOrder.vue'
  import Employee from '@/components/Mobile/EditModal/Employee.vue'
  import StageOption from '@/components/Mobile/EditModal/StageCommonOption.vue'
  import FoodProduct from '@/components/Mobile/EditModal/FoodProduct.vue'
  import Rentalorder from '@/components/Mobile/EditModal/RentalOrder.vue'
  import PurchaseList from '@/components/Mobile/EditModal/PurchaseList.vue'
  import Addpower from '@/components/Mobile/AddModal/Power.vue'
  import AddRentalOrder from '@/components/Mobile/AddModal/RentalOrder.vue'
  import Addemployee from '@/components/Mobile/AddModal/Employee.vue'
  import AddFoodProduct from '@/components/Mobile/AddModal/FoodProduct.vue'
  import AddPurchaseList from '@/components/Mobile/AddModal/PurchaseList.vue'

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
      StageOrder,
      Employee,
      StageOption,
      FoodProduct,
      Rentalorder,
      PurchaseList,
      Addpower,
      AddRentalOrder,
      Addemployee,
      AddFoodProduct,
      AddPurchaseList,
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
      delete_dialog_group: false,
      delete_dialog_subrep: false,
      delete_dialog_place: false,
      delete_dialog_power: false,
      delete_dialog_item: false,
      delete_dialog_stage: false,
      delete_dialog_employee: false,
      delete_dialog_food: false,
      delete_dialog_purchase: false,
      groupSnackbar: false,
      placeSnackbar: false,
      subrepSnackbar: false,
      powerSnackbar: false,
      stageOrderSnackbar: false,
      rentalOrderSnackbar: false,
      employeeSnackbar: false,
      foodproductSnackbar: false,
      addpowerSnackbar: false,
      addRentalOrderSnackbar: false,
      addEmployeeSnackbar: false,
      addRentalOrderSnackbar: false,
      isEditGroup: [],
      isEditSubRep: [],
      isEditPlace: [],
      isEditPowerOrder: [],
      isEditRentalOrder: [],
      isEditStageOrder: [],
      isEditEmployee: [],
      isEditFoodProduct:[],
      isEditPurchaseList: [],
      addPowerOrder: [],
      addRentalOrder: [],
      addEmployee: [],
      addFoodProduct: [],
      addPurchaseList: [],
      // 物品申請編集用
      rental_order_id: [],
      rental_item_id: [],
      //削除コマンド用
      purchase_list_id: [],
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
      //ステージ申請用
      stage_order_id: [],
      is_sunny: [],
      stage_date: [],
      stage_first: [],
      stage_second: [],
      use_time_interval: [],
      prepare_time_interval: [],
      cleanup_time_interval: [],
      prepare_start_time: [],
      performance_start_time: [],
      performance_end_time: [],
      cleanup_end_time: [],
      //ステージオプション申請用
      stage_option_id: [],
      own_equipment: [],
      bgm: [],
      camera_permission: [],
      loud_sound: [],
      stage_content: [],
      //従業員申請用
      employee_id: [],
      name:[],
      student_id:[],      
      //販売食品用
      food_product_id: [],
      is_cooking: [],
      first_day_num: [],
      second_day_num: [],
      //購入品情報
      edit_purchase_list_id: [], 
      purchase_list_item: [], 
      purchase_food_product_id: [], 
      shop_id: [], 
      fes_date_id: [], 
      is_fresh: [],
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
          this.isEditFoodProduct = response.data[0].is_edit_food_product
          this.isEditPurchaseList = response.data[0].is_edit_purchase_list
          this.isAddRentalOrder = response.data[0].is_add_rental_order
          this.addPowerOrder = response.data[0].add_power_order
          this.addRentalOrder = response.data[0].add_rental_order
          this.addEmployee = response.data[0].add_employee
          this.addFoodProduct = response.data[0].add_food_product
          this.addPurchaseList = response.data[0].add_purchase_list
          console.log(response)
        })
    },

    methods: {
      //削除メソッド(団体すべて)
      delete_yes() {
      const url = process.env.VUE_APP_URL + "/groups/" + this.group_id;
      axios.delete(url);
      this.reload()
      this.delete_dialog = false
      },
      //削除メソッド(電力申請)
      delete_yes_power() {
      const url = process.env.VUE_APP_URL + "/power_orders/" + this.power_order_id;
      axios.delete(url);
      this.reload()
      this.delete_dialog_power = false
      },
      //削除メソッド(物品申請)
      delete_yes_item() {
      const url = process.env.VUE_APP_URL +  "/rental_orders/" + this.rental_order_id;
      axios.delete(url);
      this.reload()
      this.delete_dialog_item = false
      },
      //削除メソッド(従業員申請)
      delete_yes_employee() {
      const url = process.env.VUE_APP_URL +  "/employees/" + this.employee_id;
      axios.delete(url);
      this.reload()
      this.delete_dialog_employee = false
      },
      //削除メソッド(販売食品)
      delete_yes_food() {
      const url = process.env.VUE_APP_URL + "/food_products/" + this.food_product_id;
      console.log(url)
      axios.delete(url);      
      this.reload()
      this.delete_dialog_food = false
      },
      //削除メソッド(購入品)
      delete_yes_purchase() {
      const url = process.env.VUE_APP_URL + "/purchase_lists/" + this.purchase_list_id;
            console.log(url)
      axios.delete(url)      
      this.reload()
      this.delete_dialog_purchase = false
      },

      reload() {
        this.$emit('reload');
      },
      //編集後Snackbar
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
      openStageOrderSnackbar() {
        this.stageOrderSnackbar = true
      },
      openEmployeeSnackbar() {
        this.employeeSnackbar = true
      },
      openFoodProductSnackbar() {
        this.foodproductSnackbar = true
      },
      //追加後Snackkbar
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
      openAddFoodProductDisplay() {
        this.$refs.AddFoodProductDlg.isDisplay = true
        console.log(this.$refs.AddFoodProductDlg.isDisplay)
      },
      //編集用コンポーネント
      openGroupDisplay() {
        this.$refs.groupDlg.isDisplay = true
      },
      openSubRepDisplay() {
        this.$refs.subRepDlg.isDisplay = true
      },
      openPlaceDisplay() {
        this.$refs.placeDlg.isDisplay = true
      },
      openStageOrderDisplay(stage_order_id, group_id, is_sunny, stage_date, stage_first, stage_second, use_time_interval, prepare_time_interval, cleanup_time_interval, prepare_start_time, performance_start_time, performance_end_time, cleanup_end_time) {
        this.stage_order_id = stage_order_id
        this.group_id = group_id
        this.is_sunny = is_sunny
        this.stage_date = stage_date
        this.stage_first = stage_first
        this.stage_second = stage_second
        this.use_time_interval = use_time_interval
        this.prepare_time_interval = prepare_time_interval
        this.cleanup_time_interval = cleanup_time_interval
        this.prepare_start_time = prepare_start_time
        this.performance_start_time = performance_start_time
        this.performance_end_time = performance_end_time
        this.cleanup_end_time = cleanup_end_time
        this.$refs.stageOrderDlg.isDisplay = true
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
      openStageOptionDisplay(id, group_id, own_equipment, bgm, camera_permission, loud_sound, stage_content) {
        this.stage_option_id = id
        this.group_id = group_id
        this.own_equipment = own_equipment
        this.bgm = bgm
        this.camera_permission = camera_permission
        this.loud_sound = loud_sound
        this.stage_content = stage_content
        this.$refs.StageOptionDlg.isDisplay = true
      },
      openEmployeeDisplay(id, group_id, name, student_id){
        this.employee_id = id
        this.group_id = group_id
        this.name = name
        this.student_id = student_id
        this.$refs.employeeDlg.isDisplay = true
      },
      openFoodProductDisplay(id, group_id, name, first_day_num, second_day_num, is_cooking) {
        this.food_product_id = id
        this.group_id = group_id
        this.name = name
        this.first_day_num = first_day_num
        this.second_day_num = second_day_num
        this.is_cooking = is_cooking
        this.$refs.foodproductDlg.isDisplay = true
      },
      //追加用コンポーネント
      openAddRentalOrderDisplay(id, group_id, name, num) {
        this.rental_order_id = id
        this.group_id = group_id
        this.name = name
        this.num = num
        this.$refs.AddRentalOrderDlg.isDisplay = true
        console.log(this.$refs.AddRentalOrderDlg.isDisplay)
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
      openPurchaseListDisplay(purchase_list_id, item, food_product_id, shop_id, fes_date_id, is_fresh) {
        this.edit_purchase_list_id = purchase_list_id
        this.purchase_list_item = item
        this.purchase_food_product_id = food_product_id
        this.shop_id = shop_id
        this.fes_date_id = fes_date_id
        this.is_fresh = is_fresh
        axios.get(process.env.VUE_APP_URL + "/api/v1/get_food_products_from_group/" + this.regist.group.id, {
          headers: { 
            "Content-Type": "application/json", 
          }
        })
          .then(response => {
            this.$refs.PurchaseListDlg.food_products = response.data
          })
        this.$refs.PurchaseListDlg.isDisplay = true
      },
      openAddPurchaseListDisplay() {
        axios.get(process.env.VUE_APP_URL + "/api/v1/get_food_products_from_group/" + this.regist.group.id, {
          headers: { 
            "Content-Type": "application/json", 
          }
        })
          .then(response => {
            this.$refs.AddPurchaseListDlg.food_products = response.data
          })
        this.$refs.AddPurchaseListDlg.isDisplay = true
      },
      openPurchaseListSnackbar(){
        this.addRentalOrderSnackbar = true
      },
      //削除用ダイアログ
      open_delete_dialog_power(id){
        this.power_order_id = id
        this.delete_dialog_power = true
      },
      open_delete_dialog_item(id){
        this.rental_order_id = id
        this.delete_dialog_item = true
      },
      open_delete_dialog_employee(id){
        this.employee_id = id
        this.delete_dialog_employee = true
      },
      open_delete_dialog_food(id){
        this.food_product_id = id
        this.delete_dialog_food = true
      },
      open_delete_dialog(id){
        this.group_id = id
        this.delete_dialog = true
      },
      open_delete_dialog_purchase(id){
        this.purchase_list_id = id
        this.delete_dialog_purchase = true
      },
    }
  }
</script>
