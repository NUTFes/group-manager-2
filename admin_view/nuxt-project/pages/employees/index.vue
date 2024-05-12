<template>
  <div class="main-content" v-if="this.$role(roleID).employees.read">
    <SubHeader pageTitle="従業員申請">
      <CommonButton v-if="this.$role(roleID).employees.create" iconName="add_circle" :on_click="openAddModal">
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
          :on_click="refinementEmployees"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchEmployees"
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
            v-for="(employee, index) in employees"
            :key="index"
            @click="
              () => $router.push({ path: `/employees/` + employee.employee.id })
            "
          >
            <td>{{ employee.employee.id }}</td>
            <td>{{ employee.group.name }}</td>
            <td>{{ employee.employee.name }}</td>
            <td>{{ employee.stool_test.status }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="従業員申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="groupId">
            <option disabled value="">選択してください</option>
            <option
              v-for="group in groupList"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>氏名</h3>
          <input v-model="employeeName" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="employeeStudentId" placeholder="入力してください" />
        </div>
        <div>
          <h3>検便</h3>
          <select v-model="stoolTestID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in stoolTestList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.value }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitEmployee"
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
      headers: ["ID", "参加団体", "名前", "検便"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      groupId: "",
      employeeName: "",
      employeeStudentId: "",
      employees: [],
      refYears: "Year",
      refYearID: 0,
      searchText: "",
      groupList: [],
      stoolTestList: null,
      stoolTestList: [
        { id: 1, value: "検便準備中" },
        { id: 2, value: "検便無" },
        { id: 3, value: "検便有" }
      ]
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    const url =
      "/api/v1/get_refinement_employees?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    const employeesRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      employees: employeesRes.data,
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
    async refinementEmployees(item_id, name_list) {
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
      this.employees = [];
      const refUrl =
        "/api/v1/get_refinement_employees?fes_year_id=" + this.refYearID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.employees.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchEmployees();
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    async searchEmployees() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.employees = [];
      const searchUrl = "/api/v1/get_search_employees?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.employees.push(res);
      }
    },
    async openAddModal() {
      const groupUrl = "/api/v1/get_groups_refinemented_by_current_fes_year";
      const groupRes = await this.$axios.$get(groupUrl);
      this.groupList = groupRes.data;
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
    reload(id) {
      const reUrl = "/api/v1/get_employee_show_for_admin_view/" + id;
      this.$axios.$get(reUrl).then((response) => {
        this.employees.push(response.data);
      });
    },
    async submitEmployee() {
      const postEmployeeUrl =
        "/employees/" +
        "?group_id=" +
        this.groupId +
        "&name=" +
        this.employeeName +
        "&student_id=" +
        this.employeeStudentId +
        "&stool_test_id=" +
        this.stoolTestID;

      this.$axios.$post(postEmployeeUrl).then((response) => {
        this.openSnackBar(this.employeeName + "を追加しました");
        this.appGroup = "";
        this.employeeName = "";
        this.employeeStudentId = "";
        this.stoolTestID = null;
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_employees_csv/" + this.refYearID;
      window.open(url, "従業員一覧_CSV");
    },
  },
};
</script>
