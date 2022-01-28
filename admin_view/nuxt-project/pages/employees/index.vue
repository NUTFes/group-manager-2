<template>
  <div class="main-content">

    <SubHeader pageTitle="従業員申請">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSVダウンロード
      </CommonButton>
    </SubHeader>

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
            <td>{{ employee.employee.student_id }}</td>
            <td>{{ employee.employee.created_at | formatDate }}</td>
            <td>{{ employee.employee.updated_at | formatDate }}</td>
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
          <select v-model="appGroup">
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
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitEmployee">登録</CommonButton
        >
      </template>
    </AddModal>

  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "名前", "学籍番号", "登録日時", "編集日時"],
      isOpenAddModal: false,
      appGroup: "",
      employeeName: "",
      employeeStudentId: "",
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_employee_index_for_admin_view";
    const employeesRes = await $axios.$get(url);

    const currentFesYearId = 1;
    const groupsUrl = "/api/v1/get_groups_refinemented_by_fes_year?fes_year_id=" + currentFesYearId;
    const groupsRes = await $axios.$post(groupsUrl);

    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);

    return {
      employees: employeesRes.data,
      groupList: groupsRes.data,
      yearList: yearsRes.data,
    };
  },
  methods: {
    refinementGroups: function (id) {
      const refUrl = "/api/v1/get_refinement_groups?fes_year_id=" + id;
      const refRes = this.$axios.$post(refUrl);
      console.log(refUrl);
      console.log(refRes);
    },
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    reload() {
      const employeeId = this.employees.slice(-1)[0].employee.id + 1;
      const reUrl ="/api/v1/get_employee_show_for_admin_view/" + employeeId;
      this.$axios.$get(reUrl).then((response) => {
        this.employees.push(response.data);
      });
    },
    async submitEmployee() {

      const postEmployeeUrl =
        "/employees/" +
        "?group_id=" + this.appGroup +
        "&name=" + this.employeeName +
        "&student_id=" + this.employeeStudentId;

      this.$axios.$post(postEmployeeUrl).then((response) => {
        this.appGroup = "";
        this.employeeName = "";
        this.employeeStudentId = "";
        this.reload();
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url = "http://localhost:3000" + "/api/v1/get_employees_csv/" + 1;
      window.open(
        url,
        "従業員一覧_CSV"
      );
    },
  },
};
</script>
