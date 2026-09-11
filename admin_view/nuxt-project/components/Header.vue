<template>
  <div>
    <div class="header-container">
      <header class="header-contents">
        <div class="header-title">
          <img src="~/assets/symbol-mark.svg" />
          <a href="/dashboard"> 参加団体管理アプリ-管理者ページ </a>
        </div>
        <div class="header-option">
          <IconButton
            icon_name="notifications"
            :on_click="openNotificationModal"
          />
          <IconButton icon_name="forum" :on_click="openMemoModal" />
          <IconButton icon_name="account_circle" :on_click="openAccountModal" />
        </div>
      </header>
    </div>
    <NotificationModal
      @close="closeNotificationModal"
      v-if="isOpenNotificationModal"
    >
      <IconButton icon_name="close" :on_click="closeNotificationModal" />
    </NotificationModal>
    <MemoModal @close="closeMemoModal" v-if="isOpenMemoModal" :memos="memos">
      <IconButton icon_name="close" :on_click="closeMemoModal" />
    </MemoModal>
    <AccountModal @close="closeAccountModal" v-if="isOpenAccountModal">
      <IconButton icon_name="close" :on_click="closeAccountModal" />
    </AccountModal>

  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      value: "",
      groups: [],
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      // v-model
      groupName: "",
      projectName: [],
      activity: [],
      groupCategoryId: "",
      fesYearId: "",

      year_list: [],
      user: [],
      groupId: "",
      reGroup: [],
      refYears: "Year",
      refYearID: 0,
      refGroupCategories: "Categories",
      refCategoryID: 0,
      isOpenAccountModal: false,
      isOpenMemoModal: false,
      isOpenNotificationModal: false,
      searchText: "",
      memos: [],
      groupCategories: [
        { id: 1, name: '食品販売' },
        { id: 2, name: '物品販売' },
        { id: 3, name: 'ステージ' },
        { id: 4, name: '展示・体験' },
        { id: 5, name: '研究室' },
        { id: 6, name: '国際' },
        { id: 7, name: '実行委員' },
        { id: 8, name: 'その他' }
      ],
      headers: [
        "ID",
        "グループ名",
        "企画名",
        "カテゴリ",
        "開催年",
        "日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    // const url = "/api/v1/get_group_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_groups?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&group_category_id=0";
    const groupRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      groups: groupRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  methods: {
    openNotificationModal() {
      this.isOpenNotificationModal = true;
    },
    closeNotificationModal() {
      this.isOpenNotificationModal = false;
    },
    async openMemoModal() {
      const memosUrl = "/memos";
      const memosRes = await this.$axios.$get(memosUrl);
      this.memos = memosRes.data;
      console.log(this.memos);
      this.isOpenMemoModal = true;
    },
    closeMemoModal() {
      this.isOpenMemoModal = false;
    },
    openAccountModal() {
      this.isOpenAccountModal = true;
    },
    closeAccountModal() {
      this.isOpenAccountModal = false;
    },
  },
};
</script>

<style>
img {
  height: 45px;
  margin: 5px;
}

.header-container {
  position: fixed;
  top: 0;
  height: 60px;
  width: 100%;
  padding: 0px 30px;
  z-index: 2;
  color: white;
  background: radial-gradient(
    ellipse at top left,
    rgba(40, 40, 40, 0.9),
    rgba(40, 40, 40, 0.8)
  );
  background-color: rgba(255, 255, 255, 1);
}
.header-contents {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-title {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-option {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  gap: 15px;
}
</style>
