<template>
    <div class="main-content">
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
              <td>
                <div v-if='group.sub_rep'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.place_order'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.power_orders'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.rental_orders'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.stage_orders'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.stage_common_option'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.employees'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.food_products && group.food_products.food_product'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.food_products && group.food_products.purchase_lists'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.public_relation'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.announucement'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.venue_map'>登録済み</div>
                <div v-else>未登録</div>
              </td>
              <td>
                <div v-if='group.cooking_process_order'>登録済み</div>
                <div v-else>未登録</div>
              </td>
            </tr>
          </template>
        </Table>
      </Card>

    </div>
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
      console.log(groupsRes.data)

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
          "/api/v1/get_refinement_groups?fes_year_id=" +
          this.refYearID;
        const refRes = await this.$axios.$post(refUrl);
        for (const res of refRes.data) {
          this.groups.push(res);
        }
      },
      async searchGroups() {
        this.groups = [];
        const searchUrl = "/api/v1/get_search_groups?word=" + this.searchText;
        const refRes = await this.$axios.$post(searchUrl);
        for (const res of refRes.data) {
            this.groups.push(res);
        }
      },
    },
  };
  </script>
