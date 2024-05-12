<template>
  <div class="main-content">
    <SubHeader pageTitle="申請状況一覧"></SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementGroups"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="groupCategories"
          :on_click="refinementGroups"
          value="name"
        >
          {{ refGroupCategories }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="internationalList"
          :on_click="refinementGroups"
          value="value"
        >
          {{ refInternational }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="externalList"
          :on_click="refinementGroups"
          value="value"
        >
          {{ refExternal }}
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

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr v-for="(group, index) in groups" :key="index">
            <td>{{ group.group.id }}</td>
            <td>{{ group.group.name }}</td>
            <td :class="{ unregistered: !group.sub_rep }">
              <div v-if="group.sub_rep">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.place_order }">
              <div v-if="group.place_order">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.power_orders }">
              <div v-if="group.power_orders">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.rental_orders }">
              <div v-if="group.rental_orders">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.stage_orders }">
              <div v-if="group.stage_orders">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.stage_common_option }">
              <div v-if="group.stage_common_option">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.employees }">
              <div v-if="group.employees">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.food_products }">
              <div
                v-if="group.food_products && group.food_products.food_product"
              >
                ◯
              </div>
              <div v-else>✖️</div>
            </td>
            <td
              :class="{
                unregistered: !(
                  group.food_products && group.food_products.purchase_lists
                ),
              }"
            >
              <div
                v-if="group.food_products && group.food_products.purchase_lists"
              >
                ◯
              </div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.public_relation }">
              <div v-if="group.public_relation">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.announucement }">
              <div v-if="group.announucement">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.venue_map }">
              <div v-if="group.venue_map">◯</div>
              <div v-else>✖️</div>
            </td>
            <td :class="{ unregistered: !group.cooking_process_order }">
              <div v-if="group.cooking_process_order">◯</div>
              <div v-else>✖️</div>
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
      headers: [
        "ID",
        "参加団体",
        "副代表",
        "会場",
        "電力",
        "物品",
        "ステージ",
        "ステージオプション",
        "従業員",
        "販売品",
        "購入品",
        "PR",
        "アナウンス",
        "模擬店平面図",
        "調理工程",
      ],
      groups: [],
      group_categories: [],
      group_id: "",
      dialog: false,
      message: "",
      international: false,
      external: false,
      refYears: "Years",
      refYearID: 0,
      refGroupCategories: "Categories",
      refCategoryID: 0,
      refInternational: "国際",
      refInternationalID: 0,
      refExternal: "学外",
      refExternalID: 0,
      groupCategories: [],
      searchText: "",
      internationalList: [
        { id: 1, value: "国際", bool: true },
        { id: 2, value: "国内", bool: false },
      ],
      externalList: [
        { id: 1, value: "学外", bool: true },
        { id: 2, value: "学内", bool: false },
      ],
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const groupCategoryRes = await $axios.$get("/group_categories");
    const url =
      "/api/v1/get_refinement_order_status_check?fes_year_id=" +
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
      groupCategories: groupCategoryRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = 'Year';
    }

    const storedCategoryID = localStorage.getItem(this.$route.path + 'RefCategory');
    if (storedCategoryID) {
      this.refCategoryID = Number(storedCategoryID);
      this.updateFilters(this.refCategoryID, this.groupCategories);
    } else {
      this.refGroupCategories = 'Categories';
    }

    const storedInternationalID = localStorage.getItem(this.$route.path + 'RefInternational');
    if (storedInternationalID) {
      this.refInternationalID = Number(storedInternationalID);
      this.updateFilters(this.refInternationalID, this.internationalList);
    } else {
      this.refInternational = 'International';
    }

    const storedExternalID = localStorage.getItem(this.$route.path + 'RefExternal');
    if (storedExternalID) {
      this.refExternalID = Number(storedExternalID);
      this.updateFilters(this.refExternalID, this.externalList);
    } else {
      this.refExternal = 'External';
    }

    this.fetchFilteredData();

    window.addEventListener('scroll', this.saveScrollPosition);
  },
  methods: {
    async refinementGroups(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + "RefYear", this.refYearID);
      localStorage.setItem(
        this.$route.path + "RefCategory",
        this.refCategoryID
      );
      localStorage.setItem(
        this.$route.path + "RefInternational",
        this.refInternationalID
      );
      localStorage.setItem(
        this.$route.path + "RefExternal",
        this.refExternalID
      );
      this.fetchFilteredData();
    },
    updateFilters(item_id, name_list) {
      console.log(item_id, name_list[0]);
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
        // group_categoryで絞り込むとき
      } else if (name_list.toString() == this.groupCategories.toString()) {
        this.refCategoryID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refGroupCategories = "ALL";
        } else {
          this.refGroupCategories = name_list[item_id - 1].name;
        }
        // internationalで絞り込むとき
      } else if (Object.is(name_list, this.internationalList)) {
        this.refInternationalID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refInternational = "ALL";
        } else {
          this.refInternational = name_list[item_id - 1].value;
        }
        // externalで絞り込むとき
      } else if (Object.is(name_list, this.externalList)) {
        this.refExternalID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refExternal = "ALL";
        } else {
          this.refExternal = name_list[item_id - 1].value;
        }
      }
    },
    async fetchFilteredData() {
      this.groups = [];
      const refUrl =
        "/api/v1/get_refinement_order_status_check?fes_year_id=" +
        this.refYearID +
        "&group_category_id=" +
        this.refCategoryID +
        "&is_international=" +
        this.refInternationalID +
        "&is_external=" +
        this.refExternalID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.groups.push(res);
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    async searchGroups() {
      this.groups = [];
      const searchUrl =
        "/api/v1/get_search_order_status_check?word=" + this.searchText;
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
  background: none; /* 線形グラデーションを上書きして無効にします */
  -webkit-background-clip: initial !important; /* デフォルトの状態に戻します */
  -webkit-text-fill-color: black !important;
}
</style>
