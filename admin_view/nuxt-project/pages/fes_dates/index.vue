<template>
  <div class="main-content">
    <SubHeader pageTitle="開催日">
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
            v-for="(fesDate, index) in fesDates"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/fes_dates/` + fesDate.fes_date.id,
                })
            "
          >
            <td>{{ fesDate.fes_date.id }}</td>
            <td>{{ fesDate.fes_year.year_num }}</td>
            <td>{{ fesDate.fes_date.days_num }}</td>
            <td>{{ fesDate.fes_date.date }}</td>
            <td>{{ fesDate.fes_date.day }}</td>
            <td>{{ fesDate.fes_date.created_at | formatDate }}</td>
            <td>{{ fesDate.fes_date.updated_at | formatDate }}</td>
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
        <CommonButton iconName="add_circle" :on_click="submitEmployee"
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
      headers: [
        "ID",
        "開催年",
        "何日目",
        "開催日",
        "曜日",
        "登録日時",
        "編集日時",
      ],
      isOpenAddModal: false,
    };
  },
  async asyncData({ $axios }) {
    const fesDateUrl = "/fes_dates";
    const fesDatesRes = await $axios.$get(fesDateUrl);
    return {
      fesDates: fesDatesRes.data,
    };
  },
  methods: {
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    reload() {
      const employeeId = this.employees.slice(-1)[0].employee.id + 1;
      const reUrl = "/api/v1/get_employee_show_for_admin_view/" + employeeId;
      this.$axios.$get(reUrl).then((response) => {
        this.employees.push(response.data);
      });
    },
    async submitEmployee() {
      const postEmployeeUrl =
        "/employees/" +
        "?group_id=" +
        this.appGroup +
        "&name=" +
        this.employeeName +
        "&student_id=" +
        this.employeeStudentId;

      this.$axios.$post(postEmployeeUrl).then((response) => {
        this.appGroup = "";
        this.employeeName = "";
        this.employeeStudentId = "";
        this.reload();
        this.closeAddModal();
      });
    },
  },
};
</script>
