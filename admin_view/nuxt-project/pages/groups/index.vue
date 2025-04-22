<template>
  <div class="main-content" v-if="this.$role(roleID).groups.read">
    <SubHeader pageTitle="参加団体申請一覧">
      <CommonButton
        v-if="this.$role(roleID).groups.create"
        iconName="add_circle"
        :on_click="openAddModal"
      >
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSV
      </CommonButton>
    </SubHeader>

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
          :nameList="applicantList"
          :on_click="refinementGroups"
          value="value"
        >
          {{ refCommittee }}
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
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(group, index) in groups"
            :key="index"
            @click="() => $router.push({ path: `/groups/` + group.group.id })"
          >
            <td>{{ group.group.id }}</td>
            <td>{{ group.group.name }}</td>
            <td>{{ group.group.committee }}</td>
            <td>{{ group.group.is_international }}</td>
            <td>{{ group.group.is_external }}</td>
            <td>{{ group.group.project_name }}</td>
            <td>{{ group.group_category.name }}</td>
            <td>{{ group.fes_year.year_num }}</td>
            <!-- <td>{{ group.group.created_at | formatDate }}</td>
            <td>{{ group.group.updated_at | formatDate }}</td> -->
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="参加団体申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <input v-model="groupName" placeholder="入力してください" />
        </div>
        <div>
          <h3>申請者</h3>
          <select v-model="committee">
            <option disabled value="">選択してください</option>
            <option
              v-for="applicant in applicantList"
              :key="applicant.id"
              :value="applicant.bool"
            >
              {{ applicant.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>カテゴリー</h3>
          <select v-model="groupCategoryId">
            <option disabled value="">選択してください</option>
            <option
              v-for="category in groupCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>国際</h3>
          <input type="checkbox" v-model="international" />
        </div>
        <div>
          <h3>学外</h3>
          <input type="checkbox" v-model="external" />
        </div>
        <div>
          <h3>企画名</h3>
          <input v-model="projectName" placeholder="入力してください" />
        </div>
        <div>
          <h3>活動内容</h3>
          <textarea v-model="activity" placeholder="入力してください" />
        </div>
        <div>
          <h3>開催年</h3>
          <select v-model="fesYearId">
            <option disabled value="">選択してください</option>
            <option v-for="year in yearList" :key="year.id" :value="year.id">
              {{ year.year_num }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitGroup"
          >登録</CommonButton
        >
      </template>
    </AddModal>

    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
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
      committee: "",
      international: false,
      external: false,

      year_list: [],
      user: [],
      groupId: "",
      reGroup: [],
      refYears: "Year",
      refYearID: 0,
      refGroupCategories: "Categories",
      refCategoryID: 0,
      refCommittee: "申請者",
      refCommitteeID: 0,
      refInternational: "国際",
      refInternationalID: 0,
      refExternal: "学外",
      refExternalID: 0,
      isOpenAddModal: false,
      isOpenSnackBar: false,
      searchText: "",
      groupCategories: [],
      headers: [
        "ID",
        "グループ名",
        "委員",
        "国際",
        "学外",
        "企画名",
        "カテゴリ",
        "開催年",
      ],
      applicantList: [
        { id: 1, value: "実行委員", bool: true },
        { id: 2, value: "参加団体", bool: false },
      ],
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
    // const url = "/api/v1/get_group_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_groups?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&group_category_id=0&committee=0";
    const groupRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      groups: groupRes.data,
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

    const storedCommitteeID = localStorage.getItem(
      this.$route.path + "RefCommittee"
    );
    if (storedCommitteeID) {
      this.refCommitteeID = Number(storedCommitteeID);
      this.updateFilters(this.refCommitteeID, this.applicantList);
    } else {
      this.refCommittee = "申請者";
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
      localStorage.setItem(
        this.$route.path + "RefCommittee",
        this.refCommitteeID
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
        // group_categoryで絞り込むとき
      } else if (name_list.toString() == this.groupCategories.toString()) {
        this.refCategoryID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refGroupCategories = "ALL";
        } else {
          this.refGroupCategories = name_list[item_id - 1].name;
        }
        // committeeで絞り込むとき
      } else if (Object.is(name_list, this.applicantList)) {
        this.refCommitteeID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refCommittee = "ALL";
        } else {
          this.refCommittee = name_list[item_id - 1].value;
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
        "/api/v1/get_refinement_groups?fes_year_id=" +
        this.refYearID +
        "&group_category_id=" +
        this.refCategoryID +
        "&committee=" +
        this.refCommitteeID +
        "&is_international=" +
        this.refInternationalID +
        "&is_external=" +
        this.refExternalID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.groups.push(res);
      }
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
      const searchUrl = "/api/v1/get_search_groups?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.groups.push(res);
      }
    },
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload() {
      const groupId = this.groups.slice(-1)[0].group.id + 1;
      const reUrl = "/api/v1/get_group_for_admin_view/" + groupId;
      this.$axios.$get(reUrl).then((response) => {
        this.groups.push(response.data[0]);
      });
    },
    async submitGroup() {
      const currentUserUrl = "/api/v1/users/show";
      const CurrentUser = await this.$axios.get(currentUserUrl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      });
      const postGroupUrl =
        "/groups/" +
        "?user_id=" +
        CurrentUser.data.data.id +
        "&name=" +
        this.groupName +
        "&committee=" +
        this.committee +
        "&project_name=" +
        this.projectName +
        "&activity=" +
        this.activity +
        "&group_category_id=" +
        this.groupCategoryId +
        "&fes_year_id=" +
        this.fesYearId +
        "&is_international=" +
        this.international +
        "&is_external=" +
        this.external;
      this.$axios.$post(postGroupUrl).then((response) => {
        this.openSnackBar(this.groupName + "を追加しました");
        this.groupName = "";
        this.committee = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
        this.international = false;
        this.external = false;
        this.reload();
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_groups_csv/" + this.refYearID;
      window.open(url, "参加団体一覧_CSV");
      this.openSnackBar("参加団体一覧をダウンロードしました");
    },
  },
};
</script>
