<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="group.name" pageSubTitle="参加団体申請一覧">
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="delete"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card></Card>
      <Card></Card>
    </Row>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";

export default {
  watchQuery: ["page"],
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
      items_available: [
        { label: "使用", value: true },
        { label: "不使用", value: false },
      ],
      photo_available: [
        { label: "許可", value: true },
        { label: "禁止", value: false },
      ],
      loud_able: [
        { label: "出す", value: true },
        { label: "出さない", value: false },
      ],
      cooking_available: [
        { label: "する", value: true },
        { label: "しない", value: false },
      ],
      rules: {
        required: (value) => !!value || "入力してください",
      },
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/groups/", "");
    const url = "/api/v1/get_group_with_category_and_fes_year?id=" + routeId;
    const response = await $axios.$get(url);
    return {
      group: response.data[0].group,
      route: url,
    };
  },
};
</script>
