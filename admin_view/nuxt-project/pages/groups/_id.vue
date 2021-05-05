<template>
  <div v-if="data.length === 0">
    <div class="card">
      <v-card flat>
        <br><br>
        <div class="text-center">
        <v-progress-circular
          indeterminate
          color="#009688"
        ></v-progress-circular>
        <br><br>
        </div>
      </v-card>
    </div>
  </div>
  <div v-else>
    <v-row>
      <v-col>
        <v-card-text>
          <div class="breadcrumbs">
            <ul>
              <li>
                <div class="breadcrumbs-item">
                  <router-link to="/groups">参加団体一覧</router-link>
                </div>
              </li>
              <li>
                <div class="breadcrumbs-item">{{ group.name }}</div>
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                {{ group.name }}
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="edit_dialog_open"
                      fab
                    >
                      <v-icon class="ma-5">mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>編集</span>
                </v-tooltip>
                <v-tooltip top v-if="selfRoleId == (1 || 2)">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="delete_dialog = true"
                      fab
                    >
                      <v-icon class="ma-5">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>削除</span>
                </v-tooltip>
              </v-card-title>
              <hr class="mt-n3" />
              <v-simple-table class="my-9">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th>ID：</th>
                      <td class="caption">{{ group.id }}</td>
                    </tr>
                    <tr>
                      <th>ユーザー：</th>
                      <td class="caption">{{ user }}</td>
                    </tr>
                    <tr>
                      <th>グループ名：</th>
                      <td class="caption">{{ group.name }}</td>
                    </tr>
                    <tr>
                      <th>企画名：</th>
                      <td class="caption">{{ group.project_name }}</td>
                    </tr>
                    <tr>
                      <th>活動内容：</th>
                      <td class="caption">{{ group.activity }}</td>
                    </tr>
                    <tr>
                      <th>グループカテゴリ：</th>
                      <td>
                        <v-chip
                          v-if="group.group_category_id == 1"
                          color="red"
                          text-color="white"
                          small
                          >{{ category[0] }}</v-chip
                        >
                        <v-chip
                          v-if="group.group_category_id == 2"
                          color="pink"
                          text-color="white"
                          small
                          >{{ category[1] }}</v-chip
                        >
                        <v-chip
                          v-if="group.group_category_id == 3"
                          color="blue"
                          text-color="white"
                          small
                          >{{ category[2] }}</v-chip
                        >
                        <v-chip
                          v-if="group.group_category_id == 4"
                          color="green"
                          text-color="white"
                          small
                          >{{ category[3] }}</v-chip
                        >
                        <v-chip
                          v-if="group.group_category_id == 5"
                          color="orange"
                          text-color="white"
                          small
                          >{{ category[4] }}</v-chip
                        >
                        <v-chip
                          v-if="group.group_category_id == 6"
                          color="blue-gray"
                          text-color="white"
                          small
                          >{{ category[5] }}</v-chip
                        >
                      </td>
                    </tr>
                    <tr>
                      <th>開催年：</th>
                      <td class="caption">{{ year }}</td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">
                        {{ group.created_at | format-date }}
                      </td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">
                        {{ group.updated_at | format-date }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card>
        <br />
        <v-row>
          <v-col cols=6>
            <v-card flat class="ml-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    副代表
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <router-link :to="{ name: 'sub_reps-id', params:{ id: subRep.id }}" tag="th">
                            <th>名前：</th>
                          </router-link>
                          <router-link :to="{ name: 'sub_reps-id', params:{ id: subRep.id }}" tag="th">
                          <td class="caption">{{ subRep.name }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
           <v-col cols=6>
            <v-card flat class="mr-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    会場申請
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9" v-if="groupCategoryId !== 3">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <router-link :to="{ name: 'place_orders-id', params:{ id: placeOrder.id }}" tag="th">
                            <th>第一希望</th>
                          </router-link>
                          <router-link :to="{ name: 'place_orders-id', params:{ id: placeOrder.id }}" tag="td">
                            <td>{{ place_first }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'place_orders-id', params:{ id: placeOrder.id }}" tag="th">
                            <th>第二希望</th>
                          </router-link>
                          <router-link :to="{ name: 'place_orders-id', params:{ id: placeOrder.id }}" tag="td">
                            <td>{{ place_second }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'place_orders-id', params:{ id: placeOrder.id }}" tag="th">
                            <th>第三希望</th>
                          </router-link>
                          <router-link :to="{ name: 'place_orders-id', params:{ id: placeOrder.id }}" tag="td">
                            <td>{{ place_third }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <v-else>
                    <v-card-text>会場申請はありません</v-card-text>
                  </v-else>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <br>
        <v-row>
          <v-col cols="6">
            <v-card flat class="ml-15" :to="{ name: 'power_orders'}">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    電力申請
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                            <th>製品</th>
                            <th>電力</th>
                        </tr>
                        <tr v-for="powerOrder in powerOrders" :key="powerOrder.id">
                          <router-link :to="{ name: 'power_orders-id', params:{ id: powerOrder.id }}" tag="td">
                            <td class="caption">{{ powerOrder.item }}</td>
                          </router-link>
                          <router-link :to="{ name: 'power_orders-id', params:{ id: powerOrder.id }}" tag="td">
                            <td class="caption">{{ powerOrder.power }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card flat class="mr-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    物品申請
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th>貸し出し物品名：</th>
                          <th>貸し出し個数：</th>
                        </tr>
                        <tr v-for="rentalOrderList in rentalOrderLists" :key="rentalOrderList.id">
                          <router-link :to="{ name: 'rental_orders-id', params:{ id: rentalOrderList.rental_id }}" tag="td">
                            <td>{{ rentalOrderList.rental_item }}</td>
                          </router-link>
                          <router-link :to="{ name: 'rental_orders-id', params:{ id: rentalOrderList.rental_id }}" tag="td">
                            <td>{{ rentalOrderList.rental_num }}</td>
                          </router-link>
                        </tr>
                      </tbody>  
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <br />
        <v-row v-if="groupCategoryId === 3">
          <v-col cols="6" v-for="stageOrder in stageOrders" :key="stageOrder.id">
            <v-card flat class="ml-15" v-if="stageOrder.is_sunny === true">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    ステージ：晴れ
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>希望日：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ isSunnyLists.fes_date }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>第一希望：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ isSunnyLists.stage_first }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>第二希望：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ isSunnyLists.stage_second }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>準備開始時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.prepare_start_time }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ kname: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>パフォーマンス開始時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.performance_start_time }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>パフォーマンス終了時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.performance_end_time }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>掃除終了時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.cleanup_end_time }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
            
            <v-card flat class="mr-15" v-if="stageOrder.is_sunny === false">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    ステージ：雨
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>希望日：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ isRainyLists.fes_date }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>第一希望：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ isRainyLists.stage_first }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>第二希望：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ isRainyLists.stage_second }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>準備開始時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.prepare_start_time }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ kname: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>パフォーマンス開始時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.performance_start_time }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>パフォーマンス終了時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.performance_end_time }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="th">
                            <th>掃除終了時刻：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_orders-id', params:{ id: stageOrder.id }}" tag="td">
                            <td>{{ stageOrder.cleanup_end_time }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <br />
        <v-row>
          <v-col cols="6">
            <v-card flat class="ml-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    ステージオプション
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="th">
                            <th>所持機器の使用：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="td">
                            <td v-if="stageCommonOption.own_equipment == true">{{ items_available[0].label }}</td>
                            <td v-if="stageCommonOption.own_equipment == false">{{ items_available[1].label }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="th">
                            <th>音楽をかける：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="td">
                            <td v-if="stageCommonOption.bgm == true">{{ items_available[0].label }}</td>
                            <td v-if="stageCommonOption.bgm == false">{{ items_available[1].label }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="th">
                            <th>撮影許可：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="td">
                            <td v-if="stageCommonOption.camera_permission == true">{{ photo_available[0].label }}</td>
                            <td v-if="stageCommonOption.camera_permission == false">{{ photo_available[1].label }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="th">
                          <th>大きな音を出すか：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="td">
                            <td v-if="stageCommonOption.loud_sound == true">{{ loud_able[0].label }}</td>
                            <td v-if="stageCommonOption.loud_sound == false">{{ loud_able[1].label }}</td>
                          </router-link>
                        </tr>
                        <tr>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="th">
                            <th>ステージ内容：</th>
                          </router-link>
                          <router-link :to="{ name: 'stage_common_options-id', params:{ id: stageCommonOption.id }}" tag="td">
                            <td>{{ stageCommonOption.stage_content }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <br />
        <v-row v-if="groupCategoryId !== 3">
          <v-col>
            <v-card flat class="ml-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    販売食品
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th>名前：</th>
                          <th>調理の有無：</th>
                          <th>1日目の個数：</th>
                          <th>2日目の個数：</th>
                        </tr>
                        <tr v-for="foodProduct in foodProducts" :key="foodProduct.id">
                          <router-link :to="{ name: 'food_products-id', params:{ id: foodProduct.id }}" tag="td">
                            <td>{{ foodProduct.name }}</td>
                          </router-link>
                          <router-link :to="{ name: 'food_products-id', params:{ id: foodProduct.id }}" tag="td">
                            <td v-if="foodProduct.is_cooking == true">{{ cooking_available[0].label }}</td>
                            <td v-if="foodProduct.is_cooking == false">{{ cooking_available[1].label }}</td>
                          </router-link>
                          <router-link :to="{ name: 'food_products-id', params:{ id: foodProduct.id }}" tag="td">
                            <td>{{ foodProduct.first_day_num }}</td>
                          </router-link>
                          <router-link :to="{ name: 'food_products-id', params:{ id: foodProduct.id }}" tag="td">
                            <td>{{ foodProduct.second_day_num }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card flat class="mr-15">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    従業員
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-simple-table class="my-9">
                    <template v-slot:default>
                      <tbody v-for="Employee in Employees" :key="Employee.id">
                        <tr>
                          <router-link :to="{ name: 'employees-id', params:{ id: Employee.id }}" tag="th">
                            <th>{{ Employee.id }}</th>
                          </router-link>
                          <router-link :to="{ name: 'employees-id', params:{ id: Employee.id }}" tag="td">
                            <td class="caption">{{ Employee.name }}</td>
                          </router-link>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="card">
          <v-btn text color="white" to="/groups"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">参加団体一覧に戻る</div></v-btn
          >
        </div>
      </v-col>
    </v-row>

    <!-- modal window to edit -->
    <v-dialog v-model="edit_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-pencil</v-icon>編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_dialog = false" fab dark>
            <v-icon class="ma-5">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-form ref="form">
                <v-text-field
                  label="グループ名"
                  v-model="groupName"
                  background-color="white"
                  outlined
                  filled
                  clearable
                ></v-text-field>
                <v-select
                  label="カテゴリ"
                  v-model="groupCategoryId"
                  :items="groupCategories"
                  :rules="[rules.required]"
                  :menu-props="{
                    top: true,
                    offsetY: true,
                  }"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
                <v-text-field
                  label="企画名"
                  background-color="white"
                  outlined
                  v-model="groupProjectName"
                  filled
                  clearable
                ></v-text-field>
                <v-text-field
                  label="企画内容"
                  background-color="white"
                  outlined
                  v-model="groupActivity"
                  filled
                  clearable
                ></v-text-field>
                <v-select
                  label="開催年"
                  v-model="fes_year_id"
                  :items="year_list"
                  :rules="[rules.required]"
                  :menu-props="{
                    top: true,
                    offsetY: true,
                  }"
                  item-text="year_num"
                  item-value="id"
                  outlined
                ></v-select>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="btn" @click="edit"> 編集する </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 削除ダイアログ -->
    <v-dialog v-model="delete_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-delete</v-icon>削除
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="delete_dialog = false" fab dark>
            ​ <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-title> 削除してよろしいですか？ </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="yes" @click="delete_yes"> はい </v-btn>
          <v-btn depressed dark color="no" @click="delete_dialog = false">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 編集成功SnackBar -->
    <v-snackbar v-model="success_snackbar" color="blue-grey" top elevation="24">
      編集しました

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      data: [],
      detail_data: [],
      group: [],
      user_id: [],
      user: [],
      group_category_id: [],
      fes_year_id: [],
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      place_first: [],
      place_second: [],
      place_third: [],
      stageOrdersLists: [],
      isSunnyLists: [],
      isRainyLists: [],
      rentalOrderLists: [],
      purchase_lists: [],
      expand: false,
      dialog: false,
      groupName: [],
      groupProjectName: [],
      groupCategoryId: [],
      groupActivity: [],
      Group: [],
      subRep: [],
      Employees: [],
      placeOrder: [],
      powerOrders: [],
      rentalOrders: [],
      stageOrders: [],
      stageCommonOption: [],
      foodProducts: [],
      edit_dialog: false,
      delete_dialog: false,
      success_snackbar: false,
      delete_snackbar: false,
      year_list: [],
      groupCategories: [],
      // 課程
      departments: [
        { name: "機械創造工学課程", id: 1 },
        { name: "電気電子情報工学課程", id: 2 },
        { name: "物質材料工学課程", id: 3 },
        { name: "環境社会基盤工学課程", id: 4 },
        { name: "生物機能工学課程", id: 5 },
        { name: "情報・経営システム工学課程", id: 6 },
        { name: "機械創造工学専攻", id: 7 },
        { name: "電気電子情報工学専攻", id: 8 },
        { name: "物質材料工学専攻", id: 9 },
        { name: "環境社会基盤工学専攻", id: 10 },
        { name: "生物機能工学専攻", id: 11 },
        { name: "情報・経営システム工学専攻", id: 12 },
        { name: "原子力システム安全工学専攻", id: 13 },
        { name: "システム安全専攻", id: 14 },
        { name: "技術科学イノベーション専攻", id: 15 },
        { name: "情報・制御工学専攻", id: 16 },
        { name: "材料工学専攻", id: 17 },
        { name: "エネルギー・環境工学専攻", id: 18 },
        { name: "生物統合工学専攻", id: 19 },
        { name: "その他", id: 20 },
      ],
      // 学年
      grades: [
        { name: "B1 [学部1年]", id: 1 },
        { name: "B2 [学部2年]", id: 2 },
        { name: "B3 [学部3年]", id: 3 },
        { name: "B4 [学部4年]", id: 4 },
        { name: "M1 [修士1年]", id: 5 },
        { name: "M2 [修士2年]", id: 6 },
        { name: "D1 [博士1年]", id: 7 },
        { name: "D2 [博士2年]", id: 8 },
        { name: "D3 [博士3年]", id: 9 },
        { name: "GD1 [イノベ1年]", id: 10 },
        { name: "GD2 [イノベ2年]", id: 11 },
        { name: "GD3 [イノベ3年]", id: 12 },
        { name: "GD4 [イノベ4年]", id: 13 },
        { name: "GD5 [イノベ5年]", id: 14 },
        { name: "その他", id: 15 },
      ],
      items_available:[
        {label:"使用",value:true},
        {label:"不使用",value:false}
      ],
      photo_available:[
        {label:"許可",value:true},
        {label:"禁止",value:false}
      ],
      loud_able:[
        {label:"出す",value:true},
        {label:"出さない",value:false}
      ],
      cooking_available:[
        {label:"する",value:true},
        {label:"しない",value:false}
      ],
      rules: {
        required: (value) => !!value || "入力してください",
      },
    };
  },
  computed: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  methods: {
    reload: function () {
      const url = "api/v1/get_group/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.data = response.data
          this.group = response.data.group;
          this.groupName = this.group.name;
          this.groupProjectName = this.group.project_name;
          this.groupCategoryId = this.group.group_category_id;
          this.groupActivity = this.group.activity;
          this.user_id = this.group.user_id;
          this.fes_year_id = this.group.fes_year_id;
          this.user = this.data.user;
          this.year = this.data.fes_year;
          this.place_first = this.data.place_first;
          this.place_second = this.data.place_second;
          this.place_third = this.data.place_third;
          this.stageOrdersLists = this.data.stage_orders_lists;
          this.rentalOrderLists = this.data.rental_order_lists;
          this.purchase_lists = this.data.purchase_lists;

          for (var i = 0; i < 2; i++){
            if (stageOrdersLists[i].is_sunny){
              this.isSunnyLists = stageOrdersLists[i]
            } else {
              this.isRainyLists = stageOrdersLists[i]
            }
          }
        });
      const group_detail_url = "api/v1/get_group_detail/" + this.$route.params.id;
      this.$axios.get(group_detail_url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.detail_data = response.data
        this.Group = this.detail_data.group;
        this.subRep = this.detail_data.sub_rep;
        this.Employees = this.detail_data.employees;
        this.placeOrder = this.detail_data.place_order;
        this.powerOrders = this.detail_data.power_orders;
        this.rentalOrders = this.detail_data.rental_orders;
        this.stageOrders = this.detail_data.stage_orders;
        this.stageCommonOption = this.detail_data.stage_common_option;
        this.foodProducts = this.detail_data.food_products;
      });
    },
    edit_dialog_open: function () {
      const year_url = "/fes_years/";
      this.$axios
        .get(year_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.year_list = response.data;
        });
      this.edit_dialog = true;

      const group_categories_url = "/group_categories/";
      this.$axios
        .get(group_categories_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.groupCategories = response.data;
        });
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/groups/" +
        this.group.id +
        "?name=" +
        this.groupName +
        "&project_name=" +
        this.groupProjectName +
        "&group_category_id=" +
        this.groupCategoryId +
        "&activity=" +
        this.groupActivity +
        "&fes_year_id=" +
        this.fes_year_id;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.reload();
          this.edit_dialog = false;
        });
    },
    delete_yes: function () {
      const url = "/groups/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/groups");
    },
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    const url = "api/v1/get_group/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.data = response.data
        this.group = response.data.group;
        this.groupName = this.group.name;
        this.groupProjectName = this.group.project_name;
        this.groupCategoryId = this.group.group_category_id;
        this.groupActivity = this.group.activity;
        this.user_id = this.group.user_id;
        this.fes_year_id = this.group.fes_year_id;
        this.user = this.data.user;
        this.year = this.data.fes_year;
        this.place_first = this.data.place_first;
        this.place_second = this.data.place_second;
        this.place_third = this.data.place_third;
        this.stageOrdersLists = this.data.stage_orders_lists;
        this.rentalOrderLists = this.data.rental_order_lists;
        this.purchase_lists = this.data.purchase_lists;
        for (var i = 0; i < 2; i++){
          if (this.stageOrdersLists[i].is_sunny){
            this.isSunnyLists = this.stageOrdersLists[i]
          } else {
            this.isRainyLists = this.stageOrdersLists[i]
          }
        }
      });

    const category_url = "group_categories/";
    this.$axios
      .get(category_url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        this.group_categories = response.data;
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]["name"]);
        }
      });

    const group_detail_url = "api/v1/get_group_detail/" + this.$route.params.id;
    this.$axios
      .get(group_detail_url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.detail_data = response.data
        this.Group = this.detail_data.group;
        this.subRep = this.detail_data.sub_rep;
        this.Employees = this.detail_data.employees;
        this.placeOrder = this.detail_data.place_order;
        this.powerOrders = this.detail_data.power_orders;
        this.rentalOrders = this.detail_data.rental_orders;
        this.stageOrders = this.detail_data.stage_orders;
        this.stageCommonOption = this.detail_data.stage_common_option;
        this.foodProducts = this.detail_data.food_products;
      });
  },

  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD");
    },
  },
};
</script>
