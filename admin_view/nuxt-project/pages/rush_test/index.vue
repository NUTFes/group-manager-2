<template>
  <div class="main-content">
    <SubHeader pageTitle="参加団体申請一覧">
      <CommonButton v-if="true" iconName="add_circle" :on_click="openAddModal">
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
            @click="() => $router.push({ path: `/rush_test/` + group.group.id })"
          >
            <td>{{ group.group.id }}</td>
            <td>{{ group.group.name }}</td>
            <td>{{ group.group.project_name }}</td>
            <td>{{ group.group_category.name }}</td>
            <td>{{ group.fes_year.year_num }}</td>
            <td>{{ group.group.created_at | formatDate }}</td>
            <td>{{ group.group.updated_at | formatDate }}</td>
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
</template>

<script>
import { mapState } from "vuex";
export default {
  auth: false,
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
      isOpenAddModal: false,
      isOpenSnackBar: false,
      searchText: "",
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
  mounted() {
    window.scrollTo(0, 0);
  },

  methods: {
    async refinementGroups(item_id, name_list) {
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
      }
      this.groups = [];
      const refUrl =
        "/api/v1/get_refinement_groups?fes_year_id=" +
        this.refYearID +
        "&group_category_id=" +
        this.refCategoryID;
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
        "&project_name=" +
        this.projectName +
        "&activity=" +
        this.activity +
        "&group_category_id=" +
        this.groupCategoryId +
        "&fes_year_id=" +
        this.fesYearId;
      this.$axios.$post(postGroupUrl).then((response) => {
        this.openSnackBar(this.groupName + "を追加しました");
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
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
