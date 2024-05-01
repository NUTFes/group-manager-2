<template>
  <div class="main-content">
    <SubHeader pageTitle="模擬店平面図申請一覧">
      <CommonButton
        v-if="this.$role(roleID).announcements.create"
        iconName="add_circle"
        :on_click="openAddModal"
      >
        追加
      </CommonButton>
      <CommonButton
        v-if="this.$role(roleID).announcements.create"
        iconName="file_download"
        :on_click="downloadCSV"
      >
        CSV
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementAnnouncements"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchAnnouncements"
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
          <tr
            v-for="(announcement, index) in announcements"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/announcement/` + announcement.announcement.id,
                })
            "
          >
            <td>{{ announcement.group.id }}</td>
            <td>{{ announcement.group.name}}</td>
            <td>
              <div v-if='announcement.announcement.message === ""'>未登録</div>
              <div v-else>登録済み</div>
            </td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="模擬店平面図の登録"
    >
      <template v-slot:form>
        <div>
          <h3>参加団体</h3>
          <select v-model="group_id">
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>模擬店平面図</h3>
          <input v-model="message" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackMessage }}
    </SnackBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "申請状況"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      group_id: "",
      announcements: [],
      groups: [],
      dialog: false,
      message: "",
      snackMessage: "",
      group_id: "",
      refYears: "Years",
      refYearID: 0,
      searchText: ""
    };
  },
  async asyncData({ $axios }) {

    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const url =
      "/api/v1/get_refinement_announcements?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    const announcementsRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
     });

    return {
      announcements: announcementsRes.data,
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

    async openAddModal() {
      const groupUrl = "/api/v1/get_groups_refinemented_by_current_fes_year";
      const groupRes = await this.$axios.$get(groupUrl);
      this.groups = groupRes.data;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.snackMessage = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload(id) {
      const reUrl = "/api/v1/get_announcement_show_for_admin_view/" + id;
      this.$axios.get(reUrl).then((res) => {
        this.announcements.push(res.data.data);
      });
    },
    async submit() {
      const postAnnouncementUrl =
        "/announcements/" +
        "?group_id=" +
        this.group_id +
        "&message=" +
        this.message;

      this.$axios.$post(postAnnouncementUrl).then((res) => {
        this.openSnackBar("模擬店平面図を登録しました");
        this.group_id = "";
        this.message = "";
        this.reload(res.data.id);
        this.closeAddModal();
      });
    },
    async refinementAnnouncements(item_id, name_list) {
     // fes_yearで絞り込むとき
      this.refYearID = item_id;
      // ALLの時
      if (item_id == 0) {
        this.refYears = "ALL";
      } else {
        this.refYears = name_list[item_id - 1].year_num;
      }
      this.announcements = [];
      const refUrl =
        "/api/v1/get_refinement_announcements?fes_year_id=" +
        this.refYearID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.announcements.push(res);
      }
    },
    async searchAnnouncements() {
      this.announcements = [];
      const searchUrl = "/api/v1/get_search_announcements?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.announcements.push(res);
      }
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL +
        "/api/v1/get_announcements_csv"
      window.open(url, "購入品申請_CSV");
    },
  },
};
</script>
