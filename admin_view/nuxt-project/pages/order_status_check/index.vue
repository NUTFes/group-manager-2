<template>
    <div class="main-content" v-if="this.$role(roleID).order_status.read">
      <SubHeader pageTitle="申請状況一覧"></SubHeader>

      <SubSubHeader>
        <template v-slot:refinement>
          <SearchDropDown
            :nameList="yearList"
            :on_click="refinementgroups"
            value="year_num"
          >
            {{ refYears }}
          </SearchDropDown>
        </template>
        <template v-slot:search>
          <SearchBar>
            <input
              v-model="searchText"
              @keypress.enter="searchGroups"
              type="text"
              size="25"
              placeholder="search"
            />
          </SearchBar>
        </template>
      </SubSubHeader>

      <Card width="100%" >
        <Table>
          <template v-slot:table-header>
            <th v-for="(header, index) in headers" :key="index">
              {{ header }}
            </th>
          </template>
          <template v-slot:table-body>
            <tr
              v-for="(group, index) in groups"
              :key="index"
            >
              <td>{{ group.group.id }}</td>
              <td>{{ group.group.name}}</td>
              <td :class="{unregistered: !group.sub_rep}">
                <div v-if='group.sub_rep'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.place_order}">
                <div v-if='group.place_order'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.power_orders}">
                <div v-if='group.power_orders'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.rental_orders}">
                <div v-if='group.rental_orders'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.stage_orders}">
                <div v-if='group.stage_orders'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.stage_common_option}">
                <div v-if='group.stage_common_option'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.employees}">
                <div v-if='group.employees'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.food_products}">
                <div v-if='group.food_products && group.food_products.food_product'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !(group.food_products && group.food_products.purchase_lists)}">
                <div v-if='group.food_products && group.food_products.purchase_lists'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.public_relation}">
                <div v-if='group.public_relation'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.announucement}">
                <div v-if='group.announucement'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.venue_map}">
                <div v-if='group.venue_map'>◯</div>
                <div v-else>✖️</div>
              </td>
              <td :class="{unregistered: !group.cooking_process_order}">
                <div v-if='group.cooking_process_order'>◯</div>
                <div v-else>✖️</div>
              </td>
            </tr>
          </template>
        </Table>
      </Card>

    </div>
    <h1 v-else>閲覧権限がありません</h1>
  </template>

  <script>
  import { mapState } from "vuex";
  export default {
    watchQuery: ["page"],
    data() {
      return {
        headers: ["ID", "参加団体", "副代表", "会場", "電力", "物品", "ステージ", "ステージオプション", "従業員", "販売品", "購入品", "PR", "アナウンス", "模擬店平面図", "調理工程"],
        groups: [],
        group_id: "",
        groups: [],
        groups: [],
        dialog: false,
        message: "",
        refYears: "Years",
        refYearID: 0,
        searchText: ""
      };
    },
    async asyncData({ $axios }) {
      const currentYearUrl = "/user_page_settings/1";
      const currentYearRes = await $axios.$get(currentYearUrl);
      const url =
        "/api/v1/get_refinement_order_infos?fes_year_id=" +
        currentYearRes.data.fes_year_id;
      const groupsRes = await $axios.$post(url);
      const yearsUrl = "/fes_years";
      const yearsRes = await $axios.$get(yearsUrl);
      const currentYears = yearsRes.data.filter(function (element) {
        return element.id == currentYearRes.data.fes_year_id;
       });

      return {
        groups: groupsRes.data,
        yearList: yearsRes.data,
        refYearID: currentYearRes.data.fes_year_id,
        refYears: currentYears[0].year_num,
      };
    },
    computed: {
      ...mapState({
        roleID: (state) => state.users.role,
      }),
    },
    methods: {
      async refinementgroups(item_id, name_list) {
       // fes_yearで絞り込むとき
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
        this.groups = [];
        const refUrl =
          "/api/v1/get_refinement_order_infos?fes_year_id=" +
          this.refYearID;
        const refRes = await this.$axios.$post(refUrl);
        for (const res of refRes.data) {
          this.groups.push(res);
        }
      },
      async searchGroups() {
        this.groups = [];
        const searchUrl = "/api/v1/get_search_order_infos?word=" + this.searchText;
        const refRes = await this.$axios.$post(searchUrl);
        for (const res of refRes.data) {
            this.groups.push(res);
        }
      },
    },
  };
  </script>
  <style scoped>
  .unregistered {
    background-color: red;
    color: white;
  }
  .normal-table td.unregistered:hover {
    background-color: red !important;
    color: white;
    background: none;  /* 線形グラデーションを上書きして無効にします */
    -webkit-background-clip: initial !important;  /* デフォルトの状態に戻します */
    -webkit-text-fill-color: black !important;
  }
  </style>
