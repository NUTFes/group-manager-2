<template>
  <div class="main-content" v-if="this.$role(roleID).user_page_setting.read">
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
            <!-- roleのupdateがtrueになっているroleだけ，トグルボタンが表示される -->
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_regist_group" :isOn="is_regist_group" :on_click="() => {this.is_regist_group = !this.is_regist_group}" />
          </td>
        </tr>
        <tr>
          <td>団体情報編集・削除</td>
          <td>
            <p v-if="is_edit_group === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_group" :isOn="is_edit_group" :on_click="() => {this.is_edit_group = !this.is_edit_group}" />
          </td>
        </tr>
        <tr>
          <td>ユーザ情報編集・削除</td>
          <td>
            <p v-if="is_edit_user === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_user" :isOn="is_edit_user" :on_click="() => {this.is_edit_user = !this.is_edit_user}" />
          </td>
        </tr>
        <tr>
          <td>副代表情報編集</td>
          <td>
            <p v-if="is_edit_sub_rep === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_sub_rep" :isOn="is_edit_sub_rep" :on_click="() => {this.is_edit_sub_rep = !this.is_edit_sub_rep}" />
          </td>
        </tr>
        <tr>
          <td>会場申請情報編集</td>
          <td>
            <p v-if="is_edit_place === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_place" :isOn="is_edit_place" :on_click="() => {this.is_edit_place = !this.is_edit_place}" />
          </td>
        </tr>
        <tr>
          <td>電力申請の追加</td>
          <td>
            <p v-if="add_power_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="add_power_order" :isOn="add_power_order" :on_click="() => {this.add_power_order = !this.add_power_order}" />
          </td>
        </tr>
        <tr>
          <td>電力申請情報編集・削除</td>
          <td>
            <p v-if="is_edit_power_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_power_order" :isOn="is_edit_power_order" :on_click="() => {this.is_edit_power_order = !this.is_edit_power_order}" />
          </td>
        </tr>
        <tr>
          <td>貸出物品の追加</td>
          <td>
            <p v-if="add_rental_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="add_rental_order" :isOn="add_rental_order" :on_click="() => {this.add_rental_order = !this.add_rental_order}" />
          </td>
        </tr>
        <tr>
          <td>物品申請情報編集・削除</td>
          <td>
            <p v-if="is_edit_rental_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_rental_order" :isOn="is_edit_rental_order" :on_click="() => {this.is_edit_rental_order = !this.is_edit_rental_order}" />
          </td>
        </tr>
        <tr>
          <td>ステージ申請の追加</td>
          <td>
            <p v-if="add_stage_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="add_stage_order" :isOn="add_stage_order" :on_click="() => {this.add_stage_order = !this.add_stage_order}" />
          </td>
        </tr>
        <tr>
          <td>ステージ申請情報編集</td>
          <td>
            <p v-if="is_edit_stage_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_stage_order" :isOn="is_edit_stage_order" :on_click="() => {this.is_edit_stage_order = !this.is_edit_stage_order}" />
          </td>
        </tr>
        <tr>
          <td>ステージオプション申請情報編集</td>
          <td>
            <p v-if="is_edit_stage_common_option === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_stage_common_option" :isOn="is_edit_stage_common_option" :on_click="() => {this.is_edit_stage_common_option = !this.is_edit_stage_common_option}" />
          </td>
        </tr>
        <tr>
          <td>従業員の追加</td>
          <td>
            <p v-if="add_employee === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="add_employee" :isOn="add_employee" :on_click="() => {this.add_employee = !this.add_employee}" />
          </td>
        </tr>
        <tr>
          <td>従業員情報編集・削除</td>
          <td>
            <p v-if="is_edit_employee === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_employee" :isOn="is_edit_employee" :on_click="() => {this.is_edit_employee = !this.is_edit_employee}" />
          </td>
        </tr>
        <tr>
          <td>販売食品の登録</td>
          <td>
            <p v-if="is_regist_food_product === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_regist_food_product" :isOn="is_regist_food_product" :on_click="() => {this.is_regist_food_product = !this.is_regist_food_product}" />
          </td>
        </tr>
        <tr>
          <td>販売食品の追加</td>
          <td>
            <p v-if="add_food_product === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="add_food_product" :isOn="add_food_product" :on_click="() => {this.add_food_product = !this.add_food_product}" />
          </td>
        </tr>
        <tr>
          <td>販売食品情報編集・削除</td>
          <td>
            <p v-if="is_edit_food_product === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_food_product" :isOn="is_edit_food_product" :on_click="() => {this.is_edit_food_product = !this.is_edit_food_product}" />
          </td>
        </tr>
        <tr>
          <td>購入品の追加</td>
          <td>
            <p v-if="add_purchase_list === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="add_purchase_list" :isOn="add_purchase_list" :on_click="() => {this.add_purchase_list = !this.add_purchase_list}" />
          </td>
        </tr>
        <tr>
          <td>購入品情報編集・削除</td>
          <td>
            <p v-if="is_edit_purchase_list === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_purchase_list" :isOn="is_edit_purchase_list" :on_click="() => {this.is_edit_purchase_list = !this.is_edit_purchase_list}" />
          </td>
        </tr>
        <tr>
          <td>アナウンス文申請情報編集</td>
          <td>
            <p v-if="is_edit_announcement === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_announcement" :isOn="is_edit_announcement" :on_click="() => {this.is_edit_announcement = !this.is_edit_announcement}" />
          </td>
        </tr>
        <tr>
          <td>PR申請情報編集</td>
          <td>
            <p v-if="is_edit_public_relation === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_public_relation" :isOn="is_edit_public_relation" :on_click="() => {this.is_edit_public_relation = !this.is_edit_public_relation}" />
          </td>
        </tr>
        <tr>
          <td>模擬店平面図情報編集</td>
          <td>
            <p v-if="is_edit_venue_map === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton v-if="this.$role(roleID).user_page_setting.update" v-model="is_edit_venue_map" :isOn="is_edit_venue_map" :on_click="() => {this.is_edit_venue_map = !this.is_edit_venue_map}" />
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
      <CommonButton v-if="$role(roleID).user_page_setting.update" iconName="save" :on_click="update">保存</CommonButton>
      <InTableButton v-if="$role(roleID).user_page_setting.update" iconName="close" :on_click="() => {location.reload()}">キャンセル</InTableButton>
    </Row>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
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
      is_edit_user: false,
      is_edit_sub_rep: false,
      is_edit_place: false,
      is_edit_power_order: false,
      is_edit_rental_order: false,
      is_edit_stage_order: false,
      is_edit_stage_common_option: false,
      is_edit_employee: false,
      is_edit_food_product: false,
      is_edit_purchase_list: false,
      is_edit_announcement: false,
      is_edit_public_relation: false,
      is_edit_venue_map: false,
      add_power_order: false,
      add_rental_order: false,
      add_stage_order: false,
      add_employee: false,
      add_food_product: false,
      add_purchase_list: false,
      add_announcement: false,
      fes_year_id: null,
      fes_year_list: [],
      multiLine: true,
      snackbar: false,
      text: `I'm a multi-line snackbar.`,
    };
  },

  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
    });
    
    this.$axios
      .get("/user_page_settings")
      .then((response) => {
        console.log(response.data.data[0])
        this.is_regist_group = response.data.data[0].is_regist_group;
        this.is_regist_food_product = response.data.data[0].is_regist_food_product;
        console.log(response.data.data[0].is_regist_food_product)
        this.is_edit_group = response.data.data[0].is_edit_group;
        this.is_edit_user = response.data.data[0].is_edit_user;
        this.is_edit_sub_rep = response.data.data[0].is_edit_sub_rep;
        this.is_edit_place = response.data.data[0].is_edit_place;
        this.is_edit_power_order = response.data.data[0].is_edit_power_order;
        this.is_edit_rental_order = response.data.data[0].is_edit_rental_order;
        this.is_edit_stage_order = response.data.data[0].is_edit_stage_order;
        this.is_edit_stage_common_option = response.data.data[0].is_edit_stage_common_option;
        this.is_edit_employee = response.data.data[0].is_edit_employee;
        this.is_edit_food_product = response.data.data[0].is_edit_food_product;
        this.is_edit_purchase_list = response.data.data[0].is_edit_purchase_list;
        this.is_edit_announcement = response.data.data[0].is_edit_announcement;
        this.is_edit_public_relation = response.data.data[0].is_edit_public_relation;
        this.is_edit_venue_map = response.data.data[0].is_edit_venue_map;
        this.add_power_order = response.data.data[0].add_power_order;
        this.add_rental_order = response.data.data[0].add_rental_order;
        this.add_stage_order = response.data.data[0].add_stage_order;
        this.add_employee = response.data.data[0].add_employee;
        this.add_food_product = response.data.data[0].add_food_product;
        this.add_purchase_list = response.data.data[0].add_purchase_list;
        this.add_announcementd = response.data.data[0].add_announcement;
        this.fes_year_id = response.data.data[0].fes_year_id
      });
    this.$axios
      .get("/fes_years", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fes_year_list = response.data.data;
      });
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    update: function() {
      const update_url = "/user_page_settings/1";
      let params = new URLSearchParams();
      params.append("is_regist_group", this.is_regist_group);
      params.append("is_regist_food_product", this.is_regist_food_product);
      params.append("is_edit_group", this.is_edit_group);
      params.append("is_edit_user", this.is_edit_user);
      params.append("is_edit_sub_rep", this.is_edit_sub_rep);
      params.append("is_edit_place", this.is_edit_place);
      params.append("is_edit_power_order", this.is_edit_power_order);
      params.append("is_edit_rental_order", this.is_edit_rental_order);
      params.append("is_edit_stage_order", this.is_edit_stage_order);
      params.append("is_edit_stage_common_option", this.is_edit_stage_common_option);
      params.append("is_edit_employee", this.is_edit_employee);
      params.append("is_edit_food_product", this.is_edit_food_product);
      params.append("is_edit_purchase_list", this.is_edit_purchase_list);
      params.append("is_edit_announcement", this.is_edit_announcement);
      params.append("is_edit_public_relation", this.is_edit_public_relation);
      params.append("is_edit_venue_map", this.is_edit_venue_map);
      params.append("add_power_order", this.add_power_order);
      params.append("add_rental_order", this.add_rental_order);
      params.append("add_stage_order", this.add_stage_order);
      params.append("add_employee", this.add_employee);
      params.append("add_food_product", this.add_food_product);
      params.append("add_purchase_list", this.add_purchase_list);
      params.append("add_announcement", this.add_announcement);
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
