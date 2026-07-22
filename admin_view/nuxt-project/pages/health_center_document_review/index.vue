<template>
  <div class="main-content" v-if="this.$role(roleID).order_status.read">
    <SubHeader pageTitle="保健所提出団体一覧"></SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementGroups"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <!--
        <SearchDropDown
          :nameList="groupCategories"
          :on_click="refinementGroups"
          value="name"
        >
          {{ refGroupCategories }}
        </SearchDropDown>
        -->
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

    <div class="status-guide-with-button">
      <div class="status-icon-guide">
        <span class="status-icon-guide__title">アイコン凡例:</span>
        <span class="status-icon-guide__item">
          <span class="material-icons status-badge__icon status-badge--unapproved">notification_important</span>
          未確認
        </span>
        <span class="status-icon-guide__item">
          <span class="material-icons status-badge__icon status-badge--waiting-resubmission">autorenew</span>
          再提出待ち
        </span>
        <span class="status-icon-guide__item">
          <span class="material-icons status-badge__icon status-badge--approved">check</span>
          承認済み
        </span>
        <span class="status-icon-guide__item">
          <span class="material-icons status-badge__icon status-badge--unsubmitted">close</span>
          未提出
        </span>
      </div>

      <div class="sync-button-container">
        <CommonButton
          iconName="sync"
          :on_click="onSyncSubmissionStatus"
          :disabled="isSyncing"
        >
          {{ isSyncing ? '同期中...' : 'ステータス更新' }}
        </CommonButton>
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
          <tr v-for="(group, index) in groups" :key="index"
            @click="() => $router.push({ path: `/health_center_document_review/` + group.group.id })">
            <td>{{ group.group.id }}</td>
            <td>{{ group.group.name }}</td>
            <td @click.stop>
              <SwitchButton
                :isOn="group.group.is_health_center_submission_target"
                :on_click="
                  () =>
                    onToggleSubmissionTarget(
                      group,
                      !group.group.is_health_center_submission_target
                    )
                "
              />
            </td>
            <td :class="{ unregistered: !isHealthCenterDocumentComplete(group) }">
              <div v-if="isHealthCenterDocumentComplete(group)">◯</div>
              <div v-else>✖️</div>
            </td>
            <td>
              <div v-if="getGroupCategoryId(group) !== 1">ー</div>
              <div
                v-else
                class="status-badge"
                :class="getStatusMeta(normalizeStatus(group.cooking_process_order)).className"
                :title="getStatusMeta(normalizeStatus(group.cooking_process_order)).label"
              >
                <span class="material-icons status-badge__icon">
                  {{ getStatusMeta(normalizeStatus(group.cooking_process_order)).icon }}
                </span>
              </div>
            </td>
            <td>
              <div v-if="getGroupCategoryId(group) !== 1 && getGroupCategoryId(group) !== 2">ー</div>
              <div
                v-else
                class="status-badge"
                :class="getStatusMeta(normalizeStatus(group.food_product)).className"
                :title="getStatusMeta(normalizeStatus(group.food_product)).label"
              >
                <span class="material-icons status-badge__icon">
                  {{ getStatusMeta(normalizeStatus(group.food_product)).icon }}
                </span>
              </div>
            </td>
            <td>
              <div v-if="getGroupCategoryId(group) !== 1">ー</div>
              <div
                v-else
                class="status-badge"
                :class="getStatusMeta(normalizeStatus(group.purchase_list)).className"
                :title="getStatusMeta(normalizeStatus(group.purchase_list)).label"
              >
                <span class="material-icons status-badge__icon">
                  {{ getStatusMeta(normalizeStatus(group.purchase_list)).icon }}
                </span>
              </div>
            </td>
            <td>
              <div v-if="getGroupCategoryId(group) !== 1">ー</div>
              <div
                v-else
                class="status-badge"
                :class="getStatusMeta(normalizeStatus(group.employee)).className"
                :title="getStatusMeta(normalizeStatus(group.employee)).label"
              >
                <span class="material-icons status-badge__icon">
                  {{ getStatusMeta(normalizeStatus(group.employee)).icon }}
                </span>
              </div>
            </td>
            <td>
              <div v-if="getGroupCategoryId(group) !== 1">ー</div>
              <div
                v-else
                class="status-badge"
                :class="getStatusMeta(normalizeStatus(group.venue_map)).className"
                :title="getStatusMeta(normalizeStatus(group.venue_map)).label"
              >
                <span class="material-icons status-badge__icon">
                  {{ getStatusMeta(normalizeStatus(group.venue_map)).icon }}
                </span>
              </div>
            </td>
            <td>
              <div
                class="status-badge"
                :class="getStatusMeta(normalizeStatus(group.equipment)).className"
                :title="getStatusMeta(normalizeStatus(group.equipment)).label"
              >
                <span class="material-icons status-badge__icon">
                  {{ getStatusMeta(normalizeStatus(group.equipment)).icon }}
                </span>
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

const HEALTH_CENTER_REFINEMENT_ENDPOINT =
  "/api/v1/get_health_center_submission_status_index_for_admin_view";

export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "提出対象",
        "結果",
        "調理工程申請",
        "販売品申請",
        "購入品申請",
        "従業員申請",
        "平面図申請",
        "物品申請",
      ],
      allGroups: [],
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
      refCategoryID: 1,
      refInternational: "ALL",
      refInternationalID: 0,
      refExternal: "ALL",
      refExternalID: 0,
      groupCategories: [],
      yearList: [],
      searchText: "",
      internationalList: [
        { id: 1, value: "国際", bool: true },
        { id: 2, value: "国内", bool: false },
      ],
      externalList: [
        { id: 1, value: "学外", bool: true },
        { id: 2, value: "学内", bool: false },
      ],
      isSyncing: false,
      updatingSubmissionTargetGroupId: null,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  async mounted() {
    const initialized = await this.fetchInitialData();
    if (!initialized) return;

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
    async fetchInitialData() {
      try {
        const [
          currentYearRes,
          groupCategoryRes,
          groupsRes,
          yearsRes,
          unregisteredGroupsRes,
        ] = await Promise.all([
          this.$axios.$get("/user_page_settings/1"),
          this.$axios.$get("/group_categories"),
          this.$axios.$get(HEALTH_CENTER_REFINEMENT_ENDPOINT),
          this.$axios.$get("/fes_years"),
          this.$axios.$get("/un_registered_groups"),
        ]);

        const currentYearId = currentYearRes.data.fes_year_id;
        const currentYear = yearsRes.data.find((element) => element.id === currentYearId);

        const filteredGroups = groupsRes.data.filter((group) => {
          const categoryId =
            typeof group.group_category === "number"
              ? group.group_category
              : group.group_category?.id;
          const yearId = group.group?.fes_year_id || group.fes_year?.id;

          return categoryId === 1 && yearId === currentYearId;
        });

        this.allGroups = groupsRes.data;
        this.groups = filteredGroups;
        this.unregisteredGroups = unregisteredGroupsRes.data;
        this.groupCategories = groupCategoryRes.data;
        this.yearList = yearsRes.data;
        this.refYearID = currentYearId;
        this.refCategoryID = 1;
        this.refYears = currentYear ? currentYear.year_num : "Year";

        return true;
      } catch (error) {
        if (error?.response?.status === 401) {
          this.$router.push("/reauthentication_required");
          return false;
        }
        throw error;
      }
    },
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
      if (name_list === this.yearList) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "Year: ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
      } else if (name_list === this.groupCategories) {
        this.refCategoryID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refGroupCategories = "カテゴリ: ALL";
        } else {
          this.refGroupCategories = name_list[item_id - 1].name;
        }
        // internationalで絞り込むとき
      } else if (name_list === this.internationalList) {
        this.refInternationalID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refInternational = "International: ALL";
        } else {
          this.refInternational = name_list[item_id - 1].value;
        }
        // externalで絞り込む時
      } else if (name_list === this.externalList) {
        this.refExternalID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refExternal = "External: ALL";
        } else {
          this.refExternal = name_list[item_id - 1].value;
        }
      }
    },
    async fetchFilteredData() {
      this.groups = this.filterGroups(this.searchText);

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
      this.groups = this.filterGroups(this.searchText);

      // 検索時も申請しないデータを再取得
      const unregisteredRes = await this.$axios.$get("/un_registered_groups");
      this.unregisteredGroups = unregisteredRes.data;
    },
    async onSyncSubmissionStatus() {
      this.isSyncing = true;
      try {
        const res = await this.$axios.$post("/api/v1/sync_health_center_submission_statuses");

        // 同期完了後、データを再取得
        const updatedGroups = res.data.groups;
        this.allGroups = updatedGroups.map(group => ({
          group: group.group,
          group_category: group.group_category,
          fes_year: group.fes_year,
          cooking_process_order: group.cooking_process_order,
          food_product: group.food_product,
          purchase_list: group.purchase_list,
          employee: group.employee,
          venue_map: group.venue_map,
          equipment: group.equipment,
        }));

        this.groups = this.filterGroups(this.searchText);
        alert(`申請ステータスを更新しました（${res.data.synced_count}件）`);
      } catch (error) {
        if (error?.response?.status === 401) {
          this.$router.push("/reauthentication_required");
          return;
        }
        alert("申請ステータスの更新に失敗しました");
      } finally {
        this.isSyncing = false;
      }
    },
    async onToggleSubmissionTarget(group, checked) {
      const groupId = group?.group?.id;
      if (!groupId || this.updatingSubmissionTargetGroupId === groupId) return;

      this.updatingSubmissionTargetGroupId = groupId;
      try {
        const response = await this.$axios.$patch(
          `/api/v1/update_health_center_submission_target/${groupId}`,
          { is_health_center_submission_target: checked }
        );
        group.group.is_health_center_submission_target =
          response.data.is_health_center_submission_target;
      } catch (error) {
        if (error?.response?.status === 401) {
          this.$router.push("/reauthentication_required");
          return;
        }
        alert("保健所提出対象の更新に失敗しました");
      } finally {
        this.updatingSubmissionTargetGroupId = null;
      }
    },
    // 申請しないデータかどうかを判定するメソッド
    isUnregistered(groupId, orderType) {
      return this.unregisteredGroups.some(item =>
        item.group_id === groupId && item.order_type === orderType
      );
    },
    getGroupCategoryId(group) {
      if (typeof group.group_category === "number") {
        return group.group_category;
      }
      return group.group_category?.id;
    },
    getGroupYearId(group) {
      return group.group?.fes_year_id || group.fes_year?.id;
    },
    normalizeStatus(value) {
      if (value === false || value === null || value === undefined || value === "") {
        return "unsubmitted";
      }
      return value;
    },
    getStatusMeta(status) {
      const statusMap = {
        unapproved: {
          label: "未確認",
          icon: "notification_important",
          className: "status-badge--unapproved",
        },
        waiting_resubmission: {
          label: "再提出待ち",
          icon: "autorenew",
          className: "status-badge--waiting-resubmission",
        },
        approved: {
          label: "承認済み",
          icon: "check",
          className: "status-badge--approved",
        },
        unsubmitted: {
          label: "未提出",
          icon: "close",
          className: "status-badge--unsubmitted",
        },
      };
      return statusMap[this.normalizeStatus(status)] || statusMap.unapproved;
    },
    toSubmitted(value) {
      return this.normalizeStatus(value) !== "unsubmitted";
    },
    filterGroups(word = "") {
      const normalizedWord = word.trim().toLowerCase();

      return this.allGroups.filter((group) => {
        const categoryId = this.getGroupCategoryId(group);
        const yearId = this.getGroupYearId(group);
        const isInternational = group.group?.is_international;
        const isExternal = group.group?.is_external;
        const matchedWord =
          normalizedWord.length === 0 ||
          group.group?.name?.toLowerCase().includes(normalizedWord);

        return (
          categoryId === 1 &&
          (this.refYearID === 0 || yearId === this.refYearID) &&
          (this.refInternationalID === 0 ||
            (this.refInternationalID === 1 && isInternational === true) ||
            (this.refInternationalID === 2 && !isInternational)) &&
          (this.refExternalID === 0 ||
            (this.refExternalID === 1 && isExternal === true) ||
            (this.refExternalID === 2 && !isExternal)) &&
          matchedWord
        );
      });
    },
    // 保健所提出書類に必要な項目が全て満たされているかを判定
    isHealthCenterDocumentComplete(group) {
      const groupId = group.group?.id;
      const isEquipmentRequired = !this.isUnregistered(groupId, "rental_item_order");
      const statuses = [
        group.cooking_process_order,
        group.food_product,
        group.purchase_list,
        group.employee,
        group.venue_map,
      ];

      if (isEquipmentRequired) {
        statuses.push(group.equipment);
      }

      return statuses.every(
        (status) => this.normalizeStatus(status) === "approved"
      );
    },
  },
};
</script>
<style scoped>
.unregistered {
  background-color: red;
  color: white;
}

.status-badge {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
}

.status-badge__icon {
  font-size: 18px;
  color: inherit;
  -webkit-text-fill-color: currentColor;
}

.status-badge--unapproved {
  background: #e53935;
  color: #fff;
  -webkit-text-fill-color: #fff;
}

.status-badge--waiting-resubmission {
  background: #2e7d32;
  color: #fff;
  -webkit-text-fill-color: #fff;
}

.status-badge--approved {
  background: #ffffff;
  color: #1e88e5;
  border-color: #1e88e5;
  -webkit-text-fill-color: #1e88e5;
}

.status-badge--unsubmitted {
  background: #ffb300;
  color: #fff;
  -webkit-text-fill-color: #fff;
}

.normal-table td:hover .status-badge__icon {
  color: inherit !important;
  -webkit-text-fill-color: currentColor !important;
}

.status-guide-with-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 0 16px;
  gap: 20px;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.status-icon-guide {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 13px;
}

.status-icon-guide__title {
  font-weight: 1000;
}

.status-icon-guide__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.normal-table td.unregistered:hover {
  background-color: red !important;
  color: white;
  background: none; /* 線形グラデーションを上書きして無効にします */
  background-clip: initial;
  -webkit-background-clip: initial !important; /* デフォルトの状態に戻します */
  -webkit-text-fill-color: black !important;
}

.sync-button-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
</style>
