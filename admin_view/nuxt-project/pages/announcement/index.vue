<template>
  <div class="main-content"  v-if="this.$role(roleID).announcements.read">
    <SubHeader pageTitle="会場アナウンス文申請一覧">
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
                  path: `/announcement/` + announcement.group.id,
                })
            "
          >
            <td>{{ announcement.group.id }}</td>
            <td>{{ announcement.group.name}}</td>
            <td>
              <div v-if='announcement.announcement'>{{announcement.announcement.status}}</div>
              <div v-else>未登録</div>
            </td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="会場アナウンス文の登録"
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
          <h3>会場アナウンス文</h3>
          <input v-model="message" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <div v-if="isMessageOver" style="color: red;">アナウンス文は300字以内で入力してください。</div>
        <CommonButton iconName="add_circle" :on_click="submit" :disabled="isMessageOver"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackMessage }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
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
    isMessageOver() {
      return this.message.length > 300;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);

    const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = 'Year';
    }
    this.fetchFilteredData();
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },

    async openAddModal() {
      const groupUrl = "/api/v1/get_groups_have_no_announcement";
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
    reload() {
      const url = "/api/v1/get_refinement_announcements?fes_year_id=" + this.refYearID;
      this.$axios.get(url).then((res) => {
        this.announcements.push(res.data.data);
      });
    },
    async submit() {
      if (!this.group_id || !this.message) {
        this.openSnackBar("参加団体と会場アナウンス文を入力してください");
        return;
      }

      const postAnnouncementUrl =
        "/announcements/" +
        "?group_id=" +
        this.group_id +
        "&message=" +
        this.message;

      this.$axios.$post(postAnnouncementUrl).then((res) => {
        this.openSnackBar("会場アナウンス文を登録しました");
        this.group_id = "";
        this.message = "";
        this.reload(res.data.id);
        this.closeAddModal();
      });
    },
    async refinementAnnouncements(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + 'RefYear', this.refYearID);
      this.fetchFilteredData();
    },
    updateFilters(item_id, name_list) {
      // fes_yearで絞り込むとき
      this.refYearID = item_id;
      // ALLの時
      if (item_id == 0) {
        this.refYears = "ALL";
      } else {
        this.refYears = name_list[item_id - 1].year_num;
      }
    },
    async fetchFilteredData() {
      this.announcements = [];
      const refUrl =
        "/api/v1/get_refinement_announcements?fes_year_id=" +
        this.refYearID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.announcements.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchAnnouncements();
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    async searchAnnouncements() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
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
