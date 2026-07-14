<template>
  <div class="main-content" v-if="this.$role(roleID).order_status.read">
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

    <div class="status-guide-container">
      <div class="status-icon-guide">
        <span class="status-icon-guide__title">【ステータス凡例】</span>
        <span class="status-icon-guide__item">
          <span class="material-icons status-icon-small">check</span>: 承認済み
        </span>
        <span class="status-icon-guide__item">
          <span class="status-guide-cell bg-unapproved"
            ><span class="material-icons status-icon-small"
              >notification_important</span
            ></span
          >: 未確認
        </span>
        <span class="status-icon-guide__item">
          <span class="status-guide-cell bg-resubmission"
            ><span class="material-icons status-icon-small"
              >autorenew</span
            ></span
          >: 再提出待ち
        </span>
        <span class="status-icon-guide__item">
          <span class="status-guide-cell unregistered"
            ><span class="material-icons status-icon-small">close</span></span
          >: 未申請
        </span>
        <span class="status-icon-guide__item"> <span>ー</span>: 対象外 </span>
      </div>
    </div>

    <Card width="100%">
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
            @click="$router.push(`/order_status_check/${group.group.id}`)"
            class="clickable-row"
          >
            <!-- ID -->
            <td>{{ group.group.id }}</td>
            <!-- 参加団体 -->
            <td>{{ group.group.name }}</td>
            <!-- 副代表 -->
            <td
              :class="{
                unregistered:
                  !group.sub_rep && !isUnregistered(group.group.id, 'sub_rep'),
              }"
            >
              <div v-if="group.sub_rep">◯</div>
              <div v-else-if="isUnregistered(group.group.id, 'sub_rep')">
                ー
              </div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 会場 -->
            <td
              :class="{
                unregistered:
                  !group.place_order &&
                  !group.group.is_international &&
                  group.group_category !== 3,
              }"
            >
              <div v-if="group.place_order">◯</div>
              <div
                v-else-if="
                  group.group.is_international || group.group_category === 3
                "
              >
                ー
              </div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 消費電力 -->
            <td
              :class="[
                {
                  unregistered:
                    !group.power_orders &&
                    !isUnregistered(group.group.id, 'power_order'),
                },
                isUnregistered(group.group.id, 'power_order')
                  ? ''
                  : getSubmissionStatusClass(group, 'power_order'),
              ]"
            >
              <div v-if="isUnregistered(group.group.id, 'power_order')">ー</div>
              <div v-else-if="group.power_orders" class="status-cell-inner">
                <span
                  v-if="getSubmissionStatusIcon(group, 'power_order')"
                  class="material-icons status-icon-small"
                  >{{ getSubmissionStatusIcon(group, "power_order") }}</span
                >
              </div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 物品 -->
            <td
              :class="[
                {
                  unregistered:
                    !group.rental_orders &&
                    !isUnregistered(group.group.id, 'rental_item_order'),
                },
                isUnregistered(group.group.id, 'rental_item_order')
                  ? ''
                  : getSubmissionStatusClass(group, 'equipment'),
              ]"
            >
              <div v-if="isUnregistered(group.group.id, 'rental_item_order')">
                ー
              </div>
              <div v-else-if="group.rental_orders" class="status-cell-inner">
                <span
                  v-if="getSubmissionStatusIcon(group, 'equipment')"
                  class="material-icons status-icon-small"
                  >{{ getSubmissionStatusIcon(group, "equipment") }}</span
                >
              </div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- ステージ -->
            <td
              :class="{
                unregistered: !group.stage_orders && group.group_category === 3,
              }"
            >
              <div v-if="group.stage_orders">◯</div>
              <div v-else-if="group.group_category !== 3">ー</div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- ステージオプション -->
            <td
              :class="{
                unregistered:
                  !group.stage_common_option && group.group_category === 3,
              }"
            >
              <div v-if="group.stage_common_option">◯</div>
              <div v-else-if="group.group_category !== 3">ー</div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 従業員 -->
            <td
              :class="[
                {
                  unregistered:
                    !group.employees &&
                    !isUnregistered(group.group.id, 'employee') &&
                    group.group_category === 1,
                },
                isUnregistered(group.group.id, 'employee')
                  ? ''
                  : getSubmissionStatusClass(group, 'employee'),
              ]"
            >
              <div v-if="isUnregistered(group.group.id, 'employee')">ー</div>
              <div v-else-if="group.employees" class="status-cell-inner">
                <span
                  v-if="getSubmissionStatusIcon(group, 'employee')"
                  class="material-icons status-icon-small"
                  >{{ getSubmissionStatusIcon(group, "employee") }}</span
                >
              </div>
              <div v-else-if="group.group_category !== 1">ー</div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 販売品 -->
            <td
              :class="[
                {
                  unregistered:
                    !group.food_product &&
                    (group.group_category === 1 || group.group_category === 2),
                },
                getSubmissionStatusClass(group, 'food_product'),
              ]"
            >
              <div v-if="group.food_product" class="status-cell-inner">
                <span
                  v-if="getSubmissionStatusIcon(group, 'food_product')"
                  class="material-icons status-icon-small"
                  >{{ getSubmissionStatusIcon(group, "food_product") }}</span
                >
              </div>
              <div
                v-else-if="
                  group.group_category !== 1 && group.group_category !== 2
                "
              >
                ー
              </div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 購入品 -->
            <td
              :class="[
                {
                  unregistered:
                    !group.purchase_list && group.group_category === 1,
                },
                getSubmissionStatusClass(group, 'purchase_list'),
              ]"
            >
              <div v-if="group.purchase_list" class="status-cell-inner">
                <span
                  v-if="getSubmissionStatusIcon(group, 'purchase_list')"
                  class="material-icons status-icon-small"
                  >{{ getSubmissionStatusIcon(group, "purchase_list") }}</span
                >
              </div>
              <div v-else-if="group.group_category !== 1">ー</div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- PR -->
            <td :class="{ unregistered: !group.public_relation }">
              <div v-if="group.public_relation">◯</div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 模擬店平面図 -->
            <td
              :class="[
                {
                  unregistered: !group.venue_map && group.group_category === 1,
                },
                getSubmissionStatusClass(group, 'venue_map'),
              ]"
            >
              <div v-if="group.venue_map" class="status-cell-inner">
                <span
                  v-if="getSubmissionStatusIcon(group, 'venue_map')"
                  class="material-icons status-icon-small"
                  >{{ getSubmissionStatusIcon(group, "venue_map") }}</span
                >
              </div>
              <div v-else-if="group.group_category !== 1">ー</div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 調理工程 -->
            <td
              :class="[
                {
                  unregistered:
                    !group.cooking_process_order && group.group_category === 1,
                },
                getSubmissionStatusClass(group, 'cooking_process_order'),
              ]"
            >
              <div v-if="group.cooking_process_order" class="status-cell-inner">
                <span
                  v-if="getSubmissionStatusIcon(group, 'cooking_process_order')"
                  class="material-icons status-icon-small"
                  >{{
                    getSubmissionStatusIcon(group, "cooking_process_order")
                  }}</span
                >
              </div>
              <div v-else-if="group.group_category !== 1">ー</div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
            </td>
            <!-- 火気使用申請 -->
            <td
              :class="[
                {
                  unregistered:
                    !group.fire_equipment_order &&
                    !isUnregistered(group.group.id, 'fire_equipment_order') &&
                    [1, 2, 4, 5].includes(group.group_category),
                },
                isUnregistered(group.group.id, 'fire_equipment_order')
                  ? ''
                  : getSubmissionStatusClass(group, 'fire_equipment_order'),
              ]"
            >
              <div
                v-if="isUnregistered(group.group.id, 'fire_equipment_order')"
              >
                ー
              </div>
              <div
                v-else-if="
                  group.fire_equipment_order &&
                  [1, 2, 4, 5].includes(group.group_category)
                "
                class="status-cell-inner"
              >
                <span
                  v-if="getSubmissionStatusIcon(group, 'fire_equipment_order')"
                  class="material-icons status-icon-small"
                  >{{
                    getSubmissionStatusIcon(group, "fire_equipment_order")
                  }}</span
                >
              </div>
              <div v-else-if="![1, 2, 4, 5].includes(group.group_category)">
                ー
              </div>
              <div v-else class="status-cell-inner">
                <span class="material-icons status-icon-small">close</span>
              </div>
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
import {
  normalizeSubmissionStatus,
  getSubmissionStatusMeta,
} from "~/utils/health_center_submission_status";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "副代表",
        "会場",
        "消費電力",
        "物品",
        "ステージ",
        "ステージオプション",
        "従業員",
        "販売品",
        "購入品",
        "PR",
        "模擬店平面図",
        "調理工程",
        "火気使用申請",
      ],
      groups: [],
      unregisteredGroups: [],
      group_categories: [],
      group_id: "",
      dialog: false,
      message: "",
      international: false,
      external: false,
      refYears: "Years",
      refYearID: 0,
      refGroupCategories: "ALL",
      refCategoryID: 0,
      refInternational: "ALL",
      refInternationalID: 0,
      refExternal: "ALL",
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

    // 申請しないデータを取得
    const unregisteredGroupsRes = await $axios.$get("/un_registered_groups");

    return {
      groups: groupsRes.data,
      unregisteredGroups: unregisteredGroupsRes.data,
      groupCategories: groupCategoryRes.data,
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
  mounted() {
    console.log(this.groups);
    const storedYearID = localStorage.getItem(this.$route.path + "RefYear");

    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = "Year";
    }

    const storedCategoryID = localStorage.getItem(
      this.$route.path + "RefCategory"
    );

    if (storedCategoryID) {
      this.refCategoryID = Number(storedCategoryID);
      this.updateFilters(this.refCategoryID, this.groupCategories);
    } else {
      this.refGroupCategories = "Categories";
    }

    const storedInternationalID = localStorage.getItem(
      this.$route.path + "RefInternational"
    );

    if (storedInternationalID) {
      this.refInternationalID = Number(storedInternationalID);
      this.updateFilters(this.refInternationalID, this.internationalList);
    } else {
      this.refInternational = "International";
    }

    const storedExternalID = localStorage.getItem(
      this.$route.path + "RefExternal"
    );

    if (storedExternalID) {
      this.refExternalID = Number(storedExternalID);
      this.updateFilters(this.refExternalID, this.externalList);
    } else {
      this.refExternal = "External";
    }

    this.fetchFilteredData();

    window.addEventListener("scroll", this.saveScrollPosition);
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
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
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
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
        // externalで絞り込む時
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

      // 申請しないデータも再取得
      const unregisteredRes = await this.$axios.$get("/un_registered_groups");
      this.unregisteredGroups = unregisteredRes.data;

      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchGroups();
      }
      this.$nextTick(() => {
        window.scrollTo(
          0,
          parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
        );
      });
    },
    async searchGroups() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.groups = [];
      const searchUrl =
        "/api/v1/get_search_order_status_check?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.groups.push(res);
      }

      // 検索時も申請しないデータを再取得
      const unregisteredRes = await this.$axios.$get("/un_registered_groups");
      this.unregisteredGroups = unregisteredRes.data;
    },
    // 申請しないデータかどうかを判定するメソッド
    isUnregistered(groupId, orderType) {
      return this.unregisteredGroups.some(
        (item) => item.group_id === groupId && item.order_type === orderType
      );
    },
    getSubmissionStatus(groupWrapper, typeKey) {
      if (!groupWrapper || !groupWrapper.health_center_submission_statuses)
        return null;
      return groupWrapper.health_center_submission_statuses[typeKey];
    },
    // typeKeyに対応する申請物自体がgroupWrapperに存在するかどうか
    hasApplicationRecord(groupWrapper, typeKey) {
      if (!groupWrapper) return false;
      const fieldByType = {
        power_order: "power_orders",
        equipment: "rental_orders",
        employee: "employees",
        food_product: "food_product",
        purchase_list: "purchase_list",
        venue_map: "venue_map",
        cooking_process_order: "cooking_process_order",
        fire_equipment_order: "fire_equipment_order",
      };
      const field = fieldByType[typeKey];
      return !!(field && groupWrapper[field]);
    },
    getSubmissionStatusIcon(groupWrapper, typeKey) {
      const status = this.getSubmissionStatus(groupWrapper, typeKey);
      const hasApplication = this.hasApplicationRecord(groupWrapper, typeKey);
      return getSubmissionStatusMeta(
        normalizeSubmissionStatus(status, hasApplication)
      ).icon;
    },
    getSubmissionStatusClass(groupWrapper, typeKey) {
      const status = this.getSubmissionStatus(groupWrapper, typeKey);
      const hasApplication = this.hasApplicationRecord(groupWrapper, typeKey);
      const resolvedStatus = normalizeSubmissionStatus(status, hasApplication);
      if (resolvedStatus === "unapproved") return "bg-unapproved";
      if (resolvedStatus === "waiting_resubmission") return "bg-resubmission";
      return "";
    },
  },
};
</script>
<style scoped>
.unregistered {
  background-color: #ffb300 !important;
  color: white !important;
}
.bg-unapproved {
  background-color: #e53935 !important;
  color: white !important;
}
.bg-resubmission {
  background-color: #2e7d32 !important;
  color: white !important;
}
.status-cell-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.status-icon-small {
  font-size: 18px;
}
.status-guide-container {
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 0 16px;
  width: 100%;
}
.status-icon-guide {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  text-align: left;
}
.status-icon-guide__title {
  font-weight: bold;
}
.status-icon-guide__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-guide-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
}
.normal-table td.unregistered:hover,
.normal-table td.bg-unapproved:hover,
.normal-table td.bg-resubmission:hover {
  background-color: inherit !important;
  color: white;
  background: none;
  -webkit-background-clip: initial !important;
  background-clip: initial !important;
  -webkit-text-fill-color: white !important;
}
.clickable-row {
  cursor: pointer;
}
.clickable-row:hover {
  background-color: #f5f5f5;
}
</style>
