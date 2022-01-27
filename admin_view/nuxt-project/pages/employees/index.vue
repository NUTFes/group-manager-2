<template>
  <div class="main-content">

    <SubHeader pageTitle="従業員申請">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
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

  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "名前", "学籍番号", "登録日時", "編集日時"],
      isOpenAddModal: false,
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_employee_index_for_admin_view";
    const employeesRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      employees: employeesRes.data,
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
      const groupId = this.groups.length + 1;
      const reUrl = "/api/v1/get_group_for_admin_view?id=" + groupId;
      this.$axios.$get(reUrl).then((response) => {
        this.groups.push(response.data[0]);
      });
    },
    async submitGroup() {
      const currentUserUrl = "/api/v1/current_user/show";
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
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
        this.reload();
        this.closeAddModal();
      });
    },
  },
};
</script>
