<template>
  <div class="main-content">
    <SubHeader pageTitle="従業員申請">
      <CommonButton iconName="add_circle" :on_click="openModal">
        追加
      </CommonButton>
    </SubHeader>
    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "名前", "学籍番号", "登録日時", "編集日時"],
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
    reload: function () {
      this.$axios
        .get("/api/v1/get_employees", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.employees = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("name", this.userName);
      params.append("student_id", this.studentId);
      this.$axios.post("/employees", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.userName = "";
        this.studentId = "";
      });
    },
  },
};
</script>
