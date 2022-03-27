<template>
  <div class="main-content">
    <SubHeader pageTitle="ユーザー画面制御"></SubHeader>
    <Card width="100%">
      <VerticalTable>
        <tr>
          <td>参加団体登録</td>
          <td>
            <p v-if="is_regist_group === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_regist_group" :isOn="is_regist_group" :on_click="() => {this.is_regist_group = !this.is_regist_group}" />
          </td>
        </tr>
        <tr>
          <td>団体情報編集・削除</td>
          <td>
            <p v-if="is_edit_group === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_group" :isOn="is_edit_group" :on_click="() => {this.is_edit_group = !this.is_edit_group}" />
          </td>
        </tr>
        <tr>
          <td>副代表情報編集</td>
          <td>
            <p v-if="is_edit_sub_rep === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_sub_rep" :isOn="is_edit_sub_rep" :on_click="() => {this.is_edit_sub_rep = !this.is_edit_sub_rep}" />
          </td>
        </tr>
        <tr>
          <td>会場申請情報編集</td>
          <td>
            <p v-if="is_edit_place === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_place" :isOn="is_edit_place" :on_click="() => {this.is_edit_place = !this.is_edit_place}" />
          </td>
        </tr>
        <tr>
          <td>電力申請の追加</td>
          <td>
            <p v-if="add_power_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="add_power_order" :isOn="add_power_order" :on_click="() => {this.add_power_order = !this.add_power_order}" />
          </td>
        </tr>
        <tr>
          <td>電力申請情報編集・削除</td>
          <td>
            <p v-if="is_edit_power_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_power_order" :isOn="is_edit_power_order" :on_click="() => {this.is_edit_power_order = !this.is_edit_power_order}" />
          </td>
        </tr>
        <tr>
          <td>貸出物品の追加</td>
          <td>
            <p v-if="add_rental_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="add_rental_order" :isOn="add_rental_order" :on_click="() => {this.add_rental_order = !this.add_rental_order}" />
          </td>
        </tr>
        <tr>
          <td>物品申請情報編集・削除</td>
          <td>
            <p v-if="is_edit_rental_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_rental_order" :isOn="is_edit_rental_order" :on_click="() => {this.is_edit_rental_order = !this.is_edit_rental_order}" />
          </td>
        </tr>
        <tr>
          <td>ステージ申請情報編集</td>
          <td>
            <p v-if="is_edit_stage_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_stage_order" :isOn="is_edit_stage_order" :on_click="() => {this.is_edit_stage_order = !this.is_edit_stage_order}" />
          </td>
        </tr>
        <tr>
          <td>従業員の追加</td>
          <td>
            <p v-if="add_employee === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="add_employee" :isOn="add_employee" :on_click="() => {this.add_employee = !this.add_employee}" />
          </td>
        </tr>
        <tr>
          <td>従業員情報編集・削除</td>
          <td>
            <p v-if="is_edit_employee === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_employee" :isOn="is_edit_employee" :on_click="() => {this.is_edit_employee = !this.is_edit_employee}" />
          </td>
        </tr>
        <tr>
          <td>販売食品の追加</td>
          <td>
            <p v-if="add_food_product === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="add_food_product" :isOn="add_food_product" :on_click="() => {this.add_food_product = !this.add_food_product}" />
          </td>
        </tr>
        <tr>
          <td>販売食品情報編集・削除</td>
          <td>
            <p v-if="is_edit_food_product === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_food_product" :isOn="is_edit_food_product" :on_click="() => {this.is_edit_food_product = !this.is_edit_food_product}" />
          </td>
        </tr>
        <tr>
          <td>購入品の追加</td>
          <td>
            <p v-if="add_purchase_list === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="add_purchase_list" :isOn="add_purchase_list" :on_click="() => {this.add_purchase_list = !this.add_purchase_list}" />
          </td>
        </tr>
        <tr>
          <td>購入品情報編集・削除</td>
          <td>
            <p v-if="is_edit_purchase_list === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-model="is_edit_purchase_list" :isOn="is_edit_purchase_list" :on_click="() => {this.is_edit_purchase_list = !this.is_edit_purchase_list}" />
          </td>
        </tr>
        <tr>
          <td>開催年</td>
          <td>
            <Row gap="0px">
              <span class="material-icons">expand_more</span>
              <select v-model="fes_year_id">
                <option
                  v-for="item in fes_year_list"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.year_num }}
                </option>
              </select>
            </Row>
          </td>
        </tr>
      </VerticalTable>
    </Card>
    <Row>
      <CommonButton iconName="save" :on_click="update">保存</CommonButton>
      <InTableButton iconName="close" :on_click="() => {location.reload()}">キャンセル</InTableButton>
    </Row>
  </div>
  <!--
  <div class="main-content">
    <Card width="100%">
      <h3>設定</h3>
      <hr />

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-account-group</v-icon>
            参加団体登録
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_regist_group === true">募集中</v-card-text>
          <v-card-text v-if="is_regist_group === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_regist_group"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-account-group</v-icon>
            団体情報編集・削除
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_group === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_group === false">募集締め切り</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="is_edit_group" color="green lighten-1"></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-account-outline</v-icon>
            副代表情報編集
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_sub_rep === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_sub_rep === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_edit_sub_rep"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-map-marker</v-icon>
            会場申請情報編集
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_place === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_place === false">募集締め切り</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="is_edit_place" color="green lighten-1"></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-power-plug</v-icon>
            電力申請の追加
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="add_power_order === true">募集中</v-card-text>
          <v-card-text v-if="add_power_order === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="add_power_order"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-power-plug</v-icon>
            電力申請情報編集・削除
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_power_order === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_power_order === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_edit_power_order"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-table-chair</v-icon>
            貸出物品の追加
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="add_rental_order === true">募集中</v-card-text>
          <v-card-text v-if="add_rental_order === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="add_rental_order"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-table-chair</v-icon>
            物品申請情報編集・削除
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_rental_order === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_rental_order === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_edit_rental_order"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-microphone-variant</v-icon>
            ステージ申請情報編集
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_stage_order === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_stage_order === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_edit_stage_order"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-account</v-icon>
            従業員の追加
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="add_employee === true">募集中</v-card-text>
          <v-card-text v-if="add_employee === false">募集締め切り</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="add_employee" color="green lighten-1"></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-account</v-icon>
            従業員情報編集・削除
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_employee === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_employee === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_edit_employee"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-baguette</v-icon>
            販売食品の追加
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="add_food_product === true">募集中</v-card-text>
          <v-card-text v-if="add_food_product === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="add_food_product"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-baguette</v-icon>
            販売食品情報編集・削除
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_food_product === true">募集中</v-card-text>
          <v-card-text v-if="is_edit_food_product === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_edit_food_product"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-cart</v-icon>
            購入品の追加
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="add_purchase_list === true">募集中</v-card-text>
          <v-card-text v-if="add_purchase_list === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="add_purchase_list"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-cart</v-icon>
            購入品情報編集・削除
          </v-card-title>
        </v-col>
        <v-col cols="2">
          <v-card-text v-if="is_edit_purchase_list === true"
            >募集中</v-card-text
          >
          <v-card-text v-if="is_edit_purchase_list === false"
            >募集締め切り</v-card-text
          >
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="is_edit_purchase_list"
            color="green lighten-1"
          ></v-switch>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-card-title>
            <v-icon class="pr-2">mdi-calendar-multiple</v-icon>
            開催年
          </v-card-title>
        </v-col>
        <v-col cols="3">
          <v-select
            label="開催年"
            v-model="fes_year_id"
            :items="item_list"
            item-text="year_num"
            item-value="id"
            outlined
          />
        </v-col>
        <v-col cols="3"> </v-col>
      </v-row>

      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-row>
        <v-col cols="8"></v-col>
        <v-col cols="3">
          <div>
            <v-btn rounded depressed dark block color="btn" @click="update">
              変更する
            </v-btn>

            <v-snackbar
              v-model="snackbar"
              color="blue-grey"
              :multi-line="multiLine"
              top
              elevation="24"
            >
              変更しました
              <template v-slot:action="{ attrs }">
                <v-btn
                  color="white"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-snackbar>
          </div>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    </Card>
  </div>
  -->
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      data: [],
      is_regist_group: false,
      is_regist_food_product: false,
      is_edit_group: false,
      is_edit_sub_rep: false,
      is_edit_place: false,
      is_edit_power_order: false,
      is_edit_rental_order: false,
      is_edit_stage_order: false,
      is_edit_employee: false,
      is_edit_food_product: false,
      is_edit_purchase_list: false,
      add_power_order: false,
      add_rental_order: false,
      add_employee: false,
      add_food_product: false,
      add_purchase_list: false,
      fes_year_id: "",
      fes_year_list: [],
      multiLine: true,
      snackbar: false,
      text: `I'm a multi-line snackbar.`,
    };
  },

  mounted() {
    this.$axios
      .get("/user_page_settings")
      .then((response) => {
        this.data = response.data[0];
        this.is_regist_group = response.data[0].is_regist_group;
        this.is_edit_group = response.data[0].is_edit_group;
        this.is_edit_sub_rep = response.data[0].is_edit_sub_rep;
        this.is_edit_place = response.data[0].is_edit_place;
        this.is_edit_power_order = response.data[0].is_edit_power_order;
        this.is_edit_rental_order = response.data[0].is_edit_rental_order;
        this.is_edit_stage_order = response.data[0].is_edit_stage_order;
        this.is_edit_employee = response.data[0].is_edit_employee;
        this.is_edit_food_product = response.data[0].is_edit_food_product;
        this.is_edit_purchase_list = response.data[0].is_edit_purchase_list;
        this.add_power_order = response.data[0].add_power_order;
        this.add_rental_order = response.data[0].add_rental_order;
        this.add_employee = response.data[0].add_employee;
        this.add_food_product = response.data[0].add_food_product;
        this.add_purchase_list = response.data[0].add_purchase_list;
        this.fes_year_id = response.data[0].fes_year_id;
      });
    this.$axios
      .get("/fes_years", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fes_year_list = response.data;
      });
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    update: function() {
      const update_url = "/user_page_settings/1";
      let params = new URLSearchParams();
      params.append("is_regist_group", this.is_regist_group);
      params.append("is_edit_group", this.is_edit_group);
      params.append("is_edit_sub_rep", this.is_edit_sub_rep);
      params.append("is_edit_place", this.is_edit_place);
      params.append("is_edit_power_order", this.is_edit_power_order);
      params.append("is_edit_rental_order", this.is_edit_rental_order);
      params.append("is_edit_stage_order", this.is_edit_stage_order);
      params.append("is_edit_employee", this.is_edit_employee);
      params.append("is_edit_food_product", this.is_edit_food_product);
      params.append("is_edit_purchase_list", this.is_edit_purchase_list);
      params.append("add_power_order", this.add_power_order);
      params.append("add_rental_order", this.add_rental_order);
      params.append("add_employee", this.add_employee);
      params.append("add_food_product", this.add_food_product);
      params.append("add_purchase_list", this.add_purchase_list);
      params.append("fes_year_id", this.fes_year_id);

      this.$axios
        .put(update_url, params)

        .then(
          (response) => {
            this.snackbar = true;
            console.log(response);
            console.log("update");
          },
          (error) => {}
        );

      this.snackbar = true;
    },
  },
};
</script>
